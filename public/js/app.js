/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var myApp = angular.module('myApp', [
	'ui.router',
	'angular-flash.service',
	'angular-flash.flash-alert-directive',
	'ngCookies',
	'appRoutes',
	'WelcomeCtrl',
	'HomeCtrl',
	'UserCtrl',
	'AboutCtrl',
	'PostCtrl',
	'provinceService',
	'userService',
	'authService'
])

.config(['flashProvider',function(flashProvider) {
	flashProvider.errorClassnames.push('alert-danger');
	flashProvider.warnClassnames.push('alert-warning');
	flashProvider.successClassnames.push('alert-success');
	flashProvider.infoClassnames.push('alert-info');
}])

