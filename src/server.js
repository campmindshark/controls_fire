/* jshint -W014 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import os from 'os';
import System from './api/models/system_model';

var app = express(),
    port = process.env.PORT || 5000,
    routes = require('./api/routes/fx_routes'),
    //sqlite3 = require('sqlite3').verbose(),
    //TODO: add endpoint to load config
    sys_config = require('./system_config.json'),
    installation_config = require('./installation_config.json');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.locals.system = new System(sys_config, installation_config);
app.locals.system.initialize().then(() => {
    //TODO: set master_power relay(s) to ON
    console.log('\nSet Routes');
    routes.routes(app);
    console.log('\nBegin Listening');
    app.listen(port);
    console.log('Device: ' + os.hostname() + '\n');
    console.log('Rejoice. You may now control Fire on port: ' + port);
});
