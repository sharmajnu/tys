"use strict";

angular.module('tys.upload')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/quizzes', {
            templateUrl: 'upload/quiz.list.view.html',
            controller: 'QuizListController'
        });
    }])
    .controller('QuizListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
        $scope.controller = 'Quiz list controller';
        $http.get('/api/quizzes/').then(function (res) {

            $scope.quizzes = res.data;

        }, function (error) {
            console.log(error);
        })
    }]);