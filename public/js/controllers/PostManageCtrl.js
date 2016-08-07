angular.module('PostManageCtrl', [])
	.controller('PostManageCtrl', ['$scope', '$state', 'User', 'Post', 'Province', 'Couty', 'Category', 'flash', 'filepickerService', function($scope, $state, User, Post, Province, Couty, Category, flash, filepickerService) {
		$scope.currentUser = User.getCurrentUser();
		$scope.currentPost = Post.getCurrentPost();

		Post.getByUser({
				_id: $scope.currentUser
			})
			.success(function(resPosts) {
				$scope.posts = resPosts;
			})
			.error(function(error) {
				/* Act on the event */
				flash.error = error;
			});


		$scope.EditPost = function(post) {
			Post.setCurrentPost(post._id);
			$state.go('EditPost');
		};
	}])
	.controller('EditPostCtrl', ['$scope', '$state', 'Post', 'User', 'Province', 'Couty', 'Category', 'flash', function($scope, $state, Post, User, Province, Couty, Category, flash){
		$scope.currentPost = Post.getCurrentPost();
		$scope.currentUser = User.getCurrentUser();

		if ($scope.currentPost !== null) {
			Post.getById({
					_id: $scope.currentPost
				})
				.success(function(resPost) {
					$scope.currentPost = resPost;
					if ($scope.currentPost.userId != $scope.currentUser) {
						flash.error = "Bạn không được quyền chỉnh sửa bài viết của người khác";
						$state.go("Home");
					} else {
						Province.get()
							.success(function(resProvinces) {
								$scope.provinces = resProvinces;
								for (var i = 0; i < $scope.provinces.length; i++) {
									if ($scope.provinces[i]._id == $scope.currentPost.provinceId._id) {
										$scope.postProvince = $scope.provinces[i];
										break;
									}
								}
								if (!$.isEmptyObject($scope.postProvince)) {
									Couty.getByProvince({
											_id: $scope.currentPost.provinceId._id
										})
										.success(function(resCouties) {
											$scope.couties = resCouties;
											for (var i = 0; i < $scope.couties.length; i++) {
												if ($scope.couties[i]._id == $scope.currentPost.coutyId._id) {
													$scope.postCouty = $scope.couties[i];
													break;
												}
											}
										});
								}
							})
							.error(function(error) {
								flash.error = error;
							});
						Category.get()
							.success(function(resCategories) {
								$scope.categories = resCategories;
								for (var i = 0; i < $scope.categories.length; i++) {
									if ($scope.categories[i]._id == $scope.currentPost.categoryId._id) {
										$scope.postCategory = $scope.categories[i];
									}
								}
							})
							.error(function(error) {
								flash.error = error;
							});
					}
				})
				.error(function(error) {
					flash.error = error;
				});
		}

		$scope.UpdatePost = function() {
			$scope.currentPost.province = $scope.postProvince;
			$scope.currentPost.couty = $scope.postCouty;
			$scope.currentPost.category = $scope.postCategory;

			Post.update($scope.currentPost)
				.success(function(res) {
					flash.success = res;
					$state.go('PostManage');
				})
				.error(function(error) {
					flash.error = error;
				});
		};
		//Single file upload, you can take a look at the options
		$scope.upload = function() {
			filepickerService.pick({
					mimetype: 'image/*',
					language: 'en',
					services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
					openTo: 'IMAGE_SEARCH'
				},
				function(Blob) {
					console.log(JSON.stringify(Blob));
					$scope.currentPost.picture = Blob;
					$scope.$apply();
				}
			);
		};
	}]);