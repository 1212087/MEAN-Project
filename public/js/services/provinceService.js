angular.module('provinceService',[])
.factory('Province',['$http', '$window', function($http, $window){
    return {
    	getCurrentProvince: function(){
    		if(!$.isEmptyObject($window.localStorage.getItem('currentProvince')))
    			return $window.localStorage.getItem('currentProvince');
    		else
    			return null;
    	},
    	setCurrentProvince: function(value){
    		$window.localStorage.setItem('currentProvince', JSON.stringify({id:value}));
    	},
    	deteleCurrentProvince: function(){
    		if(!$.isEmptyObject($window.localStorage.getItem('currentProvince'))){
    			delete $window.localStorage.currentProvince;
    		}
    	},
        get: function(){
            var provinces = $http.get('/api/province/list');
            console.log("Provinces recieved: "+ provinces);
            return provinces;
        }
    }
}])