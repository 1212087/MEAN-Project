angular.module('authService', [])
    .factory('AuthenticationService', function() {
        return {
            isAuthenticated: false,
        };
    })
    .factory('TokenInterceptor', function($q, $window, $location, AuthenticationService) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.email) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.email;
                }
                return config;
            },

            requestError: function(rejection) {
                return $q.reject(rejection);
            },

            response: function(response) {
                if (response !== null && response.status == 200 && $window.sessionStorage.email && !AuthenticationService.isAuthenticated) {
                    AuthenticationService.isAuthenticated = true;
                }
                return response || $q.when(response);
            },

            responseError: function(rejection) {
                if (rejection !== null && rejection.status === 401 && ($window.sessionStorage.email || AuthenticationService.isAuthenticated)) {
                    delete $window.sessionStorage.email;
                    AuthenticationService.isAuthenticated = false;
                    $location.path("/login");
                }

                return $q.reject(rejection);
            }
        };
    });