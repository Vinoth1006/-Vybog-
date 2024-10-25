const router = require('express').Router();
const { modelMap } = require("../../models");
const controller = require('./teamManagementController')(modelMap);
// const { authCheck } = require('../../authentication');



module.exports = (app) => {
    // router.post("teams-import", controller.importTeams);
    // router.post("/import" , controller.importjobs);
    /**
     * @openapi
     * '/teams/':
     *  post:
     *     tags:
     *     - Team Management Controller
     *     summary: Create a team management
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - teamName
     *              - members
     *            properties:
     *              teamName:
     *                type: string
     *                example: 'sparks'
     *              members:
     *                type: string
     *                example: 'Vinoth'
     *     responses:
     *      201:
     *        description: Team management created successfully
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
     *                  example: Team management created successfully
     *                response:
     *                  type: object
     *                  description: Created team management data
     *      400:
     *        description: Bad Request (e.g., validation errors)
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Team name is required and Members is required
     *      409:
     *        description: Conflict (e.g., team name already exists)
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: team name already exists
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Failed to create team management
     */
    router.post("/", controller.create);
    /**
     * @openapi
     * '/teams/':
     *  get:
     *     tags:
     *     - Team Management Controller
     *     summary: Get team management
     *     responses:
     *      200:
     *        description: Team management fetched successfully
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
     *                  example: Team management fetched successfully
     *                response:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: Team management data
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Bad Request
     *      404:
     *        description: Team management not found
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Team management not found
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Server error occurred
     */
    router.get("/", controller.getAll);

    // /**
    // * @openapi
    // * '/jobs/view/{id}':
    // *  get:
    // *     tags:
    // *     - jobs Controller
    // *     summary: Get a jobs by id
    // *     parameters:
    // *      - name: id
    // *        in: path
    // *        description: The jobsname of the jobs
    // *        required: true
    // *     responses:
    // *      200:
    // *        description: Fetched Successfully
    // *      400:
    // *        description: Bad Request
    // *      404:
    // *        description: Not Found
    // *      500:
    // *        description: Server Error
    // */
    router.get("/", controller.getById); 

    /**
     * @openapi
     * '/teams/':
     *  put:
     *     tags:
     *     - Team Management Controller
     *     summary: Modify a team management
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The team management ID
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              teamName:
     *                type: string
     *                example: 'Sparks'
     *              members:
     *                type: string
     *                example: 'Vinoth'
     *     responses:
     *      200:
     *        description: Team management modified successfully
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
     *                  example: Team management modified successfully
     *                response:
     *                  type: object
     *                  description: Modified team management data
     *      400:
     *        description: Bad Request (e.g., validation errors)
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Bad Request
     *      404:
     *        description: Team management not found
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Team management not found
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Failed to update data
     */
    router.put("/", controller.edit);

    /**
     * @openapi
     * '/teams/':
     *  delete:
     *     tags:
     *     - Team Management Controller
     *     summary: Delete team management by ID
     *     parameters:
     *      - name: id
     *        in: query
     *        description: The unique ID of the team management
     *        required: true
     *        schema:
     *          type: string
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              id:
     *                type: string
     *                default: '1'
     *     responses:
     *      200:
     *        description: Team management removed successfully
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
     *                  example: Team management removed successfully
     *      400:
     *        description: Bad Request (e.g., validation errors)
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Bad Request
     *      404:
     *        description: team management not found
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Team management not found
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                  example: true
     *                message:
     *                  type: string
     *                  example: Failed to delete data
     */
    router.delete("/", controller.remove);
    
    /**
     * @openapi
     * '/teams/export':
     *  get:
     *     tags:
     *     - Team Management Controller
     *     summary: Export Roles
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
     *                  example: users_export_1630303030.xlsx
     *                fileData:
     *                  type: string
     *                  example: SGVsbG8sIFdvcmxkCg==
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Users not found
     *      500:
     *        description: Internal Server Error
     */
    router.get('/export', controller.exportTeams);
    /**
     * @openapi
     * '/teams/search':
     *  get:
     *     tags:
     *     - Team Management Controller
     *     summary: Search Team Management
     *     description: Search through team management records based on filters provided via query parameters.
     *     parameters:
     *       - name: team_management
     *         in: query
     *         description: Filter by team_management-related fields (teamName, members)
     *         required: false
     *         schema:
     *           type: string
     *       - name: status
     *         in: query
     *         description: Filter by team_management status (1 for active, 0 for inactive)
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, 0]
     *           default: 1
     *     responses:
     *      200:
     *        description: Team Management fetched successfully
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
     *                  example: Team Management fetched successfully
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: List of matched team_management
     *      400:
     *        description: Invalid filters or query parameters
     *      404:
     *        description: No team_management found matching the filters
     *      500:
     *        description: Internal Server Error
     */
    router.get('/search', controller.searchTeams);
    app.use('/teams', router);
};

