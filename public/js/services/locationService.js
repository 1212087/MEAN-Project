angular.module('locationService', [])
    .factory('Province', ['$http', '$window', function($http, $window) {
        return {
            getCurrentProvince: function() {
                if (!$.isEmptyObject($window.localStorage)) {
                    if (!$.isEmptyObject($window.localStorage.getItem('currentProvince')))
                        return $window.localStorage.getItem('currentProvince');
                    else
                        return null;
                } else
                    return null;
            },
            setCurrentProvince: function(value) {
                if (value === null) {
                    $window.localStorage.removeItem('currentProvince');
                } else {
                    $window.localStorage.setItem('currentProvince', JSON.stringify({
                        _id: value
                    }));
                }
            },
            get: function() {
                var provinces = $http.get('/api/province/list');
                // console.log("Provinces recieved: "+ provinces);
                return provinces;
            },
            getById: function(province) {
                return $http.post('/api/province/getById', province);
            }
        };
    }])

    .factory('Couty', ['$http', function($http) {
        return {
            getByProvince: function(data) {
                return $http.post('/api/couty/getByProvince', data);
            },
            getById: function(data) {
                return $http.post('/api/couty/getById', data);
            }
        };
    }]);