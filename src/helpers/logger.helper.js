const logger = require('../services/logger');

// Middleware to log requests
const requestLogger = (req, res, next) => {
    const { method, url, ip } = req;
    const timestamp = new Date().toISOString();
    const domain = req.headers.host ? `https://${req.headers.host}` : 'Unknown Domain';

    // Add domain to the request object for use in the logger
    req.domain = domain;

    logger.info(`Request received: ${method} ${domain}${url} - IP: ${ip}`);

    // Proceed to the next middleware
    next();
};

module.exports = requestLogger;
