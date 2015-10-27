"use strict";

angular.module('tys.upload')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/quiz/edit/:id', {
            templateUrl: 'upload/upload.html',
            controller: 'QuizEditController'
        });
    }])
    .controller('QuizEditController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
        $scope.id =  $routeParams.id;
        $http.get('/api/s/quizzes/' + $scope.id).then(function (res) {
            $scope.quiz = res.data;

        }, function (error) {
            console.log(error);
        });

        loadSubjects();

        $scope.submitForm = function (isValid) {

            if (isValid) {
                $http.put('/api/s/quizzes/' + $scope.id, JSON.stringify($scope.quiz)).then(function(res){
                    $location.path('/quiz/' + $scope.id);

                }, function(error){
                    console.log(error);
                });
            }
        };
        $scope.cancel = function(){
            window.history.back();
        };

        function loadSubjects(){
            $http.get('/api/subjects').then(function(res){
                $scope.subjects = res.data;
            }, function(error){
                console.log(error);
            })
        }
    }]);