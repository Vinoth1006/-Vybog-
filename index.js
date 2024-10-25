const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const {db , modelMap } = require("./src/models");

mode = process.env.NODE_ENV;

let controllerName = "Login";

const controller = require('./src/controller/'+controllerName+'/'+controllerName+'Controller')(modelMap);
app.get("/", controller.get);
app.get("/:id", controller.get);
app.post("/", controller.add);
app.put("/:id", controller.edit);
app.delete("/:id", controller.remove);

module.exports = {
    app
};