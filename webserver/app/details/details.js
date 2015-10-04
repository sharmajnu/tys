'use strict';

angular.module('tys.details', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/details', {
            templateUrl: 'details/details.html',
            controller: 'Details'
        });
    }])

    .controller('Details', ['$scope', '$http', function($scope, $http) {

        $scope.product = {name: 'One plus one mobile', details: 'This is from one plus one'};

        /*$http({
            method: 'GET',
            url: '/api/products'
        }).then(function successCallback(response) {

            $scope.products =  response.data;
        }, function errorCallback(response) {

        });
*/
    }]);

