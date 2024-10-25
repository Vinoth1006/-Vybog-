const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');
const logger = require('../services/logger');

/**
 * Export data to an Excel file as a Base64 string
 * @param {Array} data - Array of JSON data to be exported
 * @param {Array} columns - Column headers to be used in Excel
 * @param {Array} headers - Optional array of custom headers for the file
 * @returns {Promise} - Resolves with the Base64 encoded Excel file data
 */
const exportToExcel = async (data, columns, headers = []) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        worksheet.columns = columns;
        logger.info(`Set worksheet columns: ${JSON.stringify(columns)}`);

        if (headers.length > 0) {
            worksheet.getRow(1).values = headers;
            logger.info(`Added custom headers: ${JSON.stringify(headers)}`);
        }

        data.forEach(item => {
            worksheet.addRow(item);
        });
        logger.info(`Added ${data.length} rows to Excel worksheet`);

        // Create a buffer to hold the Excel file data
        const buffer = await workbook.xlsx.writeBuffer();
        const base64String = Buffer.from(buffer).toString('base64');

        logger.info(`Excel file converted to Base64 string`);
        return base64String;
    } catch (error) {
        logger.error(`Error exporting data to Excel: ${error.message}`);
        throw new Error(`Error exporting data to Excel: ${error.message}`);
    }
};

/**
 * Export data to a CSV file as a Base64 string
 * @param {Array} data - Array of JSON data to be exported
 * @param {Array} fields - Fields to be used in the CSV
 * @param {Array} headers - Optional array of custom headers for the CSV file
 * @returns {Promise} - Resolves with the Base64 encoded CSV file data
 */
const exportToCSV = async (data, fields, headers = []) => {
    try {
        const json2csvParser = new Parser({ fields });
        let csv = json2csvParser.parse(data);
        logger.info(`Parsed data to CSV format`);

        if (headers.length > 0) {
            csv = `${headers.join(',')}\n${csv}`;
            logger.info(`Added custom headers to CSV`);
        }

        const base64String = Buffer.from(csv).toString('base64');
        logger.info(`CSV file converted to Base64 string`);
        return base64String;
    } catch (error) {
        logger.error(`Error exporting data to CSV: ${error.message}`);
        throw new Error(`Error exporting data to CSV: ${error.message}`);
    }
};

const generateExcelColumns = (fields) => {
    return fields.map((field) => ({
        header: field.replace(/_/g, ' ').toUpperCase(),
        key: field,
        width: 20
    }));
};

const generateCSVFields = (modelAttributes) => {
    return Object.keys(modelAttributes);
};

module.exports = {
    exportToExcel,
    exportToCSV,
    generateExcelColumns,
    generateCSVFields,
};