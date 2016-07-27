angular.module('HomeCtrl', [])
	.controller('HomeCtrl', ['$scope', '$rootScope', '$window', '$state', '$timeout', 'Post', 'Province', 'Category', 'flash', 'AuthenticationService', function($scope, $rootScope, $window, $state, $timeout, Post, Province, Category, flash, AuthenticationService) {
		$scope.currentProvince = Province.getCurrentProvince();
		$scope.currentCategory = Category.getCurrentCategory();
		$scope.previousPosts = Post.getPreviousPosts();

		Province.get()
			.success(function(resProvinces) {
				$scope.provinces = resProvinces;
			})
			.error(function(error) {
				flash.error = 'Lỗi khi lấy danh sách tỉnh thành';
			});

		Category.get()
			.success(function(resCategories) {
				$scope.categories = resCategories;
			})
			.error(function(error) {
				flash.error = "Có lỗi khi lấy danh mục bài viết";
			});

		// lấy theo vị trí và loại khi có cả 2
		if ($scope.currentProvince !== null && $scope.currentCategory !== null) {
			console.log('Lấy theo tỉnh & loại');
			var search = {
				currentProvince: JSON.parse($scope.currentProvince),
				currentCategory: JSON.parse($scope.currentCategory)
			};
			// console.log(search);
			Post.getByProvinceAndCategory(search)
				.success(function(resPosts) {
					$scope.posts = resPosts;
					console.log(resPosts);
				})
				.error(function(error) {
					flash.error = error;
				});
		}
		// chỉ lấy theo tỉnh khi loại == null
		else if ($scope.currentProvince !== null) {
			console.log('Lấy theo tỉnh');
			Post.getByProvince($scope.currentProvince)
				.success(function(resPosts) {
					console.log(resPosts);
					$scope.posts = resPosts;
				})
				.error(function(error) {
					/* Act on the event */
					flash.error = "Có lỗi khi lấy danh sách bài viết theo danh mục!";
					// console.log(error);
				});
		}

		// chỉ lấy theo loại khi tỉnh == null
		else if ($scope.currentCategory !== null) {
			console.log('Lấy theo danh mục');
			Post.getByCategory($scope.currentCategory)
				.success(function(resPosts) {
					$scope.posts = resPosts;
					// console.log($scope.posts);
				})
				.error(function(error) {
					/* Act on the event */
					// console.log(error);
					flash.error = "Có lỗi khi lấy danh sách bài viết theo tỉnh thành!";
				});
		}

		// ko có gì -> lấy tất cả post
		else {
			console.log('Lấy tất cả');
			Post.get()
				.success(function(resPosts) {
					$scope.posts = resPosts;
					console.log(resPosts);
				})
				.error(function(error) {
					// console.log(error);
					flash.error = "Có lỗi khi lấy danh sách tất cả bài viết!";
				});
		}

		$scope.getPostDetail = function(post) {
			Post.setCurrentPost(post._id);
			Post.unshiftPreviousPosts(post);
			$state.go('post');
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