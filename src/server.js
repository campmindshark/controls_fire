var express = require('express'),
	  app = express(),
	  port = process.env.PORT || 5000,
	bodyParser = require('body-parser'),
	cors = require('cors');

import Effects from "./api/models/fxModel";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.locals.effects = new Effects("Demo Array Id", "config placeholder");
var routes = require('./api/routes/fxRoutes');
routes(app);

app.listen(port);

console.log('Rejoice. You may now control Fire on port: ' + port);
