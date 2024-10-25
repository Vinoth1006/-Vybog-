const logger = require('../../services/logger.js');
const XLSX = require('xlsx');
const { createData, getData, getOneData, updateData, removeData, bulkCreateData, searchData } = require("../../services/crud.js");
const modelName = 'team_management';
const { exportToExcel, exportToCSV, generateExcelColumns, generateCSVFields } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse} = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')

const createController = (modelMap) =>{
    const create = async (req, res) => {
        try {
            const { teamName, members } = req.body;
    
            if (!teamName) {
                logError("Team Name is required");
                return sendErrorResponse(res, 400, "Team Name is required");
            }
    
            if (!members) {
                logError("Members are required");
                return sendErrorResponse(res, 400, "Members are required");
            }
    
            req.body.teamName = teamName;
            
            const existingData = await getData(req, modelName);
            console.log('Existing data fetched from database:', existingData);
    
            if (existingData && existingData.data && Array.isArray(existingData.data)) {
                const existingTeam = existingData.data.find((team) => team.teamName === teamName);
    
                if (existingTeam) {
                    logError("Team name already exists");
                    return sendErrorResponse(res, 409, "Team name already exists");
                }
            }
    
            const response = await createData(req, modelName);
    
            if (!response.error) {
                logger.info("Team management created successfully");
                return sendSuccessResponse(res, 200, "Team management created successfully", response.data);
            } else {
                logError("Team management creation failed", JSON.stringify(response.response));
                return sendErrorResponse(res, 500, "Team management creation failed");
            }
    
        } catch (error) {
            logError(`Error in create function: ${error.stack || error.message || JSON.stringify(error)}`, error);
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };
    
    
    const getAll = async (req, res) => {
        try {
            const response = await getData(req, modelName);
    
            if (!response.error) {
                logger.info("Team management fetched successfully");
                return sendSuccessResponse(res, 200, "Team management fetched successfully", response.data);
            } else {
                logError('Data fetch error:', response.response);
                return sendErrorResponse(res, 500, response.response || 'Failed to fetch team management');
            }
        } catch (error) {
            logError('Error in getAll function:', error);
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };
    
    const getById = async (req, res) => {
        try {
            // Fetch ID from either query or params
            const id = req.params.id || req.query.id;
    
            if (!id) {
                logger.warn("ID is missing in the request");
                return sendErrorResponse(res, 400, "ID is required");
            }
    
            const response = await getOneData(req, 'team_management');  // Adjust table name if needed
    
            if (!response.error && response.data) {
                logger.info(`Successfully retrieved team management data with id: ${id}`);
                return sendSuccessResponse(res, 200, `Successfully retrieved team management data`, response.data);
            }
    
            logger.warn(`Team management data not found with id: ${id}`);
            return sendErrorResponse(res, 404, "Team management data not found");
        } catch (error) {
            logger.error(`Error in teamManagementController (getById): ${error.message || error}`, error);
            return sendErrorResponse(res, 500, 'Failed to retrieve team management data');
        }
    };
    
    
    const edit = async (req, res) => {
        try {
            const response = await updateData(req, modelName);
    
            if (!response.error) {
                if (response.data != 0) {
                    logger.info("Team management data updated successfully");
                    return sendSuccessResponse(res, 200, "Team management data updated successfully", response.data);
                } else {
                    logError("Team management not found");
                    return sendErrorResponse(res, 404, "Team management does not exist");
                }
            }
        } catch (error) {
            logError(`Error updating team management data: ${error.message || error}`, error);
    
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
                logger.info("Team management deleted successfully");
                return sendSuccessResponse(res, 200, "team management deleted successfully", response.data);
            } else {
                logError("Failed to delete team management", response.response);
                return sendErrorResponse(res, 500, "Failed to delete team management");
            }
        } catch (error) {
            logError(`Error in remove function: ${error.message || error}`, error);
    
            if (error.response && error.response.response) {
                return sendErrorResponse(res, 400, error.response.response || "Bad Request");
            }
    
            return sendErrorResponse(res, 400, "Bad Request");
        }
    };
    

    // const bulkImport = async (req, res) => {
    //     try {
    //         console.log("Request body:", req.body);
    
    //         const { base64data } = req.body;
    
    //         if (!base64data) {
    //             logError("No Base64 data provided");
    //             return sendErrorResponse(res, 400, "No Base64 data provided");
    //         }
    
    //         const buffer = Buffer.from(base64data, 'base64');
    //         const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName]; 
    
    //         const data = XLSX.utils.sheet_to_json(sheet);
    
    //         console.log("Parsed data:", data);
    
    //         let response = await bulkCreateData({ body: { clients: data }, headers: req.headers }, 'client');
    
    //         if (!response.error) {
    //             logger.info("Data imported successfully");
    //             return sendSuccessResponse(res, 200, "Data imported successfully", response.data);
    //         } else {
    //             logError("Failed to import data", response.response);
    //             return sendErrorResponse(res, 500, "Failed to import data");
    //         }
    //     } catch (error) {
    //         logError(`Error during bulk import: ${error.message || error}`, error);
    //         return sendErrorResponse(res, 400, "Bad Request");
    //     }
    // };    

    const exportTeams = async (req, res) => {
        try {
            logger.info('Attempting to export teams');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const teams = response.data;
    
                if (!teams || teams.length === 0) {
                    logger.warn('No teams found for export');
                    return sendErrorResponse(res, 404, 'teams not found');
                }
    
                logger.info(`Fetched ${teams.length} teams from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(teams[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = teams.map(team => {
                    const teamData = {};
                    fieldsToExport.forEach(field => {
                        teamData[field] = team[field];
                    });
                    return teamData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `teamManagement_export_${Date.now()}.xlsx`;
    
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
                logError(`Error exporting teams: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export teams');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };

    const searchTeams = async (req, res) =>{
        try {
            let response = await searchData(req, modelName);
            if (!response.error){
                if (response.data.length > 0){
                    sendSuccessResponse(res, 200, 'Team Management fetched successfully', response.data);
                } else {
                    sendErrorResponse(res, 404, 'No Team Management found matching the filters');
                }
            } else {
                logError('Error fetching Team Management', {details: response.response})
                sendErrorResponse(res, 400, 'Error fetching Team Management');
            }
        } catch (error){
            logError('Internal server error', {details: error.message})
            sendErrorResponse(res, 500, 'Internal server error');
        }
    }
    
    return {
        create,
        getAll,
        getById,
        edit,
        remove,
        // bulkImport,
        exportTeams,
        searchTeams
    };
}
module.exports = createController;