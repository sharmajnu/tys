"use strict";


angular.module('tys.test', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/test/:id', {
            templateUrl: 'test/test.html',
            controller: 'TestController'
        });
    }])
    .controller('TestController', ['$scope', '$http', '$routeParams', '$interval', '$rootScope', function ($scope, $http, $routeParams, $interval, $rootScope) {

        (function buildModel() {
            $scope.moduleScope = $routeParams.module;
            $scope.answers = {};

            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;

            $http.get('/api/quizzes/' + $routeParams.id)
                .then(function(response){
                    $scope.quiz = response.data;
                    setShowSubmit();
                    setHoverStyleForQuiz();
                }, function(error){
                    $scope.error = error;
                });

            $scope.showResult = false;
            $scope.testStarted = false;

            if($rootScope.user) {
                $scope.userNotLoggedIn = false;
            } else{
                $scope.showSubmit = false;
                $scope.userNotLoggedIn = true;
            }

            $scope.showStartButton = !$scope.userNotLoggedIn;

            //startTimer();

        }());

        function setHoverStyleForQuiz() {
            for (var j = 0; j < $scope.quiz.questions.length; j++) {
                $scope.quiz.questions[j].checked = "quiz2";
            }
        }

        $scope.startTest = function(){
            $scope.showQuestionPaper = true;
            $scope.showStartButton = false;

            startTimer();
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
            if(!$rootScope.user) {
                $scope.showSubmit = false;
                return;
            }
            if(!($scope.quiz && $scope.quiz.questions)){
                $scope.showSubmit = false;
                return;
            }
            if ($scope.currentPage === Math.ceil($scope.quiz.questions.length / $scope.itemsPerPage)) {
                $scope.showSubmit = true;
            } else {
                $scope.showSubmit = false;
            }
        }
    }]);