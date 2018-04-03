/* jshint -W014 */

import path from "path";
import express from "express";
import bodyParser from "body-parser";
import System from "./api/models/system_model";

const app = express(),
  port = process.env.PORT || 5000,
  routes = require("./api/routes/fx_routes"),
  sys_config = require("../config/system_config"),
  installation_config = require("../config/installation_config"),
  staticPath = path.join(__dirname, "../hot_and_gui/static");

app.use(express.static(staticPath));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include
  // cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
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
