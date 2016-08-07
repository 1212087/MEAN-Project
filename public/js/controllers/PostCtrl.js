angular.module('PostCtrl', [])
	.controller('PostCtrl', ['$scope', '$window', '$state', 'Post', 'User', 'flash', function($scope, $window, $state, Post, User, flash) {
		$scope.currentPost = {
			_id: Post.getCurrentPost()
		};
		$scope.currentUser = User.getCurrentUser();

		$scope.showPhone = false;
		$scope.previousPosts = Post.getPreviousPosts();

		if ($scope.currentPost.id === null) {
			$state.go('Home');
			flash.error = "Có lỗi xảy ra";
		} else {
			Post.getById($scope.currentPost)
				.success(function(resPost) {
					$scope.post = resPost;
					$scope.user = {
						_id: resPost.userId
					};
					User.getById($scope.user)
						.success(function(resUser) {
							$scope.user = resUser;
						})
						.error(function(error) {
							/* Act on the event */
							flash.error = error;
						});
				})
				.error(function(error) {
					/* Act on the event */
					flash.error = error;
				});
		}


		$scope.getPostDetail = function(post) {
			Post.setCurrentPost(post._id);
			Post.unshiftPreviousPosts(post);
			console.log($state);
			if ($state.current.name == 'Post') {
				$state.reload();
			} else {
				$state.go('Post');
			}
		};

		$scope.showPhoneClick = function() {
			if ($scope.showPhone === false) {
				$scope.showPhone = true;
			} else {
				$scope.showPhone = false;
			}
		};

		$scope.reportPost = function() {
			if ($scope.currentUser == $scope.post.userId) {
				flash.error = 'Bạn không thể report bài viết của chính mình!';
			} else {
				$state.go('Report');
			}
		};
	}])

	.controller('PreviousPostCtrl', ['$scope', '$state', 'Post', function($scope, $state, Post) {
		$scope.previousPosts = Post.getPreviousPosts();
		$scope.getPostDetail = function(post) {
			Post.setCurrentPost(post._id);
			Post.unshiftPreviousPosts(post);
			console.log($state);
			if ($state.current.name == 'Post') {
				$state.reload();
			} else {
				$state.go('Post');
			}
		};
	}]);