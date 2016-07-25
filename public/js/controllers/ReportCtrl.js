angular.module('ReportCtrl', [])
.controller('ReportCtrl', ['$scope', '$window', '$state', 'Report', 'Post', 'User','flash', function ($scope, $window, $state, Report, Post, User, flash) {
	$scope.currentPost = {
		id: Post.getCurrentPost()
	}

	Post.getById($scope.currentPost)
	.success (function(resPost){
		$scope.post = resPost;
	})
	.error(function(error) {
		/* Act on the event */
		flash.error = error;
	});
	$scope.SubmitReport = function(){
		var report = {
			UserId : User.getCurrentUser(),
			PostId : Post.getCurrentPost(),
			reason: $scope.reason
		} 
		Report.submit(report)
		.success(function(res){
			flash.success = res;
			$state.go('home');
		})
		.error(function(error) {
			/* Act on the event */
			flash.error = error;
		});
	}
}])