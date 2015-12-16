var Quiz = require('../models/quiz.server.model.js');
var authHelper = require('../helpers/auth.helper.js');
var SubjectController = require('./subject.server.controller.js');
var mongoose = require('mongoose');

var getForEdit  = function (req, res) {
    Quiz.findById(req.params.id, function (err, quiz) {
        if (err) {

            res.status(404).json({message: 'Quiz does not exists'});
        } else {
            res.status(200).json(quiz);
        }
    });
};

var getForEditList = function (req, res) {
    Quiz.find({}, {title: 1, subject: 1, topic: 1, level: 1, published: 1}).exec(function (err, quizzes) {
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
            }
        });

    });
}

var post = function (req, res) {
    var authPayload = authHelper.getAuthPayload(req);
    if(authPayload && authPayload.roles && authPayload.roles.contributor) {

        var entry = new Quiz({
            totalQuestions: req.body.totalQuestions,
            time: req.body.time,
            title: req.body.title,
            subject: req.body.subject,
            award: req.body.award,
            penalty: req.body.penalty,
            isSolved: req.body.isSolved,
            notes: req.body.notes,
            questions: req.body.questions,
            level: req.body.level,
            topic: req.body.topic,
            createdBy: authPayload.sub,
            updateBy: authPayload.sub,
            published: false
        });

        entry.save(function (error) {
            console.log(error);
            if(error) {
                res.status(500).json(error);
            }
        });
        res.status(201).json(entry._id);

    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

var put = function (req, res) {

    var authPayload = authHelper.getAuthPayload(req);
    if(authPayload && authPayload.roles && authPayload.roles.contributor) {

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
            questions: req.body.questions,
            level: req.body.level,
            topic: req.body.topic,
            updateBy: authPayload.sub
        };

        var objectId = mongoose.Types.ObjectId(id);
        Quiz.update({_id: objectId}, {$set: entry}, function (err, numAffected) {
            if (err) {
                console.log(err);
                res.status(500).json({message: err});
            } else {

                res.status(200).json({});
            }
        });
    } else{
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

var publish = function(req, res){
    var authPayload = authHelper.getAuthPayload(req);
    if(authPayload) {
        var objectId = mongoose.Types.ObjectId(req.params.id);

        Quiz.update({_id: objectId},
            {$set: {published: req.body.published, updatedBy: authPayload.sub}},
            function(error, rowsAffected){
                if(error){
                    res.status(500).json(error);
                } else {
                    res.status(200).json({});
                }
            });


    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }

};

var securedQuizController = {
    post: post,
    put: put,
    getForEdit: getForEdit,
    getForEditList: getForEditList,
    publish: publish
};

module.exports = securedQuizController;
