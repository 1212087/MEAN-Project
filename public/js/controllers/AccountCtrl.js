angular.module('AccountCtrl', [])
	.controller('AccountCtrl', ['$scope', '$state', 'User', 'Category', 'Post', 'flash', function($scope, $state, User, Category, Post, flash) {
		$scope.currentUser = {
			id: User.getCurrentUser()
		};
		$scope.different = false;
		$scope.checkDifferent = function(){
			$scope.different = true;
			if($scope.password.new == $scope.password.reNew){
				$scope.different = false;
			}
		};

		$scope.changePassword = function() {
			if ($scope.password.new == $scope.password.reNew) {
				$scope.password.currentUser = User.getCurrentUser();
				console.log($scope.password);
				User.changePassword($scope.password)
					.success(function(res) {
						flash.success = res;
						$state.go('account');
					})
					.error(function(error) {
						flash.error = error;
					});
			} else {
				flash.error = 'Mật khẩu không trùng khớp, xin nhập lại!';
			}

		};

	}]);