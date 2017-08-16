/**
 * Audio Date Filter Directive
 */
'use strict';
/* eslint angular/directive-restrict: "off" */
/* eslint angular/no-services: "off" */
angular.module('myApp')
  .directive('dateFilter', function (moment, $log, $http) {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'app/directives/anuraDateFilter.view.html',
      scope: {
        options: '=',
        dateRanges: '=',
        onSearch: '&',
        onExport: '&'
      },
      controller: function ($scope) {
        var vm = this;
        vm.setFilter = setFilter;
        vm.options = angular.extend({
            search: false,
            export: false,
            refresh: true,
            defaultSelection: 0,
            dateFormat: 'YYYY-MM-DD'
          },
          $scope.options
        );
        vm.minView = 'date';
        vm.dateRanges = $scope.dateRanges;
        vm.isSearching = false;

        // Default selection
        if (vm.options.defaultSelection < vm.dateRanges.length) {
          vm.selectedFilter = vm.dateRanges[vm.options.defaultSelection];
        } else {
          vm.selectedFilter = vm.dateRanges[1];
        }

        if (vm.options.dateFormat.indexOf('mm') != -1) {
          vm.minView = 'minutes';
        }

        // Initial filter
        setFilter();

        /* Change start/end date based on selected filter */
        function setFilter() {
          vm.endDate = moment(new Date());
          switch (vm.selectedFilter.type) {
          case 'hour':
            vm.startDate = moment().subtract(vm.selectedFilter.value, 'h');
            break;
          case 'day':
            vm.startDate = moment().subtract(vm.selectedFilter.value, 'd');
            break;
          case 'week':
            vm.startDate = moment().subtract(vm.selectedFilter.value, 'w');
            break;
          case 'month':
            vm.startDate = moment().subtract(vm.selectedFilter.value, 'M');
            break;
          case 'today':
            vm.startDate = moment().startOf('day');
            break;
          case 'yesterday':
            vm.startDate = moment().subtract(1, 'days').startOf('day');
            vm.endDate = moment().subtract(1, 'days').endOf('day');
            break;
          case 'lastmonth':
            vm.startDate = moment().subtract(30, 'd');
            break;
          case 'custom':
            vm.startDate = '';
            vm.endDate = '';
            break;
          default:
            break;
          }

          $log.log('Date range', vm.startDate, vm.endDate);

          if (vm.selectedFilter.type !== 'custom' && !vm.options.search) {
            $scope.onSearch({
              startDate: vm.startDate,
              endDate: vm.endDate
            });
          }
        }

        // Disable search and refresh buttons when we are executing http request to server
        $scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };
        $scope.$watch($scope.isLoading, function (v) {
          vm.isSearching = v;
        });
      },
      controllerAs: 'vm'
    };
  });
