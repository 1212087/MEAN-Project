angular.module('WelcomeCtrl', [])
.controller('WelcomeCtrl', ['$http','$scope', '$rootScope', '$window', '$state', 'Province', 'Category', 'AuthenticationService', function ($http, $scope, $rootScope, $window, $state, Province, Category, AuthenticationService) {
    // $rootScope.isLoggedIn = AuthenticationService.isAuthenticated;
    $scope.categories;
    Province.get().success(function(response) {
        $scope.provinces =  response;
    });

    Category.get()
    .success (function(resCategories){
        $scope.categories = resCategories;
    })
    .error(function(error) {
        /* Act on the event */
        flash.error = error;
    });

    $scope.ChooseCategory = function(category) {
        if(Province.getCurrentProvince() != null)
            Province.setCurrentProvince(null);
        Category.setCurrentCategory(category._id);
        $state.go('home');
    }

    $scope.ChooseLocation = function () {
    	if($scope.selectedProvince.name =="Toàn Quốc"){
    		Province.setCurrentProvince(null);
    	}
    	else{
    		Province.setCurrentProvince($scope.selectedProvince._id);
    	}
        if(Category.getCurrentCategory() != null)
            Category.setCurrentCategory(null);
    	$state.go('home');
    }
}]);