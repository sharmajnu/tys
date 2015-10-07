'use strict';

// Declare app level module which depends on views, and components
angular.module('tys', [
  'ngRoute',
  'tys.home',
  'tys.quizlist',
  'tys.test',
  'tys.version',
  'tys.upload',
  'ui.bootstrap'
]).
  config(['$routeProvider', function($routeProvider) {
   $routeProvider.otherwise({redirectTo: '/home'});
  }])
    .filter('startFrom', function () {
      return function (input, start) {

        if(input) {
          start = +start; //parse to int
          return input.slice(start);
        }
      };
    });
