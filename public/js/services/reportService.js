angular.module('reportService', [])
	.factory('Report', ['$http', '$window', function($http, $window) {
		return {
			getCurrentReport: function() {
				if ($.isEmptyObject(JSON.parse($window.localStorage.getItem('currentReport')))) {
					return null;
				} else {
					return JSON.parse($window.localStorage.getItem("currentReport"));
				}
			},
			changeCurrentReport: function(report) {
				if(!$.isEmptyObject(JSON.parse($window.localStorage.getItem('currentReport'))) || report === null){
					delete $window.localStorage.currentReport;
				}
				$window.localStorage.setItem("currentReport", JSON.stringify(report));
			},
			submit: function(report) {
				return $http.post('/api/report/submit', report);
			},
			get: function() {
				return $http.get('/api/report/get');
			},
			getById: function(_id) {
				return $http.post('/api/report/getById', _id);
			}, 
			getByPost: function(_id) {
				return $http.post('/api/report/getByPost', _id);
			},
			getByUser: function(_id) {
				return $http.post('/api/report/getByUser', _id);
			}, 
			// data: {_id, userId}
			deactive: function(data) {
				return $http.post('/api/report/deactive', data);
			},
			countUnreslove: function() {
				return $http.get('/api/report/countUnreslove');
			}
		};
	}]);