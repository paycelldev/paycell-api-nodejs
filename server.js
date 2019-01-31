var express = require('express');
var app = express();
var bodyParser = require("body-parser");

//read env variables
var port = process.env.port || 3000;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//expose public files
app.use(express.static(__dirname + "/public"));

//expose routes
var restApiRoutes = require('./routes/RestApiRoutes');
var soapApiRoutes = require('./routes/SoapApiRoutes');
var utilRoutes = require('./routes/UtilRoutes');
restApiRoutes(app);
soapApiRoutes(app);
utilRoutes(app);

//start server
app.listen(port);
console.log("Server started on port: " + port);