const { createData, updateData, removeData, getData, bulkCreateData, getOneData, searchData } = require('../../services/crud');
const modelName = 'hr_management';
const logger = require('../../services/logger');
const { error } = require('winston');
const validation = require('../../helpers/validation.helper');
const { exportToExcel, exportToCSV, generateExcelColumns, generateCSVFields, ensureDirectoryExistence } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse } = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')

module.exports = (modelMap) => {
    const add = async (req, res) => {
        try {
            let { first_name, last_name, official_email, date_of_joining, designation, country, user_name } = req.body;
    
            if (!first_name) {
                logError("First name is required");
                return sendErrorResponse(res, 400, "First name is required");
            }
            if (!last_name) {
                logError("Last name is required");
                return sendErrorResponse(res, 400, "Last name is required");
            }
            if (!official_email) {
                logError("Official email is required");
                return sendErrorResponse(res, 400, "Official email is required");
            }
            if (!validation.emailValidation(official_email)) {
                logError("Invalid email address");
                return sendErrorResponse(res, 400, "Invalid email address");
            }
            if (!user_name) {
                logError("User name is required");
                return sendErrorResponse(res, 400, "User name is required");
            }
            if (!date_of_joining) {
                logError("Date of joining is required");
                return sendErrorResponse(res, 400, "Date of joining is required");
            }
            if (!designation) {
                logError("Designation is required");
                return sendErrorResponse(res, 400, "Designation is required");
            }
            if (!country) {
                logError("Country is required");
                return sendErrorResponse(res, 400, "Country is required");
            }
    
            req.body.official_email = official_email;
            const existingData = await getData(req, modelName);
            if (existingData && existingData.data && Array.isArray(existingData.data)) {
                const existingHrmanagement = existingData.data.find(hrManagement => hrManagement.official_email === official_email);
                if (existingHrmanagement) {
                    logError("HR Management already exists");
                    return sendErrorResponse(res, 403, "HR Management already exists");
                }
            }
    
            const response = await createData(req, modelName);
            if (!response.error) {
                logger.info("HR Management created successfully");
                return sendSuccessResponse(res, 200, "HR Management created successfully", response.data);
            } else {
                logError("HR Management creation failed", response.response);
                return sendErrorResponse(res, 500, "HR Management creation failed");
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
                logger.info("HR Management fetched successfully");
                return sendSuccessResponse(res, 200, "HR Management fetched successfully", response.data);
            } else {
                logError('Data fetch error:', response.response);
                return sendErrorResponse(res, 500, response.response || 'Failed to fetch HR Management');
            }
        } catch (error) {
            logError('Error in getAll function:', error);
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };

    const getById = async (req, res) => {
        try {
            const { id } = req.query;
    
            if (!id || isNaN(id)) {
                logError("Invalid or missing ID in query");
                return sendErrorResponse(res, 400, "Invalid or missing ID in query");
            }
    
            const parsedId = parseInt(id, 10);
            console.log("Parsed ID is:", parsedId);
            req.id = parsedId;
            const response = await getOneData(req, modelName);
    
            if (!response.error && response.data) {
                logger.info(`Successfully retrieved ${modelName} with id: ${parsedId}`);
                return sendSuccessResponse(res, 200, `Successfully retrieved ${modelName}`, response.data);
            }
    
            logError(`HR Management not found with id: ${parsedId}`);
            return sendErrorResponse(res, 404, "HR Management not found");
        } catch (error) {
            logError(`Error in ${modelName} controller (getById): ${error.message || error}`, error);
            return sendErrorResponse(res, 500, 'Failed to retrieve HR Management');
        }
    };
    
    const edit = async (req, res) => {
        try {
            const response = await updateData(req, modelName);
    
            if (!response.error) {
                if (response.data != 0) {
                    logger.info("HR Management data updated successfully");
                    return sendSuccessResponse(res, 200, "HR Management data updated successfully", response.data);
                } else {
                    logError("Client not found");
                    return sendErrorResponse(res, 404, "HR Management does not exist");
                }
            }
        } catch (error) {
            logError(`Error updating HR Management data: ${error.message || error}`, error);
    
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
                logger.info("HR Management deleted successfully");
                return sendSuccessResponse(res, 200, "Client deleted successfully", response.data);
            } else {
                logError("Failed to delete HR Management", response.response);
                return sendErrorResponse(res, 500, "Failed to delete HR Management");
            }
        } catch (error) {
            logError(`Error in remove function: ${error.message || error}`, error);
    
            if (error.response && error.response.response) {
                return sendErrorResponse(res, 400, error.response.response || "Bad Request");
            }
    
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };

    const exportHrManagements = async (req, res) => {
        try {
            logger.info('Attempting to export HR Managements');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const hrManagements = response.data;
    
                if (!hrManagements || hrManagements.length === 0) {
                    logger.warn('No HR Management found for export');
                    return sendErrorResponse(res, 404, 'HR Management not found');
                }
    
                logger.info(`Fetched ${hrManagements.length} HR Managements from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(hrManagements[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = hrManagements.map(hrManagement => {
                    const hrManagementData = {};
                    fieldsToExport.forEach(field => {
                        hrManagementData[field] = hrManagement[field];
                    });
                    return hrManagementData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `hrManagement_export_${Date.now()}.xlsx`;
    
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
                logError(`Error exporting HR Managements: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export HR Managements');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };

    const searchHrManagements = async (req, res) =>{
        try {
            let response = await searchData(req, modelName);
            if (!response.error){
                if (response.data.length > 0){
                    sendSuccessResponse(res, 200, 'HR Management fetched successfully', response.data);
                } else {
                    sendErrorResponse(res, 404, 'No HR Management found matching the filters');
                }
            } else {
                logError('Error fetching HR Management', {details: response.response});
                sendErrorResponse(res, 400, 'Error fetching HR Management');
            }
        } catch (error) {
            logError('Internal server error', {details: error.message});
            sendErrorResponse(res, 500, 'Internal server error');
        }
    };

    return{
        add, getAll, getById, edit, remove, exportHrManagements, searchHrManagements
    }
};