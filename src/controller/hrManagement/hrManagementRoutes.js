const { modelMap } = require("../../models");
const router = require('express').Router();
const controller = require('./hrManagementController')(modelMap);

module.exports = (app) => {

    /**
    * @openapi
    * /hr-management/create:
    *  post:
    *     tags:
    *     - HR Management Controller
    *     summary: Register a HR Management
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *          schema:
    *            type: object
    *            required:
    *              - first_name
    *              - last_name
    *              - official_email
    *              - date_of_joining
    *              - designation
    *              - country
    *              - user_name
    *            properties:
    *              first_name:
    *                type: string
    *                example: johndoe
    *              last_name:
    *                type: string
    *                example: Jake
    *              official_email:
    *                type: string
    *                format: email
    *                example: samson@example.com
    *              date_of_joining:
    *                type: string
    *                format: date
    *                example: 2023-09-10  // ISO format recommended
    *              designation:
    *                type: string
    *                example: designer
    *              country:
    *                type: string
    *                example: India
    *              country_access:
    *                type: string
    *                example: India
    *              user_name:
    *                type: string
    *                example: johndoe123
    *     responses:
    *      201:
    *        description: Created
    *      409:
    *        description: Conflict - Email already exists
    *      403:
    *        description: Forbidden - HR Management already exists
    *      404:
    *        description: Not Found
    *      500:
    *        description: Server Error
    */
    router.post('/create', controller.add);
    /**
     * @openapi
     * '/hr-management/view':
     *  get:
     *     tags:
     *     - HR Management Controller
     *     summary: Get all HR Management
     *     responses:
     *      200:
     *        description: HR Management fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.get('/view', controller.getAll);
    /**
    * @openapi
    * /hr-management/edit:
    *  put:
    *     tags:
    *     - HR Management Controller
    *     summary: Modify a HR Management
    *     parameters:
    *       - name: id
    *         in: query
    *         required: true
    *         schema:
    *           type: string
    *         description: The user ID to be modified
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            properties:
    *              first_name:
    *                type: string
    *                example: johndoe
    *              last_name:
    *                type: string
    *                example: Jake
    *              official_email:
    *                type: string
    *                example: samson@example.com
    *              date_of_joining:
    *                type: string
    *                format: date
    *                example: 2023-09-10  // ISO format recommended
    *              designation:
    *                type: string
    *                example: designer
    *              country:
    *                type: string
    *                example: India
    *              country_access:
    *                type: string
    *                example: India
    *              user_name:
    *                type: string
    *                example: johndoe123
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
    router.put('/edit', controller.edit);
    /**
     * @openapi
     * '/hr-management':
     *  delete:
     *     tags:
     *     - HR Management Controller
     *     summary: Delete HR Management by Id
     *     parameters:
     *      - name: id
     *        in: query
     *        description: The unique Id of the HR Management
     *        required: true
     *        schema:
     *          type: integer
     *     responses:
     *      200:
     *        description: HR Management successfully deleted
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                error:
     *                  type: boolean
     *                message:
     *                  type: string
     *      400:
     *        description: Bad request
     *      404:
     *        description: Not found
     *      500:
     *        description: Server error
     */
    router.delete('/', controller.remove);
    /**
     * @openapi
     * '/hr-management/export':
     *  get:
     *     tags:
     *     - HR Management Controller
     *     summary: Export HR Management
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
     *                  example: hrManagement_export_1630303030.xlsx
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
    router.get('/export', controller.exportHrManagements);
    /**
     * @openapi
     * '/hr-management':
     *  get:
     *     tags:
     *     - HR Management Controller
     *     summary: Get HR Management by ID
     *     parameters:
     *       - name: id
     *         in: query
     *         description: The ID of the HR Management record to retrieve.
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *      200:
     *        description: Successfully retrieved HR Management
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  example: Successfully retrieved HR Management
     *                data:
     *                  type: object
     *                  properties:
     *                    id:
     *                      type: integer
     *                      example: 1
     *                    first_name:
     *                      type: string
     *                      example: John
     *                    last_name:
     *                      type: string
     *                      example: Doe
     *                    official_email:
     *                      type: string
     *                      example: john.doe@example.com
     *                    contact_no:
     *                      type: string
     *                      example: 123456789
     *                    designation:
     *                      type: string
     *                      example: Designer
     *      400:
     *        description: Invalid or missing ID in query
     *      404:
     *        description: HR Management not found
     *      500:
     *        description: Internal Server Error
     */
    router.get('/', controller.getById);
    /**
     * @openapi
     * '/hr-management/search':
     *  get:
     *     tags:
     *     - HR Management Controller
     *     summary: Search HR Management
     *     description: Search through hr management records based on filters provided via query parameters.
     *     parameters:
     *       - name: HR Management
     *         in: query
     *         description: Filter by HR Management-related fields (first_name, last_name, email)
     *         required: false
     *         schema:
     *           type: string
     *       - name: status
     *         in: query
     *         description: Filter by HR Management status (1 for active, 0 for inactive)
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, 0]
     *           default: 1
     *     responses:
     *      200:
     *        description: HR Management fetched successfully
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
     *                  example: HR Management fetched successfully
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: List of matched HR Management
     *      400:
     *        description: Invalid filters or query parameters
     *      404:
     *        description: No HR management found matching the filters
     *      500:
     *        description: Internal Server Error
     */
    router.get('/search', controller.searchHrManagements);
    app.use('/hr-management', router);
}