/* jshint -W014 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import os from 'os';
import System from './api/models/system_model';
import Sqlite3Adapter from './api/models/data/sqlite3_adapter';

var app = express(),
  port = process.env.PORT || 5000,
  routes = require('./api/routes/fx_routes'),
  sqlite3 = require('sqlite3').verbose(),
  //TODO: add endpoint to load config
  //TODO: archive configs
  sys_config = require('./system_config.json'),
  installation_config = require('./installation_config.json');

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//TODO: Add user management to system object
//TODO: System object should manage master_power relay
app.locals.system = new System(sys_config);
app.locals.system.create_db();

//TODO: run this on demand from a system endpoint
app.locals.effects = app.locals.system.get_effects(installation_config);

routes.routes(app);
app.listen(port);

console.log("Device: " + os.hostname() + '\n');
console.log('Rejoice. You may now control Fire on port: ' + port);
