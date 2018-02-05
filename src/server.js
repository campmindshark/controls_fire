var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    bodyParser = require('body-parser'),
    cors = require('cors'),
    fs = require('fs'),
    routes = require('./api/routes/fx_routes'),
    os = require('os'),
    //TODO: do better with the config source
    json_config = require('./system_config.json');

import Effects from './api/models/fx_model';
import System from './api/models/sys_model';
import Sqlite3Adapter from './api/models/data/sqlite3_adapter';

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.locals.db_adapter = new Sqlite3Adapter();
//TODO: don't always recreate db.
app.locals.db_adapter.rebuild_db();
//TODO: System object should manage master_power relay
app.locals.system = new System();
//TODO: run this on demand from an endpoint
app.locals.effects = new Effects(JSON.stringify(json_config));

routes(app);
app.listen(port);
console.log("Device: " + os.hostname() + '\n');
console.log('Rejoice. You may now control Fire on port: ' + port);
