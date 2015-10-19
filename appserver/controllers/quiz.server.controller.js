var mongoose = require('mongoose');
var Quiz = require('../models/quiz.server.model.js');
var SubjectController = require('./subject.server.controller.js');


var get = function (req, res) {
    Quiz.find({}, {title: 1, subject: 1}).exec(function (err, quizzes) {
        SubjectController.getSubjects(function (err, subjects) {
            if (err) {
                res.status(404).json({message: 'something went wrong' + err})
            } else {
                var returnedData = [];
                for (var i = 0; i < quizzes.length; i++) {
                    returnedData.push(quizzes[i].toObject())
                    for (var j = 0; j < subjects.length; j++) {
                        if (quizzes[i].subject.equals(subjects[j]._id)) {
                            returnedData[i].subject = subjects[j].name;
                            break;
                        }
                    }
                }
                res.status(200).json(returnedData);
                console.log(quizzes);
            }
        });

    });
};


var getBySubject = function (req, res) {
    SubjectController.getSubjectByCode(req.params.subject, function (err, subject) {
            if(!subject){
                res.status(200).json([]);
                return;
            }

            Quiz.find({subject: subject._id}, {title: 1, subject: 1}).exec(function (err, quizzes) {
                if (err) {
                    res.status(404).json({message: 'something went wrong' + err});
                } else {
                    var returnedData = [];
                    for (var i = 0; i < quizzes.length; i++) {
                        returnedData.push(quizzes[i].toObject());
                        returnedData[i].subject = subject.name;
                    }
                    res.status(200).json(returnedData);
                }
            });
        }
    );
};

var getQuiz = function (req, res) {
    var id = req.params.id;
    console.log('GetQuiz finding by id ' + id);
    Quiz.findById(req.params.id, function (err, quiz) {
        if (err) {
            res.status(404).json({message: 'Quiz does not exists'});
        } else {
            res.status(200).json(quiz);
        }
    });
}

var post = function (req, res) {

    console.log('starting processing post request...');

    SubjectController.createSubject(req.body.subject, function (subjectId) {

        var entry = new Quiz({
            totalQuestions: req.body.totalQuestions,
            time: req.body.time,
            title: req.body.title,
            subject: subjectId,
            award: req.body.award,
            penalty: req.body.penalty,
            isSolved: req.body.isSolved,
            notes: req.body.notes,
            questions: req.body.questions
        });

        entry.save();
        console.log(entry);

        res.status(201).json(entry._id);
    });
};

var put = function (req, res) {

    console.log('starting processing put request...');

    var id = req.params.id;
    var entry = {
        totalQuestions: req.body.totalQuestions,
        time: req.body.time,
        title: req.body.title,
        subject: req.body.subject,
        award: req.body.award,
        penalty: req.body.penalty,
        isSolved: req.body.isSolved,
        notes: req.body.notes,
        questions: req.body.questions
    };

    console.log('**************Updating entry----------');
    console.log(entry);

    var objectId = mongoose.Types.ObjectId(id);
    Quiz.update({_id: objectId}, {$set: entry}, function (err, numAffected) {
        if (err) {
            res.status(500).json({message: err});
        } else {
            console.log('-----------------------------' + numAffected);
            res.status(200).json({});
        }
    });
};


var quizController = {
    get: get,
    post: post,
    getQuiz: getQuiz,
    put: put,
    getBySubject: getBySubject
};

module.exports = quizController;
