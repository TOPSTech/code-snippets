'use strict';
angular.module('myApp')
	.factory('AdminService', AdminService);

AdminService.$inject = ['$resource','$http','GENERAL_CONFIG','$q','$location','$state'];

function AdminService($resource,$http,GENERAL_CONFIG,$q,$location,$state) {
	var service = {
		user:                     user,
		addUser:                  addUser,
		changeUserStatus:         changeUserStatus,
		checkEmailAvailablity:    checkEmailAvailablity,
		categories:               categories
	};
	return service;

	function user(loginCredentials){
		return $resource(GENERAL_CONFIG.app_base_url+'/api/users/:userId', null,
		{
			'update': { method:'PUT' }
		});
	}
	function addUser(loginCredentials){
		return $resource(GENERAL_CONFIG.app_base_url+'/api/users/add');
	}
	function checkEmailAvailablity(){
		return $resource(GENERAL_CONFIG.app_base_url+'/api/users/check-email-availablity');
	}
	function changeUserStatus(){
		return $resource(GENERAL_CONFIG.app_base_url+'/api/users/change-status');
	}
	function changeCategoryStatus(){
		return $resource(GENERAL_CONFIG.app_base_url+'/api/categories/change-status');
	}
	function categories(){
		return $resource(GENERAL_CONFIG.app_base_url+'/api/categories/:categoryId', null,
		{
			'update': { method:'PUT' }
		});
	}
}
