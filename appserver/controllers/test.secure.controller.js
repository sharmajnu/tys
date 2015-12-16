var Quiz = require('../models/quiz.server.model.js');
var authHelper = require('../helpers/auth.helper.js');
var TestResult = require('../models/test.result.server.model.js');
var User = require('../models/user.server.model.js');
var mongoose = require('mongoose');

var startTest = function (req, res) {

    var payload = authHelper.getAuthPayload(req);

    if (payload && payload.sub && payload.roles && payload.roles.public) {
        Quiz.findById(req.params.id, {'questions.answer': 0, 'questions.explanation': 0}, function (err, quiz) {
            if (err) {
                res.status(404).json({message: 'Quiz does not exists'});
            } else {
                saveStartTestInDB(res, quiz, payload);
            }
        });
    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

function saveStartTestInDB(res, quiz, payload) {
    var testStart = new TestResult({
        quizId: quiz._id,
        userId: payload.sub,
        startTime: Date.now(),
        testTime: quiz.time,
        quizTitle: quiz.title,
        answerProgress: []
    });

    testStart.save(function (err) {
        if (err) {
            res.status(500).json({message: err});
        } else {
            res.status(200).json({quiz: quiz, trackingId: testStart._id});
        }
    });
}

var updateProgress = function (req, res) {
    var payload = authHelper.getAuthPayload(req);
    if (payload && payload.sub && payload.roles && payload.roles.public) {

        var trackingId = req.body.trackingId;
        var currentAnswers = req.body.answers;

        var update = {
            time: Date.now(),
            answers: currentAnswers
        };

        TestResult.findByIdAndUpdate(
            trackingId,
            {$push: update},
            {safe: true, upsert: true},
            function (err, testResult) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json({message: 'updated the details at server'});
                }
            });

    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

var submitTest = function(req, res) {
    var payload = authHelper.getAuthPayload(req);
    if (payload && payload.sub && payload.roles && payload.roles.public) {
        var trackingId = req.body.trackingId;
        var quizId = req.body.quizId;
        var finalAnswers = req.body.answers;

        Quiz.findById(quizId, {'questions.options': 0}, function (err, quiz) {

            if(err){
                console.log(err);
                res.status(500).json(err);
            } else if(quiz){
                TestResult.findById(trackingId, {}, function (err, testResult) {
                    if(testResult){
                        //TODO: Implement the validation with server side time
                        //testResult.startTime;
                        updateTestResult(trackingId, quiz, finalAnswers, res, payload);
                    }
                })

            }
        });

    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

var myAttemptedTests = function(req, res){

    try {
        var payload = authHelper.getAuthPayload(req);
        if (payload && payload.sub) {
            var userId = mongoose.Types.ObjectId(payload.sub);

            TestResult.find({userId: userId}, {quizId: 1, quizTitle: 1, totalScore: 1, startTime: 1}).sort({'startTime': 'descending'}).exec(function (err, myTests) {
                res.status(200).json(myTests);
            });
        } else {
            res.status(401).json(authHelper.unautorizedMessage);
        }
    }catch(e){
        console.log(e);
    }
}

function calculateScore(quiz, finalAnswers){
    var rightAnswers = 0;
    var wrongAnswers= 0;
    var notAttempted = 0;

    for(var i=0; i < quiz.questions.length; i++ ){
        for(var j=0; j < finalAnswers.length; j++){
            if(quiz.questions[i].id === finalAnswers[j].questionId){
                if(finalAnswers[j].answer){
                    if(quiz.questions[i].answer === finalAnswers[j].answer){
                        rightAnswers++;
                    } else {
                        wrongAnswers++;
                    }
                }else{
                    notAttempted++;
                }
            }
        }
    }

    var totalScore = rightAnswers* quiz.award + wrongAnswers * quiz.penalty;

    return {
        rightAnswers: rightAnswers,
        wrongAnswers: wrongAnswers,
        notAttempted: notAttempted,
        totalScore: totalScore
    };

}

function updateTestResult(trackingId, quiz, finalAnswers, res, payload){
    var score = calculateScore(quiz, finalAnswers);
    var update = {
        rightAnswers: score.rightAnswers,
        wrongAnswers: score.wrongAnswers,
        notAttempted: score.notAttempted,
        totalScore : score.totalScore,
        endTime: Date.now(),
        finalAnswers: finalAnswers
    };


    var tyscore =(score.totalScore * 100)/quiz.award;

    TestResult.findByIdAndUpdate(trackingId,
        {$set: update},
        {safe: true, upsert: true, new: true},
        function (err, testResult) {
            if(err){
                console.log(err);
                res.status(500).json(err);
            } else {
                delete testResult.answerProgress;
                if(quiz.isSolved) {
                    Quiz.findById(quiz._id, {'questions.id': 1, 'questions.answer': 1, 'questions.explanation': 1}, function (err, answers) {
                        if (err) {
                            res.status(404).json({message: 'Quiz does not exists'});
                        } else {
                            var result = {
                                answers: answers,
                                result: testResult
                            };
                            res.status(200).json(result);
                        }
                    });
                }else {
                    res.status(200).json({result:testResult });
                }
            }
        });

    User.findByIdAndUpdate(payload.sub,
        {$inc: {tyscore: tyscore}},
        {safe: true, upsert: true},
        function (err, user) {

        });
}



module.exports = {
    startTest: startTest,
    updateProgress: updateProgress,
    submitTest: submitTest,
    myAttemptedTests: myAttemptedTests
};