const { createData, updateData, removeData, getData, bulkCreateData, getOneData, searchData } = require('../../services/crud');
const modelName = 'candidate';
const logger = require('../../services/logger');
const { error } = require('winston');
const validation = require('../../helpers/validation.helper');
const { exportToExcel, exportToCSV, generateExcelColumns } = require('../../helpers/export.helper.js');
const { sendErrorResponse, sendSuccessResponse } = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')
const candidate = require('../../models/candidate.js')
const { pool } = require("../../server.js")

module.exports = (modalMap) => {
    const bulkImport = async (req, res) => {
        try {

            let errorSummary = {
                totalErrorCount: 0,
                duplicateDataCount: 0,
                emailPhoneMissingCount: 0,
                invalidEmailCount: 0,
                first_nameMissingCount: 0,
                last_nameMissingCount: 0
            };

            for (const candidate of req.body.candidates) {
                const { first_name, last_name, email, phone } = candidate;

                if (!first_name) {
                    errorSummary.first_nameMissingCount++;
                    errorSummary.totalErrorCount++;
                }
                if (!last_name) {
                    errorSummary.last_nameMissingCount++;
                    errorSummary.totalErrorCount++;
                }
                if (!email && !phone) {
                    errorSummary.emailPhoneMissingCount++;
                    errorSummary.totalErrorCount++;
                }
                if (email && !validation.emailValidation(email)) {
                    errorSummary.invalidEmailCount++;
                    errorSummary.totalErrorCount++;
                }
                if (email || phone) {
                    req.email = email;
                    req.phone = phone;
                    const existingData = await getOneData(req, modelName);
                    if (existingData) {
                        let candidates = existingData.data;
                        console.log(candidates);
                        if (candidates != null) {
                            if (candidates.email === email || candidates.phone === phone) {
                                errorSummary.duplicateDataCount++;
                                errorSummary.totalErrorCount++;
                            }
                        }
                    }
                }
            }

            let response;
            if (req.body.candidates) {
                response = await bulkCreateData(req, modelName);
            }
            // console.log(response);
            if (!response.error) {
                logger.info("Data created successfully")
                let created_summary;
                if (response.data[0]) {
                    if (response.data[0].length == 0) {
                        created_summary = 0;
                    } else {
                        created_summary = response.data[0].length;
                    }
                }

                res.status(200).send({
                    error: response.error,
                    message: 'Data created successfully',
                    response: {
                        total_records: req.body.candidates.length,
                        error_summary: errorSummary,
                        created_summary: created_summary,
                    },
                });
            } else {
                // console.log(response.response);
                // reject({ error: true, response: e });
                throw error.message = response.response;
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error });
        }
    };
    const add = async (req, res) => {
        try {
            let { first_name, last_name, email, phone, additionalEmail } = req.body.candidate;

            if (email && !validation.emailValidation(email)) {
                throw error.message = "Invalid Email";
            }
            if (additionalEmail) {
                if (additionalEmail == email) {
                    throw error.message = "Additional Email cannot be same as Email";
                }
                if (!validation.emailValidation(additionalEmail)) {
                    throw error.message = "Invalid Additional Email";
                }
            }
            if (!first_name || !last_name) {
                throw error.message = "Missing required data";
            }
            if (!email && !phone) {
                throw error.message = "Email or Phone required";
            }

            req.email = email;
            req.phone = phone;
            req.candidate_tracking = req.body.candidate_tracking;
            req.body = req.body.candidate;
            let existingData = await getOneData(req, modelName);
            if (existingData) {
                let existCandidates = existingData.data;
                if (existCandidates) {
                    if (existCandidates.phone === phone) {
                        throw error.message = "Phone Number Already Exists";
                    }
                    if (existCandidates.email === email) {
                        throw error.message = "Email Already Exists";
                    } else {
                        console.log("No matches found, proceeding with creation.");
                    }
                }
            }
            let response;
            response = await createData(req, modelName);

            if (!response.error) {
                if (response.data) {
                    let skillIds = req.body.skills;

                    for (let skillId of skillIds) {
                        const insertQuery = `INSERT INTO can_skills_mapping (can_id, skill_id) VALUES ($1, $2)`;
                        const insertValues = [response.data.id, skillId];
                        await pool.query(insertQuery, insertValues);
                    }

                    if (req.candidate_tracking) {
                        let can_tracking = req.candidate_tracking;

                        const insertTrackingQuery = `INSERT INTO public.candidate_tracking
                            (can_id, job_id, job_tracking_id, certification, remarks, offer_list, education, employer, documents, resume_description, resume, role_id)	
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

                        const insertTrackingValues = [
                            response.data.id,
                            can_tracking.job_id,
                            can_tracking.job_tracking_id,
                            can_tracking.certification,
                            can_tracking.remarks,
                            can_tracking.offer_list,
                            can_tracking.education,
                            can_tracking.employer,
                            can_tracking.documents,
                            can_tracking.resume_description,
                            can_tracking.resume,
                            response.data.role
                        ];
                        await pool.query(insertTrackingQuery, insertTrackingValues);
                    }
                    // return { error: false, data: response };
                }
                logger.info("Data created successfully")
                res.status(200).send({
                    error: response.error,
                    message: 'Data created successfully',
                    response: response.data
                });
            } else {
                reject({ error: true, response: e });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error });
        }
    };

    const edit = async (req, res) => {
        try {
            let response = await updateData(req, modelName);

            if (!response.error) {
                if (response.data != 0) {
                    res.status(200).send({ error: response.error, message: 'Data updated successfully', response: response.data });
                }
                else {
                    logger.error("user not found")
                    res.status(400).send({ message: "Bad Request", error: "User not found" });
                }
            } else {
                reject({ error: true, response: e });
            }
        } catch (error) {
            // console.log(error);
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error.response });
        }
    };

    const remove = async (req, res) => {
        try {
            let response = await removeData(req, modelName);
            if (!response.error) {
                logger.info("Data deleted successfully")
                res.status(200).send({ error: response.error, message: 'Data deleted successfully', response: response.data });
            } else {
                reject({ error: true, response: e });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error.response });
        }
    };

    const get = async (req, res) => {
        try {
            let response = await getData(req, modelName);
            if (!response.error) {
                logger.info("Data fetched successfully")
                res.status(200).send({ error: response.error, message: 'Data fetched successfully', response: response.data });
            } else {
                // logger.error(e)
                reject({ error: true, response: e });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error });
        }
    };
    const getTrack = async (req, res) => {
        try {
            let response = await candidate.candidateTrack(req, modelName);
            if (!response.error) {
                logger.info("Data fetched successfully")
                res.status(200).send({ error: response.error, message: 'Data fetched successfully', response: response.data });
            } else {
                reject({ error: true, response: e });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error });
        }
    };
    const filterData = async (req, res) => {
        try {
            let response = await getOneData(req, modelName);
            if (!response.error) {
                logger.info("Data fetched successfully")
                res.status(200).send({ error: response.error, message: 'Data fetched successfully', response: response.data });
            } else {
                // logger.error(e)
                reject({ error: true, response: e });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response)
            }
            else {
                logger.error(error)
            }
            res.status(400).send({ message: "Bad Request", error: error });
        }
    };

    const exportCandidates = async (req, res) => {
        try {
            logger.info('Attempting to export candidates');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const candidates = response.data;
    
                if (!candidates || candidates.length === 0) {
                    logger.warn('No candidates found for export');
                    return sendErrorResponse(res, 404, 'Candidates not found');
                }
    
                logger.info(`Fetched ${candidates.length} candidates from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(candidates[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = candidates.map(candidate => {
                    const candidateData = {};
                    fieldsToExport.forEach(field => {
                        candidateData[field] = candidate[field];
                    });
                    return candidateData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `candidates_export_${Date.now()}.xlsx`;
    
                const base64String = fileData.toString('base64');
                logger.info('Converted exported Excel file to Base64 string');
    
                return res.status(200).json({
                    fileName: fileName,
                    fileData: base64String
                });
    
            } else {
                logError(`Error fetching data: ${JSON.stringify(response.response)}`);
                return sendErrorResponse(res, 400, response.response);
            }
        } catch (error) {
            if (!res.headersSent) {
                logError(`Error exporting candidates: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export candidates');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };

    const searchCandidates = async (req, res) => {
        try {
            let response = await searchData(req, modelName);
    
            if (!response.error) {
                if (response.data.length > 0) {
                    sendSuccessResponse(res, 200, 'Candidates fetched successfully', response.data);
                } else {
                    sendErrorResponse(res, 404, 'No candidates found matching the filters');
                }
            } else {
                logError('Error fetching candidates', { details: response.response });
                sendErrorResponse(res, 400, 'Error fetching candidates');
            }
        } catch (error) {
            logError('Internal Server Error', { details: error.message });
            sendErrorResponse(res, 500, 'Internal Server Error');
        }
    };

    return { bulkImport, add, edit, remove, get, filterData, exportCandidates, getTrack, searchCandidates }
}