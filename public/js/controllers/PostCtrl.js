angular.module('PostCtrl', [])
.controller('PostCtrl', ['$scope', '$window', '$state', 'Post', 'User', 'flash', function ($scope, $window, $state, Post, User, flash) {
	$scope.currentPost = {
		id: Post.getCurrentPost()
	}
	$scope.previousPosts = Post.getPreviousPosts();
	if(!$scope.currentPost){
		$state.go('home');
		flash.error = "Có lỗi xảy ra";
	}
	Post.getById($scope.currentPost)
	.success(function(resPost){
		$scope.post = resPost;
		$scope.user = {
			id: resPost.userId
		}
		User.getById($scope.user)
		.success(function(resUser){
			$scope.user = resUser;
			console.log($scope.user);
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
}])