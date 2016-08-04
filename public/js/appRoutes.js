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
			.state('Welcome', {
				url: '/',
				templateUrl: 'views/layout/welcome.html',
				controller: 'WelcomeCtrl',
				title: 'iMarket',
				access: {
					requiredLogin: false
				}
			})
			.state('Home', {
				url: '/home',
				templateUrl: 'views/layout/home.html',
				controller: 'HomeCtrl',
				title: 'Trang chủ',
				access: {
					requiredLogin: false
				}
			})
			.state('Login', {
				url: '/login',
				templateUrl: 'views/user/login.html',
				controller: 'UserCtrl',
				title: 'Đăng nhập',
				access: {
					requiredLogin: false,
					requiredLogout: true
				}
			})
			.state('Register', {
				url: '/register',
				templateUrl: 'views/user/register.html',
				controller: 'UserCtrl',
				title: 'Đăng ký',
				access: {
					requiredLogin: false,
					requiredLogout: true
				}
			})
			.state('ForgetPassword', {
				url: '/forget',
				templateUrl: 'views/user/forget.html',
				controller: 'UserCtrl',
				title: 'Quên mật khẩu',
				access: {
					requiredLogin: false,
					requiredLogout: true
				}
			})
			.state('About', {
				url: '/about',
				templateUrl: 'views/about/about.html',
				controller: 'AboutCtrl',
				title: 'Về chúng tôi',
				access: {
					requiredLogin: false
				}
			})
			.state('Post', {
				url: '/post',
				templateUrl: 'views/post/post.html',
				controller: 'PostCtrl',
				title: "Chi tết bài viết",
				access: {
					requiredLogin: false
				}
			})
			.state('New', {
				url: '/new',
				templateUrl: 'views/post/new.html',
				controller: 'NewPostCtrl',
				title: 'Đăng bài viết mới',
				access: {
					requiredLogin: true,
					redirectTo: '/login'
				}
			})
			.state('Report', {
				url: '/report',
				templateUrl: 'views/post/report.html',
				controller: 'ReportCtrl',
				title: 'Báo cáo bài viết',
				access: {
					requiredLogin: true,
					redirectTo: '/login'
				}
			})
			.state('Logout', {
				url: '/logout',
				controller: 'UserCtrl',
				access: {
					requiredLogin: false
				}
			})
			.state('Manage', {
				url: '/manage',
				templateUrl: '/views/manage/index.html',
				access: {
					requiredLogin: true
				}
			})
			.state('Password', {
				url: '/PasswordManage',
				controller: 'AccountManageCtrl',
				templateUrl: 'views/manage/password.html',
				access: {
					requiredLogin: true
				}
			})
			.state('UserInfo', {
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
			.state('Notification', {
				url: '/notification',
				controller: 'NotiCtrl',
				templateUrl: 'views/manage/notification.html',
				access: {
					requiredLogin: true
				}
			})
			.state('Admin', {
				url: '/admin',
				controller: 'AdminCtrl',
				templateUrl: 'views/admin/index.html',
				access: {
					requiredLogin: true,
					requiredAdmin: true
				}
			})
			.state('AdminPosts', {
				url:'/admin/posts',
				controller: 'AdminPostsCtrl',
				templateUrl: 'views/admin/post_manage.html',
				access: {
					requiredLogin: true,
					requiredAdmin: true
				}
			})
			.state('AdminReports', {
				url: '/admin/reports',
				controller: 'AdminReportsCtrl',
				templateUrl: 'views/admin/reports_manage.html',
				access: {
					requiredLogin: true,
					requiredAdmin: true
				}
			})
			.state('AdminReportDetail', {
				url: '/admin/reports/detail',
				controller: 'AdminReportsDetailCtrl',
				templateUrl: 'views/admin/report_detail.html',
				access: {
					requiredLogin: true,
					requiredAdmin: true
				}
			})
			.state('AdminUsers', {
				url: '/admin/users',
				controller: 'AdminUsersCtrl',
				templateUrl: 'views/admin/users_manage.html',
				access: {
					requiredLogin: true,
					requiredAdmin: true
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
	.run(['$rootScope', '$location', '$window', '$state', 'AuthenticationService', 'flash', 'Province', 'Category', 'User',
		function($rootScope, $location, $window, $state, AuthenticationService, flash, Province, Category, User) {
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
				if (toState.url == '/manage' && $rootScope.isLoggedIn) {
					User.isAdmin({
							_id: User.getCurrentUser()
						})
						.success(function(res){
							if(res === true) {
								$state.go('Admin');
							}
						})
						.error(function(error){
							flash.error = error;
						});
	
				}
				if (toState !== null && toState.access !== null && toState.access.requiredAdmin && $rootScope.isLoggedIn) {
					User.isAdmin({
							_id: User.getCurrentUser()
						})
						.success(function(res){
							if(res === false) {
								flash.error = 'Bạn không có quyền truy cập trang này';
								$state.go('Home');
							}
						})
						.error(function(error){
							flash.error = error;
						});

				}
			});
		}
	]);