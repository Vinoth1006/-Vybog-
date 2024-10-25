const { createData, updateData, removeData, getData, bulkCreateData, getOneData, searchData } = require('../../services/crud');
const modelName = 'role';
const logger = require('../../services/logger');
const { exportToExcel, exportToCSV, generateExcelColumns, generateCSVFields } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse } = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')

module.exports = (modalMap) => {
    const create = async (req, res) => {
        try {
            const { role_name } = req.body;
            let validationErrors = [];

            if (!role_name) {
                validationErrors.push({ message: 'Role name is required' });
                logError('Role name is required');
            }

            if (validationErrors.length > 0) {
                const errorMessages = validationErrors.map(error => error.message).join(' and ');
                return sendErrorResponse(res, 400, errorMessages);
            }

            const response = await createData(req, modelName);
            if (response.error) {
                logError('Failed to create role', response.response);
                return sendErrorResponse(res, 500, 'Failed to create role');
            }

            logger.info('Role created successfully:', response);
            return sendSuccessResponse(res, 201, 'Role created successfully', response.data);

        } catch (error) {
            const errorMessage = `Error in create function: ${error.message || JSON.stringify(error)}`;
            logError(errorMessage, error);
            return sendErrorResponse(res, 500, 'Internal Server Error');
        }
    };

    const edit = async (req, res) => {
        try {
            let response = await updateData(req, modelName);

            if (!response.error) {
                if (response.data != 0) {
                    logger.info('Data updated successfully:', response.data);
                    return sendSuccessResponse(res, 200, 'Data updated successfully', response.data);
                } else {
                    const errorMessage = 'User not found';
                    logError(errorMessage);
                    return sendErrorResponse(res, 404, errorMessage);
                }
            } else {
                const errorMessage = 'Failed to update data';
                logError(errorMessage, response);
                return sendErrorResponse(res, 500, errorMessage);
            }
        } catch (error) {
            const errorMessage = `Error in edit function: ${error.message || JSON.stringify(error)}`;
            logError(errorMessage, error);
            return sendErrorResponse(res, 500, 'Internal Server Error');
        }
    };

    const remove = async (req, res) => {
        try {
            let response = await removeData(req, modelName);

            if (!response.error) {
                logger.info('Data deleted successfully:', response.data);
                return sendSuccessResponse(res, 200, 'Data deleted successfully', response.data);
            } else {
                const errorMessage = 'Failed to delete data';
                logError(errorMessage, response);
                return sendErrorResponse(res, 500, errorMessage);
            }
        } catch (error) {
            const errorMessage = `Error in remove function: ${error.message || JSON.stringify(error)}`;
            logError(errorMessage, error);
            return sendErrorResponse(res, 500, 'Internal Server Error');
        }
    };


    const get = async (req, res) => {
        try {
            let response = await getData(req, modelName);

            if (!response.error) {
                logger.info("Data fetched successfully:", response.data);
                return sendSuccessResponse(res, 200, 'Data fetched successfully', response.data);
            } else {
                const errorMessage = 'Failed to fetch data';
                logError(errorMessage, response);
                return sendErrorResponse(res, 500, errorMessage);
            }
        } catch (error) {
            const errorMessage = `Error in get function: ${error.message || JSON.stringify(error)}`;
            logError(errorMessage, error);
            return sendErrorResponse(res, 500, 'Internal Server Error');
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

    const exportRoles = async (req, res) => {
        try {
            logger.info('Attempting to export roles');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const roles = response.data;
    
                if (!roles || roles.length === 0) {
                    logger.warn('No roles found for export');
                    return sendErrorResponse(res, 404, 'roles not found');
                }
    
                logger.info(`Fetched ${roles.length} roles from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(roles[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = roles.map(role => {
                    const roleData = {};
                    fieldsToExport.forEach(field => {
                        roleData[field] = role[field];
                    });
                    return roleData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `roles_export_${Date.now()}.xlsx`;
    
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
                logError(`Error exporting roles: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export roles');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };

    const searchRo = async (req, res) => {
        try {
            let response = await searchData(req, modelName);
            if (!response.error) {
                if (response.data.length > 0) {
                    res.status(200).send({
                        error: false,
                        message: 'Jobs fetched successfully',
                        response: response.data
                    });
                } else {
                    res.status(404).send({
                        error: true,
                        message: 'No jobs found matching the filters',
                        response: []
                    });
                }
            } else {
                res.status(400).send({
                    error: true,
                    message: 'Error fetching jobs',
                    response: response.response
                });
            }
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "Internal Server Error",
                response: error.message
            });
        }
    };

    const searchRoles = async (req, res) =>{
        try {
            let response = await searchData(req, modelName);
            if (!response.error){
                if (response.data.length > 0){
                    sendSuccessResponse(res, 200, 'Roles fetched successfully', response.data);
                }else {
                    sendErrorResponse(res, 404, 'No roles found matching the filters');
                }
            } else {
                logError('Error fetching roles', {details: response.response})
                sendErrorResponse(res, 400, 'Error fetching roles');
            }
        } catch (error){
            logError('Internal server error', {details: error.message})
            sendErrorResponse(res, 500, 'Internal server error');
        }
    };

    return { create, edit, remove, get, filterData, exportRoles, searchRoles }
}