const { createData, updateData, removeData, getData, getOneData, searchData } = require('../../services/crud');
const modelName = 'user';
const logger = require('../../services/logger');
const { error } = require('winston');
const { authCheck } = require('../../services/authentication.js');
const jwt = require("jsonwebtoken");
const { exportToExcel, exportToCSV, generateExcelColumns, generateCSVFields } = require('../../helpers/export.helper.js');
const { logError, sendErrorResponse, sendSuccessResponse } = require('../../helpers/response.helper.js')
const path = require('path')
const fs = require('fs')
const { emailValidation, phoneValidation, validatePassword } = require('../../helpers/validation.helper.js');
// const user = require('../../models/user.js');
const bcrypt = require('bcrypt');

module.exports = (modalMap) => {

    const add = async (req, res) => {
        try {
            const { first_name, last_name, phone, email, password, company } = req.body;

            let validationErrors = [];

            // Validate required fields
            if (!first_name) {
                validationErrors.push({ message: 'First name is required' });
                logError('First name is required');
            }

            if (!last_name) {
                validationErrors.push({ message: 'Last name is required' });
                logError('Last name is required');
            }

            if (!phone) {
                validationErrors.push({ message: 'Contact number is required' });
                logError('Contact number is required');
            } else if (!phoneValidation(phone)) {
                validationErrors.push({ message: 'Invalid phone number format. Contact number must be at least 6 digits.' });
                logError('Invalid phone number format. Contact number must be at least 6 digits.', { providedValue: contact_number });
            }

            if (!email) {
                validationErrors.push({ message: 'Email is required' });
                logError('Email is required');
            } else if (!emailValidation(email)) {
                validationErrors.push({ message: 'Invalid email address' });
                logError('Invalid email address', { providedEmail: email });
            }

            if (!password) {
                validationErrors.push({ message: 'Password is required' });
                logError('Password is required');
            } else if (!validatePassword(password)) {
                validationErrors.push({ message: 'Password must contain 8 characters, one uppercase, one lowercase, one number, and one special character' });
                logError('Password must contain 8 characters, one uppercase, one lowercase, one number, and one special character');
            }

            if (!company) {
                validationErrors.push({ message: 'Company name is required' });
                logError('Company name is required');
            } else if (company.length < 3) {
                validationErrors.push({ message: 'Company name must be at least 3 characters long' });
                logError('Company name must be at least 3 characters long', { providedCompanyName: company });
            }

            // If there are validation errors, respond with all errors
            if (validationErrors.length > 0) {
                const errorMessages = validationErrors.map(error => error.message).join(' and ');
                return sendErrorResponse(res, 400, errorMessages);
            }

            logger.info('Request body before createData:', req.body);

            const existingUser = await getData(req, modelName);
            logger.info('Existing user data:', existingUser);

            if (existingUser.data && existingUser.data.length > 0) {
                const message = 'Email already exists';
                validationErrors.push({ message });
                logError(message, { existingUserData: existingUser.data });
                return sendErrorResponse(res, 409, message);
            }

            let response = await createData(req, modelName);
            if (response.error) {
                logError("Failed to create data", response.response);
                return sendErrorResponse(res, 500, "Failed to create data");
            }

            logger.info('New user created successfully:', response);

            return sendSuccessResponse(res, 201, 'User created successfully', response.data);
        } catch (error) {
            const errorMessage = `Error in add function: ${error.message || JSON.stringify(error)}`;
            logError(errorMessage, error);
            return sendErrorResponse(res, 500, "Internal Server Error");
        }
    };


    const edit = async (req, res) => {
        try {
            let response = await updateData(req, modelName);

            if (!response.error) {
                if (response.data != 0) {
                    logger.info("User updated successfully");
                    return sendSuccessResponse(res, 200, "User updated successfully", response.data);
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
                logger.info("User deleted successfully");
                return sendSuccessResponse(res, 200, 'User deleted successfully', response.data);
            } else {
                logError("Failed to delete user", response.response);
                return sendErrorResponse(res, 500, response.response || "Failed to delete user");
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
                logger.info("Users fetched successfully");
                return sendSuccessResponse(res, 200, 'Users fetched successfully', response.data);
            } else {
                logError("Failed to fetch users", response.response);
                return sendErrorResponse(res, 500, response.response || "Failed to fetch users");
            }
        } catch (error) {
            logError(`Error in get function: ${error.message || error}`, error);
            return sendErrorResponse(res, 400, error.message || "Bad Request");
        }
    };

    const getOne = async (req, res) => {
        try {
            let response = await getOneData(req, modelName);
            // console.log(response);
            if (!response.error) {
                logger.info("Data fetched successfully")
                res.status(200).send({ error: response.error, message: 'Data fetched successfully', response: response.data });
            } else {
                // logger.error(e)
                reject({ error: true, response: e });
            }
        } catch (error) {

            if (error.response) {
                console.log(error);
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
    // const login = async (req, res) => {
    //     try {
    //         const check = compareSync(body.password, result[0].user_password);
    //         const generateToken = (payload) => {
    //             const token = jwt.sign({payload}, "qwe1234", { expiresIn: "1h" });
    //             return token;
    //         };
    //         const token = generateToken(body.user_email);
    //         if (req.body.email == '') {
    //             throw error.message = 'Please Enter Email id';
    //         }
    //         if (req.body.password == '') {
    //             throw error.message = 'Please Enter Password';
    //         }
    //         if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
    //             throw error.message = 'missing require data';
    //         }
    //         let response = await getOneData(req, modelName);


    //         if (!response.error) {
    //            let isMatch;
    //             if (response.data!="No Data Found") {
    //                 console.log(req.body.password);
    //                 console.log(response.data.password);
    //                 isMatch = await bcrypt.compare(req.body.password, response.data.password);
    //                 console.log(isMatch);
    //             }
    //             // console.log(isMatch);
    //             if (isMatch) {
    //                 logger.info("User Login successfully")
    //                 res.status(200).send
    //                     ({
    //                         error: response.error,
    //                         message: 'User Login successfully',
    //                         response: response.data,
    //                         // token: token
    //                     });
    //             }
    //             else {
    //                 logger.error("Invalid Credentials");
    //                 res.status(404).send
    //                     ({
    //                         error: true,
    //                         message: 'Invalid Credentials',
    //                     })
    //             }
    //         } else {
    //             reject({ error: true, response: e });
    //         }
    //     } catch (error) {
    //         if (error.response) {
    //             if (error.response.response) {
    //                 logger.error(error.response.response);
    //             }
    //             logger.error(error.response)
    //         }
    //         else {
    //             logger.error(error)
    //         }
    //         console.log(error);
    //         res.status(400).send({ message: "Bad Request", error: error });
    //     }
    // };
    const login = async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(400).send({
                    error: true,
                    message: 'Email and password are required',
                });
            }
            let response = await getOneData(req, modelName);

            if (!response.error) {
                let isMatch = false;

                if (response.data !== "No Data Found") {
                    console.log(req.body.password);
                    console.log(response.data.password);

                    isMatch = await bcrypt.compare(req.body.password, response.data.password);
                    console.log(isMatch);
                }
                if (isMatch) {
                    const generateToken = (payload) => {
                        const token = jwt.sign(payload, "qwe1234", { expiresIn: "8h" });
                        return token;
                    };

                    const token = generateToken({ email: response.data.email, id: response.data.id });

                    logger.info("User Login successfully");
                    return res.status(200).send({
                        error: false,
                        message: 'User Login successfully',
                        response: response.data,
                        token: token,
                    });
                } else {
                    logger.error("Invalid Credentials");
                    return res.status(404).send({
                        error: true,
                        message: 'Invalid Credentials',
                    });
                }
            } else {
                return res.status(500).send({
                    error: true,
                    message: 'Server error occurred while fetching user data',
                });
            }
        } catch (error) {
            logger.error(error);
            console.log(error);

            return res.status(400).send({
                error: true,
                message: "Bad Request",
                details: error.message || error,
            });
        }
    };

    const exportUsers = async (req, res) => {
        try {
            logger.info('Attempting to export users');
    
            let response = await getData(req, modelName);
    
            if (!response.error) {
                const users = response.data;
    
                if (!users || users.length === 0) {
                    logger.warn('No users found for export');
                    return sendErrorResponse(res, 404, 'users not found');
                }
    
                logger.info(`Fetched ${users.length} users from the database`);
    
                let queryFields = req.query.fields ? req.query.fields.split(',') : [];
                let fieldsToExport = queryFields.length > 0 ? queryFields : Object.keys(users[0]);
    
                logger.info(`Fields to export: ${fieldsToExport}`);
    
                if (fieldsToExport.length === 0) {
                    logger.warn('No valid fields found to export');
                    return sendErrorResponse(res, 400, 'No valid fields found to export');
                }
    
                const exportData = users.map(user => {
                    const userData = {};
                    fieldsToExport.forEach(field => {
                        userData[field] = user[field];
                    });
                    return userData;
                });
    
                const columns = generateExcelColumns(fieldsToExport);
                const fileData = await exportToExcel(exportData, columns);
                const fileName = `users_export_${Date.now()}.xlsx`;
    
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
                logError(`Error exporting users: ${error.message}`, error);
                return sendErrorResponse(res, 500, 'Failed to export users');
            } else {
                logError(`Error after response sent: ${error.message}`, error);
            }
        }
    };

    // const searchUsers = async (req, res) => {
    //     try {
    //         let response = await searchData(req, modelName);
    //         if (!response.error) {
    //             if (response.data.length > 0) {
    //                 res.status(200).send({
    //                     error: false,
    //                     message: 'Jobs fetched successfully',
    //                     response: response.data
    //                 });
    //             } else {
    //                 res.status(404).send({
    //                     error: true,
    //                     message: 'No jobs found matching the filters',
    //                     response: []
    //                 });
    //             }
    //         } else {
    //             res.status(400).send({
    //                 error: true,
    //                 message: 'Error fetching jobs',
    //                 response: response.response
    //             });
    //         }
    //     } catch (error) {
    //         res.status(500).send({
    //             error: true,
    //             message: "Internal Server Error",
    //             response: error.message
    //         });
    //     }
    // };

    const searchUsers = async (req, res) => {
        try {
            let response = await searchData(req, modelName);
            if (!response.error){
                if (response.data.length > 0){
                    sendSuccessResponse(res, 200, 'Users fetched successfully', response.data);
                } else {
                    sendErrorResponse(res, 404, 'No users found matching the filters');
                }
            } else {
                logError('Error fetching users', {details: response.response});
                sendErrorResponse(res, 400, 'Error fetching users');
            }
        } catch {
            logError('Internal server error', {details: error.message});
            sendErrorResponse(res, 500, 'Internal server error');
        }
    }

    return { add, edit, remove, get, login, getOne, exportUsers, searchUsers }
}