/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var myApp = angular.module('myApp', [
	'ui.router',
	'angular-filepicker',
	'angular-flash.service',
	'angular-flash.flash-alert-directive',
	'angularUtils.directives.dirPagination',
	'ui.bootstrap',
	'ngCookies',
	'appRoutes',
	'WelcomeCtrl',
	'HomeCtrl',
	'UserCtrl',
	'AboutCtrl',
	'NewPostCtrl',
	'PostCtrl',
	'ReportCtrl',
	'provinceService',
	'userService',
	'authService',
	'categoryService',
	'postService',
	'reportService'
])

.config(['flashProvider',function(flashProvider) {
	flashProvider.errorClassnames.push('alert-danger');
	flashProvider.warnClassnames.push('alert-warning');
	flashProvider.successClassnames.push('alert-success');
	flashProvider.infoClassnames.push('alert-info');
}])
.config(['filepickerProvider', function (filepickerProvider) {
	filepickerProvider.setKey('AHBdUjo0MS0yyWyOgcqFUz');
}])

