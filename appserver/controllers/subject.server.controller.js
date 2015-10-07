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

    var name = req.body.name

    var id = createSubject(name);
    if (id) {
        res.status(201).json(id);
    } else {
        res.status(200).json('Resource already exists!!');
    }
    console.log(entry);
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

var getSubjects = function(callback){
    Subject.find({}, function (err, docs) {
      if(err){
          callback(err, null);
      } else {
          callback(null, docs);
      }
    });
}

var subjectController = {
    get: get,
    post: post,
    createSubject: createSubject,
    getSubjects: getSubjects
};

module.exports = subjectController;