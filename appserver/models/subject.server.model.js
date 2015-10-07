var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubjectSchema = new Schema( {
    name: String,
    notes: String
});

module.exports = mongoose.model('Subject', SubjectSchema);