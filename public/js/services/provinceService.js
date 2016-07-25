angular.module('provinceService',[])
.factory('Province',['$http', '$window', function($http, $window){
    return {
    	getCurrentProvince: function(){
    		if(!$.isEmptyObject($window.localStorage)){
                if(!$.isEmptyObject($window.localStorage.getItem('currentProvince')))
    			     return $window.localStorage.getItem('currentProvince');
    		    else
    			     return null;
                }
            else
                return null;
    	},
    	setCurrentProvince: function(value){
            if(value == null){
                $window.localStorage.removeItem('currentProvince');
            }
            else{
                $window.localStorage.setItem('currentProvince', JSON.stringify({id:value}));
            }
    	},
        get: function(){
            var provinces = $http.get('/api/province/list');
            console.log("Provinces recieved: "+ provinces);
            return provinces;
        }
    }
}])