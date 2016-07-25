angular.module('UserCtrl', [])
.controller('UserCtrl', ['$scope','$rootScope', '$state', 'User', 'flash', '$rootScope', '$cookieStore', '$window', 'AuthenticationService', 
    function ($scope, $rootScope, $state, User, flash, $rootScope, $cookieStore, $window, AuthenticationService) {
    $scope.user = {};
    // $rootScope.isLoggedIn = AuthenticationService.isAuthenticated;
    // Xử ly user đăng nhập
    $scope.login = function() {
        if (!$.isEmptyObject($scope.user)){

            User.login($scope.user)
            .success(function(response){
                // AuthenticationService.isAuthenticated = true;
                // $rootScope.isLoggedIn = true;
                $window.sessionStorage._id = response.user._id;
                $window.sessionStorage.email = response.user.email;
                $window.sessionStorage.name = response.user.name;
                
                $scope.user = {};
                $scope.form.$setPristine();
                $scope.Process = false;
                flash.success = 'Bạn đã đăng nhập thành công!';
                setTimeout(function(){
                    $state.go('welcome');
                }, 500);
                console.log($scope.isLoggedIn);
            })
            .error(function(response) {
                console.log(response);
                flash.error = 'Email hoặc Password không đúng';
                $state.go('login');
            });
        }
    };

    //Xử lý user đăng ký tài khoản
    $scope.register = function(){
        $scope.Proccess = true;
        if(!$.isEmptyObject($scope.user) && $scope.user.password == $scope.user.repassword){
            User.register($scope.user)
            .success(function(data){
            	$scope.user = {};
            	$scope.form.$setPristine();
            	$scope.Proccess = false;
                flash.success = 'Đăng ký thành công';
                console.log(data);
                setTimeout(function(){
                    $state.go('login');
                }, 500);    
            })
            .error(function(data) {
            	console.log(data);
                flash.error = 'Email đã được sử dụng, vui lòng đăng ký bằng Email khác!';
                $scope.Proccess = false;
                $state.go('register');
            });
        }
        else {
        	flash.error = "Mật khẩu không trùng khớp, xin nhập lại!";
        }
    }

    //Xử lý user quên mật khẩu
    $scope.forget = function(){
        $scope.Process = true;
        if(!$.isEmptyObject($scope.user)){
            User.forget($scope.user)
            .success(function(data){
                $scope.user = {};
                $scope.Process = false;
                flash.success = 'Chúng tôi đã gửi password đến email của bạn! Vui lòng kiểm tra email';
                $state.go('login');
            })
            .error(function(data) {
                /* Act on the event */
                console.log(data);
                flash.error = data.error;
                $scope.Process = false;
                $state.go('register');
            });
        }
    }

    //Xử lý logout
    $scope.logout = function(){
        User.logout()
        .success(function(data){
            delete $window.sessionStorage._id;
            delete $window.sessionStorage.email;
            delete $window.sessionStorage.name;
            delete $window.sessionStorage.provinceId;
            delete $window.localStorage.currentPost;
            delete $window.localStorage.previousPosts;
            flash.success = data;
            setTimeout(function(){
                $state.go('login');
            }, 500); 
        })
        .error(function(data){
            flash.error = data;
        })
        // AuthenticationService.isAuthenticated = false;
        // $rootScope.isLoggedIn = false;   
    }

    // Xử lý quay lại trang chủ
    $scope.back = function(){
        $state.go('home');
        flash.info = 'Quay trở lại trang chủ';
    }

}]);