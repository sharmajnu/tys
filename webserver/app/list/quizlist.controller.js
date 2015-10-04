"use strict";


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

