angular.module('ReportCtrl', [])
	.controller('ReportCtrl', ['$scope', '$window', '$state', 'Report', 'Post', 'User', 'flash', function($scope, $window, $state, Report, Post, User, flash) {
		$scope.currentPost = {
			id: Post.getCurrentPost()
		};

		$scope.currentUser = User.getCurrentUser();

		Post.getById($scope.currentPost)
			.success(function(resPost) {
				$scope.post = resPost;
			})
			.error(function(error) {
				/* Act on the event */
				flash.error = error;
			});
		$scope.SubmitReport = function() {
			if ($scope.currentUser == $scope.post.userId) {
				flash.error = "Bạn không thể report bài viết của chính mình!";
				$state.go('post');
			} else {
				var report = {
					UserId: $scope.currentUser,
					PostId: Post.getCurrentPost(),
					reason: $scope.reason
				};
				Report.submit(report)
					.success(function(res) {
						flash.success = res;
						$state.go('home');
					})
					.error(function(error) {
						/* Act on the event */
						flash.error = error;
					});
			}
		};
	}]);