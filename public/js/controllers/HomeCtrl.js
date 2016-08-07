angular.module('HomeCtrl', [])
	.controller('HomeCtrl', ['$scope', '$rootScope', '$window', '$state', '$timeout', 'Post', 'Province', 'Category', 'flash', 'AuthenticationService', function($scope, $rootScope, $window, $state, $timeout, Post, Province, Category, flash, AuthenticationService) {
		$scope.currentProvince = JSON.parse(Province.getCurrentProvince());
		$scope.currentCategory = JSON.parse(Category.getCurrentCategory());

		Province.get()
			.success(function(resProvinces) {
				$scope.provinces = resProvinces;
			})
			.error(function(error) {
				flash.error = error;
			});

		Category.get()
			.success(function(resCategories) {
				$scope.categories = resCategories;
			})
			.error(function(error) {
				flash.error = error;
			});

		// lấy theo vị trí và loại khi có cả 2
		if ($scope.currentProvince !== null && $scope.currentCategory !== null) {
			// console.log('Lấy theo tỉnh & loại');
			var search = {
				provinceId: $scope.currentProvince.id,
				categoryId: $scope.currentCategory.id
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
					_id: $scope.currentProvince.id
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
					_id: $scope.currentCategory.id
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
			if ($scope.search.category.name == "Tất cả danh mục") {
				Category.setCurrentCategory(null);
			} else {
				Category.setCurrentCategory($scope.search.category._id);
			}
			$state.reload();
		};

		$scope.searchByProvince = function() {
			if ($scope.search.province.name == "Toàn Quốc") {
				Province.setCurrentProvince(null);
			} else {
				Province.setCurrentProvince($scope.search.province._id);
			}
			$state.reload();
		};
	}]);