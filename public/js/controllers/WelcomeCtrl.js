angular.module('WelcomeCtrl', [])
.controller('WelcomeCtrl', ['$http','$scope', '$rootScope', 'Province', 'AuthenticationService', function ($http, $scope, $rootScope, Province, AuthenticationService) {
    // $rootScope.isLoggedIn = AuthenticationService.isAuthenticated;
    Province.get().success(function(response) {
        $scope.provinces =  response;
    });
}]);