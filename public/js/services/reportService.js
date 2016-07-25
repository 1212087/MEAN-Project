angular.module('reportService', [])
.factory('Report', ['$http', function($http){
	return{
		submit: function(report){
			return $http.post('/api/report/submit', report);
		}
	}	
}])