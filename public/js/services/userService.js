angular.module('userService', [])
    .factory('User', ['$http', '$window', function($http, $window) {
        return {
            getCurrentUser: function() {
                if (!$.isEmptyObject($window.sessionStorage)) {
                    if (!$.isEmptyObject($window.sessionStorage.getItem('_id'))) {
                        return $window.sessionStorage.getItem('_id');
                    } else
                        return null;
                } else {
                    return null;
                }
            },
            setCurrentUser: function(value) {
                if (value === null)
                    delete $window.sessionStorage._id;
                else
                    $window.sessionStorage.setItem('_id', value);
            },
            register: function(user) {
                return $http.post('/api/user/register', user);
            },
            login: function(user) {
                return $http.post('/api/user/login', user);
            },
            forget: function(user) {
                return $http.post('/api/user/forget', user);
            },
            logout: function() {
                return $http.get('/api/user/logout');
            },
            getByEmail: function(user) {
                return $http.post('/api/user/getUserByEmail', user);
            },
            getById: function(user) {
                return $http.post('/api/user/getById', user);
            },
            changePassword: function(password){
                return $http.post('/api/user/changePassword', password);
            }
        };
    }]);