var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = new Schema({
    id: Number,
    value: String
}, {_id: false});

var QuestionSchema = new Schema({
    id: Number,
    title: String,
    options: [OptionSchema],
    answer: Number,
    explanation: String
}, {_id: false});

var QuizSchema = new Schema({
    title: String,
    subject: mongoose.Schema.Types.ObjectId,
    totalQuestions: Number,
    time: Number,
    award: Number,
    penalty: Number,
    isSolved: Boolean,
    notes: String,
    questions: [QuestionSchema],
    createdDate: {type: Date, default: Date.now},
    updateDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Quiz', QuizSchema);