// const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const { createQry, updateQry, deleteQry, getQry, bulkCreateQry, getOneQry, searchQry } = require('../../src/services/dbQuery');
const bcrypt = require('bcrypt');
const { pool } = require('./../server')
const logger = require('../services/logger')

const bulkCreateData = async function (req, model) {
    try {
        let { children, ...parent } = req.body;
        console.log("processing CRUD");
        parent.created_by = req.query.user_id;

        const promises = Object.keys(parent).map(async (childVal) => {
            let childModel = childVal;
            if (Array.isArray(parent[childModel])) {
                const isCandidates = childModel === 'candidates';
                const isJobs = childModel === 'jobs';
                const isClients = childModel === 'clients'; 
                let postData;

                if (isClients) {
                    postData = parent[childModel].filter(v => {
                        return (
                            v.company_name &&
                            v.company_name.length >= 3 &&
                            v.company_tier &&
                            v.company_agreement
                        );
                    });
                } else if (isCandidates || isJobs) {
                    postData = parent[childModel].filter(v => {
                        if (isCandidates) {
                            return (v.firstName && v.lastName) && (v.email || v.phone);
                        } else if (isJobs) {
                            return v.job_title && v.job_code;
                        } else {
                            return false;
                        }
                    });
                }

                const modelTbl = model;
                let existingRecords = [];

                if (isClients) {
                    // Check for existing clients based on company name
                    const companyNames = postData.map(v => v.company_name);

                    const query = `SELECT * FROM ${modelTbl} WHERE company_name = ANY($1::text[])`;
                    const values = [companyNames];

                    const res = await pool.query(query, values);
                    existingRecords = res.rows;
                } else if (isCandidates) {
                    const emailList = postData.map(v => v.email);
                    const phoneList = postData.map(v => v.phone);

                    const query = `SELECT * FROM ${modelTbl} WHERE email = ANY($1::text[]) OR phone = ANY($2::text[])`;
                    const values = [emailList, phoneList];

                    const res = await pool.query(query, values);
                    existingRecords = res.rows;
                } else if (isJobs) {
                    const jobTitleList = postData.map(v => v.job_title);
                    const jobCodeList = postData.map(v => v.job_code);

                    const query = `SELECT * FROM ${modelTbl} WHERE job_title = ANY($1::text[]) OR job_code = ANY($2::text[])`;
                    const values = [jobTitleList, jobCodeList];

                    const res = await pool.query(query, values);
                    existingRecords = res.rows;
                }

                console.log(existingRecords);
                postData = postData.map(data => ({
                    ...data,
                    createdAt: new Date(),
                    createdBy: parent.created_by
                }));

                // Filter out records that already exist
                let newRecords = postData.filter(v => {
                    if (isClients) {
                        const companyName = v.company_name ? v.company_name.trim() : null;

                        return !existingRecords.some(record => {
                            const recordCompanyName = record.company_name ? record.company_name.trim() : null;

                            return companyName && recordCompanyName && companyName === recordCompanyName;
                        });
                    } else if (isCandidates) {
                        const email = v.email ? v.email.toLowerCase().trim() : null;
                        const phone = v.phone ? v.phone.trim() : null;

                        return !existingRecords.some(record => {
                            const recordEmail = record.email ? record.email.toLowerCase().trim() : null;
                            const recordPhone = record.phone ? record.phone.trim() : null;

                            return (email && recordEmail && email === recordEmail) || (phone && recordPhone && phone === recordPhone);
                        });
                    } else if (isJobs) {
                        const jobTitle = v.job_title ? v.job_title.trim() : null;
                        const jobCode = v.job_code ? v.job_code.trim() : null;

                        return !existingRecords.some(record => {
                            const recordJobTitle = record.job_title ? record.job_title.trim() : null;
                            const recordJobCode = record.job_code ? record.job_code.trim() : null;

                            return (jobTitle && recordJobTitle && jobTitle === recordJobTitle) || (jobCode && recordJobCode && jobCode === recordJobCode);
                        });
                    }
                });

                // if (newRecords.length === 0) {
                //     return { error: true, data: "All provided records already exist." };
                // }

                try {
                    let bulkResponse = await bulkCreateQry(newRecords, model);
                    if (bulkResponse.error) {
                        throw new Error(bulkResponse.error);
                    }
                    return { error: false, data: bulkResponse.data };
                } catch (e) {
                    console.log(e);
                    return { error: true, data: e.message };
                }
            }
            return { error: false, data: null };
        });

        const results = await Promise.all(promises);
        const hasError = results.some(result => result && result.error);
        if (hasError) {
            const error = results.find(result => result && result.error);
            console.error('First encountered error:', error.data);
            throw new Error(error.data || 'Unknown error occurred during bulk creation.');
        }

        const successfulData = results.filter(result => result && result.data).map(result => result.data);
        return { error: false, data: successfulData };

    } catch (e) {
        return { error: true, response: e.message || 'An error occurred.' };
    }
};

const createData = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            let { children, ...parent } = req.body;
            // parent.id = uuidv4();
            // parent.org_id = req.headers.org_id;
            if (parent.password) {
                let hashedPassword = await bcrypt.hash(parent.password, 10);
                parent.password = hashedPassword;
            }

            parent.createdBy = req.query.user_id;
            parent.createdAt = new Date();

            await createQry(parent, model).then(async (response) => {
                if (children) {
                    console.log("child:", children);
                    let i = 1;
                    Object.keys(children).forEach((childVal) => {
                        return new Promise(async (resolve, reject) => {
                            let childModel = childVal;
                            // console.log(childModel); 
                            children[childModel].createdAt = new Date();

                            let postData = children[childModel].map(v => ({
                                ...v,
                                createdAt: new Date(),  // Use snake_case if that's your convention
                                createdBy: parent.createdBy || req.query.user_id  // Ensure created_by is coming from the right source
                            }));
                            console.log(postData.createdAt);

                            if (Array.isArray(children[childModel])) {

                                await createQry(postData, childModel).then(async (bulkResponse) => {
                                    if (!bulkResponse.error) {
                                        resolve({ error: false, data: bulkResponse.data });
                                    } else {
                                        reject({ error: true, bulkResponse: e });
                                    }
                                });
                            } else {
                                // children[childModel][model + '_id'] = parent.id;
                                // children[childModel].id = uuidv4();
                                children[childModel].createdAt = new Date();
                                console.log(children[childModel].createdAt);
                                children[childModel].createdBy = parent.createdBy;
                                await createQry(children[childModel], childModel).then(async (childResponse) => {
                                    if (!childResponse.error) {
                                        resolve({ error: false, data: childResponse.data });
                                    } else {
                                        reject({ error: true, childResponse: e });
                                    }
                                });
                            }
                        }).then(() => {
                            if (Object.keys(children).length === i) {
                                if (!response.error) {
                                    resolve({ error: false, data: response.data });
                                } else {
                                    reject({ error: true, response: e });
                                }
                            }
                            i++;
                        });
                    });
                } else {
                    if (!response.error) {
                        // console.log(response);
                        resolve({ error: false, data: response.data });
                    } else {
                        // console.log(e);
                        reject({ error: true, response: e });
                    }
                }
            });
        } catch (e) {
            reject({ error: true, response: e });
            // console.log(e);
        }
    });
};

const updateData = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            let { children, ...parent } = req.body;
            parent.updatedBy = req.query.user_id;
            let { id } = req.query;
            await updateQry(parent, id, model).then((response) => {
                if (children) {
                    let i = 1;
                    Object.keys(children).forEach((childVal) => {
                        return new Promise(async (resolve, reject) => {
                            let childModel = childVal;
                            if (Array.isArray(children[childModel])) {
                                children[childModel].forEach(async (dataVal, dataKey) => {
                                    if (dataVal.id) {
                                        dataVal.updatedBy = parent.updatedBy;
                                        await updateQry(dataVal, dataVal.id, childModel).then(async (existRecResponse) => {
                                            if (!existRecResponse.error) {
                                                resolve({ error: false, data: existRecResponse.data });
                                            } else {
                                                reject({ error: true, existRecResponse: e });
                                            }
                                        });
                                    } else {
                                        dataVal = { ...dataVal, createdBy: parent.updatedBy, updatedBy: parent.updatedBy };
                                        await createQry(dataVal, childModel).then(async (newRecResponse) => {
                                            if (!newRecResponse.error) {
                                                resolve({ error: false, data: newRecResponse.data });
                                            } else {
                                                reject({ error: true, newRecResponse: e });
                                            }
                                        });
                                    }
                                });
                            } else {
                                children[childModel].updatedBy = parent.updatedBy;
                                await updateQry(children[childModel], children[childModel].id, childModel).then(async (childResponse) => {
                                    if (!childResponse.error) {
                                        resolve({ error: false, data: childResponse.data });
                                    } else {
                                        reject({ error: true, childResponse: e });
                                    }
                                });
                            }
                        }).then(() => {
                            if (Object.keys(children).length === i) {
                                if (!response.error) {
                                    resolve({ error: false, data: response.data });
                                } else {
                                    reject({ error: true, response: e });
                                }
                            }
                            i++
                        });
                    });
                } else {
                    if (!response.error) {
                        resolve({ error: false, data: response.data });
                    } else {
                        reject({ error: true, response: e });
                    }
                }
            });
        } catch (e) {
            reject({ error: true, response: e });
        }
    });
};

const removeData = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            req.query.updatedBy = req.query.user_id;
            let response = await deleteQry(req, model);
            if (!response.error) {
                resolve({ error: false, data: response.data });
            } else {
                reject({ error: true, response: response.message });
            }
        } catch (e) {
            reject({ error: true, response: e });
        }
    });
};

const getOneData = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            const id = req.id;

            let response = await getOneQry(req, model);
            if (!response.error) {
                resolve({ error: false, data: response.data });
            } else {
                reject({ error: true, response: response.message });
            }
        } catch (e) {
            reject({ error: true, response: e });
        }
    });
};
// const getData = function (req, model) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             req.id = req.headers.id;
//             let response = await getQry(req, model);
//             if (!response.error) {
//                 resolve({ error: false, data: response.data });
//             } else {
//                 console.log('getQry returned an error:', response.response);
//                 reject({ error: true, response: response.message });
//             }
//         } catch (e) {
//             console.log('Error caught in getData:', e);
//             logger.error('Error caught in getData:', e)
//             reject({ error: true, response: e });
//         }
//     });
// };
const getData = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            // req.id = req.headers.id;
            
            let response = await getQry(req, model);
            if (!response.error) {
                resolve({ error: false, data: response.data });
            } else {
                console.log('getQry returned an error:', response.response);
                reject({ error: true, response: response.message });
            }
        } catch (e) {
            console.log('Error caught in getData:', e);
            logger.error('Error caught in getData:', e)
            reject({ error: true, response: e });
        }
    });
};

const searchData = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await searchQry(req, model);
            if (!response.error) {
                resolve({ error: false, data: response.data });
            } else {
                console.log('searchQry returned an error:', response.response);
                reject({ error: true, response: response.response });
            }
        } catch (e) {
            console.log('Error caught in searchData:', e);
            reject({ error: true, response: e.message });
        }
    });
};

module.exports = { createData, updateData, removeData, getData, bulkCreateData, getOneData, searchData };