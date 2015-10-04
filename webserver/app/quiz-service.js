(function () {

    var app = angular.module('tys');

    app.factory('QuizService', function () {

        var quizzes = [{ id: 1, title: 'JavaScript Expressions', subject: 'js', rating: 5 },
                        { id: 2, title: 'JavaScript Functions ', subject: 'js', rating: 3 },
                        { id: 3, title: 'JavaScript Arrays ', subject: 'js',rating: 2 },
                        { id: 4, title: 'Linq', subject: 'csharp', rating: 4 },
                        { id: 5, title: 'Lambda Expressions', subject: 'csharp', rating: 5 },
        ];

        var quiz = {
            subject: 'js',
            id: 1,
            name: 'JavaScript Expressions',
            time: 1,
            solved: true,
            questions: [
                            { id: 1, question: 'This is a sample question.', options: [{ key: 1, value: 'Something' }, { key: 2, value: 'Nothing' }, { key: 3, value: 'Everything' }] },
                            { id: 2, question: 'What is the population of INDIA?', options: [{ key: 1, value: '123' }, { key: 2, value: '2323' }, { key: 3, value: '232 Crores' }] },
                           { id: 3, question: 'Which of the following are Javascript premitive types?', options: [{ key: 1, value: 'string, null, number' }, { key: 2, value: 'string, null, undefined, number, boolean' }, { key: 3, value: 'string, object' }, { key: 4, value: 'None of these' }] }
            ]
        };

        var answers = [{ id: 1, answer: 2, description: 'Sample Description.' },
        { id: 2, answer: 3, description: 'As per Govt Records the populaton of India is XXXXX.' },
        { id: 3, answer: 2, description: 'See ECMA script definition.' }]

        var getQuiz = function (quizId) {
            return quiz;
        }

        function getAllQuizzes(subject) {
            return quizzes;
        }

        function getAnswers(quizId) {
            return answers;
        }

        function getResult(answerSheet) {

            // AnswerSheet is an object of the following form
            //{
            //    quizId: 1,
            //    answers:[{id: 1, answer: 2}, {id: 2, answer: 4}]
            //}
            return {
                rightAnswers: 5,
                wrongAnswers: 1,
                totalMarks: 7
            }
        }

        return {
            getAllQuizzes: getAllQuizzes,
            getQuiz: getQuiz,
            getAnswers: getAnswers,
            getResult: getResult
        }
    });
}());