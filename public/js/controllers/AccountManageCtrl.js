angular.module('AccountManageCtrl', [])
	.controller('AccountManageCtrl', ['$scope', '$state', 'User', 'Category', 'Post', 'Province', 'Couty', 'flash', function($scope, $state, User, Category, Post, Province, Couty, flash) {
		$scope.currentUser = {
			_id: User.getCurrentUser()
		};

		$scope.editing = false;
		$scope.status = 'disabled';

		User.getById($scope.currentUser)
			.success(function(resUser) {
				$scope.user = resUser;
				if ($scope.user.provinceId !== null) {
					Province.get()
						.success(function(resProvince) {
							$scope.provinces = resProvince;
							for (var i = resProvince.length - 1; i >= 0; i--) {
								if (resProvince[i]._id == $scope.user.provinceId._id) {
									$scope.userProvince = resProvince[i];
									break;
								}
							}
						})
						.error(function(error) {
							/* Act on the event */
							flash.error = error;
						});
				}
				if ($scope.user.coutyId !== null) {
					Couty.getByProvince({
							_id: $scope.user.provinceId
						})
						.success(function(resCouties) {
							$scope.couties = resCouties;
							for (var i = resCouties.length - 1; i >= 0; i--) {
								if (resCouties[i]._id == $scope.user.coutyId._id) {
									$scope.userCouty = resCouties[i];
								}
							}
						})
						.error(function(error) {
							/* Act on the event */
							flash.error = error;
						});
				}
			})
			.error(function(error) {
				/* Act on the event */
				flash.error = error;
			});

		$scope.loadCouty = function() {
			Couty.getByProvince($scope.userProvince)
				.success(function(resCouties) {
					$scope.couties = resCouties;
				})
				.error(function(error) {
					/* Act on the event */
					flash.error = error;
				});
		};

		$scope.edit = function() {
			$scope.editing = true;
			document.getElementById('myFieldset').disabled = false;
			if($.isEmptyObject($scope.userProvince)){
				Province.get()
					.success(function(resProvinces){
						$scope.provinces = resProvinces;
					})
					.error(function(error) {
						/* Act on the event */
						flash.error =error;
					});
			}
		};

		$scope.checkDifferent = function() {
			$scope.different = true;
			if ($scope.password.new == $scope.password.reNew) {
				$scope.different = false;
			}
		};

		$scope.changePassword = function() {
			if ($scope.password.new == $scope.password.reNew) {
				$scope.password.userId = User.getCurrentUser();
				User.changePassword($scope.password)
					.success(function(res) {
						flash.success = res;
						$state.go('Manage');
					})
					.error(function(error) {
						flash.error = error;
					});
			} else {
				flash.error = 'Mật khẩu không trùng khớp, xin nhập lại!';
			}
		};

		$scope.ChangeUserInfo = function() {
			if ($.isEmptyObject($scope.userProvince)) {
				flash.error = "Bạn phải chọn Tỉnh";
			} else if ($.isEmptyObject($scope.userCouty)) {
				flash.error = "Bạn phải chọn Quận/Huyện";
			} else {
				$scope.user.provinceId = $scope.userProvince._id;
				$scope.user.coutyId = $scope.userCouty._id;
				User.Update($scope.user)
					.success(function(res) {
						flash.success = res;
						$state.reload();
					})
					.error(function(error) {
						flash.error = error;
					});
			}
		};

		$scope.cancel = function(){
			$state.reload();
		};
	}]);