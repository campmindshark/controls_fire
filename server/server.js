/* jshint -W014 */

import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import System from "./api/models/system_model";

const app = express(),
  port = process.env.PORT || 5000,
  routes = require("./api/routes/fx_routes"),
  //sqlite3 = require('sqlite3').verbose(),
  //TODO: add endpoint to load config
  sys_config = require("../../system_config.json"),
  installation_config = require("../../installation_config.json"),
  staticPath = path.join(__dirname, "../hot_and_gui/static"),
  indexPath = path.join(__dirname, "../hot_and_gui/index.html");

app.use(express.static(staticPath));
app.get('/', (req, res) => {
  res.sendFile(indexPath);
});

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.locals.system = new System(sys_config, installation_config);
app.locals.system.initialize().then(() => {
  //TODO: set master_power relay(s) to ON
  console.log("[Server]: Set Routes");
  routes.routes(app);
  console.log("[Server]: Begin Listening");
  app.listen(port);
  console.log(`[Server]: Rejoice. You may now control Fire on port: ${port}`);
});
