"use strict";
(function () {
    var app = angular.module('tys');

    app.directive('inputQuestion', function () {

        var linker = function (scope, element, attr) {
        };

        var controller = function ($scope) {
        };

        var scope = {
            question: "=",
            solved: "="
        };
       return {

            restrict: 'E',
            templateUrl: 'template/inputQuestion2.html?',
            controller: controller,
            scope: scope,
            linker: linker
        };
    });

    app.directive('tysInstructions', function () {

        var linker = function (scope, element, attr) {
        };

        var controller = function ($scope) {


            $scope.$watch('quiz', function () {
                if($scope.quiz && $scope.quiz.notes) {
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
            })

        };

        var scope = {
            quiz: "=",
        };
        return {

            restrict: 'E',
            templateUrl: 'template/instructions.html',
            controller: controller,
            scope: scope,
            linker: linker
        };
    });

    app.directive('createSubject', ['$http', function ($http) {

        var linker = function (scope, element, attr) {
        };

        var controller = function ($scope) {
            $scope.invalidCode = false;

            $scope.create = function () {
                var valid = true;
                if(!$scope.code){
                    $scope.invalidCode = true;
                    valid =false;
                } else{
                    $scope.invalidCode = false;
                }

                if(!$scope.name){
                    $scope.invalidName = true;
                    valid = false;
                } else {
                    $scope.invalidName = false;
                }

                if(!valid){
                    return;
                }

                var subject ={
                    code: $scope.code,
                    name: $scope.name
                };

                $http.post('/api/s/subjects', subject).then(function(res){
                    $scope.newSubject = res;
                    $scope.code  = $scope.name = "";
                    $('#myModal').modal('hide');
                }, function(error){
                    console.log('Something went wrong during subject creation', error);
                });
            };
        };

        var scope = {
            newSubject: "="
        };
        return {

            restrict: 'E',
            templateUrl: 'template/create-subject.html',
            controller: controller,
            scope: scope,
            linker: linker
        };
    }]);

    app.directive('loginBtn', ['$location', function ($location) {
        var linker = function (scope, element, attr) {
        };

        var controller = function ($scope) {
            $scope.navigateToLoginPage = function(){
                $location.url('/login');
            }
        };

        var scope = {
        };
        return {

            restrict: 'E',
            templateUrl: 'template/login-btn.html',
            controller: controller,
            scope: scope,
            linker: linker
        };
    }]);
}());