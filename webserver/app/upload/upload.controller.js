/**
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
    .controller('UploadController', ['$scope', 'QuizService', '$routeParams',function ($scope, QuizService, $routeParams) {

        $scope.numberOfOptionsInEachQuestion = 4;

        $scope.states = ['India', 'Karnataka', 'javascript', 'C#'];
        $scope.quiz = {};

        $scope.updateQuestionCount = function () {
            if (isNaN($scope.totalQuestions))
                return;

            $scope.quiz.questions = [];

            for (var i = 0; i < $scope.totalQuestions; i++) {
                var options  = [];
                for (var j = 0; j < $scope.numberOfOptionsInEachQuestion; j++) {
                    options.push({id: j+1, value: null});
                }

                var question = { number: i + 1, options: options };
                $scope.quiz.questions.push(question);
            }
        }



        $scope.cancel = function () {
            window.history.back();
        };

        $scope.submitForm = function (isValid) {

            if (isValid) {

            }

        };
    }
    ]);