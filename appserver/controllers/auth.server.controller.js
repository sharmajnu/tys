
var express = require('express');
var request = require('request');
var userController = require('./user.server.controller.js');
var settings = require('../config/app.config.js');
var router = express.Router();
var jwt = require('jwt-simple');

router.post('/google', function (req, res) {
    var url = "https://accounts.google.com/o/oauth2/token";
    var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: 'authorization_code',
        client_secret: settings.GOOGLE_APP_SECRET

    };
    request.post(url, {
        json: true,
        form: params
    }, function (err, response, token) {
        console.log(token);
        var accessToken = token.access_token;
        var headers = {
            Authorization: 'Bearer ' + accessToken
        };

        request.get({
            url: apiUrl,
            headers: headers,
            json: true
        }, function (err, response, profile) {
            console.log(profile);
            userController.findOrCreateUser(profile, res, token);
        })

    });
});

router.post('/refreshToken', function(req, res){
    console.log(req.headers);
    if(req.headers && req.headers.authorization){

        var token = req.headers.authorization.split(' ')[1];
        var payload= jwt.decode(token, settings.TOKEN_SECRET,settings.SIGNING_ALGO );
        userController.findUserAndSend(payload, res);
    } else {
        res.status(401).json({message: 'Missing authorization headers'});
    }
});
module.exports = router;