angular.module('provinceService',[])
.factory('Province',['$http', function($http){
    return {
        get: function(){
            var provinces = $http.get('/api/province/list');
            console.log("Provinces recieved: "+ provinces);
            return provinces;
        }
    }
}])