var express = require('express'),
	  app = express(),
	  port = process.env.PORT || 5000,
	body-parser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/fxRoutes');
routes(app);

app.listen(port);

console.log('Rejoice. You may now control Fire on port: ' + port);
