'use strict';

// Declare app level module which depends on views, and components
angular.module('tys', [
  'ngRoute',
  'satellizer',
  'tys.home',
  'tys.quizlist',
  'tys.test',
  'tys.version',
  'tys.upload',
  'tys.authentication',
  'ui.bootstrap'

]).
  config(['$routeProvider', '$authProvider', '$httpProvider', function($routeProvider, $authProvider, $httpProvider) {
      $routeProvider.when('/unauthorized', {
        templateUrl: 'unauthorized/unauthorized.html'
      });
      $routeProvider.otherwise({redirectTo: '/home'});

      $authProvider.google({
        clientId: '978616852397-tbcptkaj8q0gjtoak4ap58rndnrd0g37.apps.googleusercontent.com',
        url: '/auth/google'
      });

      $httpProvider.interceptors.push('authInterceptor');

    }])
    .filter('startFrom', function () {
      return function (input, start) {

        if(input) {
          start = +start; //parse to int
          return input.slice(start);
        }
      };
    })

    .controller('HeaderController', ['$scope', '$rootScope', 'userContext', function ($scope, $rootScope, userContext) {
      $rootScope.$watch('user', function(){
        $scope.user = $rootScope.user;
      }, true);
    }]);
