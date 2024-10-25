const { pool } = require("../server")
const logger = require('../services/logger')
const dbquery = require('../services/dbQuery')

// const candidateTrack = async (req, model) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let query = `SELECT ct.can_id,ct.remarks,skills.skill_name,role.role_name,job.job_title,job.job_code,location.city,location.country,location.state
//                         FROM public.candidate_tracking AS ct
//                         JOIN candidate ON candidate.id = ct.can_id
//                         JOIN job ON job.id = ct.job_id
//                         JOIN location ON location.id = candidate.city
//                         JOIN can_skills_mapping ON can_skills_mapping.can_id = candidate.id
//                         JOIN skills ON skills.id = can_skills_mapping.skill_id
//                         JOIN role ON role.id = candidate.role`;
//             const values = [];
//             if (req.query.id || req.body.id) {
//                 query += ` WHERE ct.can_id = $1`;
//                 values.push(req.query.id);
//             }

//             const result = await pool.query(query, values);

//             if (result.rows.length > 0) {
//                 resolve({ error: false, data: result.rows });
//             } else {
//                 resolve({ error: false, data: "No Data Found" });
//             }
//         } catch (e) {
//             logger.error(`Error in getOneQry: ${e.message}`);
//             reject({ error: true, message: e.toString() });
//         }
//     });
// };

const candidateTrack = async (req, model) => {
    return new Promise(async (resolve, reject) => {
        try {
            const id = req.query.id || req.body.id; 
            let query = `SELECT ct.can_id, ct.remarks, skills.skill_name, role.role_name, job.job_title, job.job_code, location.city, location.country, location.state
                         FROM public.candidate_tracking AS ct
                         LEFT JOIN candidate ON candidate.id = ct.can_id
                         LEFT JOIN job ON job.id = ct.job_id
                         LEFT JOIN location ON location.id = candidate.city
                         LEFT JOIN can_skills_mapping ON can_skills_mapping.can_id = candidate.id
                         LEFT JOIN skills ON skills.id = can_skills_mapping.skill_id
                         LEFT JOIN role ON role.id = candidate.role`;

            const values = [];
            
            if (id) {
                query += ` WHERE ct.can_id = $1`;
                values.push(id);
            }

            console.log("Executing query:", query);
            console.log("With values:", values);

            const result = await pool.query(query, values);

            if (result.rows.length > 0) {
                resolve({ error: false, data: result.rows });
            } else {
                resolve({ error: false, data: "No Data Found" });
            }
        } catch (e) {
            logger.error(`Error in candidateTrack: ${e.message}`);
            reject({ error: true, message: e.toString() });
        }
    });
};

module.exports = {
    candidateTrack
};