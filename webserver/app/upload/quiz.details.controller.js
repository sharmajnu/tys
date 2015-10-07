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
        $scope.preview = true;

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $http.get('/api/quizzes/' + $scope.id).then(function (res) {

            console.log(res.data);
            $scope.quiz = res.data;

            if($scope.quiz.notes){
                $scope.quiz.instructions = $scope.quiz.notes.split('\n');
            }

        }, function (error) {
            console.log(error);
        })
    }]);