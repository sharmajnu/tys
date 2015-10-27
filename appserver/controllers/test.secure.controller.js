var Quiz = require('../models/quiz.server.model.js');
var authHelper = require('../helpers/auth.helper.js');
var TestResult = require('../models/test.result.server.model.js');

var startTest = function (req, res) {
    console.log('started processing start test');
    var payload = authHelper.getAuthPayload(req);

    if (payload && payload.sub && payload.roles && payload.roles.public) {
        Quiz.findById(req.params.id, {'questions.answer': 0}, function (err, quiz) {
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
                        updateTestResult(trackingId, quiz, finalAnswers, res);
                    }
                })

            }
        });

    } else {
        res.status(401).json(authHelper.unautorizedMessage);
    }
};

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
    console.log('Total Score is : ' + totalScore);

    return {
        rightAnswers: rightAnswers,
        wrongAnswers: wrongAnswers,
        notAttempted: notAttempted,
        totalScore: totalScore
    };

}

function updateTestResult(trackingId, quiz, finalAnswers, res){
    var score = calculateScore(quiz, finalAnswers);
    var update = {
        rightAnswers: score.rightAnswers,
        wrongAnswers: score.wrongAnswers,
        notAttempted: score.notAttempted,
        totalScore : score.totalScore,
        endTime: Date.now(),
        finalAnswers: finalAnswers
    };

    TestResult.findByIdAndUpdate(trackingId,
        {$set: update},
        {safe: true, upsert: true, new: true},
        function (err, testResult) {
            if(err){
                console.log(err);
                res.status(500).json(err);
            } else {
                delete testResult.answerProgress;
                res.status(200).json(testResult);
            }
        });
}

module.exports = {
    startTest: startTest,
    updateProgress: updateProgress,
    submitTest: submitTest
};