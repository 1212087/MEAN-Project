angular.module('NotiCtrl', [])
	.controller('NotiCtrl', ['$scope', 'User', function($scope, User) {
		$scope.isAdmin = function() {
			User.isAdmin({
					_id: User.getCurrentUser()
				})
				.success(function(res) {
					console.log(res);
				})
				.error(function(error) {
					console.log(error);
				});
		};
	}]);