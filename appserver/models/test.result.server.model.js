/**
 * Created by DEEPAK.SHARMA on 10/23/2015.
 */
var mongoose = require('mongoose');

var AnswerSchema = mongoose.Schema({
    questionId : Number,
    answer: Number
});

var AnswerProgress = mongoose.Schema({
    time: Date,
    answers: [AnswerSchema]
});

var TestResultSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    quizId: mongoose.Schema.Types.ObjectId,
    testTime: Number,
    startTime: Date,
    quizTitle: String,

    answerProgress: [AnswerProgress],

    totalScore: Number,
    rightAnswers: Number,
    wrongAnswers: Number,
    notAttempted: Number,

    timeTaken: Number,
    endTime: Date,
    finalAnswers: [AnswerSchema]
});

module.exports = mongoose.model('TestResultSchema', TestResultSchema);