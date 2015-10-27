"use strict";

angular.module('tys.admin')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/users/:id', {
            templateUrl: 'admin/user.admin.edit.view.html',
            controller: 'ManageUserPermissionsController'
        });
    }])
    .controller('ManageUserPermissionsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

        function loadUserDetails(){
            $http.get('/api/s/users/' + $scope.id).then(function (res) {

                $scope.user = res.data;

                for(var k in $scope.user.roles){
                    for(var i=0; i < $scope.roles.length; i++){
                        if(k === $scope.roles[i].name){
                            $scope.roles[i].enabled = $scope.user.roles[k];
                        }
                    }
                }

            }, function (error) {
                console.log(error);
            });
        }

        $scope.id = $routeParams.id;
        $scope.roles = [{name: 'admin', enabled: false},
            {name: 'contributor', enabled: false},
            {name: 'public', enabled: false}];


        loadUserDetails();

        $scope.enableRole = function(role){
            changeRole(role, true);
        };

        $scope.disableRole = function(role){
            changeRole(role, false);
        };

        function changeRole(role, roleValue){
            var payload = {role: role, roleValue: roleValue};
            $http.post('/api/s/users/' + $scope.id +'/perm', JSON.stringify(payload)).then(function (res) {
                for(var i=0; i < $scope.roles.length; i++) {
                    if($scope.roles[i].name === role){
                        $scope.roles[i].enabled = roleValue;
                    }
                }
            }, function(error){

            });
        }
    }]);