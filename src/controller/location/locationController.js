const { createData, updateData, removeData, getData, getOneData } = require('../../services/crud.js');
const modelName = 'location';
const logger = require('../../services/logger.js');
// const { exportToExcel, exportToCSV, generateExcelColumns, ensureDirectoryExistence } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse } = require('../../helpers/response.helper.js')
// const path = require('path')
// const fs = require('fs')

module.exports = (modalMap) => {
    const create = async (req, res) => {
        try {
            const { location_name } = req.body;
            let validationErrors = [];

            if (!location_name) {
                validationErrors.push({ message: 'location name is required' });
                logError('location name is required');
            }

            if (validationErrors.length > 0) {
                const errorMessages = validationErrors.map(error => error.message).join(' and ');
                return sendErrorResponse(res, 400, errorMessages);
            }

            const response = await createData(req, modelName);
            if (response.error) {
                logError('Failed to create location', response.response);
                return sendErrorResponse(res, 500, 'Failed to create location');
            }

            logger.info('location created successfully:', response);
            return sendSuccessResponse(res, 201, 'location created successfully', response.data);

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

    return { create, edit, remove, get }
}