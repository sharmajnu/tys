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
            templateUrl: 'template/inputQuestion2.html?' + Math.random(),
            controller: controller,
            scope: scope,
            linker: linker
        };
    });

}());