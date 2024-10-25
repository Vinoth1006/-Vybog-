const { createData, updateData, removeData, getData, bulkCreateData, getOneData, searchData } = require('../../services/crud');
const modelName = 'job';
const logger = require('../../services/logger');
const XLSX = require('xlsx');
const base64js = require('base64-js')
const { exportToExcel, exportToCSV, generateExcelColumns, generateCSVFields } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse } = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')

module.exports = (modalMap) => {

    const importJobs = async (req, res) => {
        try {
            let jobs = req.body.jobs;
            // req.body.jobs = jobs;
            // console.log(req.body.jobs);

            // Send data for bulk creation
            let response;
            if (jobs.length > 0) {
                response = await bulkCreateData(req, modelName);
            }

            // Send response
            if (!response.error) {
                logger.info("Data created successfully");
                let created_summary = response.data[0] ? response.data[0].length : 0;
                res.status(200).send({
                    error: response.error,
                    message: 'Data created successfully',
                    response: {
                        total_records: jobs.length,
                        // error_summary: errorSummary,
                        created_summary: created_summary,
                    },
                });
            } else {
                throw new Error(response.response);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response);
            } else {
                logger.error(error);
            }
            res.status(400).send({ message: "Bad Request", error: error.message });
        }
    };
    const extractData = async (req, res) => {
        try {
            // Decode base64 to binary data
            const base64Data = req.body.file;
            const binaryData = base64js.toByteArray(base64Data);

            // Parse the Excel file
            const workbook = XLSX.read(binaryData, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jobs = XLSX.utils.sheet_to_json(sheet);

            // Send response
            if (jobs.length > 0) {
                logger.info("Data created successfully");
                res.status(200).send({
                    error: false,
                    message: 'Data extracted successfully',
                    response: {
                        total_records: jobs.length,
                        // error_summary: errorSummary,
                        data: jobs,
                    },
                });
            } else {
                throw new Error("no data found");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.response) {
                    logger.error(error.response.response);
                }
                logger.error(error.response);
            } else {
                logger.error(error);
            }
            res.status(400).send({ message: "Bad Request", error: error.message });
        }
    };

    const create = async (req, res) => {
        try {
            const { job_title, job_code } = req.body;

            if (!job_title) {
                logError("Job title is required");
                return sendErrorResponse(res, 400, "Job title is required");
            }

            if (!job_code) {
                logError("Job code is required");
                return sendErrorResponse(res, 400, "Job code is required");
            }

            // const existingData = await getData(req, modelName);
            // if (existingData && existingData.data && Array.isArray(existingData.data)) {
            //     const existingClient = existingData.data.find(job => (job.job_title === job_title || job.job_code === job_code));
            //     if (existingClient) {
            //         logError("Job already exists");
            //         return sendErrorResponse(res, 409, "Job already exists");
            //     }
            // }

            const response = await createData(req, modelName);

            if (!response.error) {
                logger.info("Job created successfully");
                return sendSuccessResponse(res, 200, "Job created successfully", response.data);
            } else {
                logError("Failed to create job", response.response);
                return sendErrorResponse(res, 500, "Failed to create job");
            }
        } catch (error) {
            logError(`Error in create function: ${error.message || error}`, error);
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };

    const edit = async (req, res) => {
        try {
            let response = await updateData(req, modelName);

            if (!response.error) {
                if (response.data != 0) {
                    logger.info("Data updated successfully");
                    return sendSuccessResponse(res, 200, "Data updated successfully", response.data);
                } else {
                    logError("User not found");
                    return sendErrorResponse(res, 404, "User not found");
                }
            } else {
                logError("Failed to update data", response.response);
                return sendErrorResponse(res, 500, response.response || "Failed to update data");
            }
        } catch (error) {
            logError(`Error in edit function: ${error.message || error}`, error);
            return sendErrorResponse(res, 400, error.response || "Bad Request");
        }
    };

    const remove = async (req, res) => {
        try {
            let response = await removeData(req, modelName);

            if (!response.error) {
                logger.info("Data deleted successfully");
                return sendSuccessResponse(res, 200, 'Data deleted successfully', response.data);
            } else {
                logError("Failed to delete data", response.response);
                return sendErrorResponse(res, 500, response.response || "Failed to delete data");
            }
        } catch (error) {
            logError(`Error in remove function: ${error.message || error}`, error);
            return sendErrorResponse(res, 400, error.response || "Bad Request");
        }
    };


    const get = async (req, res) => {
        try {
            let response = await getData(req, modelName);

            if (!response.error) {
                logger.info("Jobs fetched successfully");
                return sendSuccessResponse(res, 200, 'Jobs fetched successfully', response.data);
            } else {
                logError("Failed to fetch data", response.response);
                return sendErrorResponse(res, 500, response.response || "Failed to fetch data");
            }
        } catch (error) {
            logError(`Error in get function: ${error.message || error}`, error);
            return sendErrorResponse(res, 400, error.message || "Bad Request");
        }
    };

    const filterData = async (req, res) => {
        try {
            let response = await getData(req, modelName);
            if (!response.error) {
                logger.info("Data fetched successfully");
                res.status(200).send({
                    error: false,
                    message: 'Data fetched successfully',
                    response: response.data,
                    filters: response.filters
                });
            } else {
                res.status(400).send({
                    error: true,
                    message: 'Error fetching data',
                    response: response.response
                });
            }
        } catch (error) {
            logger.error(error);
            res.status(500).send({
                error: true,
                message: "Internal Server Error",
                response: error
            });
        }
    };

    const searchJobs = async (req, res) => {
        try {
            let response = await searchData(req, modelName);
            if (!response.error){
                if(response.data.length > 0){
                    sendSuccessResponse(res, 200, 'Jobs fetched successfully', response.data);
                } else {
                    sendErrorResponse(res, 404, 'No jobs found matching the filters');
                }
            } else {
                logError('Error fetching jobs', {details: response.response})
                sendErrorResponse(res, 400, 'Error fetching jobs');
            }
        } catch (error) {
            logError('Internal server error', {details: error.message})
            sendErrorResponse(res, 500, 'Internal server error');
        }
    }

    const exportJobs = async (req, res) => {
        try {
            logger.info('Attempting to export jobs');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const jobs = response.data;
    
                if (!jobs || jobs.length === 0) {
                    logger.warn('No jobs found for export');
                    return sendErrorResponse(res, 404, 'jobs not found');
                }
    
                logger.info(`Fetched ${jobs.length} jobs from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(jobs[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = jobs.map(job => {
                    const jobData = {};
                    fieldsToExport.forEach(field => {
                        jobData[field] = job[field];
                    });
                    return jobData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `jobs_export_${Date.now()}.xlsx`;
    
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
                logError(`Error exporting jobs: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export jobs');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };

    return { importJobs, create, edit, remove, get, filterData, exportJobs, extractData, searchJobs }
}