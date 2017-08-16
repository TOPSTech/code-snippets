angular
	.module('myApp', [
		'ngResource',
		'ui.router',
		'ngAnimate',
		'ngSanitize',
		'oc.lazyLoad',
		'ui.bootstrap',
		'toastr',
		'angularFileUpload',		
		'localytics.directives',
		'myApp.user',
		'myApp.config',
		'myApp.adminPanel',
		'datePicker'
	])
	.config(config)
	.run(run);

/* App Run */
function run($rootScope, GENERAL_CONFIG, $state, $transitions){
	$rootScope.app_base_url = GENERAL_CONFIG.app_base_url;
}

/* App Config */
function config($httpProvider, $provide) {
	$httpProvider.interceptors.push('httpInterceptorService');
	$httpProvider.interceptors.push('errorHandler');// Handle SESSION_TIMED_OUT error 
}