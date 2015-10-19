"use strict";


angular.module('tys.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });
    }])

    .controller('HomeController', ['$scope', '$http', function($scope, $http){

        $scope.subjects = [];
        $http.get('/api/subjects')
            .then(function (res) {
               $scope.subjects = res.data;
            });

    }]);
