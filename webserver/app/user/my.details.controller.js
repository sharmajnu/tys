"use strict";

angular.module('tys.me', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/me', {
            templateUrl: 'user/my.details.view.html',
            controller: 'MyDetailsController'
        });
    }])
    .controller('MyDetailsController', ['$scope', '$http', function($scope, $http){
        $http.get('/api/s/user/me').then(function (res) {
            $scope.user = res.data;
        }, function (error) {
            console.log(error);
        });

        $http.get('/api/s/my/tests').then(function (res) {
            $scope.tests = res.data;
        }, function (error) {
            console.log(error);
        });
    }]);