
var Quiz = require('../models/quiz.server.model.js');

var get = function (req, res) {
    var result = {};
    Quiz.find().exec(function (err, results) {
        result = results;
        res.status(200).json(result);
        console.log(results);
    });
};

var post = function (req, res) {

    console.log('starting processing post request...');

    var entry = new Quiz({
        title: req.body.title,
        subject: req.body.subject,
        totalQuestions: req.body.totalQuestions,
        time: req.body.time,
        award: req.body.award,
        penalty: req.body.penalty,
        isSolved: req.body.isSolved,
        notes: req.body.notes,
        questions: req.body.questions
    });

    entry.save();
    console.log(entry);

    res.status(201).json(entry._id);
};

var quizController = {
    get: get,
    post: post
};

module.exports = quizController;
