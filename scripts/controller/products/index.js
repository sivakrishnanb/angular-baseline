define(['app', 'model/products/products'], function (app, model) {
    app.controller('Products', function ($scope, $bus, $dal, $location, ngProgress, $http, $constants, $routeParams, toaster ) {
        
        $scope.model = new model();
        
        $scope.productFilterOptions = $constants.productFilterOptions; 

        $scope.dateOptions = $constants.dateOptions;

        $scope.inventoryOptions = $constants.inventoryOptions;

        $scope.categoryOptions = $constants.categoryOptions;

        $scope.productStatus = $constants.productStatus;

        $scope.columnDefs = [];

        $scope.isOptionVisible = function(option) {
            switch(option) {
                case 'shipment':
                    return ($routeParams.status != 'archived' && $routeParams.status != 'inactive');
                    break;
                case 'fulfillment':
                    return ($routeParams.status != 'archived' && $routeParams.status != 'inactive');
                    break;
                case 'removal':
                    return ($routeParams.status != 'archived' && $routeParams.status != 'inactive');
                    break;
                case 'active':
                    return ($routeParams.status != 'active' && $routeParams.status != 'archived');
                    break;
                case 'inactive':
                    return ($routeParams.status != 'inactive' && $routeParams.status != 'archived');
                    break;
                case 'archived':
                    return ($routeParams.status != 'archived');
                    break;
                case 'restore':
                    return ($routeParams.status == 'archived');
                    break;
                default:
                    return true;
            }
        }

        $scope.getSpecificPage = function(page) {
            switch(page) {
                case 'all':
                $scope.columnDefs = [
                                {field:"", width: 20},
                                {field:"edit", width: 50, displayName:"Edit", sortable : false,  cellTemplate : '<a id="{{\'edit-\' + row.entity.fbspSkuId}}" ng-href="#/products/edit/{{row.entity.fbspSkuId || \'---\'}}" title="Edit" class="glyphicon glyphicon-edit"></a>'},
                                {field:"fbspSkuId", displayName:"FBSP-SKU", cellTemplate : '<a id="{{\'id-\' + row.entity.fbspSkuId}}" ng-href="#/products/view/{{row.entity.fbspSkuId || \'---\'}}" title="Edit">{{row.entity.fbspSkuId || \'---\'}}</a>'},
                                {field:"sku", displayName:"Merchant SKU"},
                                {field:"createdDate", displayName:"Date Created"},
                                {field:"productDisplayName", displayName:"Product Name"},
                                {field:"qtyFulfillable", displayName:"Fulfillable"},
                                {field:"qtyDamaged", displayName:"Damaged"},
                                {field:"qtyInShipment", displayName:"Inbound"},
                                /*{field:"reserved", displayName:"Reserved"},*/
                                {field:"inventoryAlertLevel", displayName:"Alert Level"},
                                {field:"isActive", width:50, displayName:"Active", cellTemplate : '<span class="{{row.entity.isActive ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'}}"></span>' }
                                ];
                    break;
                case 'inactive':
                    $scope.columnDefs = [
                                {field:"", width: 20},
                                {field:"edit", width: 50, displayName:"Edit", sortable : false,  cellTemplate : '<a id="{{\'edit-\' + row.entity.fbspSkuId}}" ng-href="#/products/edit/{{row.entity.fbspSkuId || \'---\'}}" title="Edit" class="glyphicon glyphicon-edit"></a>'},
                                {field:"fbspSkuId", displayName:"FBSP-SKU", cellTemplate : '<a id="{{\'id-\' + row.entity.fbspSkuId}}" ng-href="#/products/view/{{row.entity.fbspSkuId || \'---\'}}" title="Edit">{{row.entity.fbspSkuId || \'---\'}}</a>'},
                                {field:"sku", displayName:"Merchant SKU"},
                                {field:"createdDate", displayName:"Created Date"},
                                {field:"dateInactive", displayName:"Date Since Inactive"},
                                {field:"productDisplayName", displayName:"Product Name"},
                                /*{field:"isDangerous", displayName:"Dangerous", cellTemplate : '<span class="{{row.entity.isDangerous ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'}}"></span>' },
                                {field:"isPerishable", displayName:"Perishable", cellTemplate : '<span class="{{row.entity.isPerishable ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'}}"></span>'},*/
                                ];
                    break;
                case 'archived':
                    $scope.columnDefs = [
                                {field:"", width: 20},
                                {field:"fbspSkuId", displayName:"FBSP-SKU", cellTemplate : '<a id="{{\'id-\' + row.entity.fbspSkuId}}" ng-href="#/products/view/{{row.entity.fbspSkuId || \'---\'}}" title="Edit">{{row.entity.fbspSkuId || \'---\'}}</a>'},
                                {field:"sku", displayName:"Merchant SKU"},
                                {field:"createdDate", displayName:"Created Date"},
                                {field:"dateArchived", displayName:"Archived Date"},
                                {field:"productDisplayName", displayName:"Product Name"},
                                ];
                    break;
                default:
                    $scope.columnDefs = [
                                {field:"", width: 20},
                                {field:"edit", width: 50, displayName:"Edit", sortable : false,  cellTemplate : '<a id="{{\'edit-\' + row.entity.fbspSkuId}}" ng-href="#/products/edit/{{row.entity.fbspSkuId || \'---\'}}" title="Edit" class="glyphicon glyphicon-edit"></a>'},
                                {field:"fbspSkuId", displayName:"FBSP-SKU", cellTemplate : '<a id="{{\'id-\' + row.entity.fbspSkuId}}" ng-href="#/products/view/{{row.entity.fbspSkuId || \'---\'}}" title="Edit">{{row.entity.fbspSkuId || \'---\'}}</a>'},
                                {field:"sku", displayName:"Merchant SKU"},
                                {field:"createdDate", displayName:"Created Date"},
                                {field:"productDisplayName", displayName:"Product Name"},
                                {field:"qtyFulfillable", displayName:"Fulfillable"},
                                {field:"qtyDamaged", displayName:"Damaged"},
                                {field:"qtyInShipment", displayName:"Inbound"},
                                /*{field:"reserved", displayName:"Reserved"},*/
                                {field:"inventoryAlertLevel", displayName:"Alert Level"},
                                ];
                    break;
            }
        };  

        $scope.readQueryParam = function(param){
            param.fromdate ? $scope.fromdate = param.fromdate : '';
            param.todate ? $scope.todate = param.todate : '';
            param.skey ? $scope.searchKey = param.skey : '';
            _.map($scope.categoryOptions, function(option) { if(option.ticked) option.ticked = false });
            _.map($scope.dateOptions, function(option) { if(option.ticked) option.ticked = false });
            _.map($scope.inventoryOptions, function(option) { if(option.ticked) option.ticked = false });
            _.map($scope.productFilterOptions, function(option) { if(option.ticked) option.ticked = false });
            if(param.cat) {
                _(param.cat.split(',')).forEach(function(cat){
                    var x = _.where($scope.categoryOptions, {"value":cat});
                    if(x.length) x[0].ticked = true;
                });
            } 
            if(param.inv) {
                _(param.inv.split(',')).forEach(function(inv){
                    var x = _.where($scope.inventoryOptions, {"value":inv});
                    if(x.length) x[0].ticked = true;
                });
            } 
            if(param.scol) {
                var scol = _.where($scope.productFilterOptions, {"value":param.scol});
                if(scol.length) scol[0].ticked = true;
            } else {
                var scol = _.where($scope.productFilterOptions, {"value":"all"});
                if(scol.length) scol[0].ticked = true;
            }
            if(param.date) {
                var date = _.where($scope.dateOptions, {"value":param.date});
                if(date.length) date[0].ticked = true;
            }
        }

        $scope.resetFilter = function() {
            $location.url($location.path());
            $scope.readQueryParam($routeParams);
        }

        $scope.applyFilter = function() {
            var query = (($scope.searchColumn.length && _.pluck($scope.searchColumn, 'value') !="all") ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&': '') + ($scope.searchKey ? 'skey=' + $scope.searchKey + '&': '') + ($scope.date.length ? 'date=' + _.pluck($scope.date, 'value') + '&': '') + ($scope.fromdate ? 'fromdate=' + $scope.fromdate + '&': '') + ($scope.todate ? 'todate=' + $scope.todate + '&': '') + ($scope.category.length ? 'cat=' + _.pluck($scope.category, 'value') + '&': '') + ($scope.inventory.length ? 'inv=' + _.pluck($scope.inventory, 'value'): '') ;
            if(query && ($location.url() != $location.path() + '?' + query)) {
                $location.url($location.path() + '?' + query);
                $scope.readQueryParam($routeParams);
            }
        }      

        $scope.init = function() {
            $scope.getSpecificPage($routeParams.status);
            $scope.readQueryParam($routeParams);
            $scope.filterOptions = {
                filterText: "",
                filterColumn: "",
                useExternalFilter: true
            }; 
            $scope.totalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [10, 25, 50, 100],
                pageSize: 10,
                currentPage: 1
            };  
            $scope.setPagingData = function(data, page, pageSize,totalSize){  
                //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.myData = data;
                $scope.totalServerItems = totalSize;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.getPagedDataAsync = function (pageSize, page, searchText, searchColumn) {
                    ngProgress.start();
                    var data;
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        if(searchColumn[0]) {
                            $http.get('products?status='+ ($routeParams.status ? _.where($scope.productStatus, {"name":$routeParams.status})[0].value : '1') +'&p=' + $scope.pagingOptions.currentPage + '&rcd=' + $scope.pagingOptions.pageSize).success(function (largeLoad) { 
                                var products = [];
                                var data = largeLoad.data;
                                if(!_.isArray(data.products)) {
                                    _.forEach(data.products, function(product) { products.push(product) }); 
                                } else {
                                    products = data.products;
                                }     
                                /*data = products.filter(function(item) {
                                    if(searchColumn[0].value) {
                                        return JSON.stringify(item[searchColumn[0].value]).toLowerCase().indexOf(ft) != -1;
                                    } else {
                                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                    }
                                });*/
                                $scope.setPagingData(products,(data.toRecord/(data.toRecord-data.fromRecord+1)),(data.toRecord-data.fromRecord+1),data.totalRecords);
                                ngProgress.complete();
                            });   
                        }         
                    } else {
                        var params = {
                                        status : $routeParams.status ? _.where($scope.productStatus, {"name":$routeParams.status})[0].value : '1',
                                        p : $scope.pagingOptions.currentPage,
                                        rcd : $scope.pagingOptions.pageSize
                                    };
                        $bus.fetch({name:'products', api:'products', params: params, data: null})
                        .done(function(success){
                            var products = [];
                            var data = success.response.data;
                            //toaster.pop("success", success.response.success[0] ? success.response.success[0] : 'Product List', success.response.success[1] ? success.response.success[1] : 'Successfully Retrived');
                            if(!_.isArray(data.products)) {
                                    _.forEach(data.products, function(product) { products.push(product) }); 
                                } else {
                                    products = data.products;
                                }   
                            $scope.setPagingData(products,(data.toRecord/(data.toRecord-data.fromRecord+1)),(data.toRecord-data.fromRecord+1),data.totalRecords);
                            ngProgress.complete();
                        }).fail(function(error){
                            toaster.pop("error", "Error in fetching product list");
                            ngProgress.complete(); 
                        });
                        /*$http.get('products?status='+ ($routeParams.status ? _.where($scope.productStatus, {"name":$routeParams.status})[0].value : '1') +'&p=' + $scope.pagingOptions.currentPage + '&rcd=' + $scope.pagingOptions.pageSize).success(function (largeLoad) {
                            var products = [];
                            var data = largeLoad.data;
                            if(!_.isArray(data.products)) {
                                    _.forEach(data.products, function(product) { products.push(product) }); 
                                } else {
                                    products = data.products;
                                }   
                            $scope.setPagingData(products,(data.toRecord/(data.toRecord-data.fromRecord+1)),(data.toRecord-data.fromRecord+1),data.totalRecords);
                            ngProgress.complete();
                        });*/
                    }
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
                multiSelect: true,
                selectedItems: [],
                showSelectionCheckbox: true,
                /*checkboxCellTemplate : '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
                checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-show="multiSelect" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',*/
                columnDefs: $scope.columnDefs,
                enablePaging: true,
                showFooter: true,
                /*showFilter: true,*/
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions
            };
        };
    });
});