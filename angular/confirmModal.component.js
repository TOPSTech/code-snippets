angular  
	.module('myApp')
	.component('confirmModal', {
		templateUrl:'components/confirmModal.view.html',
		bindings: {
			name: "@",
			id:"@",
			type:'@',
			onConfirm: '&'
		},
		controllerAs:'vm',
		controller: function(AdminService, $q, $scope, $uibModal) {
			var vm        = this;
			vm.onAction   = onAction;
			vm.showDelErr = false;
			
			function onAction(){
				$scope.confirmMsg = "Are you sure want to " + vm.type +" selected "+ vm.name +" ?";
				
				/* Show alert for multiple item delete, show error if 0 items selected */
				if(vm.type == 'delete selected'){
					vm.id = JSON.parse(vm.id);
					if(vm.id.length == 0) {
						vm.showDelErr = true;
					} 
					else {
						vm.showDelErr = false;
						$scope.confirmMsg = "Are you sure want to " + vm.type+ " " + vm.name +" ?";
					}
				}

				if(!vm.showDelErr){
					var deleteUserInstance = $uibModal.open({
						templateUrl: 'partial-views/confirm-modal/confirm-modal.view.html',
						controller: 'confirmModalController as vm',
						scope:$scope
					});
					deleteUserInstance.result.then(function (result) {
						if (result) {
							if(vm.type == 'delete' || vm.type == 'delete selected'){
								vm.onConfirm({id:vm.id});
							}
							else {
								if(vm.type == 'Active')
									vm.onConfirm({id:vm.id, status: 1});
								else if(vm.type == 'Inactive')
									vm.onConfirm({id:vm.id, status: 0});
							}
						}
					},
					function (err) {
						console.info('Modal dismissed at: ' + new Date());
					});
				}
			}
		}
	});
