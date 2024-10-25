// const bcrypt = require('bcrypt');
const { pool } = require("../server")
const logger = require('../services/logger')

const createQry = function (postData, model) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(postData);
            const columns = Object.keys(postData).map(column => `"${column}"`).join(', ');
            const values = Object.values(postData);

            const paramPlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');
            const query = `INSERT INTO "${model}" (${columns}) VALUES (${paramPlaceholders}) RETURNING *`;
            console.log(query);
            const { rows } = await pool.query(query, values);
            // pool.release();

            resolve({ error: false, data: rows[0] });
        } catch (e) {
            console.error('Error in createQry:', e);
            reject({ error: true, response: e.toString() });
        }
    });
};

//fetch data
const getQry = async (req, model) => {
    try {
        let query = `SELECT * FROM "${model}" WHERE "status" = 1`;
        let values = [];
        let paramCount = 1;

        if (req.query.company_name) {
            query += ` AND "company_name" = $${paramCount}`;
            values.push(req.query.company_name);
            paramCount++;
        }

        if (req.query.job_title) {
            query += ` AND "job_title" = $${paramCount}`;
            values.push(req.query.job_title);
            paramCount++;
        }

        if (req.query.job_code) {
            query += ` AND "job_code" = $${paramCount}`;
            values.push(req.query.job_code);
            paramCount++;
        }

        if (req.query.teamName) {
            query += ` AND "teamName" = $${paramCount}`;
            values.push(req.query.teamName);
            paramCount++;
        }

        if (req.query.email) {
            query += ` AND "email" = $${paramCount}`;
            values.push(req.query.email);
            paramCount++;
        }

        if (req.params.id) {
            query += ` AND "id" = $${paramCount}`;
            values.push(req.params.id);
            paramCount++;
        }

        const result = await pool.query(query, values);
        console.log('Query result:', result.rows);

        return { error: false, data: result.rows };
    } catch (e) {
        console.log('Error executing query:', e.message);
        return { error: true, response: e.message };
    }
};

const bulkCreateQry = async function (postData, model) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Processing Query");
            console.log(postData[0]);
            if (postData[0]) {
                const columns = Object.keys(postData[0]);

                const columnList = columns.map(col => `"${col}"`).join(', ');


                let valueIndex = 1;
                const values = [];
                const rowPlaceholders = postData.map(row => {
                    const rowValues = Object.values(row);
                    values.push(...rowValues);
                    const placeholders = rowValues.map(() => `$${valueIndex++}`);
                    return `(${placeholders.join(', ')})`;
                }).join(', ');

                const query = `INSERT INTO ${model} (${columnList}) VALUES ${rowPlaceholders} RETURNING *`;

                const { rows } = await pool.query(query, values);

                resolve({ error: false, data: rows });
            } else {
                resolve({ error: false, data: '' });
            }


        } catch (e) {
            reject({ error: true, response: e.toString() });
        }
    });
};

// Update data
const updateQry = function (updateData, id, model) {
    return new Promise(async (resolve, reject) => {
        try {
            const columns = Object.keys(updateData);
            const values = Object.values(updateData);

            const setClause = columns.map((col, index) => `"${col}" = $${index + 1}`).join(', ');

            const query = `UPDATE "${model}" SET ${setClause} WHERE "id" = ${id} RETURNING *`;

            const { rows } = await pool.query(query, values);

            resolve({ error: false, data: rows[0] });
        } catch (e) {
            reject({ error: true, response: e.toString() });
        }
    });
};

const deleteQry = function (req, model) {
    return new Promise(async (resolve, reject) => {
        try {
            req.query.updatedBy = req.query.user_id;
            const findValues = [req.query.id];
            const findQuery = `SELECT * FROM "${model}" WHERE "id" = $1 AND "status" = 1`;

            const { rows: userRows } = await pool.query(findQuery, findValues);

            if (userRows.length === 0) {
                resolve({ error: true, message: 'No User Found' });
                return;
            }

            const updateQuery = `UPDATE "${model}" SET "status" = 0, "updatedBy" = $2 WHERE "id" = $1 AND "status" = 1 RETURNING *`;
            const updateValues = [req.query.id, req.query.user_id];

            const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

            if (updatedRows.length === 0) {
                resolve({ error: true, message: 'No User Found' });
            } else {
                resolve({ error: false, data: updatedRows[0] });
            }
        } catch (e) {
            reject({ error: true, response: e.toString() });
        }
    });
};
const getOneQry = async (req, model) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req;

            let query = `SELECT * FROM "${model}" WHERE "status" = 1`;
            const values = [];
            let paramCount = 1;

            if (id) {
                query += ` AND "id" = $${paramCount}`;
                values.push(id);
                paramCount++;
            }

            if (req.email) {
                query += ` AND "email" = $${paramCount}`;
                values.push(req.email);
                paramCount++;
            }

            if (req.phone) {
                query += ` AND "phone" = $${paramCount}`;
                values.push(req.phone);
                paramCount++;
            }

            if (req.body.company_name) {
                query += ` AND "company_name" = $${paramCount}`;
                values.push(req.body.company_name);
                paramCount++;
            }

            if (req.body.job_title) {
                query += ` AND "job_title" = $${paramCount}`;
                values.push(req.body.job_title);
                paramCount++;
            }

            if (req.body.job_code) {
                query += ` AND "job_code" = $${paramCount}`;
                values.push(req.body.job_code);
                paramCount++;
            }

            if (req.body.user_name) {
                query += ` AND "user_name" = $${paramCount}`;
                values.push(req.body.user_name);
                paramCount++;
            }

            query += ' LIMIT 1';

            const result = await pool.query(query, values);

            if (result.rows.length > 0) {
                resolve({ error: false, data: result.rows[0] });
            } else {
                resolve({ error: false, data: "No Data Found" });
            }
        } catch (e) {
            logger.error(`Error in getOneQry: ${e.message}`);
            reject({ error: true, message: e.toString() });
        }
    });
};

const searchQry = async (req) => {
    try {
        let model;
        if (req.query.job) {
            model = 'job';
        } else if (req.query.client) {
            model = 'client';
        } else if (req.query.candidate) {
            model = 'candidate';
        } else if (req.query.team_management) {
            model = 'team_management';
        } else if (req.query.user) {
            model = 'user';
        } else if (req.query.role) {
            model = 'role';
        } else if (req.query.hr_management){
            model = "hr_management";
        } else {
            return { error: true, response: "Invalid model provided. Please use 'job', 'client', 'candidate', 'team_management', 'user', 'hr_management', or 'role'." };
        }

        let query = `SELECT * FROM "${model}" WHERE "status" = 1`;
        let values = [];
        let paramCount = 1;

        const filters = {
            'job': ['job_title', 'job_code'],
            'client': ['company_name', 'company_tier', 'company_agreement', 'company_tax'],
            'candidate': ['first_name', 'last_name', 'email'],
            'team_management': ['teamName', 'members'],
            'user': ['first_name', 'last_name', 'email', 'company'],
            'role': ['first_name', 'last_name', 'email', 'role_name'],
            'hr_management': ['first_name', 'official_email', 'user_name', 'contact_no']
        }[model];

        let hasFilters = false;

        if (req.query[model]) {
            let searchQuery = filters.map(filter => `"${filter}" ILIKE $${paramCount}`).join(' OR ');
            query += ` AND (${searchQuery})`;
            values.push(`%${req.query[model]}%`);
            paramCount++;
            hasFilters = true;
        }

        if (req.params.id) {
            query += ` AND "id" = $${paramCount}`;
            values.push(req.params.id);
            hasFilters = true;
        }

        if (!hasFilters) {
            return { error: true, response: "No filters provided to search the data." };
        }

        console.log('Generated Query:', query);
        console.log('Query Values:', values);

        const result = await pool.query(query, values);
        console.log('Query result:', result.rows);

        return { error: false, data: result.rows };
    } catch (e) {
        console.log('Error executing query:', e.message);
        return { error: true, response: e.message };
    }
};

// const getQry = function (req, model) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const modelTbl = modelMap[model];
//             let { id } = req.params;
//             // let { email, password } = req.body;
//             let result = {};
//             if (id) {
//                 // Fetch a record
//                 result = await modelTbl.findOne({
//                     where: { id, status: 1 }
//                 });
//                 resolve({ error: false, data: result });
//             }
//             else {
//                 // Fetch all records
//                 let findData = {};

//                 // Where condition Start
//                 let condition = {}

//                 // search
//                 if (req.query.q && req.query.qField) {
//                     let searchFields = [];
//                     req.query.qField.split(',').forEach((searchField) => {
//                         searchFields.push(
//                             {
//                                 [searchField]: {
//                                     [Op.iLike]: '%' + req.query.q + '%'
//                                 }
//                             }
//                         )
//                     })
//                     condition = { [Op.or]: searchFields };
//                 }

//                 //filter
//                 if (req.query.filter) {
//                     req.query.filter.split('|').forEach((filterVal) => {
//                         let filterArr = filterVal.split('=');
//                         condition[filterArr[0]] = { [Op.in]: filterArr[1].split(',') };
//                     });
//                 }

//                 //general conditions
//                 condition.status = 1;
//                 if (req.query.skip_disable) {
//                     condition.status = 1;
//                 }
//                 if (req.query.org_id) {
//                     condition.org_id = req.query.org_id;
//                 }

//                 findData.where = condition;
//                 // Where condition End

//                 // Joins start
//                 if (req.query.include) {
//                     let include = [];
//                     req.query.include.split('||||').forEach((includeVal) => {
//                         let nestedInclude = [];
//                         let [parent, ...child] = includeVal.split('|||');
//                         if (child.length > 0) {
//                             child.forEach((nested) => {
//                                 let [nestedModel, ...nestedCondtions] = nested.split('||');
//                                 if (typeof nestedCondtions[0] !== "undefined") {
//                                     let nestedWhereCond = {};
//                                     nestedCondtions[0].split('|').forEach((nestedVal) => {
//                                         let nestedCond = nestedVal.split('=');
//                                         nestedWhereCond[nestedCond[0]] = { [Op.in]: nestedCond[1].split(',') };
//                                     });
//                                     nestedInclude.push({
//                                         model: modelMap[nestedModel],
//                                         as: nestedModel,
//                                         where: nestedWhereCond
//                                     });
//                                 } else {
//                                     nestedInclude.push({
//                                         model: modelMap[nestedModel],
//                                         as: nestedModel
//                                     });
//                                 }
//                             });
//                         }
//                         let [parentModel, ...condtions] = parent.split('||');
//                         if (typeof condtions[0] !== "undefined") {
//                             let childCond = {};
//                             condtions[0].split('|').forEach((val) => {
//                                 let cond = val.split('=');
//                                 childCond[cond[0]] = { [Op.in]: cond[1].split(',') };
//                             });
//                             include.push({
//                                 model: modelMap[parentModel],
//                                 as: parentModel,
//                                 include: nestedInclude,
//                                 where: childCond
//                             })
//                         } else {
//                             include.push({
//                                 model: modelMap[parentModel],
//                                 as: parentModel,
//                                 include: nestedInclude
//                             })
//                         }
//                     });
//                     findData.include = include;
//                 }
//                 // Joins end

//                 // Get total record count
//                 result.totalCount = await modelTbl.count(findData);

//                 // Sorting start
//                 if (req.query.sortField) {
//                     let splitSort = req.query.sortField.split('.');
//                     if (splitSort.length > 1) {
//                         findData.order = [[splitSort[0].trim(), splitSort[1].trim(), req.query.direction]];
//                     } else {
//                         findData.order = [[req.query.sortField, req.query.direction]];
//                     }
//                 }
//                 // Sorting End

//                 //Pagination
//                 if (req.query.pageSize && req.query.page) {
//                     let page, pageSize
//                     page = req.query.page ? req.query.page : 1;
//                     pageSize = req.query.pageSize ? req.query.pageSize : 10
//                     let limit = pageSize
//                     let pageNumber = page
//                     let offset = pageNumber ? (pageNumber - 1) * limit : 0
//                     findData.offset = offset;
//                     findData.limit = limit;
//                 }
//                 //Pagination

//                 result.data = await modelTbl.findAll(findData);
//                 resolve({ error: false, data: result });
//             }
//         } catch (e) {
//             reject({ error: true, response: e.toString() });
//         }
//     });
// };

module.exports = { createQry, updateQry, deleteQry, getQry, bulkCreateQry, getOneQry, searchQry };