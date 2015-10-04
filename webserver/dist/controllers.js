"use strict";


angular.module('tys.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });
    }])

    .controller('HomeController', ['$scope', function($scope){

        $scope.message = "I am home controller";

    }]);
;"use strict";


angular.module('tys.quizlist', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list/:module', {
            templateUrl: 'list/quizlist.html',
            controller: 'QuizController'
        });
    }])

    .controller('QuizController', ['$scope', 'QuizService', '$routeParams', function ($scope, QuizService, $routeParams) {
        $scope.moduleScope = $routeParams.module;
        $scope.quizzes = QuizService.getAllQuizzes();
    }]);

;"use strict";


angular.module('tys.test', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/test/:id', {
            templateUrl: 'test/test.html',
            controller: 'TestController'
        });
    }])
    .controller('TestController', ['$scope', 'QuizService', '$routeParams', '$interval', function ($scope, QuizService, $routeParams, $interval) {

        (function buildModel() {
            $scope.moduleScope = $routeParams.module;
            $scope.answers = {};

            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;
            $scope.quiz = QuizService.getQuiz();

            setShowSubmit();
            $scope.showResult = false;
            $scope.showQuestionPaper = true;

            setHoverStyleForQuiz();

            //startTimer();

        }());

        function setHoverStyleForQuiz() {
            for (var j = 0; j < $scope.quiz.questions.length; j++) {
                $scope.quiz.questions[j].checked = "quiz2";
            }
        }

        $scope.reset = function () {
            for (var i = 0; i < $scope.quiz.questions.length; i++) {
                $scope.quiz.questions[i].givenAnswer = undefined;
            }
        }

        $scope.submit = function () {

            stopTimer();


            initializeScoreVariables();

            if ($scope.quiz.solved) {

                var actualAnswers = QuizService.getAnswers($scope.quiz.id);

                for (var i = 0; i < actualAnswers.length; i++) {
                    for (var j = 0; j < $scope.quiz.questions.length; j++) {
                        if ($scope.quiz.questions[j].id === actualAnswers[i].id) {

                            (function fillQuestionObject() {
                                $scope.quiz.questions[j].answer = actualAnswers[i].answer;
                                $scope.quiz.questions[j].description = actualAnswers[i].description;
                                $scope.quiz.questions[j].checked = getClassName(actualAnswers[i].answer, $scope.quiz.questions[j].givenAnswer);
                                $scope.quiz.questions[j].checkedClass = getIconClassName(actualAnswers[i].answer, $scope.quiz.questions[j].givenAnswer);
                            }());
                            break;
                        }
                    }

                }

                $scope.finalScore = $scope.correctAnswers * 4 - $scope.wrongAnswers;
            }
            else {

                $scope.showQuestionPaper = false;


                var answerSheet = buildAnswerSheet();
                var result = QuizService.getResult(answerSheet);

                $scope.correctAnswers = result.rightAnswers;
                $scope.wrongAnswers = result.wrongAnswers;
                $scope.finalScore = result.totalMarks;

            }
            $scope.showSubmit = false;
            $scope.showResult = true;

        }

        var countdownInterval;
        function startTimer() {

            var minuites = $scope.quiz.time - 1;
            var seconds = 10;


            var decrementCountDown = function () {
                seconds -= 1;
                if (seconds == 0) {
                    minuites -= 1;

                    if (minuites <= 0) {

                        $scope.submit();
                        return;
                    }
                    seconds = 59;
                }
                var formattedSeconds = seconds > 9 ? seconds : "0" + seconds;
                $scope.timeLeft = minuites + ":" + formattedSeconds;
            }

            var startCountdown = function () {
                countdownInterval = $interval(decrementCountDown, 1000, $scope.quiz.time * 60);
            }

            startCountdown();

        }

        function stopTimer() {
            $scope.timeLeft = null;
            $interval.cancel(countdownInterval);

        }
        function buildAnswerSheet() {
            var givenAnswers = [];

            for (var i = 0; i < $scope.quiz.questions.length; i++) {
                if ($scope.quiz.questions[i].givenAnswer) {
                    givenAnswers.push({ id: $scope.quiz.questions[i].id, answer: $scope.quiz.questions[i].givenAnswer });
                }
            }

            var answerSheet = { quizId: $scope.quiz.id, answers: givenAnswers };

            var actualAnswers = QuizService.getResult($scope.quiz.id);
        }

        function initializeScoreVariables() {
            $scope.correctAnswers = 0;
            $scope.wrongAnswers = 0;
            $scope.finalScore = 0;
        }

        function getIconClassName(actualAnswer, givenAnswer) {
            if (!givenAnswer)
                return "";
            if (actualAnswer == givenAnswer) {
                $scope.correctAnswers += 1;
                return "glyphicon glyphicon-ok";
            } else {
                $scope.wrongAnswers += 1;
                return "glyphicon glyphicon-remove";
            }
        }

        function getClassName(actualAnswer, givenAnswer) {
            if (!givenAnswer)
                return "not-attempted";
            if (actualAnswer == givenAnswer) {
                return "answer right-answer";
                //return "alert-success right-answer";
            } else {
                return "answer wrong-answer";
                //return "alert-danger wrong-answer";
            }
        }

        $scope.pageChanged = function () {
            setShowSubmit();

        };

        function setShowSubmit() {
            if ($scope.currentPage === Math.ceil($scope.quiz.questions.length / $scope.itemsPerPage)) {
                $scope.showSubmit = true;
            } else {
                $scope.showSubmit = false;
            }
        }
    }]);;/**
 * Created by DEEPAK.SHARMA on 10/4/2015.
 */
"use strict";

angular.module('tys.upload', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'upload/upload.html',
            controller: 'UploadController'
        });
    }])
    .controller('UploadController', ['$scope', '$http', '$location' ,function ($scope, $http, $location) {

        $scope.numberOfOptionsInEachQuestion = 4;

        $scope.quiz = {
            title: 'Sample Quiz',
            subject: 'C#',
            time: 20,
            numberOfQuestions: 1,
            award: 5,
            penalty: -1
        };

        $scope.updateQuestionCount = function () {
            if (isNaN($scope.totalQuestions))
                return;

            $scope.quiz.questions = [];

            for (var i = 0; i < $scope.totalQuestions; i++) {
                var options  = [];
                for (var j = 0; j < $scope.numberOfOptionsInEachQuestion; j++) {
                    options.push({id: j+1, value: 'test ' + j.toString()});
                }

                var question = { id: i + 1, options: options, title: 'Test Question' };
                $scope.quiz.questions.push(question);
            }
        }


        $scope.cancel = function () {
            window.history.back();
        };

        $scope.submitForm = function (isValid) {

            if (isValid) {
                $http.post('/api/quizzes', JSON.stringify($scope.quiz)).then(function(res){
                    var id = res.data;
                    $location.path('/quiz/' + id);

                }, function(error){
                    console.log(error);
                });
            }
        };
    }
    ]);;"use strict";

angular.module('tys.upload')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/quiz/:id', {
            templateUrl: 'upload/quiz.details.html',
            controller: 'QuizDetailsController'
        });
    }])
    .controller('QuizDetailsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
        $scope.controller = 'Quiz details controller';
        $scope.id =  $routeParams.id;
    }]);