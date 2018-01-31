var express = require('express'),
	  app = express(),
	  port = process.env.PORT || 5000,
	bodyParser = require('body-parser'),
	cors = require('cors'),
	fs = require('fs');

import Effects from "./api/models/fx_model";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//TODO: Build from config file
var json_config = require('./config.json');

app.locals.effects = new Effects(JSON.stringify(json_config));
var routes = require('./api/routes/fx_routes');
routes(app);

app.listen(port);

console.log('Rejoice. You may now control Fire on port: ' + port);
