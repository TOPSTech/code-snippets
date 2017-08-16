angular.module('myApp.config', []);
var config_data = {
	'GENERAL_CONFIG': {
		'app_base_url': window.location.origin, //'http://topsdemo.in:8010',
		'app_image_url':'assets/images/'
	}
}
angular.forEach(config_data,function(key,value) {
	angular.module('myApp.config').constant(value,key);
});