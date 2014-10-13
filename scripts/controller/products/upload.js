define(['app', 'model/products/products'], function (app, model) {
    app.controller('UploadProducts', function ($scope, $bus, $dal, $location, ngProgress, $http) {
        
		//ngProgress.start();
        $scope.model = new model();

        
        $scope.init = function() {
        	$scope.filterOptions = {
                filterText: "",
                filterColumn: "",
                useExternalFilter: true
            }; 
            $scope.totalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [10, 50, 100],
                pageSize: 10,
                currentPage: 1
            };  
            $scope.setPagingData = function(data, page, pageSize){  
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.myData = pagedData;
                $scope.totalServerItems = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.getPagedDataAsync = function (pageSize, page, searchText, searchColumn) {
                setTimeout(function () {
                    var data;
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        if(searchColumn[0]) {
                            $http.get('services/uploadProducts.json').success(function (largeLoad) {        
                                data = largeLoad.filter(function(item) {
                                    if(searchColumn[0].value) {
                                        return JSON.stringify(item[searchColumn[0].value]).toLowerCase().indexOf(ft) != -1;
                                    } else {
                                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                    }
                                });
                                $scope.setPagingData(data,page,pageSize);
                            });   
                        }         
                    } else {
                        $http.get('services/uploadProducts.json').success(function (largeLoad) {
                            $scope.setPagingData(largeLoad,page,pageSize);
                        });
                    }
                }, 100);
            };
            
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
            
            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.filterOptions.filterColumn);
                }
            }, true);
            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.filterOptions.filterColumn);
                }
            }, true);

            $scope.gridOptions = {
                data: 'myData',
                showGroupPanel: false,
                multiSelect: false,
                showSelectionCheckbox: false,
                columnDefs: [
	                            {field:"date", displayName:"Date & Time"},
	                            {field:"file", displayName:"File Name"},
	                            {field:"result", displayName:"Result"},
	                            {field:"status", displayName:"Status", cellTemplate : '<div class="ngCellText"><span>{{row.entity.status}}</span><span ng-show="(row.entity.status==\'Failed\')"> - <a href="{{row.entity.report}}" title="Report">Report</a></span></div>'}
                            ],
                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions
            };	
        };

       
        ngProgress.complete();
    });
});