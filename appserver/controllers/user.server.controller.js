var User = require('../models/user.server.model.js');
var jwt = require('jwt-simple');
var settings = require('../config/app.config.js');

function createPayloadAndSendResponse(user, token, res){

    var payload = {
        iss: 'tys',
        sub: user._id,
        iat: Date.now(),
        role: user.role,
        token: token
    };
    var encoded = jwt.encode(payload, settings.TOKEN_SECRET, settings.SIGNING_ALGO);
    res.status(200).json({user: user, token: encoded});
}

var findOrCreate = function (profile, res, token) {

    User.findOne({googleId: profile.sub}, function (err, foundUser) {
        if (foundUser) {
            createPayloadAndSendResponse(foundUser.toObject(), token, res);

        } else {
            var newUser = new User({
                name: profile.name,
                googleId: profile.sub,
                email: profile.email,
                role: 'public'
            });

            newUser.save();
            createPayloadAndSendResponse(newUser.toObject(), token, res);
        }
    });
};

var findUserAndSend = function (payload, res){

    User.findById(payload.sub, function(err, foundUser){
       if(err){
           res.status(401).json({message: 'User does not exists in database'});
       } else {
           createPayloadAndSendResponse(foundUser, payload.token, res);
       }
    });
}



module.exports = {findOrCreateUser: findOrCreate, findUserAndSend: findUserAndSend};

