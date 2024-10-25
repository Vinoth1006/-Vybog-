const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config/config');
const app = express();
const swaggerDocs = require('./services/swagger');
const logger = require('./services/logger');
const requestLogger = require('./helpers/logger.helper');
const { Pool } = require('pg');

app.use(requestLogger);
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Database
// const { db, modelMap } = require("./models");

const { setupAuth } = require('./services/azure_authentication');

// setupAuth(app);
// app.use(ensureAuthenticated);
//  db.sequelize.sync().then(()=>{
//      console.log("db connected");
//  }).catch((err) =>{console.log(err);})
//console.log(config.get(`${mode}.host`));

//Route
require('./routes')(app);
app.get('/', function (req, res) {
  logger.info("Got a GET request for the homepage");
  res.send('Hello GET');
})

app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

mode = process.env.NODE_ENV;

const data = config[mode];

const port = data.port;
const host = data.host;

const pool = new Pool({
  user: data.database.username,
  host: data.database.host,
  database: data.database.database,
  password: data.database.password,
  port: data.database.port,
});

app.listen(port, host, function () {
  logger.info(`app is running ${host} at ${port}`);
});
swaggerDocs.swaggerDocs(app, port)

// syncModels();
module.exports = { pool };
