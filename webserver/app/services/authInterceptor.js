/**
 * Created by DEEPAK.SHARMA on 10/17/2015.
 */
angular
    .module('tys')
    .factory('authInterceptor', [function () {
        return {
            request: function (config) {
                console.log('Auth interceptor called1111222');
                var storage = window.localStorage;
                var token = storage.getItem('satellizer_token');
                if (token) {

                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            response: function(response){
                return response;
            }
        }
    }
]);