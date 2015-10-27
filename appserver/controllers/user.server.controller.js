var User = require('../models/user.server.model.js');
var jwt = require('jwt-simple');
var settings = require('../config/app.config.js');
var authHelper = require('../helpers/auth.helper.js');
var mongoose = require('mongoose');


function createPayloadAndSendResponse(user, token, res) {

    if (user) {


        var payload = {
            iss: 'tys',
            sub: user._id,
            iat: Date.now(),
            roles: user.roles,
            token: token
        };
        var encoded = jwt.encode(payload, settings.TOKEN_SECRET, settings.SIGNING_ALGO);
        res.status(200).json({user: user, token: encoded});
    } else {
        return res.status(401).json('user not found in DB');
    }
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
                roles: {
                    public: true
                },
                createdDate: Date.now(),
                lastLoggedInDate: Date.now()
            });

            newUser.save();
            createPayloadAndSendResponse(newUser.toObject(), token, res);
        }
    });
};

var findUserAndSend = function (payload, res) {

    User.findById(payload.sub, function (err, foundUser) {
        if (err) {
            res.status(401).json({message: 'User does not exists in database'});
        } else {
            createPayloadAndSendResponse(foundUser, payload.token, res);
        }
    });
}

var get = function (req, res) {
    var payload = authHelper.getAuthPayload(req);

    console.log(payload);
    if (payload && payload.roles && payload.roles.admin) {
        User.find({}).exec(function (err, users) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(users);
            }
        })

    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

var getById = function (req, res) {

    var payload = authHelper.getAuthPayload(req);

    var objectId = mongoose.Types.ObjectId(req.params.id);

    if (payload && payload.roles && payload.roles.admin) {
        User.findById(objectId, {}, function (err, user) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(user);
            }
        });
    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

var changePerm = function (req, res) {
    var id = req.params.id;
    var role = req.body.role;
    var changedTo = req.body.roleValue;

    var prop = 'roles.' + role;

    var changedObj = {};
    changedObj[prop] = changedTo;

    User.update({_id: id},
                {$set: changedObj},
                function (err, rows) {
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.status(200).json({});
                    }
                });
};

module.exports = {
    findOrCreateUser: findOrCreate,
    findUserAndSend: findUserAndSend,
    get: get,
    getById: getById,
    changePerm: changePerm
};

