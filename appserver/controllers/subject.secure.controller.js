var Subject = require('../models/subject.server.model.js');


var post = function (req, res) {

    console.log('starting processing post request...');

    var subject = new Subject({
        name: req.body.name,
        code: req.body.code
    });

    subject.save();
    res.status(201).json(subject._id);
};


var securedSubjectController = {
    post: post
};

module.exports = securedSubjectController;