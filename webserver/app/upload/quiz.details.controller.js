"use strict";

angular.module('tys.upload')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/quiz/:id', {
            templateUrl: 'upload/quiz.details.html',
            controller: 'QuizDetailsController'
        });
    }])
    .controller('QuizDetailsController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
        $scope.controller = 'Quiz details controller';
        $scope.id =  $routeParams.id;
        $scope.preview = true;

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $http.get('/api/quizzes/' + $scope.id).then(function (res) {

            $scope.quiz = res.data;

            if($scope.quiz.notes) {
                $scope.quiz.instructions = (function () {
                    var finalArray = [];
                    var rawArray = $scope.quiz.notes.split('\n');
                    for (var i = 0; i < rawArray.length; i++) {
                        if (rawArray[i]) {
                            finalArray.push(rawArray[i]);
                        }
                    }
                    return finalArray;
                }());
            }
        }, function (error) {
            console.log(error);
        });

        $scope.editQuiz = function(){
            $location.path('/quiz/edit/' + $scope.id);
        }
    }]);