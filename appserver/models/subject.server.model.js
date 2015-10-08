var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubjectSchema = new Schema( {
    code: String,
    name: String,
    notes: String
});

module.exports = mongoose.model('Subject', SubjectSchema);