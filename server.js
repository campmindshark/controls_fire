var express = require('express'),
	  app = express(),
	  port = process.env.PORT || 5000,
	bodyParser = require('body-parser');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
                }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/fxRoutes');
routes(app);

app.listen(port);

console.log('Rejoice. You may now control Fire on port: ' + port);
