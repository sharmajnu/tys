/**
 * Created by DEEPAK.SHARMA on 10/4/2015.
 */
"use strict";

angular.module('tys.upload', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'upload/upload.html',
            controller: 'UploadController'
        });
    }])
    .controller('UploadController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

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
            if (isNaN($scope.quiz.totalQuestions))
                return;

            if($scope.quiz.questions && ($scope.quiz.questions.length === $scope.quiz.totalQuestions))
                return;

            if ($scope.quiz.questions && $scope.quiz.questions.length > 0) {

                if ($scope.quiz.questions.length > $scope.quiz.totalQuestions) {
                    $scope.quiz.questions.splice($scope.quiz.totalQuestions, $scope.quiz.questions.length - $scope.quiz.totalQuestions);

                } else {

                    for(var i =$scope.quiz.questions.length+1; i <= $scope.quiz.totalQuestions ; i++){
                        $scope.quiz.questions.push(generateQuesttion(i));
                    }
                }
            } else {

                $scope.quiz.questions = [];

                for (var i = 0; i < $scope.quiz.totalQuestions; i++) {
                    var question = generateQuesttion(i+1);
                    $scope.quiz.questions.push(question);
                }
            }
        };

        function generateQuesttion(number) {
            var options = [];
            for (var j = 0; j < $scope.numberOfOptionsInEachQuestion; j++) {
                options.push({id: j + 1, value: 'test ' + j.toString()});
            }

            var question = {id: number, options: options, title: 'Test Question'};
            return question;
        }

        $scope.cancel = function () {
            window.history.back();
        };

        $scope.submitForm = function (isValid) {

            if (isValid) {
                $http.post('/api/quizzes', JSON.stringify($scope.quiz)).then(function (res) {
                    var id = res.data;
                    $location.path('/quiz/' + id);

                }, function (error) {
                    console.log(error);
                });
            }
        };
    }
    ]);