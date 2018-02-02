var express 		= require('express'),
	  app 				= express(),
	  port 				= process.env.PORT || 5000,
		bodyParser 	= require('body-parser'),
		cors 				= require('cors'),
		fs 					= require('fs'),
		routes 			= require('./api/routes/fx_routes'),
		//TODO: do better with the config source
		json_config = require('./config.json');

import Effects from './api/models/fx_model';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//TODO: run this on demand from an endpoint that also enables a power relay
app.locals.effects = new Effects(JSON.stringify(json_config));

routes(app);
app.listen(port);

console.log('Rejoice. You may now control Fire on port: ' + port);
