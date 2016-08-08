angular.module('MessageCtrl', [])
	.controller('MessageCtrl', ['$scope', 'User', 'Message', 'flash', function($scope, User, Message, flash) {

		$scope.currentUser = {
			_id: User.getCurrentUser()
		};

		console.log($scope.currentUser);
		Message.SentMessages($scope.currentUser)
			.success(function(resMessages) {
				$scope.messages = resMessages;
				console.log(resMessages);
			})
			.error(function(error) {
				flash.error = error;
			});
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			activeTab = $(e.target).attr('href');

			if (activeTab === "#sent-messages") {
				$scope.messages = null;
				Message.SentMessages($scope.currentUser)
					.success(function(resMessages) {
						$scope.messages = resMessages;
					})
					.error(function(error) {
						flash.error = error;
					});
			}
			if (activeTab === "#recieved-messages") {
				$scope.messages = null;
				Message.RecievedMessages($scope.currentUser)
					.success(function(resMessages) {
						$scope.messages = resMessages;
					})
					.error(function(error) {
						flash.error = error;
					});
			}
		});
	}])
	.controller('SendMessageCtrl', ['$scope', '$state', '$stateParams', 'User', 'Message', 'flash', function($scope, $state, $stateParams, User, Message, flash) {
		$scope.toUser = {
			_id: $stateParams.toId,
			name: $stateParams.toName
		};

		$scope.fromUser = {
			_id: User.getCurrentUser()
		};

		$scope.SendMessage = function() {
			$scope.message = {
				fromUser: $scope.fromUser._id,
				toUser: $scope.toUser._id,
				message: $scope.message
			};

			if ($scope.fromUser._id === $scope.toUser._id) {
				flash.error = "Bạn không được gửi tin nhắn cho chính mình!";
				$state.reload();
			} else {
				Message.new($scope.message)
					.success(function(res) {
						flash.success = res;
						$state.reload();
					})
					.error(function(error) {
						flash.error = error;
					});
			}
		};
	}]);