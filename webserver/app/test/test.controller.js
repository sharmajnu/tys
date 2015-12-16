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
            $scope.instructionVisible = true;
            $scope.answers = {};

            $scope.showInstructions = true;

            $scope.id = $routeParams.id;

            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;

            $http.get('/api/quizzes/' + $scope.id)
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
                $scope.userNotLoggedIn = true;
            }

            $scope.showStartButton = !$scope.userNotLoggedIn;

            $scope.sliderOption = {
                from: 1,
                to: 10,
                floor: true,
                step: 1,
                dimension: " questions",
                vertical: false,
                callback: function(value, elt) {
                    console.log(value);
                },
                css: {
                    background: {"background-color": "silver"},
                    before: {"background-color": "#3498db"},
                    after: {"background-color": "#3498db"},
                    pointer: {"background-color": "#b3d4fc"}
                }
            };
        }());

        function setHoverStyleForQuiz() {
            if(!($scope.quiz && $scope.quiz.questions)){
                return;
            }
            for (var j = 0; j < $scope.quiz.questions.length; j++) {
                $scope.quiz.questions[j].checked = "quiz2";
            }
        }

        $scope.toggleInstructions = function(){
            $scope.showInstructions = ! $scope.showInstructions;
        }
        $scope.startTest = function(){
            $http.post('/api/s/test/' + $scope.id + '/start', {}).then(function(res){
                $scope.quiz = res.data.quiz;
                $scope.trackingId = res.data.trackingId;
                $scope.showQuestionPaper = true;
                $scope.showStartButton = false;
                $scope.showSubmit = true;
                $scope.showInstructions = false;

                startTimer();

            }, function(err){
                console.log(err);
            });
        }

        $scope.reset = function () {
            for (var i = 0; i < $scope.quiz.questions.length; i++) {
                $scope.quiz.questions[i].givenAnswer = undefined;
            }
        }

        $scope.submit = function () {

            stopTimer();

            var givenAnswers = [];

            for (var i = 0; i < $scope.quiz.questions.length; i++) {
                var ga = $scope.quiz.questions[i].givenAnswer;

                var answer = ga? parseInt(ga): null
                givenAnswers.push({
                                    questionId: $scope.quiz.questions[i].id,
                                    answer: answer});

                console.log(givenAnswers);
            }

            var postPayload = {
                trackingId: $scope.trackingId,
                quizId: $scope.id,
                answers: givenAnswers
            };

            $http.post('/api/s/test/submit', JSON.stringify(postPayload)).then(function(res){
                $scope.response = res.data;
                $scope.showResult = true;
                $scope.showInstructions = false;

                window.scrollTo(0,0);

                if($scope.quiz.isSolved){
                    var answersFromServer = $scope.response.answers.questions;
                    for(var i=0; i < $scope.quiz.questions.length; i++){
                        for(var j=0; j < answersFromServer.length; j++){
                            if($scope.quiz.questions[i].id === answersFromServer[j].id){
                                $scope.quiz.questions[i].answer = answersFromServer[j].answer;
                                if($scope.quiz.questions[i].givenAnswer){
                                    if($scope.quiz.questions[i].givenAnswer == answersFromServer[j].answer){
                                        $scope.quiz.questions[i].checked = "answer right-answer";
                                        $scope.quiz.questions[i].checkedClass = "glyphicon glyphicon-ok"
                                    }else{
                                        $scope.quiz.questions[i].checked = "answer wrong-answer";
                                        $scope.quiz.questions[i].checkedClass = "glyphicon glyphicon-remove"
                                    }

                                }else{
                                    $scope.quiz.questions[i].checked = "not-attempted";
                                    $scope.quiz.questions[i].checkedClass = ""
                                }
                            }
                        }
                    }

                } else{
                    $scope.showQuestionPaper = false;
                }

            }, function(err){
               console.error(err);
            });
            $scope.showSubmit = false;
            $scope.showResult = true;

        };

        var countdownInterval;
        function startTimer() {

            var minuites = $scope.quiz.time - 1;
            var seconds = 60;


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