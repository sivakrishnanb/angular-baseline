define(['app', 'utility/messages'], function (app, messages) {
    app.controller('Products', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', '$routeParams', '$rootScope', '$timeout','notify', '$localStorage',
        function ($scope, $bus, $location, ngProgress, $http, $constants, $routeParams, $rootScope, $timeout,notify, $localStorage) {

            $scope.productFilterOptions = $constants.productFilterOptions;

            $scope.dateOptions = $constants.dateOptions;

            $scope.inventoryOptions = $constants.inventoryOptions;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.productStatus = $constants.productStatus;

            $scope.constants = $constants;

            $scope.routeParams = $routeParams;          

            $scope.checkShipmntRowsCount = function()
            {
                if($scope.showSelectedLength==0){
                    $('#no-productsSelected-modal').modal();                    
                }else{ 
                    $location.path('/shipments/create/product');
                }
            }

            $scope.archive = function (fbspSkuId) {

                $('#confirm-archive-modal').modal();
                    
                $('#archivemodalCancel,#archive-model-close').on('click',function(e){
                   $('#archive-modalOk').off('click');
                }); 
                        

                    $('#archive-modalOk').on('click',function(e){
                        var request = {
                            fbspSkuId: fbspSkuId,
                            archived: 1
                        }
                        $bus.fetch({
                            name: 'editproducts',
                            api: 'editproducts',
                            params: null,
                            data: JSON.stringify(request)
                        })
                            .done(function (success) {
                                if (success.response.success.length) {
                                    var products = [];
                                    var data = success.response.data;
                                    if (!_.isArray(data.products)) {
                                        _.forEach(data.products, function (product) {
                                            products.push(product)
                                        });
                                    } else {
                                        products = data.products;
                                    }
                                    $scope.getPagedDataAsync();
                                    notify.message(messages.productArchiveSuccess,'','succ');
                                    $scope.productEdited = true;
                                  
                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        notify.message(messages.productArchiveError);
                                    }
                                }
                            }).fail(function (error) {
                                notify.message(messages.productArchiveError);
                            });
                        $('#archivemodalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#archive-modalOk').off('click');
                });
                
                $('#confirm-archive-modal').keypress(function(e){
                    if(e.keyCode == 13 || e.keyCode == 32){
                        $('#archive-modalOk').click();
                    }
                });
            }


            $scope.checkOrderRowsCount = function()
            {
                if($scope.showSelectedLength==0){
                    $('#no-productsSelected-modal').modal(); 
                }else{ 
                    $location.path('/orders/create/product');
                }
            }

            $scope.checkRemovalRowsCount = function()
            {
                if($scope.showSelectedLength==0){
                    $('#no-productsSelected-modal').modal();
                }else{
                    $location.url('/orders/removals/create/product');
                }
            }

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            };

            $scope.sort = function (field, name) {
                if ($scope.sortingOptions.field != field || $scope.sortingOptions.name != name) {
                    $scope.sortingOptions.field = field;
                    $localStorage.pagingOptions.products.sortingOption = field;
                    $scope.applyFilter();
                }
            }

            $scope.sortDirection = function () {
                if ($scope.sortingOptions.direction == 'desc') {
                    $scope.sortingOptions.direction = 'asc';
                    $localStorage.pagingOptions.products.sortDir = 'asc';
                } else {
                    $scope.sortingOptions.direction = 'desc';
                    $localStorage.pagingOptions.products.sortDir = 'desc';
                }
                $scope.applyFilter();
            };
            
            $scope.getHeaderText = function() {
                
                if ($routeParams.status=='active' || !($routeParams.status)) {
                    return messages.headerProductActive;
                }else if ($routeParams.status=='inactive') {
                    return messages.headerProductInActive;
                }else{
                    return messages.headerProductAll;
                }
            }

            //
            $scope.getProductStatus = function()
            {
	        if ($routeParams.status=='active' || $routeParams.status=='all' || !($routeParams.status)) {
                    return true;
                }else if ($routeParams.status=='inactive') {
                    return false;
                }
            }

            //
            $scope.getNoProductsHeader = function()
            {
                if ($routeParams && ($routeParams.date || $routeParams.cat || $routeParams.scol || $routeParams.skey || $routeParams.inv)) {
                    return messages.noProductsHeaderTextFilter;
                }else if ($routeParams.status=='active' || !($routeParams.status)) {
                    return messages.noProductsHeaderTextActive;
                }else if ($routeParams.status=='inactive') {
                    return messages.noProductsHeaderTextInactive;
                }else{
                    return messages.noProductsHeaderTextAll;
                }
            }

            $scope.getNoProductsSubMessage = function()
            {
                if ($routeParams && ($routeParams.date || $routeParams.cat || $routeParams.scol || $routeParams.skey || $routeParams.inv)) {
                    return messages.noProductsHeaderSubTextFilter;
                }else if ($routeParams.status=='active' || !($routeParams.status)) {
                    return messages.noProductsHeaderSubTextActive;
                }else if ($routeParams.status=='inactive') {
                    return messages.noProductsHeaderSubTextInactive;
                }else{
                    return messages.noProductsHeaderSubTextAll;
                }
            }

            $scope.getCurrentStatus = function() {
                
                if((!$routeParams.status)||($routeParams && $routeParams.status=='active')){
                    $scope.popUpCondition='inactive';
                    return 'Inactive';
                }
                else if ($routeParams && $routeParams.status=='inactive'){
                    $scope.popUpCondition='active';
                    return 'Active';
                }
            }

            // For getting the header title

            $scope.getTitleText = function() {
                if ($routeParams.status=='active' || !($routeParams.status)) {
                    return messages.headerTitleProductActive;
                }else if ($routeParams.status=='inactive') {
                    return messages.headerTitleProductInActive;
                }else{
                    return messages.headerTitleProductAll;
                }
            }
            
            $scope.isOptionVisible = function (option) {
                
                switch (option) {
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
                    return ($routeParams.status == 'all' || ($routeParams.status != 'active' && $routeParams.status != 'archived' && $location.path()!='/products'));
                    break;
                case 'inactive':
                    return ($routeParams.status == 'all' || $routeParams.status != 'inactive' && $routeParams.status != 'archived');
                    break;
                case 'archived':
                    return ($routeParams.status != 'archived');
                    break;
                case 'restore':
                    return ($routeParams.status == 'archived');
                    break;
                case 'inventory':
                    return ($routeParams.status != 'inactive' && $routeParams.status != 'archived');
                    break;
                default:
                    return true;
                }
            }
            
            $scope.disableActionLinks = function(val,allLink) {

                if(!val){
                    return 'disableRemovalOrder';    
                }else if($routeParams && ($routeParams.status=='all' || $routeParams.status=='inactive' || $routeParams.status=='active') && allLink){
                    return 'disableRemovalOrder';    
                }else if(!$routeParams.status && allLink){
                    return 'disableRemovalOrder';    
                }else {
                    return '';
                }
                

            }
            
            $scope.sortOptionVisible = function (option) {

                switch (option) {
                case 'inventoryAlertLevel':
                case 'qtyInShipment':
                case 'qtyDamaged':
                case 'qtyFulfillable':
                    return false;
                    break;
                case 'dateInActive':
                    return ($routeParams.status == 'inactive');
                    break;
                default:
                    return true;
                }
            }

            $scope.getCircle = function (val) {
                if (val == 0 || val == 2) {
                    return false;
                }
                if (val == 1) {
                    return true;
                }
            }

            $scope.getInventoryAlertLevel = function (val) {

                if (val || val == '0') {
                    return val;
                } else {
                    return $constants.notAvailableText;
                }
            }

            $scope.createdText = function () {
                
                if ($routeParams.status == 'inactive') {
                    $scope.showInactive = true;
                    $scope.showCreated = false;
                } else {
                    $scope.showCreated = true;
                    $scope.showInactive = false;
                }
            }
            
            $scope.createdDates = function (option) {
                
                if ($routeParams.status == 'inactive') {
                    var inactDate = (option.dateInactive)?option.dateInactive:$constants.notAvailableText;
                    return inactDate;
                } else {
                    var actDate = (option.createdDate)?option.createdDate:$constants.notAvailableText;
                    return actDate;
                }
            };

            $scope.closeUpdateModal = function() {
                $('#prod-bulk-approve').modal('hide');
                $('.modal-backdrop.fade.in').remove();
                $location.path($rootScope.bulkProdUpdate.status ? '/products/active' : '/products/inactive');
            };

            $scope.closeArchiveModal = function() {
                $('#prod-bulk-archive').modal('hide');
                $('.modal-backdrop.fade.in').remove();
                $scope.getPagedDataAsync();
                $rootScope.getProductsCount();
                $scope.toggleCheckBoxVal = false;
            };

            $('#prod-bulk-approve').on('hidden.bs.modal', function (e) {
                $location.path($rootScope.bulkProdUpdate.status ? '/products/active' : '/products/inactive');
                $scope.$apply();
            });

            $scope.getBulkApprovePercentage = function(key) {
                if (!$rootScope.bulkProdUpdate) return;
                if      (key == 'total')    return Math.round(($rootScope.bulkProdUpdate.prodsSuccess + $rootScope.bulkProdUpdate.prodsFailed) / ($rootScope.bulkProdUpdate.totalProdsCount)*100);
                else if (key == 'success')  return Math.round($rootScope.bulkProdUpdate.prodsSuccess  / $rootScope.bulkProdUpdate.totalProdsCount*100);
                else if (key == 'failed')   return Math.round($rootScope.bulkProdUpdate.prodsFailed   / $rootScope.bulkProdUpdate.totalProdsCount*100)
            }

            $scope.changeProdStauts = function(isActive) {

                $rootScope.prods = [];
                angular.forEach($scope.myData, function(prod) {
                    if (prod.Selected && prod.isActive != isActive) {
                        $rootScope.prods.push(prod.fbspSkuId)
                    }
                });
                if ($rootScope.prods.length == 0) return;
                $('#prod-bulk-approve').modal();
                $rootScope.isBulkProductUpdating = true;
                $rootScope.activateOverlay = true;
                var totalCount = $rootScope.prods.length;
                $rootScope.bulkProdUpdate = {
                    totalProdsCount:totalCount,
                    prodsSuccess:0,
                    prodsFailed:0,
                    prodsHitCount:0,
                    slicedProdsLength:0,
                    response:[],
                    successSKU:[],
                    failedSKU:[],
                    status:isActive
                };

                var changeStatus = function () {
                    var slicedProds = [];
                    if ($rootScope.prods.length > 5) {
                        slicedProds = $rootScope.prods.slice(0, 5);
                        $rootScope.prods.splice(0,5);
                    }
                    else slicedProds = angular.copy($rootScope.prods);
                    $rootScope.bulkProdUpdate.slicedProdsLength = slicedProds.length;


                    angular.forEach(slicedProds, function(fbsku) {
                        $bus.fetch({
                            name: 'updateProductStatus',
                            api: 'updateProductStatus',
                            params: {
                                fbspSkuId: fbsku,
                                isActive: isActive ? 1 : 0
                            },
                            data: null
                        })
                            .done(function (success) {
                                if (success && success.response && success.response.status == 'Exception') {
                                    $rootScope.bulkProdUpdate.prodsFailed++;
                                    $rootScope.bulkProdUpdate.response.push(success);
                                    $rootScope.bulkProdUpdate.prodsHitCount++;
                                    var failureMsg;
                                    angular.forEach(success.response.errors, function(value, key){
                                        failureMsg = value;
                                    })
                                    $rootScope.bulkProdUpdate.failedSKU.push(success.params.fbspSkuId + ' - ' + failureMsg);

                                    ngProgress.complete();
                                    if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                        if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                            $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                            changeStatus();
                                        }
                                        else {
                                            //(isActive) ? $location.path('/products/active') : $location.path('/products/inactive');
                                            console.log('total prods updated :' + $rootScope.bulkProdUpdate.totalProdsCount + '\nSuccess Count :' + $rootScope.bulkProdUpdate.prodsSuccess + '\nFailure Count :' + $rootScope.bulkProdUpdate.prodsFailed);
                                            $rootScope.isBulkProductUpdating = false;
                                            $rootScope.activateOverlay = false;
                                        }
                                    }
                                } else {
                                    $rootScope.bulkProdUpdate.prodsSuccess++;
                                    $rootScope.bulkProdUpdate.response.push(success);
                                    $rootScope.bulkProdUpdate.prodsHitCount++;
                                    $rootScope.bulkProdUpdate.successSKU.push(success.params.fbspSkuId);
                                    ngProgress.complete();
                                    if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                        if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                            $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                            changeStatus();
                                        }
                                        else {
                                            //(isActive) ? $location.path('/products/active') : $location.path('/products/inactive');
                                            console.log('total prods updated :' + $rootScope.bulkProdUpdate.totalProdsCount + '\nSuccess Count :' + $rootScope.bulkProdUpdate.prodsSuccess + '\nFailure Count :' + $rootScope.bulkProdUpdate.prodsFailed);
                                            $rootScope.isBulkProductUpdating = false;
                                            $rootScope.activateOverlay = false;
                                        }

                                    }
                                }


                            }).fail(function (error) {
                                $rootScope.bulkProdUpdate.prodsFailed++;
                                $rootScope.bulkProdUpdate.response.push(error);
                                $rootScope.bulkProdUpdate.prodsHitCount++;
                                $rootScope.bulkProdUpdate.failedSKU.push(error.params.fbspSkuId);
                                ngProgress.complete();
                                if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                    if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                        $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                        changeStatus();
                                    }
                                    else {
                                        //(isActive) ? $location.path('/products/active') : $location.path('/products/inactive');
                                        console.log('total prods updated :' + $rootScope.bulkProdUpdate.totalProdsCount + '\nSuccess Count :' + $rootScope.bulkProdUpdate.prodsSuccess + '\nFailure Count :' + $rootScope.bulkProdUpdate.prodsFailed);
                                        $rootScope.activateOverlay = false;
                                    }
                                }
                            });
                    });
                };
                changeStatus();
            };

            $scope.changeProdStautsArchiveClick = function() {

                $('#confirm-modal-archive').modal();

                $('#modalCancel-archive,.model-close').on('click',function(e){
                    $('#modalOk-archive').off('click');
                }); 

                $('#modalOk-archive').on('click',function(e){
                    $('#modalCancel-archive').click();
                    $('.modal-backdrop.fade.in').remove();
                    $('#modalOk-archive').off('click');
                    $scope.changeProdStautsArchive();
                });

            }

            $scope.changeProdStautsArchive = function() {

                $rootScope.prods = [];
                angular.forEach($scope.myData, function(prod) {
                    if (prod.Selected) {
                        $rootScope.prods.push(prod.fbspSkuId)
                    }
                });
                if ($rootScope.prods.length == 0) return;
                $('#prod-bulk-archive').modal();
                $rootScope.isBulkProductUpdating = true;
                $rootScope.activateOverlay = true;
                var totalCount = $rootScope.prods.length;
                $rootScope.bulkProdUpdate = {
                    totalProdsCount:totalCount,
                    prodsSuccess:0,
                    prodsFailed:0,
                    prodsHitCount:0,
                    slicedProdsLength:0,
                    response:[],
                    successSKU:[],
                    failedSKU:[],
                    status:''
                };

                var changeStatus = function () {
                    var slicedProds = [];
                    if ($rootScope.prods.length > 5) {
                        slicedProds = $rootScope.prods.slice(0, 5);
                        $rootScope.prods.splice(0,5);
                    }
                    else slicedProds = angular.copy($rootScope.prods);
                    $rootScope.bulkProdUpdate.slicedProdsLength = slicedProds.length;


                    angular.forEach(slicedProds, function(fbsku) {
                        $bus.fetch({
                            name: 'editproducts',
                            api: 'editproducts',
                            params: null,
                            data: {
                                fbspSkuId: fbsku,
                                archived: 1
                            }
                        })
                            .done(function (success) {
                                if (success && success.response && success.response.status == 'Exception') {
                                    $rootScope.bulkProdUpdate.prodsFailed++;
                                    $rootScope.bulkProdUpdate.response.push(success);
                                    $rootScope.bulkProdUpdate.prodsHitCount++;
                                    var failureMsg;
                                    angular.forEach(success.response.errors, function(value, key){
                                        failureMsg = value;
                                    })

                                    $rootScope.bulkProdUpdate.failedSKU.push(fbsku + ' - ' + failureMsg);

                                    ngProgress.complete();
                                    if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                        if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                            $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                            changeStatus();
                                        }
                                        else {
                                            $rootScope.isBulkProductUpdating = false;
                                            $rootScope.activateOverlay = false;
                                        }
                                    }
                                } else {
                                    $rootScope.bulkProdUpdate.prodsSuccess++;
                                    $rootScope.bulkProdUpdate.response.push(success);
                                    $rootScope.bulkProdUpdate.prodsHitCount++;
                                    $rootScope.bulkProdUpdate.successSKU.push(fbsku);
                                    ngProgress.complete();
                                    if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                        if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                            $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                            changeStatus();
                                        }
                                        else {
                                            $rootScope.isBulkProductUpdating = false;
                                            $rootScope.activateOverlay = false;
                                        }

                                    }
                                }


                            }).fail(function (error) {
                                $rootScope.bulkProdUpdate.prodsFailed++;
                                $rootScope.bulkProdUpdate.response.push(error);
                                $rootScope.bulkProdUpdate.prodsHitCount++;
                                $rootScope.bulkProdUpdate.failedSKU.push(error.params.fbspSkuId);
                                ngProgress.complete();
                                if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                    if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                        $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                        changeStatus();
                                    }
                                    else {
                                        $rootScope.activateOverlay = false;
                                    }
                                }
                            });
                    });
                };
                changeStatus();
            };

            $scope.toggleCheckBox = function () {

                $scope.toggleCheckBoxVal = ($scope.toggleCheckBoxVal) ? true : false;
                angular.forEach($scope.myData, function (product) {
                    product.Selected = $scope.toggleCheckBoxVal;
                });

            }

            $scope.showingSizeRowsProducts = function () {

                if ($routeParams.status == 'all' && $routeParams.status != '') {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[-1] : "0";

                } else if ($routeParams.status == 'active' && $routeParams.status != '') {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[1] : "0";

                } else if ($routeParams.status == 'inactive' && $routeParams.status != '') {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[0] : "0";

                } else {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[1] : "0";
                }

            }

            $scope.$watch('myData', function (items) {
                var indItemSelected = 0;
                angular.forEach(items, function (items) {
                    $scope.appendProducts(items);
                    indItemSelected += items.Selected ? 1 : 0;
                });

                $scope.showSelectedLength = indItemSelected;
                ($scope.showSelectedLength) ? $scope.showSelected = 1 : $scope.showSelected = 0;


            }, true);
            
            $scope.appendProducts = function(val) {
                   
                   if($.inArray(val.fbspSkuId,$rootScope.appendProductsArray)!=-1 && !val.Selected && val.fbspSkuId) {
                        $rootScope.appendProductsArray = jQuery.grep($rootScope.appendProductsArray, function(value) {
                            return value != val.fbspSkuId;
                        });
                    }
                    else if($.inArray(val.fbspSkuId,$rootScope.appendProductsArray)==-1 && val.Selected && val.fbspSkuId) {

                        $rootScope.appendProductsArray.push(val.fbspSkuId);

                    }

                    if($.inArray(val.fbspSkuId,$rootScope.appendOrdersArray)!=-1 && !val.Selected && val.fbspSkuId) {
                        $rootScope.appendOrdersArray = jQuery.grep($rootScope.appendOrdersArray, function(value) {
                            return value != val.fbspSkuId;
                        });
                    }
                    else if($.inArray(val.fbspSkuId,$rootScope.appendOrdersArray)==-1 && val.Selected && val.fbspSkuId) {

                        $rootScope.appendOrdersArray.push(val.fbspSkuId);

                    }
			}
           
            $scope.highlightSuggest = function (str, match) {
                if (str && match) {
                    var regex = new RegExp("(" + match + ")", 'gi');
                    return str.replace(regex, '<strong>$1</strong>');
                }
                return str;
            }

            $scope.readQueryParam = function (param) {
                var deferred = $.Deferred();
                $timeout(function () {
                    $scope.sortingOptions.field = $localStorage.pagingOptions.products.sortingOption;
                    $scope.sortingOptions.name = _.findWhere($constants.productSortingOptions, {"value": $scope.sortingOptions.field}).name;
                    param.fromdate ? $scope.fromdate = param.fromdate : '';
                    param.todate ? $scope.todate = param.todate : '';
                    param.skey ? $scope.searchKey = param.skey : '';
                    _.map($scope.categoryOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.dateOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.inventoryOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.productFilterOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    if (param.cat) {
                        _(param.cat.split(',')).forEach(function (cat) {
                            var cat = _.findWhere($scope.categoryOptions, {
                                "value": cat
                            });
                            if (cat) cat.ticked = true;
                        });
                    }
                    if (param.inv) {
                        _(param.inv.split(',')).forEach(function (inv) {
                            var inv = _.findWhere($scope.inventoryOptions, {
                                "value": inv
                            });
                            if (inv) inv.ticked = true;
                        });
                    }
                    if (param.scol) {
                        var scol = _.findWhere($scope.productFilterOptions, {
                            "value": param.scol
                        });
                        if (scol) scol.ticked = true;
                    } else {
                        var scol = _.findWhere($scope.productFilterOptions, {
                            "value": "all"
                        });
                        if (scol) scol.ticked = true;
                    }
                    if (param.date) {
                        var date = _.findWhere($scope.dateOptions, {
                            "value": param.date
                        });
                        if (date) {
                            date.ticked = true;
                            $scope.date[0] = date;
                        }
                    }
                    deferred.resolve();
                });
                return deferred.promise();
            }

            $scope.resetFilter = function () {
                
                var resetQueryForm = $scope.getQueryParam();
                var resetQuery = (resetQueryForm.p ? 'p=' + resetQueryForm.p + '&' : '')+(resetQueryForm.rcd ? 's=' + resetQueryForm.rcd + '&' : '')+(resetQueryForm.sortcol ? 'f=' + resetQueryForm.sortcol + '&' : '')+(resetQueryForm.sortmethod ? 'd=' + resetQueryForm.sortmethod + '&' : '');
                
                $location.url((resetQuery)?$location.path() + '?' +resetQuery:$location.path());
                $scope.readQueryParam($routeParams);
                $scope.searchKey = ""; // added
                $scope.date = [];
                //$scope.form.$setPristine(); // added

                $timeout(function() {
                    $scope.rangepicker =  $('.input-daterange').datepicker({
                        inputs: $('#date-range-from, #date-range-to'),
                        format: "dd/mm/yyyy",
                        endDate: new Date(),
                        todayHighlight:true
                    });
                    $('#date-range-from').datepicker('update', ($scope.formatDate(new Date())));
                    $('#date-range-to').datepicker('update', ($scope.formatDate(new Date())));
                    $('.input-daterange').datepicker('updateDates');    
                }, 100);
                

            };

            $scope.applyFilter = function (applyClicked) {
                
                var totalPageCount = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                var pageToFetch = ($scope.pagingOptions.currentPage > totalPageCount) ? totalPageCount : $scope.pagingOptions.currentPage;
                pageToFetch = (applyClicked)?'1':pageToFetch;
                
                var filterQuery = $routeParams;
                
                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') + (((applyClicked || (filterQuery.scol && filterQuery.skey))&& $scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&' : '') + (((applyClicked || filterQuery.skey) && $scope.searchKey) ? 'skey=' + $scope.searchKey + '&' : '') + (((applyClicked || (filterQuery.date)) && $scope.date.length) ? 'date=' + _.pluck($scope.date, 'value') + '&' : '') + (((applyClicked || filterQuery.fromdate)&& $scope.date.length && $scope.date[0].value == 'custom' && $scope.fromdate) ? 'fromdate=' + $scope.fromdate + '&' : '') + (((applyClicked || filterQuery.todate)&& $scope.date.length && $scope.date[0].value == 'custom' && $scope.todate) ? 'todate=' + $scope.todate + '&' : '') + (((applyClicked || filterQuery.cat)&& $scope.category.length) ? 'cat=' + _.pluck($scope.category, 'value') + '&' : '') + (((applyClicked || filterQuery.inv) && $scope.inventory.length) ? 'inv=' + _.pluck($scope.inventory, 'value') + '&' : '') + ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') + ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction : '');
                
                if (query && ($location.url() != $location.path() + '?' + query)) {
                    $location.url($location.path() + '?' + query);
                    $scope.readQueryParam($routeParams);
                }
            };

            $scope.getQueryParam = function () {
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);
                $scope.pagingOptions.pageSize = $scope.showingSize = $localStorage.pagingOptions.products.pageSize;


                var params = {
                    status: $routeParams.status ? _.findWhere($scope.productStatus, {
                        "name": $routeParams.status
                    }).value : null,
                    p: $routeParams.p || null,
                    rcd: $scope.pagingOptions.pageSize || null,
                    scol: $routeParams.scol || null,
                    skey: $routeParams.skey || null,
                    date: $routeParams.date || null,
                    fromdate: $routeParams.fromdate || null,
                    todate: $routeParams.todate || null,
                    cat: $routeParams.cat || null,
                    inv: $routeParams.inv || null,
                    sortcol: $localStorage.pagingOptions.products.sortingOption || null,
                    sortmethod: $localStorage.pagingOptions.products.sortDir || null
                };
                return _.omit(params, function (value, key) {
                    return !value || (key == 'inv' && value == 'all') || (key == 'date' && value == 'all') || (key == 'inv' && value == 'none') || (key == 'date' && value == 'none');
                });
            }
            $scope.formatDate = function (nowTemp) {
                var dd = nowTemp.getDate();
                var mm = nowTemp.getMonth() + 1; //January is 0!
                var yyyy = nowTemp.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }

                return dd + '/' + mm + '/' + yyyy;
            }

             $scope.today = $scope.formatDate(new Date());
            
             $scope.fromdate = $scope.today;
             $scope.todate = $scope.today;

             
            /*$scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();

                    var binddate = $scope.formatDate(nowTemp);

                    $scope.fromdate = binddate;
                    $scope.todate = binddate;

                    var checkin = $('#product-search-fromdate').datepicker({
                        endDate:new Date(),
                        todayHighlight: true
                    }).on('changeDate', function (ev) {
                        $scope.fromdate = $scope.formatDate(ev.date);
                        $scope.todate = $scope.formatDate(ev.date);
                        checkout.setValue(ev.date);
                        checkout.setStartDate(ev.date);
                        checkin.hide();
                        $('#product-search-todate')[0].focus();
                    }).data('datepicker');
                    var checkout = $('#product-search-todate').datepicker({
                        endDate:new Date(),
                        todayHighlight: true,
                        onRender: function (date) {
                            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                        }
                    }).on('changeDate', function (ev) {
                        checkout.hide();
                        $scope.todate = $scope.formatDate(ev.date);
                    }).data('datepicker');

                    var fromDate = $routeParams.fromdate ? new Date($routeParams.fromdate.split('/')[2] + '-' + $routeParams.fromdate.split('/')[1] + '-' + $routeParams.fromdate.split('/')[0]) : nowTemp;
                    var toDate = $routeParams.todate ? new Date($routeParams.todate.split('/')[2] + '-' + $routeParams.todate.split('/')[1] + '-' + $routeParams.todate.split('/')[0]) : nowTemp;
                    checkin.setValue(fromDate);
                    // newDate.setDate(newDate.getDate() + 1);
                    checkout.setValue(toDate);
                });
            }*/

            $scope.getSuggestionStatus = function() {
                if ((_.isEmpty($routeParams)) || ($routeParams && $routeParams.status=='active')) {
                    return '1';
                }else if ($routeParams && $routeParams.status=='inactive') {
                    return '0';
                }
            }
            
            $scope.suggestions = [];

            $scope.findSuggestion = function (txt, col) {
                $scope.emptySuggestions = false;
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: 'suggestproducts',
                                api: 'suggestproducts',
                                params: {
                                    skey: txt,
                                    scol: col[0].value,
                                    status: $scope.getSuggestionStatus()
                                },
                                data: null
                            })
                                .done(function (success) {
                                    if (success.response && success.response.data && success.response.data.docs){
                                        if (success.response.data.docs.length) {
                                            $('#product-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
                                            $timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        }else{
                                            $('#product-search-suggestion').hide();
                                            $scope.emptySuggestions = true;    
                                        }
                                    }
                                });
                        }
                    }, 300, false);
                } else {
                    $scope.suggestions.length = 0;
                }
            }

            $scope.attachEventsForTypeAhead = function () {
                
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #product-search-text, div.nano-pane, div.nano-slider").click(function (e) {
                    if(($(e.target).attr('class'))=='nano-pane' || ($(e.target).attr('class'))=='nano-slider'){
                        return false;
                        $('div.nano-pane, div.nano-slider').scroll(function() {
                            return false;
                        });
                    }
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.sortLogo = function () {
                return ($localStorage.pagingOptions.products.sortDir == 'asc') ? true : false;
            }

            $scope.paging = function (page, index) {

                if (index == 'last') {
                    page = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                }

                if ($scope.pagingOptions.currentPage != page && page > 0) {

                    $scope.pagingOptions.currentPage = page;
                    $scope.applyFilter();
                }
                $scope.pagingOptions.currentPage = (page > 0) ? page : $scope.pagingOptions.currentPage;
            }

            $scope.getPagingNum = function (currentPage, index) {
                return (currentPage + index);
            }

            $scope.setPageSizeClickLength = function () {
                var totalPages = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                $scope.pageSize = {
                    pageSizeClickLength: []
                }
                $scope.pageSize.pageSizeClickLength = [];

                //last
                if ($scope.pagingOptions.currentPage == totalPages) {
                    var count = 0;
                    for (var i = totalPages; i > 0; i--) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.unshift(i);
                        if (count == 5) break;
                    }
                }

                //first
                else if ($scope.pagingOptions.currentPage == 1) {
                    var count = 0;
                    for (var i = 1; i <= totalPages; i++) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.push(i);
                        if (count == 5) break;
                    }
                }

                //In - Between
                else {
                    var diffToStart, diffToEnd, count = 0,
                        startClickLength;
                    diffToStart = $scope.pagingOptions.currentPage - 1;
                    diffToEnd = totalPages - $scope.pagingOptions.currentPage;
                    if (totalPages <= 5 || diffToStart <= 2) startClickLength = 1;
                    else if (diffToStart >= 2 && diffToEnd >= 2) startClickLength = $scope.pagingOptions.currentPage - 2;
                    else if (diffToEnd < 2) startClickLength = $scope.pagingOptions.currentPage - 3;

                    for (var i = startClickLength; i <= totalPages; i++) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.push(i);
                        if (count == 5) break;
                    }
                }
            }

            $scope.tickSelection = function(options, tickIndex) {
                if (!$scope.date) $scope.date = [];
                $scope.date[0] = options[tickIndex];
                angular.forEach($scope.dateOptions, function(option, index){
                    if (index == tickIndex) {
                        $scope.dateOptions[index].ticked = true;
                    }
                    else $scope.dateOptions[index].ticked = false;
                });
            };

            $scope.showRangePicker = function() {
                $timeout(function () {
                    $scope.rangepicker;
                    $scope.isRangepickerShowing = !$scope.isRangepickerShowing;
                    if (!$scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.hide();
                    else if ($scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.show();

                    $scope.rangepicker =  $('.input-daterange').datepicker({
                        inputs: $('#date-range-from, #date-range-to'),
                        format: "dd/mm/yyyy",
                        endDate: new Date(),
                        todayHighlight:true

                    }).on('changeDate', function (ev) {
                        $scope.$apply();
                        if ($('#date-range-from').datepicker('getDate') != "Invalid Date" && $('#date-range-to').datepicker('getDate') != "Invalid Date") {
                            $scope.fromdate = $scope.formatDate($('#date-range-from').datepicker('getDate'));
                            $scope.todate   = $scope.formatDate($('#date-range-to').datepicker('getDate'));
                        }
                        else if ($('#date-range-from').datepicker('getDate') == "Invalid Date" && $('#date-range-to').datepicker('getDate') != "Invalid Date") {
                            $scope.fromdate = $scope.formatDate($('#date-range-to').datepicker('getDate'));
                            $scope.todate   = $scope.formatDate($('#date-range-to').datepicker('getDate'));
                        }
                        else {
                            $scope.fromdate = $scope.formatDate(($('#date-range-from').datepicker('getDate') != "Invalid Date")? $('#date-range-from').datepicker('getDate'): new Date());
                            $scope.todate = ($('#date-range-to').datepicker('getDate') != "Invalid Date") ? $scope.formatDate($('#date-range-to').datepicker('getDate')) : $scope.fromdate;
                        }
                        $('#date-range-from').datepicker('update', $scope.fromdate);
                        $('#date-range-to').datepicker('update', $scope.todate);
                        $('.input-daterange').datepicker('updateDates');
                    });

                    $('#date-range-from').datepicker('update', ($scope.fromdate || $scope.formatDate(new Date())));
                    $('#date-range-to').datepicker('update', ($scope.todate || $scope.formatDate(new Date())));
                    $('.input-daterange').datepicker('updateDates');

                });
            };

            $('html').click(function (e) {
                if ($scope.rangepicker && ($(e.target).closest(".dropdown-submenu").length ||
                    $(e.target).hasClass('day') || $(e.target).hasClass('month') || $(e.target).hasClass('year'))) {
                    e.stopPropagation();
                    $scope.tickSelection($scope.dateOptions, 8);
                }
            });

            $scope.editProduct = function () {
                var prodSKUs = [];
                angular.forEach($scope.myData, function(item) {
                    prodSKUs.push(item.fbspSkuId);
                });
                $rootScope.prodSKUs = prodSKUs;
            };


            $scope.getProductScrollClassTop = function(){
                if(Number($(document).width() >= 992))
                    return '';
                else
                    return 'productsPageScroll nano';
            }
            $scope.getProductScrollClassBot = function(){
                if(Number($(document).width() >= 992))
                    return '';
                else
                    return 'nano-content';
            }

            $scope.init = function () {

                $scope.date = [];
                //$scope.dateinit();
                $scope.attachEventsForTypeAhead();
                $rootScope.getProductsCount();
                $scope.readQueryParam($routeParams).done(function(){
                    $scope.showRangePicker();
                });
                $scope.totalServerItems = 0;
                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });

                $scope.pagingOptions = {
                    pageSizes: [10, 25, 50, 100],
                    pageSize: $localStorage.pagingOptions.products.pageSize,
                    currentPage: 1
                };

                $scope.pageSize = {
                    pageSizeClickLength: [1]
                };

               
                $scope.sortingOptions = {
                    field: 'modifiedDate',
                    name: 'Modified Date',
                    direction: 'desc'
                };
                $scope.sortingOptions.direction = $localStorage.pagingOptions.products.sortDir;


                $scope.setPagingData = function (data, page, pageSize, totalSize) {
                    $scope.myData = data;
                    $scope.totalServerItems = totalSize;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };
                
                $scope.getPagedDataAsync = function () {

                    var deferred = $.Deferred();

                    ngProgress.start();
                    
                    $scope.loading = {
                        nodata : false,
                        load : true
                    }
                    
                    $bus.fetch({
                        name: 'products',
                        api: 'products',
                        params: $scope.getQueryParam(),
                        data: null
                    })
                        .done(function (success) {
                           
                            $scope.loading = {
                                nodata : true,
                                load : false
                            }
                            
                            if (success.response && success.response.success.length) {
                               
                                var products = [];
                                var data = success.response.data;
                                //notify.message(messages.retrivedSuccess,true);
                                if (data && data.products) {
                                    if (!_.isArray(data.products)) {
                                        _.forEach(data.products, function (product) {
                                            products.push(product)
                                        });
                                    } else {
                                        products = data.products;
                                    }
                                    $scope.fromRecord = Number(data.fromRecord);
                                    $scope.toRecord = Number(data.toRecord);
                                    $scope.totalRecord = Number(data.totalRecords);
                                    $scope.setPagingData(products, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
                                    $scope.setPageSizeClickLength();
                                }
                            } else {
                                $scope.myData = [];
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //notify.message(messages.productListFetchError);
                                }
                            }
                            ngProgress.complete();
                            deferred.resolve();
                        }).fail(function (error) {
                            
                            $scope.loading = {
                                nodata : true,
                                load : false
                            }
                            
                            //notify.message(messages.productListFetchError);
                            ngProgress.complete();
                            deferred.reject();
                        });

                        return deferred.promise();
                };
                $scope.getPagedDataAsync().done(function(){
                    $timeout(function() {
                        $(".productsPageScroll.nano").nanoScroller({ flash: true,preventPageScrolling: true,iOSNativeScrolling: true});
                    }, 500);
                });
                $scope.$watch('pagingOptions', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                        $scope.showingSize = newVal.pageSize;
                        $localStorage.pagingOptions.products.pageSize = newVal.pageSize;
                        $scope.applyFilter();
                        //$scope.showingSize=product.selected;
                        //$scope.getPagedDataAsync();
                    }
                }, true);
                
                $('body').on('mouseover','.disableRemovalOrder',function(e) {
                    $(this).attr('href','javascript:;');
                });
                
                $timeout(function(){
                    $('.timeago').timeago();
                    $('.timeago').mouseover(function(){
							$(this).attr('title','');		
						});
                },1000);
                
                $timeout(function(){
                    $.timeago.settings.strings.suffixAgo = "ago";
                    if($('.row').hasClass('highlightAddedRow')){
                      $('.row').removeClass('highlightAddedRow');
                            $rootScope.highlightCreated = [];
                    }
                },5000);
                
                $rootScope.appendProductsArray = $rootScope.appendOrdersArray = [];
                
                $scope.createdText();

                $scope.prodFullEdit = false;
                
                if($rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length){
                    $scope.prodFullEdit = true;
                }
                
            };

    }]);
});