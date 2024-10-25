const router = require('express').Router();
const { modelMap } = require("../../models");
const controller = require('./locationController')(modelMap);
// const { authCheck } = require('../../authentication');

module.exports = (app) => {
    /**
     * @openapi
     * '/locations/create':
     *  post:
     *     tags:
     *     - Location Controller
     *     summary: Create a location
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - location_name
     *              - email
     *            properties:
     *              first_name:
     *                type: string
     *                example: 'John'
     *              last_name:
     *                type: string
     *                example: 'Doe'
     *              location_name:
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
     *        description: location created successfully
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
     *                  example: location created successfully
     *                response:
     *                  type: object
     *                  description: Created location data
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
     *                  example: location name is required and Email is required
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
     *                  example: Failed to create location
     */
    router.post("/create", controller.create);
    /**
     * @openapi
     * '/locations/view':
     *  get:
     *     tags:
     *     - Location Controller
     *     summary: Get locations
     *     responses:
     *      200:
     *        description: locations fetched successfully
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
     *                  example: locations fetched successfully
     *                response:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: location data
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
     *        description: locations not found
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
     *                  example: locations not found
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
     * '/locations/edit':
     *  put:
     *     tags:
     *     - Location Controller
     *     summary: Modify a location
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The location ID
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
     *              location_name:
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
     *        description: location modified successfully
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
     *                  example: location modified successfully
     *                response:
     *                  type: object
     *                  description: Modified location data
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
     *        description: location not found
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
     * '/locations/delete':
     *  delete:
     *     tags:
     *     - Location Controller
     *     summary: Delete location by ID
     *     parameters:
     *      - name: id
     *        in: query
     *        description: The unique ID of the location
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
     *        description: location removed successfully
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
     *                  example: location removed successfully
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
     *        description: location not found
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
     *                  example: location not found
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
    app.use('/locations', router);
};

