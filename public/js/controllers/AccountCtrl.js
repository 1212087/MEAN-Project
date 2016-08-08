angular.module('AccountCtrl', [])
    .controller('AccountCtrl', ['$scope', '$state', 'User', 'flash', '$rootScope', '$cookieStore', '$window', 'AuthenticationService',
        function($scope, $state, User, flash, $rootScope, $cookieStore, $window, AuthenticationService) {
            $scope.user = {};

            // Xử ly user đăng nhập
            $scope.login = function() {
                if (!$.isEmptyObject($scope.user)) {

                    User.login($scope.user)
                        .success(function(response) {
                            // AuthenticationService.isAuthenticated = true;
                            // $rootScope.isLoggedIn = true;
                            $window.sessionStorage._id = response.user._id;
                            $window.sessionStorage.email = response.user.email;
                            $window.sessionStorage.name = response.user.name;

                            $scope.user = {};
                            $scope.form.$setPristine();
                            $scope.Process = false;
                            flash.success = 'Bạn đã đăng nhập thành công!';
                            setTimeout(function() {
                                $state.go('Welcome');
                            }, 500);
                        })
                        .error(function(response) {
                            console.log(response);
                            flash.error = 'Email hoặc Password không đúng';
                            $state.go('Login');
                        });
                }
            };

            //Xử lý user đăng ký tài khoản
            $scope.register = function() {
                $scope.Proccess = true;
                if (!$.isEmptyObject($scope.user) && $scope.user.password == $scope.user.repassword) {
                    User.register($scope.user)
                        .success(function(data) {
                            $scope.user = {};
                            $scope.form.$setPristine();
                            $scope.Proccess = false;
                            flash.success = 'Đăng ký thành công';
                            console.log(data);
                            setTimeout(function() {
                                $state.go('Login');
                            }, 500);
                        })
                        .error(function(data) {
                            console.log(data);
                            flash.error = 'Email đã được sử dụng, vui lòng đăng ký bằng Email khác!';
                            $scope.Proccess = false;
                            $state.go('Register');
                        });
                } else {
                    flash.error = "Mật khẩu không trùng khớp, xin nhập lại!";
                }
            };

            //Xử lý user quên mật khẩu
            $scope.forget = function() {
                $scope.Process = true;
                if (!$.isEmptyObject($scope.user)) {
                    User.forget($scope.user)
                        .success(function(res) {
                            $scope.user = {};
                            $scope.Process = false;
                            flash.success = data;
                            $state.go('Login');
                        })
                        .error(function(error) {
                            /* Act on the event */
                            flash.error = error;
                            $scope.Process = false;
                            setTimeout(function() {
                                $state.go('Register');
                            }, 2000);
                        });
                }
            };

            //Xử lý logout
            $scope.logout = function() {
                User.logout()
                    .success(function(data) {
                        delete $window.sessionStorage._id;
                        delete $window.sessionStorage.email;
                        delete $window.sessionStorage.name;
                        delete $window.sessionStorage.provinceId;
                        delete $window.localStorage.currentPost;
                        delete $window.localStorage.previousPosts;
                        delete $window.localStorage.currentCategory;
                        flash.success = data;
                        setTimeout(function() {
                            $state.go('Login');
                        }, 500);
                    })
                    .error(function(data) {
                        flash.error = data;
                    });
                // AuthenticationService.isAuthenticated = false;
                // $rootScope.isLoggedIn = false;   
            };
            // Xử lý quay lại trang chủ

            // $scope.GoToManage = function() {
            //     if()
            // }
        }
    ]);
