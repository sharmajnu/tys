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
        };

        var scope = {
            quiz: "="
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
            $scope.create = function () {
                var subject ={
                    code: $scope.code,
                    name: $scope.name
                };

                $http.post('/api/subjects', subject).then(function(res){
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
}());