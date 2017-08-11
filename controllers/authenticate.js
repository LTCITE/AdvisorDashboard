const express = require('express');
const api = express.Router();
const https = require('https');
const http = require("http");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csv = require('fast-csv');
const fs = require('fs');

// all the constants are saved on this file ... 
var consts = require('../config/consts');

//constants for global host address, access-token and client secret
const globalHost = consts.globalHostTest
const client_secret = consts.client_secretTest
const newaccesstoken = consts.adminAccessTokenTest

api.use(session({ resave: true, saveUninitialized: true, secret: 'ssshhhhh' }));

var key = [];
var value = [];
global.Advisor = [];
global.Advisee = [];

api.all('/', function (req, res) {

    // reading the values in csv file and storing in stream
    var stream = fs.createReadStream('Advisor_advisee.csv');

    req.session.body = req.body;

    var csvStream = csv()
        .on("data", function (data) {
            csvData = data[0] + " " + data[1];

            // assigning the column1 values of csv file into key
            key = data[0];

            // assigning the column2 values of csv file into value
            value = data[1] + "";

            // omitting 1st value in column1 and pushing remaining values into Advisor array
            if (data[0] != 'ADVR_919') {
                Advisor.push(data[0]);
            }
            
            // omitting 1st value in column2 and pushing remaining values into Advisee array
            if (data[1] != 'STU_919') {
                Advisee.push(data[1]);
            }
        })

        // once data has been read from the csv file we are redirecting to authorise page
        .on("end", function () {
            console.log("done");
            res.redirect('https://' + consts.globalHostTest + '/login/oauth2/auth?client_id=' + consts.client_id + '&response_type=code&redirect_uri=' + consts.redirect_uri);
        });
    stream.pipe(csvStream);
});

module.exports = api;