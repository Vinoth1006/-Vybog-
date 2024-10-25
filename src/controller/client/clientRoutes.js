const { modelMap } = require("../../models");
const router = require('express').Router();
const controller = require('./clientController')(modelMap);

module.exports = (app) => {
    // router.post('/import', controller.bulkImport);
    /**
     * @openapi
     * /client/create:
     *   post:
     *     tags:
     *       - Client Controller
     *     summary: Create a new client
     *     description: This endpoint allows you to create a new client by providing the required company details.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - company_name
     *               - company_tier
     *               - company_agreement
     *             properties:
     *               company_name:
     *                 type: string
     *                 description: The name of the company
     *                 example: Vybog
     *               company_tax:
     *                 type: string
     *                 description: The tax applied to the company
     *                 example: 25
     *               company_agreement:
     *                 type: string
     *                 description: The company's agreement duration
     *                 example: 2 years
     *               company_tier:
     *                 type: string
     *                 description: The tier level of the company
     *                 example: Tier 1
     *               payment_terms:
     *                 type: string
     *                 description: The payment terms for the company
     *                 example: Net 20
     *     responses:
     *       201:
     *         description: Client created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Client created successfully
     *                 response:
     *                   type: object
     *                   description: The data of the created client
     *       400:
     *         description: Bad Request (Validation errors)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Company name is required
     *       403:
     *         description: Conflict (Client already exists)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Client already exists
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Client creation failed
     */
    router.post("/create", controller.create);
    /**
     * @openapi
     * '/client/view':
     *  get:
     *     tags:
     *     - Client Controller
     *     summary: Get all clients
     *     responses:
     *      200:
     *        description: Clients fetched Successfully
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    router.get("/view", controller.getAll);
    // /**
    //  * @openapi
    //  * '/client/view/{id}':
    //  *  get:
    //  *     tags:
    //  *     - Client Controller
    //  *     summary: Get a client by id
    //  *     parameters:
    //  *      - name: id
    //  *        in: path
    //  *        description: Company name
    //  *        required: true
    //  *     responses:
    //  *      200:
    //  *        description: Client fetched Successfully
    //  *      400:
    //  *        description: Bad Request
    //  *      404:
    //  *        description: Not Found
    //  *      500:
    //  *        description: Server Error
    //  */
    router.get("/view", controller.getById);
    /**
     * @openapi
     * /client/edit:
     *   put:
     *     tags:
     *       - Client Controller
     *     summary: Modify a Client by ID
     *     description: This endpoint modifies the details of a client based on its unique ID.
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           example: 1
     *         description: The unique ID of the client to be updated
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               company_name:
     *                 type: string
     *                 example: Vybog
     *               company_tax:
     *                 type: string
     *                 example: 25
     *               company_agreement:
     *                 type: string
     *                 example: 2 years
     *               company_tier:
     *                 type: string
     *                 example: Tier 1
     *               payment_terms:
     *                 type: string
     *                 example: Net 20
     *     responses:
     *       200:
     *         description: Client data updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Client data updated successfully
     *                 response:
     *                   type: object
     *                   description: Updated client data
     *       400:
     *         description: Bad Request (e.g., validation error or malformed request)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Bad Request
     *       404:
     *         description: Client does not exist
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Client does not exist
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Error updating client data
     */
    router.put("/edit", controller.edit);
    /**
     * @openapi
     * /client/delete:
     *   delete:
     *     tags:
     *       - Client Controller
     *     summary: Delete a client by ID
     *     description: This endpoint deletes a client by its unique ID.
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           example: 1
     *         description: The unique ID of the client to be deleted
     *     responses:
     *       200:
     *         description: Client deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Client deleted successfully
     *                 response:
     *                   type: object
     *                   description: The deleted client data
     *       400:
     *         description: Bad Request (e.g., invalid or missing client ID)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Bad Request
     *       404:
     *         description: Client not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Client not found
     *       500:
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Failed to delete client
     */
    router.delete("/delete", controller.remove);

    /**
     * @openapi
     * '/client/export':
     *  get:
     *     tags:
     *     - Client Controller
     *     summary: Export Clients
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
     *                  example: clients_export_1630303030.xlsx
     *                fileData:
     *                  type: string
     *                  example: SGVsbG8sIFdvcmxkCg==
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Clients not found
     *      500:
     *        description: Internal Server Error
     */
    router.get('/export', controller.exportClients);
    router.post('/bulk-import', controller.bulkImport);
    /**
     * @openapi
     * '/client/search':
     *  get:
     *     tags:
     *     - Client Controller
     *     summary: Search Clients
     *     description: Search through client records based on filters provided via query parameters.
     *     parameters:
     *       - name: client
     *         in: query
     *         description: Filter by client-related fields (first_name, last_name, email)
     *         required: false
     *         schema:
     *           type: string
     *       - name: status
     *         in: query
     *         description: Filter by client status (1 for active, 0 for inactive)
     *         required: false
     *         schema:
     *           type: integer
     *           enum: [1, 0]
     *           default: 1
     *     responses:
     *      200:
     *        description: Clients fetched successfully
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
     *                  example: Clients fetched successfully
     *                data:
     *                  type: array
     *                  items:
     *                    type: object
     *                    description: List of matched clients
     *      400:
     *        description: Invalid filters or query parameters
     *      404:
     *        description: No clients found matching the filters
     *      500:
     *        description: Internal Server Error
     */
    router.get('/search', controller.searchClients);
    app.use('/client', router);
};