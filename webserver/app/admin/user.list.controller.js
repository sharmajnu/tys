"use strict";

angular.module('tys.admin', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: 'admin/user.list.html',
            controller: 'UserListController'
        });
    }])
    .controller('UserListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
        $http.get('/api/s/users').then(function (res) {

            $scope.users = res.data;

        }, function (error) {
            console.log(error);
        })
    }]);