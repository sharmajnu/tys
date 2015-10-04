"use strict";

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