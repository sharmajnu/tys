angular.module('tys')
    .service('userContext', ['$auth', '$http', '$rootScope', function ($auth, $http, $rootScope) {

        this.isAuthenticated = false;
        this.user = null;
        this.refreshToken = function () {
            if ($auth.isAuthenticated()) {

                if (this.user && this.user.name) {
                    return true;
                }
                else {
                    var that = this;
                    $http.post('/auth/refreshToken').then(function (response) {
                        that.user = response.data.user;
                        $auth.setToken(response.data.token);
                        that.isAuthenticated = true;
                        $rootScope.user = response.data.user.name;
                        $rootScope.$apply();
                    }, function (error) {
                        that.isAuthenticated = false;
                        console.log(error);
                    });
                }

            }

        };

        this.getUserName = function () {
            return this.user.name;
        };

        this.refreshToken();

    }

    ]);
