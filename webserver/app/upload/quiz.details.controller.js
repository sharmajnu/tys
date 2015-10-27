"use strict";

angular.module('tys.upload')

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/quiz/:id', {
            templateUrl: 'upload/quiz.details.html',
            controller: 'QuizDetailsController'
        });
    }])
    .controller('QuizDetailsController', ['$scope', '$http', '$routeParams', '$location', '$modal', function ($scope, $http, $routeParams, $location, $modal) {
        $scope.controller = 'Quiz details controller';
        $scope.id = $routeParams.id;
        $scope.preview = true;

        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $http.get('/api/s/quizzes/' + $scope.id).then(function (res) {

            $scope.quiz = res.data;

            if ($scope.quiz.notes) {
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

        $scope.editQuiz = function () {
            $location.path('/quiz/edit/' + $scope.id);
        };

        $scope.publishQuiz = function () {

            var modalInstance = $modal.open({
                animation: false,
                templateUrl: '../template/confirm-dialog.html',
                controller: 'ConfirmModalDialogCtrl',

                resolve: {
                    message: function () {
                        return 'Are you sure you want to publish this quiz? Once you publish it will be visible to users.'
                    }
                }
            });

            modalInstance.result.then(publishConfirmCallBack, function () {});
        };

        var publishConfirmCallBack = function(){
            $http.post('/api/s/quizzes/' + $scope.id + '/publish', {published: true})
                .then(function () {
                    $scope.quiz.published = true;
                }, function (error) {
                    consoloe.log(error);
                });
        };

        $scope.revokeQuiz = function () {

            var modalInstance = $modal.open({
                animation: false,
                templateUrl: '../template/confirm-dialog.html',
                controller: 'ConfirmModalDialogCtrl',

                resolve: {
                    message: function () {
                        return 'Are you sure you want to revoke this quiz? Once you revoke it users cant see it anymore.'
                    }
                }
            });

            modalInstance.result.then(revokeConfirmCallBack, function () {});
        };

        var revokeConfirmCallBack = function(){
            $http.post('/api/s/quizzes/' + $scope.id + '/publish', {published: false})
                .then(function () {
                    $scope.quiz.published = false;
                }, function (error) {
                    consoloe.log(error);
                });
        };
    }]);