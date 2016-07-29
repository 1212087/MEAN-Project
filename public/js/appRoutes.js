/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('appRoutes', [])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		/* Xử lý URL not found/404 error */
		$urlRouterProvider.otherwise('/views/layout/404.html');
		$urlRouterProvider.when('/_=_', '/');
		/* Thiết lập URL */
		$stateProvider
			.state('welcome', {
				url: '/',
				templateUrl: 'views/layout/welcome.html',
				controller: 'WelcomeCtrl',
				title: 'iMarket',
				access: {
					requiredLogin: false
				}
			})
			.state('home', {
				url: '/home',
				templateUrl: 'views/layout/home.html',
				controller: 'HomeCtrl',
				title: 'Trang chủ',
				access: {
					requiredLogin: false
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: 'views/user/login.html',
				controller: 'UserCtrl',
				title: 'Đăng nhập',
				access: {
					requiredLogin: false,
					requiredLogout: true
				}
			})
			.state('register', {
				url: '/register',
				templateUrl: 'views/user/register.html',
				controller: 'UserCtrl',
				title: 'Đăng ký',
				access: {
					requiredLogin: false,
					requiredLogout: true
				}
			})
			.state('forget_password', {
				url: '/forget',
				templateUrl: 'views/user/forget.html',
				controller: 'UserCtrl',
				title: 'Quên mật khẩu',
				access: {
					requiredLogin: false,
					requiredLogout: true
				}
			})
			.state('about', {
				url: '/about',
				templateUrl: 'views/about/about.html',
				controller: 'AboutCtrl',
				title: 'Về chúng tôi',
				access: {
					requiredLogin: false
				}
			})
			.state('post', {
				url: '/post',
				templateUrl: 'views/post/post.html',
				controller: 'PostCtrl',
				title: "Chi tết bài viết",
				access: {
					requiredLogin: false
				}
			})
			.state('new', {
				url: '/new',
				templateUrl: 'views/post/new.html',
				controller: 'NewPostCtrl',
				title: 'Đăng bài viết mới',
				access: {
					requiredLogin: true,
					redirectTo: '/login'
				}
			})
			.state('report', {
				url: '/report',
				templateUrl: 'views/post/report.html',
				controller: 'ReportCtrl',
				title: 'Báo cáo bài viết',
				access: {
					requiredLogin: true,
					redirectTo: '/login'
				}
			})
			.state('logout', {
				url: '/logout',
				controller: 'UserCtrl',
				access: {
					requiredLogin: false
				}
			})
			.state('account', {
				url: '/account',
				controller: 'AccountCtrl',
				views: {
					'': {
						templateUrl: '/views/manage/index.html'
					},
					'previousPosts': {
						templateUrl: '/views/layout/previousPosts.html'
					}
				},
				access: {
					requiredLogin: true
				}
			})
			.state('password', {
				url: '/PasswordManage',
				controller: 'AccountManageCtrl',
				templateUrl: 'views/manage/password.html',
				access: {
					requiredLogin: true
				}
			})
			.state('userinfo', {
				url: '/UserManage',
				controller: 'AccountManageCtrl',
				templateUrl: 'views/manage/userinfo.html',
				access: {
					requiredLogin: true
				}
			})
			.state('PostManage', {
				url: '/PostManage',
				controller: 'PostManageCtrl',
				templateUrl: 'views/manage/posts.html',
				access: {
					requiredLogin: true
				}
			})
			.state('EditPost', {
				url: '/EditPost',
				controller: 'PostManageCtrl',
				templateUrl: 'views/post/edit.html',
				access: {
					requiredLogin: true
				}
			})
			.state('404', {
				url: '/404',
				templateUrl: 'views/layout/404.html',
				title: "404 - Không tìm thấy trang yêu cầu",
				access: {
					requiredLogin: false
				}
			});

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$locationProvider.hashPrefix('!');
	}])
	.config(
		function($httpProvider) {
			$httpProvider.interceptors.push('TokenInterceptor');
		}
	)
	.run(['$rootScope', '$location', '$window', '$state', 'AuthenticationService', 'flash', 'Province', 'Category',
		function($rootScope, $location, $window, $state, AuthenticationService, flash, Province, Category) {
			$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
				if ($window.sessionStorage._id === undefined || $window.sessionStorage._id === null) {
					$rootScope.isLoggedIn = false;
				} else {
					$rootScope.isLoggedIn = true;
				}
				if (toState.url == '/' && (Province.getCurrentProvince() !== null || Category.getCurrentCategory() !== null)) {
					$location.path('/home');
				}

				if (toState !== null && toState.access !== null && toState.access.requiredLogin && !$rootScope.isLoggedIn) {
					flash.error = "Bạn phải đăng nhập để truy cập trang này!";
					$location.path('/login');
				}
				if (toState !== null && toState.access !== null && toState.access.requiredLogout && $rootScope.isLoggedIn) {
					flash.error = "Bạn phải đăng xuất trước khi truy cập trang này!";
					$location.path('/home');
				}
				if (toState.url == '/register' && !$rootScope.isLoggedIn) {
					flash.warn = 'Email được dùng để khôi phục tài khoản, vui lòng cung cấp email chính xác của bạn!';
				}
				// if(toState.url == '/welcome' && !$rootScope.isLoggedIn){
				// 	flash.warn = 'Email được dùng để khôi phục tài khoản, vui lòng cung cấp email chính xác của bạn!'
				// }
				// console.log(toState.url);
				// console.log('requiredLogin: ' + toState.access.requiredLogin);
				// console.log('requiredLogout: ' + toState.access.requiredLogout);
				// console.log('Logged in: '+ $rootScope.isLoggedIn);
				// console.log('session user: ' + $window.sessionStorage);
			});
		}
	]);