angular.module('categoryService', [])
    .factory('Category', ['$http', '$window', function($http, $window) {
        return {
            getCurrentCategory: function() {
                if (!$.isEmptyObject($window.localStorage)) {
                    if (!$.isEmptyObject($window.localStorage.getItem('currentCategory'))) {
                        return $window.localStorage.getItem('currentCategory');
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            },
            setCurrentCategory: function(value) {
                if (value === null) {
                    $window.localStorage.removeItem('currentCategory');
                } else {
                    $window.localStorage.setItem('currentCategory', JSON.stringify({
                        id: value
                    }));
                }
            },
            get: function() {
                var categories = $http.get('/api/category/list');
                return categories;
            }
        };
    }]);