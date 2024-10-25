const router = require('express').Router();
const { modelMap } = require("../../models");
const controller = require('./roleController')(modelMap);
// const { authCheck } = require('../../authentication');

router.get('/export', controller.exportRoles)
module.exports = (app) => {
    /**
     * @openapi
     * '/roles/create':
     *  post:
     *     tags:
     *     - Role Controller
     *     summary: Create a role
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - role_name
     *              - email
     *            properties:
     *              first_name:
     *                type: string
     *                example: 'John'
     *              last_name:
     *                type: string
     *                example: 'Doe'
     *              role_name:
     *                type: string
     *                example: 'Admin'
     *              email:
     *                type: string
     *                example: 'john@gmail.com'
     *              password: 
     *                type: string
     *                example: 'Passw0rd!'
     *     responses:
     *      201:
     *        description: Role created successfully
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
     *                  example: Role created successfully
     *                response:
     *                  type: object
     *                  description: Created role data
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
     *                  example: Role name is required and Email is required
     *      409:
     *        description: Conflict (e.g., email already exists)
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
     *                  example: Email already exists
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
     *                  example: Failed to create role
     */
    router.post("/create", controller.create);
    /**
     * @openapi
     * '/roles/view':
     *  get:
     *     tags:
     *     - Role Controller
     *     summary: Get roles
     *     responses:
     *      200:
     *        description: Roles fetched successfully
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
     *                  example: Roles fetched successfully
     *                response:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: Role data
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
     *        description: Roles not found
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
     *                  example: Roles not found
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
    router.get("/view", controller.get);

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
    // router.get("/view/:id", controller.get);
    /**
     * @openapi
     * '/roles/edit':
     *  put:
     *     tags:
     *     - Role Controller
     *     summary: Modify a role
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The role ID
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              first_name:
     *                type: string
     *                example: 'John'
     *              last_name:
     *                type: string
     *                example: 'Doe'
     *              role_name:
     *                type: string
     *                example: 'Admin'
     *              email:
     *                type: string
     *                example: 'john@gmail.com'
     *              password: 
     *                type: string
     *                example: 'Passw0rd!'
     *     responses:
     *      200:
     *        description: Role modified successfully
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
     *                  example: Role modified successfully
     *                response:
     *                  type: object
     *                  description: Modified role data
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
     *        description: Role not found
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
     *                  example: User not found
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
    router.put("/edit", controller.edit);

    /**
     * @openapi
     * '/roles/delete':
     *  delete:
     *     tags:
     *     - Role Controller
     *     summary: Delete role by ID
     *     parameters:
     *      - name: id
     *        in: query
     *        description: The unique ID of the role
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
     *              user_id:
     *                type: string
     *                default: '1'
     *     responses:
     *      200:
     *        description: role removed successfully
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
     *                  example: Role removed successfully
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
     *        description: Role not found
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
     *                  example: Role not found
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
    router.delete("/delete", controller.remove);

    /**
     * @openapi
     * '/roles/export':
     *  get:
     *     tags:
     *     - Role Controller
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
     *                  example: roles_export_1630303030.xlsx
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
    router.get('/export', controller.exportRoles);
    /**
     * @openapi
     * '/roles/search':
     *  get:
     *     tags:
     *     - Role Controller
     *     summary: Search roles
     *     description: Search through role records based on filters provided via query parameters.
     *     parameters:
     *       - name: role
     *         in: query
     *         description: Filter by role-related fields (first_name, last_name, email, role_name)
     *         required: false
     *         schema:
     *           type: string
     *       - name: status
     *         in: query
     *         description: Filter by role status (1 for active, 0 for inactive)
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, 0]
     *           default: 1
     *     responses:
     *      200:
     *        description: Roles fetched successfully
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
     *                  example: Roles fetched successfully
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: List of matched roles
     *      400:
     *        description: Invalid filters or query parameters
     *      404:
     *        description: No roles found matching the filters
     *      500:
     *        description: Internal Server Error
     */
    router.get('/search', controller.searchRoles);
    app.use('/roles', router);
};

