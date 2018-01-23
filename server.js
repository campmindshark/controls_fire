var express = require('express'),
	  app = express(),
	  port = process.env.PORT || 5000,
	bodyParser = require('body-parser'),
	cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var effects = require('./api/models/fxModel');
var routes = require('./api/routes/fxRoutes');
routes(app);

app.listen(port);

console.log('Rejoice. You may now control Fire on port: ' + port);
