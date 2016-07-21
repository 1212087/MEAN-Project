angular.module('WelcomeCtrl', [])
.controller('WelcomeCtrl', ['$http','$scope', '$rootScope', '$window', '$state', 'Province', 'AuthenticationService', function ($http, $scope, $rootScope, $window, $state, Province, AuthenticationService) {
    // $rootScope.isLoggedIn = AuthenticationService.isAuthenticated;
    Province.get().success(function(response) {
        $scope.provinces =  response;
    });

    $scope.ChooseLocation = function () {
    	if($scope.selectedProvince.name =="Toàn Quốc"){
    		Province.deteleCurrentProvince();
    	}
    	else{
    		Province.setCurrentProvince($scope.selectedProvince._id);
    	}
        
    	$state.go('home');
    }
}]);