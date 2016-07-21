angular.module('HomeCtrl', [])
.controller('HomeCtrl', ['$scope', '$rootScope','$window', '$state', '$timeout', 'Post', 'Province', 'Category', 'flash', 'AuthenticationService', function ($scope, $rootScope, $window, $state, $timeout, Post, Province, Category, flash, AuthenticationService) {
	$scope.currentProvince = Province.getCurrentProvince();
	$scope.posts;
	Province.get()
	.success(function(resProvinces){
		$scope.provinces = resProvinces;
	})
	.error(function(error){
		flash.error = 'Lỗi khi lấy danh sách tỉnh thành';
	});

	Category.get()
	.success(function(resCategories){
		$scope.categories = resCategories;
	})
	.error(function(error){
		flash.error = "Có lỗi khi lấy danh mục bài viết"
	});
	// nếu user chọn tỉnh thành từ trang welcome -> lấy post theo tỉnh thành
	if($scope.currentProvince != null){
		console.log('Lấy theo tỉnh');
		Post.getByProvince($scope.currentProvince)
		.success(function (resPosts) {
			console.log(resPosts);
			$scope.posts = resPosts;
		})
		.error(function(error) {
			/* Act on the event */
			flash.error = "Có lỗi khi lấy danh sách bài viết theo danh mục!";
			console.log(error);
		});
	}

	// nếu user chọn theo category -> lấy post theo category
	else if($window.sessionStorage.categoryId){
		console.log('Lấy theo danh mục');
		Post.getByCategory($window.sessionStorage)
		.success(function (resPosts) {
			// $scope.posts = resPosts;
		})
		.error(function(error) {
			/* Act on the event */
			console.log(error);
			flash.error = "Có lỗi khi lấy danh sách bài viết theo tỉnh thành!";
		});
	}

	// ko chọn gì -> lấy tất cả post
	else{
		console.log('Lấy tất cả');
		Post.get()
		.success(function(resPosts){
			$scope.posts = resPosts;
			console.log(resPosts);
		})
		.error(function(error){
			console.log(error);
			flash.error = "Có lỗi khi lấy danh sách tất cả bài viết!";
		})
	}

	$scope.getPostDetail = function(post){
		Post.setCurrentPost(post._id);
		Post.unshiftPreviousPosts(post._id);
		$state.go('post');
	}

	$scope.searchByCategory = function(){
		Category.setCurrentCategory($scope.search.category._id);
		$scope.currentCategory = Category.getCurrentCategory();
		Post.getByCategory($scope.currentCategory)
		.success(function(resPosts){
			$timeout(function(){
				$scope.posts = resPosts;
				console.log($scope.posts);
			})
		})
		.error(function(error) {
			/* Act on the event */
			flash.error = error;
		});
	}
}]);