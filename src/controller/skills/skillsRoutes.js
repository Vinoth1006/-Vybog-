const router = require('express').Router();
const { modelMap } = require("../../models");
const controller = require('./skillsController')(modelMap);
// const { authCheck } = require('../../authentication');

module.exports = (app) => {
    /**
     * @openapi
     * '/skills/create':
     *  post:
     *     tags:
     *     - Skill Controller
     *     summary: Create a skill
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - skill_name
     *              - email
     *            properties:
     *              first_name:
     *                type: string
     *                example: 'John'
     *              last_name:
     *                type: string
     *                example: 'Doe'
     *              skill_name:
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
     *        description: skill created successfully
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
     *                  example: skill created successfully
     *                response:
     *                  type: object
     *                  description: Created skill data
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
     *                  example: skill name is required and Email is required
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
     *                  example: Failed to create skill
     */
    router.post("/create", controller.create);
    /**
     * @openapi
     * '/skills/view':
     *  get:
     *     tags:
     *     - Skill Controller
     *     summary: Get skills
     *     responses:
     *      200:
     *        description: skills fetched successfully
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
     *                  example: skills fetched successfully
     *                response:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: skill data
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
     *        description: skills not found
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
     *                  example: skills not found
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
     * '/skills/edit':
     *  put:
     *     tags:
     *     - Skill Controller
     *     summary: Modify a skill
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The skill ID
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
     *              skill_name:
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
     *        description: skill modified successfully
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
     *                  example: skill modified successfully
     *                response:
     *                  type: object
     *                  description: Modified skill data
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
     *        description: skill not found
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
     * '/skills/delete':
     *  delete:
     *     tags:
     *     - Skill Controller
     *     summary: Delete skill by ID
     *     parameters:
     *      - name: id
     *        in: query
     *        description: The unique ID of the skill
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
     *        description: skill removed successfully
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
     *                  example: skill removed successfully
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
     *        description: skill not found
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
     *                  example: skill not found
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
    app.use('/skills', router);
};

