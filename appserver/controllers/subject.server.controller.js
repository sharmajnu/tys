var Subject = require('../models/subject.server.model.js');

var get = function (req, res) {
    var result = {};
    Subject.find().exec(function (err, results) {
        result = results;
        res.status(200).json(result);
        console.log(results);
    });
};

var post = function (req, res) {

    console.log('starting processing post request...');

    var subject = new Subject({
        name: req.body.name,
        code: req.body.code
    });

    subject.save();
    res.status(201).json(subject._id);
};

var createSubject = function (name, callback) {

    Subject.findOne({name: name}, function (err, doc) {
        var id;
        if (doc) {
            id = doc._id;
        } else {
            var subject = new Subject({
                name: name
            });
            subject.save();
            console.log('Saved subject id: ' + subject._id);
            id = subject._id;
        }
        callback(id);
    });
}

var getSubjects = function (callback) {
    Subject.find({}, function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, docs);
        }
    });
};

var getSubjectByCode = function (code, callback) {
    Subject.findOne({code: code}, function (err, subject) {

            if (err) {
                callback(err, null);
            } else {
                callback(null, subject)
            }
        }
    );
};

var subjectController = {
    get: get,
    post: post,
    createSubject: createSubject,
    getSubjects: getSubjects,
    getSubjectByCode: getSubjectByCode
};

module.exports = subjectController;