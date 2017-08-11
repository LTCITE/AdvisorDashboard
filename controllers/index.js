//modules that are required
const express = require('express');
const api = express.Router();
const https = require('https');
const http = require("http");
const csv = require('fast-csv');
const fs = require('fs');
var consts = require('../config/consts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var async = require('async');
var request = require('request');
api.use(session({ resave: true, saveUninitialized: true, secret: 'ssshhhhh' }));

//access token for the development environment to access the data
var access_token = '10688~pw09ypd770331SOTxiBoReEC1mePPnXDaLTx5pfn1u1G3Uqe1WIf0H0KJTI9jTOb'

//variable to store the advisees list (i.e, 919#--university id) for the advisor who logged in
var advisee919 = [];

//user id's of the advisees in the canvas
var sis_user_id = [];

//array to store the information of advisees that is coming from the api calls and to rendered that to the web page
var studentRecords = [];

//student canvas ID's that are aquired from the api call using the 919# from the list
var studentCanvasID = [];

//variable to store the coursenames of the advisees
var courseNames = [];

//variable to store the unique advisees ID's to do api calls for advisee data
var uniqueAdviseeID = [];
api.use(cookieParser());

//function to do all api calls once the app started
api.get('/', function (req, res) {

    //variable to store the query code from the request
    var codeFromRequest = req.query.code;

    //declaring a json variable to store the response from the request
    var json = '';

    //variable to store the advisees information from the function "optionsGetUserId"
    var userInformation = '';

    //functionality to authorize the logged in user and specifying the hostname and path
    var options = {
        hostname: consts.globalHostTest,
        path: '/login/oauth2/token?grant_type=authorization_code&client_id=' + consts.client_id
        + '&client_secret=' + consts.client_secret + '&redirect_uri=' + consts.redirect_uri + '&code=' + codeFromRequest,
        method: 'POST'
    };
    //variable to get the logged in user
    var optionsGetUserId = function (response) {
        response.on('data', function (body) {
            json += body;
        });

        response.on('end', function () {
            json = JSON.parse(json);
            req.session.canvasID = json.user.id;

            var optionsGetUser919 = {
                hostname: consts.globalHostTest,
                path: '/api/v1/users/' + req.session.canvasID + '?access_token=' + access_token,
                method: 'GET'
            }
            // Step 2 : Get 919 number of the User 
            var getUserId = function (response) {

                //do the function if there is data
                response.on('data', function (chunk) {

                    //assinging the response(chunk) to the userInformation
                    userInformation += chunk;
                })

                //end of response
                response.on('end', function () {

                    //parsing the response into json object
                    userInformation = JSON.parse(userInformation);
                    req.session.advisorId = userInformation.sis_user_id;

                    //checking for the logged in user id to check whether he/she is authorized user or not
                    for (var k = 0; k < Advisor.length; k++) {
                        if (req.session.advisorId == Advisor[k]) {
                            advisee919.push(Advisee[k]);
                        }
                    }
                    req.session.advisorId = '';

                    //clearing the global variables 
                    Advisor = [];
                    Advisee = [];

                    //asynchronous functions to iterate through to get the details of advisees from the canvas
                    //iterate through advisee919#
                    async.eachSeries(advisee919, getCanvasID, function (err, response, data) {
                        if (err) {
                            return err;
                        }
                        else {

                            //iterate through studentCanvasID
                            async.eachSeries(studentCanvasID, getStudentDetails, function (err, response, data) {
                                if (err) {
                                    return err;
                                }
                                else {

                                    //iterate through uniqueAdviseeID
                                    async.eachSeries(uniqueAdviseeID, getCourseData, function (err, response, data) {
                                        if (err) {
                                            return err;
                                        }
                                        else {

                                        }
                                    });

                                    //calling the doRender method
                                    doRender();

                                    //emptying the student records after rndering
                                    studentRecords = [];
                                }

                                //emptying the studentCanvasID,advisee919 arrays 
                                studentCanvasID = [];
                                advisee919 = [];
                            });
                        }
                    });

                    //function to get the canvas ID's of the advisees to make other api calls to get the inforamtion about the advisee
                    function getCanvasID(sis_id, callback) {

                        //asynchronous calling with the given url to get the data from the api call
                        request({
                            url: 'https://nwmissouridev.instructure.com//api/v1/accounts/1/users?access_token=' + access_token + '&search_term=' + sis_id,
                            encoding: null
                        },

                            //function to get the data and put it in the studentCanvasID if there are no errors 
                            function (error, response, body) {

                                if (!error && response.statusCode == 200) {

                                    // variable to store the response body after parsing the response body
                                    var reqBody = JSON.parse(body);
                                    for (var n = 0; n < reqBody.length; n++) {

                                        //pushing the data to the array
                                        studentCanvasID.push(reqBody[n].id);
                                    }

                                    //calling the callback if there are errors
                                    callback(error, 'done');

                                }
                            });
                    }

                    //function to get the coursenames for the advisees 
                    function getCourseData(uniqueAdviseeID, callback) {

                        //api path to get the canvas course details
                        request({
                            url: 'https://nwmissouridev.instructure.com//api/v1/users/' + uniqueAdviseeID + '/courses?access_token=' + access_token,
                            encoding: null
                        },

                            //function to get the coursenames from the response if there are no errors
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {

                                    // variable to store the response body after parsing the response body
                                    var reqBody = JSON.parse(body);

                                    //iterate till the length of the request body
                                    for (var n = 0; n < reqBody.length; n++) {

                                        //pushing the data to the array
                                        courseNames.push(reqBody[n].name);
                                    }
                                    callback(error, 'done');
                                }
                            });
                    }

                    //function to get the student details to display them in the table in UI like 919#,FirstName, LastName, SectionID, CourseID, UserID
                    function getStudentDetails(canvasID, callback) {

                        //api call path
                        request({
                            url: 'https://nwmissouridev.instructure.com//api/v1/users/' + canvasID + '/enrollments?access_token=' + access_token,
                            encoding: null
                        },
                            //function to get the student deatils and store them in StudentRecords array
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {

                                    // variable to store the response body after parsing the respone body
                                    var reqBody = JSON.parse(body);
                                    for (var n = 0; n < reqBody.length; n++) {

                                        //checking for the enrolement if it is "StudentEnrollment" or not
                                        if (reqBody[n].role == 'StudentEnrollment') {
                                            var temp = {
                                                sis_user_id: reqBody[n].sis_user_id,
                                                name: reqBody[n].user.sortable_name,
                                                section_id: reqBody[n].sis_section_id,
                                                finalGrade: reqBody[n].grades.current_grade,
                                                finalScore: reqBody[n].grades.current_score,
                                                courseID: reqBody[n].course_id,
                                                userID: reqBody[n].user_id
                                            }

                                            //pushing the data to the array
                                            sis_user_id.push(reqBody[n].user_id);
                                            studentRecords.push(temp);
                                        }
                                    }

                                    //Functioanlity to get the unique advisees id's
                                    uniqueAdviseeID = sis_user_id.filter(function (elem, index, self) {
                                        return index == self.indexOf(elem);
                                    })
                                    callback(error, 'done');

                                }
                            });
                    }

                    //function to render the information to the view page 
                    function doRender() {
                        console.log('rendered')
                        res.render("index", { studentRecords: studentRecords, courseNames: courseNames });

                    }
                });
            }

            //making a https request 
            var userDetailsRequest = https.request(optionsGetUser919, getUserId);

            //end of request
            userDetailsRequest.end();
        });
    }

    //making a https request
    var advisorRequest = https.request(options, optionsGetUserId);

    //end of request
    advisorRequest.end();

});

//exporting the whole api response
module.exports = api;