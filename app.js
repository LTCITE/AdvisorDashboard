const http = require("http");
var path = require("path");
const express = require("express");
const api = express.Router();
const https = require('https');
//const session = require('express-session');
//const cookieParser = require('cookie-parser');
const csv = require('fast-csv');
const fs = require('fs');
//const bodyParser = require("body-parser");



// create express app 
var app = express();

// set up the view engine
app.set("views", path.resolve(__dirname, "views")); // path to views
app.set("view engine", "ejs"); // specify our view engine
//app.use(express.static(__dirname + './assets/'));  // works for views in root view folder

// specify various resources and apply them to our application

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/advisordashboard_assets/'));  // works for views in root view folder
app.use('/advisordashboard',require('./controllers/authenticate'));
app.use('/advisordashboard/index',require('./controllers/index'));



// handle page not found errors
app.use(function (request, response) {
  response.status(404).render("404.ejs");
});

// set port 
app.set('port', 3070);
app.listen(app.set('port'), function(){
  console.log('Server is running at port: ' + app.get('port'));
});