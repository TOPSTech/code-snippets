'use strict';
angular.module('myApp.adminPanel')
	.controller('UserListController', UserListController);

UserListController.$inject = ['$log', 'AdminService', '$state', '$stateParams'];
function UserListController($log, AdminService, $state, $stateParams) {
	var vm        = this;
	vm.userList   = [];
	vm.pageId     = $stateParams.pageId ? $stateParams.pageId : 1;

	/* Get user list */
	getUsers(vm.pageId);
	
	function getUsers(pageNumber){
		App.startPageLoading({animate: true});
		AdminService.user().get({pageIndex:pageNumber},function(response){
			if(response.code == 200 ){
				vm.itemPerPage = response.data.perPage;
				vm.totalItems = response.data.totalItems;
				vm.userList = response.data.userList;
			}
			App.stopPageLoading();
		})
	}
}