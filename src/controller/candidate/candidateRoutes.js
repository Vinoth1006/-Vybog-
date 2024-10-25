const router = require('express').Router();
const {modelMap } = require("../../models");
const controller = require('./candidateController')(modelMap);
const { authCheck } = require('../../services/authentication.js');

module.exports = (app) => {
    //     /**
    //  * @openapi
    //  * '/candidate/search/{data}':
    //  *   get:
    //  *     tags:
    //  *     - Candidate Controller
    //  *     summary: Get a candidate by id
    //  *     parameters:
    //  *      - name: data
    //  *        in: path
    //  *        description: The candidatename of the candidate
    //  *        required: true
    //  *     responses:
    //  *      200:
    //  *        description: Fetched Successfully
    //  *      400:
    //  *        description: Bad Request
    //  *      404:
    //  *        description: Not Found
    //  *      500:
    //  *        description: Server Error
    //  */
    // router.get("/search/:data" , controller.filterData);
    // /**
    //  * @openapi
    //  * '/candidate/filter':
    //  *  post:
    //  *     tags:
    //  *     - Candidate Controller
    //  *     summary: Filter a Candidate
    //  *     requestBody:
    //  *      required: true
    //  *      content:
    //  *        application/json:
    //  *           schema:
    //  *            type: object
    //  *            required:
    //  *              - can_name
    //  *              - can_email
    //  *              - can_phone
    //  *            properties:
    //  *              first_name:
    //  *                type: string
    //  *                default: Sam 
    //  *              last_name:
    //  *                type: string
    //  *                default: Aurthur 
    //  *              email:
    //  *                type: string
    //  *                default: sam@gmail.com
    //  *              phone:
    //  *                type: string
    //  *                default: 9878786757  
    //  *              role:
    //  *                type: integer
    //  *                default: 1
    //  *     responses:
    //  *      201:
    //  *        description: Created
    //  *      409:
    //  *        description: Conflict
    //  *      404:
    //  *        description: Not Found
    //  *      500:
    //  *        description: Server Error
    //  */
    // router.post("/filter" , controller.filterData);

    router.post("/bulk-import" ,authCheck, controller.bulkImport);
    /**
     * @openapi
     * '/candidate/create':
     *  post:
     *     tags:
     *     - Candidate Controller
     *     summary: Create a Candidate
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - first_name
     *              - last_name
     *              - email
     *            properties:
     *              first_name:
     *                type: string
     *                default: Sam 
     *              lastName:
     *                type: string
     *                default: Aurthur 
     *              email:
     *                type: string
     *                default: sam@gmail.com
     *              phone:
     *                type: string
     *                default: 9878786757  
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.post("/create" ,authCheck, controller.add);
     /**
     * @openapi
     * '/candidate/view':
     *  get:
     *     tags:
     *     - Candidate Controller
     *     summary: Get a candidate
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.get("/view" ,authCheck, controller.get);
    
     /**
     * @openapi
     * '/candidate/track':
     *  get:
     *     tags:
     *     - Candidate Controller
     *     summary: Get a candidate by id
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.get("/track" ,authCheck, controller.getTrack);

     /**
     * @openapi
     * '/candidate':
     *  get:
     *     tags:
     *     - Candidate Controller
     *     summary: Get a candidate by id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The candidatename of the candidate
     *        required: true
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.get("/view" ,authCheck, controller.filterData);
    /**
     * @openapi
     * '/candidate/edit':
     *  put:
     *     tags:
     *     - Candidate Controller
     *     summary: Modify a candidate
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The candidate ID
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              can_first_name:
     *                type: string
     *                default: Sam 
     *              can_last_name:
     *                type: string
     *                default: Aurthur 
     *              email:
     *                type: string
     *                default: sam@gmail.com
     *              phone:
     *                type: string
     *                default: 9878786757  
     *              can_source:
     *                type: string
     *                default: linkedin
     *              can_role:
     *                type: integer
     *                default: 1
     *              can_country_code:
     *                type: string
     *                default: "+91"
     *     responses:
     *      200:
     *        description: Modified
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.put("/edit",authCheck, controller.edit);

    /**
     * @openapi
     * '/candidate/delete':
     *  delete:
     *     tags:
     *     - Candidate Controller
     *     summary: Delete candidate by Id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the candidate
     *        required: true
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              user_id:
     *                type: string
     *                default: 1 
     *     responses:
     *      200:
     *        description: Removed
     *      400:
     *        description: Bad request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.delete("/delete" ,authCheck, controller.remove);
    /**
     * @openapi
     * '/candidate/export':
     *  get:
     *     tags:
     *     - Candidate Controller
     *     summary: Export Candidates
     *     parameters:
     *       - name: fields
     *         in: query
     *         description: Comma-separated list of fields to export. Leave empty to export all fields.
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *      200:
     *        description: Export successful
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                fileName:
     *                  type: string
     *                  example: candidates_export_1630303030.xlsx
     *                fileData:
     *                  type: string
     *                  description: Base64-encoded file content
     *                  example: U29tZUJhc2U2NERhdGE=
     *      404:
     *        description: Candidates not found
     *      400:
     *        description: Bad Request
     *      500:
     *        description: Server Error
     */
    router.get('/export', authCheck, controller.exportCandidates);
    /**
     * @openapi
     * '/candidate/track':
     *  get:
     *     tags:
     *     - Candidate Controller
     *     summary: Get a candidate by id
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.get('/track', controller.getTrack);
    /**
     * @openapi
     * '/candidate/search':
     *  get:
     *     tags:
     *     - Candidate Controller
     *     summary: Search Candidates
     *     description: Search through candidate records based on filters provided via query parameters.
     *     parameters:
     *       - name: candidate
     *         in: query
     *         description: Filter by candidate-related fields (first_name, last_name, email)
     *         required: false
     *         schema:
     *           type: string
     *       - name: status
     *         in: query
     *         description: Filter by candidate status (1 for active, 0 for inactive)
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, 0]
     *           default: 1
     *     responses:
     *      200:
     *        description: Candidates fetched successfully
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: false
     *                message:
     *                  type: string
     *                  example: Candidates fetched successfully
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: List of matched candidates
     *      400:
     *        description: Invalid filters or query parameters
     *      404:
     *        description: No candidates found matching the filters
     *      500:
     *        description: Internal Server Error
     */
    router.get('/search', authCheck, controller.searchCandidates);
    app.use('/candidate', router);
};

