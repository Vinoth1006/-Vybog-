const logger = require('../../services/logger.js');
const XLSX = require('xlsx');
const { createData, getData, getOneData, updateData, removeData, bulkCreateData, searchData } = require("../../services/crud.js");
const modelName = 'client';
const { exportToExcel, exportToCSV, generateExcelColumns, generateCSVFields } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse} = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')

const createController = (modelMap) =>{
    const create = async (req, res) => {
        try {
            const { company_name, company_tier, company_agreement } = req.body;
    
            if (!company_name) {
                logError("Company name is required");
                return sendErrorResponse(res, 400, "Company name is required");
            }
    
            if (!company_tier) {
                logError("Company tier is required");
                return sendErrorResponse(res, 400, "Company tier is required");
            }
    
            if (!company_agreement) {
                logError("Company agreement is required");
                return sendErrorResponse(res, 400, "Company agreement is required");
            }
    
            req.body.company_name = company_name;
            const existingData = await getData(req, modelName);
            if (existingData && existingData.data && Array.isArray(existingData.data)) {
                const existingClient = existingData.data.find(client => client.company_name === company_name);
                if (existingClient) {
                    logError("Client already exists");
                    return sendErrorResponse(res, 403, "Client already exists");
                }
            }
    
            const response = await createData(req, modelName);
            if (!response.error) {
                logger.info("Client created successfully");
                return sendSuccessResponse(res, 200, "Client created successfully", response.data);
            } else {
                logError("Client creation failed", response.response);
                return sendErrorResponse(res, 500, "Client creation failed");
            }
        } catch (error) {
            logError(`Error in create function: ${error.message || error}`, error);
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };
    
    const getAll = async (req, res) => {
        try {
            const response = await getData(req, modelName);
    
            if (!response.error) {
                logger.info("Clients fetched successfully");
                return sendSuccessResponse(res, 200, "Clients fetched successfully", response.data);
            } else {
                logError('Data fetch error:', response.response);
                return sendErrorResponse(res, 500, response.response || 'Failed to fetch client');
            }
        } catch (error) {
            logError('Error in getAll function:', error);
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };
    

    const getById = async (req, res) => {
        try {
            const response = await getOneData(req, modelName);
    
            if (!response.error && response.data) {
                logger.info(`Successfully retrieved ${modelName} with id: ${req.query.id}`);
                return sendSuccessResponse(res, 200, `Successfully retrieved ${modelName}`, response.data);
            }
    
            logError(`Client not found with id: ${req.query.id}`);
            return sendErrorResponse(res, 404, "Client not found");
        } catch (error) {
            logError(`Error in ${modelName} controller (getById): ${error.message || error}`, error);
            return sendErrorResponse(res, 500, 'Failed to retrieve client');
        }
    };
    
    
    const edit = async (req, res) => {
        try {
            const response = await updateData(req, modelName);
    
            if (!response.error) {
                if (response.data != 0) {
                    logger.info("Client data updated successfully");
                    return sendSuccessResponse(res, 200, "Client data updated successfully", response.data);
                } else {
                    logError("Client not found");
                    return sendErrorResponse(res, 404, "Client does not exist");
                }
            }
        } catch (error) {
            logError(`Error updating client data: ${error.message || error}`, error);
    
            if (error.response) {
                return sendErrorResponse(res, 400, error.response.response || "Bad Request");
            }
    
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };    

    const remove = async (req, res) => {
        try {
            const response = await removeData(req, modelName);
    
            if (!response.error) {
                logger.info("Client deleted successfully");
                return sendSuccessResponse(res, 200, "Client deleted successfully", response.data);
            } else {
                logError("Failed to delete client", response.response);
                return sendErrorResponse(res, 500, "Failed to delete client");
            }
        } catch (error) {
            logError(`Error in remove function: ${error.message || error}`, error);
    
            if (error.response && error.response.response) {
                return sendErrorResponse(res, 400, error.response.response || "Bad Request");
            }
    
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };
    


    const bulkImport = async (req, res) => {
        try {
            let errorSummary = {
                totalErrorCount: 0,
                duplicateDataCount: 0,
                companyNameMissingCount: 0,
                companyNameTooShortCount: 0,
                companyTierMissingCount: 0,
                companyAgreementMissingCount: 0
            };
    
            for (const client of req.body.clients) {
                const { company_name, company_tier, company_agreement } = client;
    
                if (!company_name) {
                    errorSummary.companyNameMissingCount++;
                    errorSummary.totalErrorCount++;
                } else if (company_name.length < 3) {
                    errorSummary.companyNameTooShortCount++;
                    errorSummary.totalErrorCount++;
                }
                if (!company_tier) {
                    errorSummary.companyTierMissingCount++;
                    errorSummary.totalErrorCount++;
                }
                if (!company_agreement) {
                    errorSummary.companyAgreementMissingCount++;
                    errorSummary.totalErrorCount++;
                }
    
                if (company_name) {
                    req.body.company_name = company_name;
                    const existingData = await getOneData(req, modelName);
                    if (existingData) {
                        let clients = existingData.data;
                        if (clients != null) {
                            if (clients.company_name === company_name) {
                                errorSummary.duplicateDataCount++;
                                errorSummary.totalErrorCount++;
                            }
                        }
                    }
                }
            }
    
            let response;
            if (req.body.clients) {
                response = await bulkCreateData(req, modelName);
            }
    
            if (!response.error) {
                logger.info("Data created successfully");
                let created_summary = response.data[0] ? response.data[0].length || 0 : 0;
    
                res.status(200).send({
                    error: response.error,
                    message: 'Data created successfully',
                    response: {
                        total_records: req.body.clients.length,
                        error_summary: errorSummary,
                        created_summary: created_summary,
                    },
                });
            } else {
                throw new Error(response.response);
            }
        } catch (error) {
            console.log(error);
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

    const exportClients = async (req, res) => {
        try {
            logger.info('Attempting to export clients');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const clients = response.data;
    
                if (!clients || clients.length === 0) {
                    logger.warn('No clients found for export');
                    return sendErrorResponse(res, 404, 'Clients not found');
                }
    
                logger.info(`Fetched ${clients.length} clients from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(clients[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = clients.map(client => {
                    const clientData = {};
                    fieldsToExport.forEach(field => {
                        clientData[field] = client[field];
                    });
                    return clientData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `clients_export_${Date.now()}.xlsx`;
    
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
                logError(`Error exporting clients: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export clients');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };
    
    // const searchCandidates = async (req, res) => {
    //     try {
    //         let response = await searchData(req, modelName);
    
    //         if (!response.error) {
    //             if (response.data.length > 0) {
    //                 sendSuccessResponse(res, 200, 'Candidates fetched successfully', response.data);
    //             } else {
    //                 sendErrorResponse(res, 404, 'No candidates found matching the filters');
    //             }
    //         } else {
    //             logError('Error fetching candidates', { details: response.response });
    //             sendErrorResponse(res, 400, 'Error fetching candidates');
    //         }
    //     } catch (error) {
    //         logError('Internal Server Error', { details: error.message });
    //         sendErrorResponse(res, 500, 'Internal Server Error');
    //     }
    // };

    const searchClients = async (req, res) => {
        try {
            let response = await searchData(req, modelName);
            if (!response.error){
                if (response.data.length > 0){
                    sendSuccessResponse(res, 200, 'Clients fetched successfully', response.data);
                } else {
                    sendErrorResponse(res, 404, 'No clients found matching the filters');
                }
            } else {
                logError('Error fetching clients', {details: response.response});
                sendErrorResponse(res, 400, 'Error fetching clients');
            }
        } catch (error) {
            logError('Internal server error', {details: error.message});
            sendErrorResponse(res, 500, 'Internal server error' );
        }
    };
    
    return {
        create,
        getAll,
        getById,
        edit,
        remove,
        bulkImport,
        exportClients,
        searchClients
    };
}
module.exports = createController;