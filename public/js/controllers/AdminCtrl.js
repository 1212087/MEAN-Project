angular.module('AdminCtrl', [])
	.controller('AdminCtrl', ['$scope', '$state', 'Post', 'User', 'Report', 'Message', 'flash', function($scope, $state, Post, User, Report, Message, flash) {
		Report.countUnreslove()
			.success(function(res) {
				$scope.numReports = res;
			})
			.error(function(error) {
				flash.error = error;
			});

		Message.countUnread({
				_id: User.getCurrentUser()
			})
			.success(function(res) {
				$scope.numMessages = res;
			})
			.error(function(error) {
				flash.error = error;
			});
	}])

.controller('AdminPostsCtrl', ['$scope', '$state', 'User', 'Post', 'flash', function($scope, $state, User, Post, flash) {
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
}])

.controller('AdminReportsCtrl', ['$scope', '$state', 'Report', 'flash', function($scope, $state, Report, flash) {
	Report.get()
		.success(function(resReports) {
			$scope.reports = resReports;
		})
		.error(function(error) {
			flash.error = error;
		});

	$scope.ReportDetail = function(report) {
		Report.changeCurrentReport(report);
		$state.go('AdminReportDetail');
	};
}])

.controller('AdminReportsDetailCtrl', ['$scope', '$state', 'Report', 'Post', 'User', 'flash', function($scope, $state, Report, Post, User, flash) {
	$scope.report = Report.getCurrentReport();
	$scope.reports = [];
	$scope.reports.push($scope.report);
	Post.getById({
			_id: $scope.report.postId._id
		})
		.success(function(resPost) {
			$scope.post = resPost;
		})
		.error(function(error) {
			flash.error = error;
		});
	$scope.LoadAllReports = function() {
		Report.getByPost({
				_id: $scope.report.postId._id
			})
			.success(function(resReports) {
				$scope.reports = [];
				$scope.reports = resReports;
			})
			.error(function(error) {
				flash.error = error;
			});
	};

	$scope.DeactivePost = function() {
		Post.deactive({
				_id: $scope.report.postId._id,
				userId: User.getCurrentUser()
			})
			.success(function() {
				Report.deactive({
						_id: $scope.report.postId._id,
						userId: User.getCurrentUser()
					})
					.success(function(res) {
						flash.success = res;
						$state.go('AdminReports');
					})
					.error(function(error) {
						flash.error = error;
					});
			})
			.error(function(error) {
				flash.error = error;
			});
	};

	$scope.DeactiveReport = function() {
		Report.deactive({
				_id: $scope.report.postId._id,
				userId: User.getCurrentUser()
			})
			.success(function(res) {
				flash.success = res;
				$state.go('AdminReports');
			})
			.error(function(error) {
				flash.error = error;
			});
	};
}])

.controller('AdminUsersCtrl', ['$scope', '$state', 'User', 'flash', function($scope, $state, User, flash) {
	User.getAll({
			_id: User.getCurrentUser()
		})
		.success(function(resUsers) {
			$scope.users = resUsers;
		})
		.error(function(error) {
			flash.error = error;
		});

	$scope.deactiveUser = function(user) {
		User.deactive({
				_id: user._id,
				userId: User.getCurrentUser()
			})
			.success(function(res) {
				flash.success = res;
				$state.reload();
			})
			.error(function(error) {
				flash.error = error;
			});
	};

	$scope.activeUser = function(user) {
		User.active({
				_id: user._id,
				userId: User.getCurrentUser()
			})
			.success(function(res) {
				flash.success = res;
				$state.reload();
			})
			.error(function(error) {
				flash.error = error;
			});
	};

	$scope.setAdmin = function(user) {
		User.setAdmin({
				_id: user._id,
				userId: User.getCurrentUser()
			})
			.success(function(res) {
				flash.success = res;
				$state.reload();
			})
			.error(function(error) {
				flash.error = error;
			});
	};

	$scope.setUser = function(user) {
		User.setUser({
				_id: user._id,
				userId: User.getCurrentUser()
			})
			.success(function(res) {
				flash.success = res;
				$state.reload();
			})
			.error(function(error) {
				flash.error = error;
			});
	};
}])

.controller('AdminUserDetailCtrl', ['$scope', '$stateParams', 'User', 'flash', function($scope, $stateParams, User, flash) {
	User.getById({
			_id: $stateParams.id
		})
		.success(function(resUser) {
			$scope.user = resUser;
			console.log(resUser);
		})
		.error(function(error) {
			flash.error = error;
		});
}]);