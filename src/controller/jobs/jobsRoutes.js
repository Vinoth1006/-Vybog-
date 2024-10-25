const router = require('express').Router();
const { modelMap } = require("../../models");
const controller = require('./jobsController')(modelMap);
// const { authCheck } = require('../../authentication');

module.exports = (app) => {
    router.post("/jobs-import", controller.importJobs);
    router.post("/jobs-extract", controller.extractData);

    /**
     * @openapi
     * '/jobs/create':
     *  post:
     *     tags:
     *     - Jobs Controller
     *     summary: Create a jobs
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - job_title
     *              - job_code
     *            properties:
     *              job_title:
     *                type: string
     *                default: 'Developer' 
     *              job_code:
     *                type: integer
     *                default: 1 
     *              role_id:
     *                type: integer
     *                default: 1
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
    router.post("/create", controller.create);
    /**
    * @openapi
    * '/jobs/view':
    *  get:
    *     tags:
    *     - Jobs Controller
    *     summary: Get a jobs
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
    router.get("/view", controller.get);
    /**
    * @openapi
    * '/jobs/view':
    *  get:
    *     tags:
    *     - Jobs Controller
    *     summary: Get a jobs by id
    *     parameters:
    *      - name: id
    *        in: path
    *        description: The jobsname of the jobs
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
    router.get("/view", controller.get);
    /**
     * @openapi
     * '/jobs/edit':
     *  put:
     *     tags:
     *     - Jobs Controller
     *     summary: Modify a jobs
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The jobs ID
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              job_title:
     *                type: string
     *                default: 'Developer' 
     *              job_code:
     *                type: integer
     *                default: 1 
     *              role_id:
     *                type: integer
     *                default: 1
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
    router.put("/edit", controller.edit);

    /**
     * @openapi
     * '/jobs/delete':
     *  delete:
     *     tags:
     *     - Jobs Controller
     *     summary: Delete jobs by Id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the jobs
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
    router.delete("/delete", controller.remove);
    /**
     * @openapi
     * '/jobs/export':
     *  get:
     *     tags:
     *     - Jobs Controller
     *     summary: Export Jobs
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
     *                  example: jobs_export_1630303030.xlsx
     *                fileData:
     *                  type: string
     *                  example: SGVsbG8sIFdvcmxkCg==
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Jobs not found
     *      500:
     *        description: Internal Server Error
     */
    router.get('/export', controller.exportJobs);
    /**
     * @openapi
     * '/jobs/search':
     *  get:
     *     tags:
     *     - Jobs Controller
     *     summary: Search jobs
     *     description: Search through job records based on filters provided via query parameters.
     *     parameters:
     *       - name: job
     *         in: query
     *         description: Filter by job-related fields (job_title, job_code)
     *         required: false
     *         schema:
     *           type: string
     *       - name: status
     *         in: query
     *         description: Filter by job status (1 for active, 0 for inactive)
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, 0]
     *           default: 1
     *     responses:
     *      200:
     *        description: Jobs fetched successfully
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
     *                  example: Jobs fetched successfully
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: List of matched jobs
     *      400:
     *        description: Invalid filters or query parameters
     *      404:
     *        description: No jobs found matching the filters
     *      500:
     *        description: Internal Server Error
     */
    router.get('/search', controller.searchJobs);
    app.use('/jobs', router);
};

