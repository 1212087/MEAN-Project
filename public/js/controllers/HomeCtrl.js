angular.module('HomeCtrl', [])
	.controller('HomeCtrl', ['$scope', '$rootScope', '$window', '$state', '$timeout', 'Post', 'Province', 'Category', 'flash', 'AuthenticationService', function($scope, $rootScope, $window, $state, $timeout, Post, Province, Category, flash, AuthenticationService) {
		$scope.currentProvince = JSON.parse(Province.getCurrentProvince());
		$scope.currentCategory = JSON.parse(Category.getCurrentCategory());

		Province.get()
			.success(function(resProvinces) {
				$scope.provinces = resProvinces;
				if($scope.currentProvince !== null) {
					for (var i = $scope.provinces.length - 1; i >= 0; i--) {
						if($scope.provinces[i]._id === $scope.currentProvince._id) {
							$scope.currentProvince = $scope.provinces[i];
							break;
						}
					}
				}
			})
			.error(function(error) {
				flash.error = error;
			});

		Category.get()
			.success(function(resCategories) {
				$scope.categories = resCategories;
				if($scope.currentCategory !== null) {
					for (var i = $scope.categories.length - 1; i >= 0; i--) {
						if($scope.categories[i]._id === $scope.currentCategory._id) {
							$scope.currentCategory = $scope.categories[i];
							break;
						}
					}
				}
			})
			.error(function(error) {
				flash.error = error;
			});

		// lấy theo vị trí và loại khi có cả 2
		if ($scope.currentProvince !== null && $scope.currentCategory !== null) {
			// console.log('Lấy theo tỉnh & loại');
			var search = {
				provinceId: $scope.currentProvince._id,
				categoryId: $scope.currentCategory._id
			};
			// console.log(search);
			Post.getByProvinceAndCategory(search)
				.success(function(resPosts) {
					$scope.posts = resPosts;
					// console.log(resPosts);
				})
				.error(function(error) {
					flash.error = error;
				});
		}
		// chỉ lấy theo tỉnh khi loại == null
		else if ($scope.currentProvince !== null) {
			Post.getByProvince({
					_id: $scope.currentProvince._id
				})
				.success(function(resPosts) {
					// console.log(resPosts);
					$scope.posts = resPosts;
				})
				.error(function(error) {
					/* Act on the event */
					flash.error = error;
					// console.log(error);
				});
		}

		// chỉ lấy theo loại khi tỉnh == null
		else if ($scope.currentCategory !== null) {
			// console.log('Lấy theo danh mục');
			Post.getByCategory({
					_id: $scope.currentCategory._id
				})
				.success(function(resPosts) {
					$scope.posts = resPosts;
					// console.log($scope.posts);
				})
				.error(function(error) {
					/* Act on the event */
					// console.log(error);
					flash.error = error;
				});
		}

		// ko có gì -> lấy tất cả post
		else {
			// console.log('Lấy tất cả');
			Post.getActivePosts()
				.success(function(resPosts) {
					$scope.posts = resPosts;
				})
				.error(function(error) {
					// console.log(error);
					flash.error = error;
				});
		}

		$scope.getPostDetail = function(post) {
			Post.setCurrentPost(post._id);
			Post.unshiftPreviousPosts(post);
			$state.go('Post');
		};

		$scope.searchByCategory = function() {
			if ($scope.currentCategory.name == "Tất cả danh mục") {
				Category.setCurrentCategory(null);
			} else {
				Category.setCurrentCategory($scope.currentCategory._id);
			}
			$state.reload();
		};

		$scope.searchByProvince = function() {
			if ($scope.currentProvince.name == "Toàn Quốc") {
				Province.setCurrentProvince(null);
			} else {
				Province.setCurrentProvince($scope.currentProvince._id);
			}
			$state.reload();
		};
	}]);