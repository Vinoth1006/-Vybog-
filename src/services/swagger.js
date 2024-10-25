const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const config = require('config');

mode = process.env.NODE_ENV;
const data = config[mode];

const port = data.port;
const host = data.host;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vybog 2.0 APIs',
      description: "API endpoints for a vybog 2.0 services documented on swagger",
      contact: {
        name: "Vybog 2.0",
        url: "https://staging.vybog.app/"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://${host}:${port}/`,
        description: "Local server"
      },
      {
        url: "https://app-vybog-be-node-dev.azurewebsites.net/",
        description: "Live server"
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional: you can specify if you are using JWT tokens
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  // looks for configuration in specified directories
  apis: [`${__dirname}/../controller/**/*Routes.js`],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

module.exports = { swaggerDocs };
