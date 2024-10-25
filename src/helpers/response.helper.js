const logger = require('../services/logger');

const logError = (message, details = {}) => {
    logger.error(message, details);
};

const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({
        error: true,
        response: [{ message: message }]
    });
};

const sendSuccessResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        error: false,
        message,
        response: data
    });
};

module.exports = {
    logError,
    sendErrorResponse,
    sendSuccessResponse
};
