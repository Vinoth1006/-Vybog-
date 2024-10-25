const router = require('express').Router();
const { modelMap } = require("../../models");
const controller = require('./LoginController')(modelMap);
const { authCheck } = require('../../services/authentication.js');

// const { passport, ensureAuthenticated } = require('../../services/authentication');

module.exports = (app) => {
    // router.get("/login", ensureAuthenticated, (req, res) => {
    //     const user = req.body.user;
    //     const claims = req.body.authInfo;

    //     console.log('User info: ', user);
    //     console.log('Validated claims: ', claims);

    //     if (claims['scp'].split(" ").indexOf("read") >= 0) {
    //         res.status(200).json({ user, claims });
    //     } else {
    //         console.log("Invalid Scope, 403");
    //         res.status(403).json({'error': 'insufficient_scope'});
    //     }
    // });
    /**
   * @openapi
   * '/user/login':
   *  post:
   *     tags:
   *     - User Controller
   *     summary: Login using username and password
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *            properties:
   *              email:
   *                type: string
   *                default: johndoe@gmail.com 
   *              password:
   *                type: string
   *                default: johnDoe20!@
   *     responses:
   *      200:
   *        description: Login successfully
   *      409:
   *        description: Conflict
   *      404:
   *        description: invalid credentials
   *      500:
   *        description: Server Error
   */
    router.post("/login", controller.login);
    /**
    * @openapi
    * '/user/register':
    *  post:
    *     tags:
    *     - User Controller
    *     summary: Register a user
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            required:
    *              - username
    *              - email
    *              - password
    *            properties:
    *              user_name:
    *                type: string
    *                default: johndoe 
    *              first_name:
    *                type: string
    *                default: Jake
    *              last_name:
    *                type: string
    *                default: samson  
    *              email:
    *                type: string
    *                default: johndoe@mail.com
    *              password:
    *                type: string
    *                default: johnDoe20!@
    *              role_id:
    *                type: integer
    *                default: 1
    *              tenant_id:
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
    router.post("/register", controller.add);
    /**
    * @openapi
    * '/user/view':
    *  get:
    *     tags:
    *     - User Controller
    *     summary: Get a user
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
    router.get("/view",authCheck, controller.get);
    /**
    * @openapi
    * '/user/filter':
    *  get:
    *     tags:
    *     - User Controller
    *     summary: Get a user by id
    *     parameters:
    *      - name: id
    *        in: path
    *        description: The username of the user
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
    router.get("/filter",authCheck, controller.getOne);
    /**
     * @openapi
     * '/user/edit':
     *  put:
     *     tags:
     *     - User Controller
     *     summary: Modify a user
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The user ID
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            properties:
     *              user_name:
     *                type: string
     *                default: johndoe 
     *              first_name:
     *                type: string
     *                default: Jake
     *              last_name:
     *                type: string
     *                default: samson  
     *              email:
     *                type: string
     *                default: johndoe@mail.com
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
     * '/user/delete':
     *  delete:
     *     tags:
     *     - User Controller
     *     summary: Delete user by Id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the user
     *        required: true
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
    router.delete("/delete",authCheck, controller.remove);
    /**
     * @openapi
     * '/user/export':
     *  get:
     *     tags:
     *     - User Controller
     *     summary: Export Users
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
    router.get('/export', controller.exportUsers);
    router.get('/search', controller.searchUsers);
    app.use('/user', router);
};

