var settings = require('../config/app.config.js');
var jwt = require('jwt-simple');

var getAuthPayload = function(req){
    if(req.headers && req.headers.authorization){

        var token = req.headers.authorization.split(' ')[1];
        var payload= jwt.decode(token, settings.TOKEN_SECRET,settings.SIGNING_ALGO );
        return payload;
    } else {
        return null;
    }
};

var unautorizedMessage = {message: 'You are not authorized to perform this task!!!'};

module.exports = {getAuthPayload: getAuthPayload, unautorizedMessage: unautorizedMessage};