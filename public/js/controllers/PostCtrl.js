angular.module('PostCtrl', [])
.controller('PostCtrl', ['$scope','$rootScope', '$window','User', 'Province' , function ($scope, $rootScope, $window,  User, Province) {
	// "use strict";
	$scope.user = {};
	User.getByEmail($window.sessionStorage)
	.success(function(response){
		$scope.user = response;
	})
	.error(function(error) {
		/* Act on the event */
		console.log(error);
	});
	Province.get()
	.success(function(response){
		$scope.provinces = response;
	})
	.error(function(error){

		console.log(error);
	})
}]);