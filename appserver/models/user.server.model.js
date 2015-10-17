var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    googleId: String,
    name: String
});

module.exports = mongoose.model('User', UserSchema);