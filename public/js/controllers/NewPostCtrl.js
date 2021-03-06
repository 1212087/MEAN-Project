angular.module('NewPostCtrl', [])
	.controller('NewPostCtrl', ['$scope', '$rootScope', '$state', '$window', 'Post', 'User', 'Province', 'Couty', 'Category', 'flash', 'filepickerService', function($scope, $rootScope, $state, $window, Post, User, Province, Couty, Category, flash, filepickerService) {
		// "use strict";
		$scope.user = {};
		$scope.postDetail = {};
		$scope.newPost = {};
		if ($.isEmptyObject($window.sessionStorage)) {
			$state.go('Login');
		}
		User.getByEmail($window.sessionStorage)
			.success(function(response) {
				$scope.user = response;
			})
			.error(function(error) {
				/* Act on the event */
				console.log(error);
			});

		Province.get()
			.success(function(response) {
				$scope.provinces = response;
			})
			.error(function(error) {

				console.log(error);
			});

		Category.get()
			.success(function(resCategory) {
				$scope.categories = resCategory;
			})
			.error(function(error) {
				console.log(error);
			});

		$scope.provinceChange = function() {
			Couty.getByProvince({_id: $scope.newPost.province._id})
				.success(function(resCouties){
					$scope.couties = resCouties;
				})
				.error(function(error) {
					flash.error = error;
				});
		};

		$scope.submitNewPost = function() {
			if (!$.isEmptyObject($scope.newPost)) {
				$scope.newPost.userId = $scope.user._id;
				console.log($scope.newPost);
				Post.submit($scope.newPost)
					.success(function(resData) {
						flash.success = "Đăng bài thành công!";
						console.log(resData);
						$scope.newPost = {};
						$scope.form.$setPristine();
						$state.go('Home');
					})
					.error(function(resError) {
						flash.error = resError;
						$state.go('New');
					});
			}
		};

		//Single file upload, you can take a look at the options
		$scope.upload = function() {
			filepickerService.pick({
					mimetype: 'image/*',
					language: 'en',
					services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
					openTo: 'COMPUTER'
				},
				function(Blob) {
					console.log(JSON.stringify(Blob));
					$scope.newPost.picture = Blob;
					$scope.$apply();
				}
			);
		};

		//Multiple files upload set to 3 as max number
		$scope.uploadMultiple = function() {
			filepickerService.pickMultiple({
					mimetype: 'image/*',
					language: 'en',
					maxFiles: 3, //pickMultiple has one more option
					services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
					openTo: 'IMAGE_SEARCH'
				},
				function(Blob) {
					console.log(JSON.stringify(Blob));
					$scope.newPost.morePictures = Blob;
					$scope.$apply();
				}
			);
		};
	}]);