angular.module('AdminCtrl', [])
	.controller('AdminCtrl', ['$scope', '$state', 'Post', 'User', 'flash', function($scope, $state, Post, User, flash) {

	}])

.controller('AdminPostsCtrl', ['$scope', '$state','User', 'Post', 'flash', function($scope, $state, User, Post, flash) {
	Post.get()
		.success(function(resPosts) {
			$scope.posts = resPosts;
		})
		.error(function(error) {
			flash.error = error;
		});

	$scope.getPostDetail = function(post) {
		Post.setCurrentPost(post._id);
		Post.unshiftPreviousPosts(post);
		if ($state.current.name == 'Post') {
			$state.reload();
		} else {
			$state.go('Post');
		}
	};

	$scope.deactivePost = function(post) {
		var data = {
			_id: post._id,
			userId: User.getCurrentUser()
		};
		Post.deactive(data)
			.success(function(res) {
				flash.success = res;
				$state.reload();
			})
			.error(function(error) {
				flash.error = error;
			});
	};

	$scope.activePost = function(post) {
		var data = {
			_id: post._id,
			userId: User.getCurrentUser()
		};
		Post.active(data)
			.success(function(res) {
				flash.success = res;
				$state.reload();
			})
			.error(function(error) {
				flash.error = error;
				$state.reload();
			});
	};
}]);