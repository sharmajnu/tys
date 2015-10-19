"use strict";


angular.module('tys.quizlist', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/list/:subject', {
            templateUrl: 'list/quizlist.html',
            controller: 'QuizController'
        });
    }])

    .controller('QuizController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.subject = $routeParams.subject;
        $http.get('/api/quizzes/subject/' + $routeParams.subject)
            .then(function (result) {
                $scope.quizzes = result.data;
            }, function (error) {
                $scope.error = error;
            });
    }]);

