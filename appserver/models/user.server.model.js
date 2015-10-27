var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    googleId: String,
    name: String,
    createdDate: Date,
    lastLoggedInDate: Date,
    roles: {
        public: Boolean,
        contributor: Boolean,
        admin: Boolean
    }
});

module.exports = mongoose.model('User', UserSchema);