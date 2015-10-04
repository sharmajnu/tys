"use strict";


angular.module('tys.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });
    }])

    .controller('HomeController', ['$scope', function($scope){

        $scope.message = "I am home controller";

    }]);
