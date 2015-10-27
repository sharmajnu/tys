
var Quiz = require('../models/quiz.server.model.js');
var SubjectController = require('./subject.server.controller.js');


var get = function (req, res) {
    Quiz.find({published: true}, {title: 1, subject: 1, topic: 1, level: 1 }).exec(function (err, quizzes) {
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

            Quiz.find({subject: subject._id, published: true}, {title: 1, subject: 1, totalQuestions: 1, level: 1}).exec(function (err, quizzes) {
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
    Quiz.findById(req.params.id,{questions: 0, __v: 0} , function (err, quiz) {
        if (err) {
            res.status(404).json({message: 'Quiz does not exists'});
        } else {
            res.status(200).json(quiz);
        }
    });
}


var secureQuizController = {
    get: get,
    getQuiz: getQuiz,
    getBySubject: getBySubject
};

module.exports = secureQuizController;
