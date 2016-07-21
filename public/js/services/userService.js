angular.module('userService',[])
.factory('User', ['$http', function($http){
    return {
        register: function(user) {
            return $http.post('/api/user/register', user);
        },
        login: function(user){
        	return $http.post('/api/user/login', user);
        },
        forget: function(user){
        	return $http.post('/api/user/forget', user);
        },
        logout: function(){
            return $http.get('/api/user/logout');
        },
        getByEmail: function(user){
            return $http.post('/api/user/getUserByEmail', user);
        },
        getById: function(user){
            return $http.post('/api/user/getById', user);
        }
    }
}])