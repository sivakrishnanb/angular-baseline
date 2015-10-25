define(['app', 'model/shipments/details', 'downloader', 'utility/restapi', 'utility/messages'], function (app, model, downloader, restapi, messages) {
    app.controller('ViewShipments', ['$window','$scope', '$bus', 'ngProgress', '$constants', '$routeParams', 'toaster', '$rootScope','notify','highlight','$location',
        function ($window,$scope, $bus, ngProgress, $constants, $routeParams, toaster, $rootScope,notify,highlight,$location) {

            $scope.constants = $constants;

            $scope.statusTxt = "";
            $scope.labelTxt = "";
            $scope.getStatus = function (id) {
                $scope.statusTxt = _.findWhere($constants.shipmentStatus, {
                    "value": id.toString()
                }) ? _.findWhere($constants.shipmentStatus, {
                    "value": id.toString()
                }).display : $constants.notAvailable;
            }

            $scope.getLabel = function (code) {
                $scope.labelTxt = _.findWhere($constants.labelList, {
                    "value": code
                }) ? _.findWhere($constants.labelList, {
                    "value": code
                }).name : $constants.notAvailable;
            }
			
			$scope.getCountryName = function (code) {
				
                $rootScope.getCountryList().done(function () {
                    $scope.model.header.addressCountryName = _.findWhere($rootScope.countryList, {
                        "countryCode": code
                    }) ? _.findWhere($rootScope.countryList, {
                        "countryCode": code
                    }).countryName : $constants.notAvailable;
                });
            }

            $scope.getDescText = function()
            {
               
                if($scope.statusTxt=='In Transit')
                        return messages.headerShipViewInTransit;
                else if($scope.statusTxt=='Received')
                      return messages.headerShipViewReceived;
                else if($scope.statusTxt=='Cancelled')
                      return messages.headerShipCancelled;
            }

            $scope.getReceivedDamagedRow = function(product) {
                
                if(!_.isEmpty(product) && !_.isEmpty($scope.model) && $scope.model.header.status==3) {
                    if((product.quantity > product.receivedQty)||(product.damagedQty > 0))
                        return 'fullfillableRow';
                }
            };

            $scope.cancel = function () {
                //var answer = confirm(messages.shipmentCancelConfirm) commentd
                //event.preventDefault();
                    
                    $('#confirm-shipcancel-modal').modal();
                    
                    $('#shipcancel-modalCancel,#shipcancel-model-close').on('click',function(e){
                        $('#shipcancel-modalOk').off('click');
                    }); 
                        
                    $('#shipcancel-modalOk').on('click',function(e){
                        // $scope.productEdited = true; commented
                        
                        var request = {
                            inboundCode: $scope.model.header.inboundCode,
                            isCancel: 1
                        }
                        $bus.fetch({
                            name: 'editshipments',
                            api: 'editshipments',
                            params: null,
                            data: JSON.stringify(request)
                        })
                            .done(function (success) {
                                if (success.response.success.length && success.response.data && success.response.data.shipment) {
                                    $scope.model.header.cancelledDate = success.response.data.shipment.header.cancelledDate;
                                    $scope.model.header.status = success.response.data.shipment.header.status;
                                    //toaster.pop("success", messages.shipmentCancelSuccess); commented
									highlight.added($scope.model.header.inboundCode);
                                    notify.message(messages.shipmentCancelSuccess,'','succ');
									$location.path('shipments/cancelled');

                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        //toaster.pop("error", errors.join(', '), '', 0); commented
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        //toaster.pop("error", messages.shipmentCancelError, "", 0); commented
                                        notify.message(messages.shipmentCancelError);
                                    }
                                }
                            }).fail(function (error) {
                                //toaster.pop("error", messages.shipmentCancelError); commented
                                notify.message(messages.shipmentCancelError);
                            });
                        $('#shipcancel-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#shipcancel-modalOk').off('click');
                    });
					
					$('#confirm-shipcancel-modal').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#shipcancel-modalOk').click();
                        }
                    });
            }

            $scope.restore = function () {
                //var answer = confirm(messages.shipmentRestoreConfirm) commented
                //event.preventDefault();
                    
                    $('#confirm-shiprestore-modal').modal();
                    
                    $('#shiprestore-modalCancel,#shiprestore-model-close').on('click',function(e){
                        $('#shiprestore-modalOk').off('click');
                    }); 
                        
                    $('#shiprestore-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        var request = {
                            inboundCode: $scope.model.header.inboundCode,
                            isRestore: 1
                        }
                        $bus.fetch({
                            name: 'editshipments',
                            api: 'editshipments',
                            params: null,
                            data: JSON.stringify(request)
                        })
                            .done(function (success) {
                                if (success.response.success.length && success.response.data && success.response.data.shipment) {
                                    $scope.model.header.cancelledDate = success.response.data.shipment.header.cancelledDate;
                                    $scope.model.header.status = success.response.data.shipment.header.status;
                                    //toaster.pop("success", messages.shipmentRestoreSuccess); commented
                                    notify.message(messages.shipmentRestoreSuccess,'','succ');
                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        //toaster.pop("error", errors.join(', '), '', 0); commented
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        //toaster.pop("error", messages.shipmentRestoreError, "", 0); commented
                                        notify.message(messages.shipmentRestoreError);
                                    }
                                }
                            }).fail(function (error) {
                                //toaster.pop("error", messages.shipmentRestoreError); commented
                                notify.message(messages.shipmentRestoreError);
                            });
                        $('#shiprestore-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#shiprestore-modalOk').off('click');
                    });
					
					$('#confirm-shiprestore-modal').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#shiprestore-modalOk').click();
                        }
                    });
            }

            $scope.getFileUrl = function (type, label) {
                if (type) {
                    var url = $constants.baseUrl + restapi[label].url + '?inboundCode=' + $scope.model.header.inboundCode + '&standardCode=' + type.value;
                    $.fileDownload(url, {
                        successCallback: function (url) {
                            //toaster.pop("success", messages.labelDownloadSuccess); commented
                            notify.message(messages.labelDownloadSuccess,'','succ');
                        },
                        failCallback: function (error, url) {
                            var err = JSON.parse($(error).text());
                            if (err && err.errors) {
                                var errors = [];
                                _.forEach(err.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //toaster.pop("error", errors.join(', '), '', 0); commented
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                   // toaster.pop("error", messages.labelDownloadError); commented
                                   notify.message(messages.labelDownloadError);
                                }
                            } else {
                                //toaster.pop("error", messages.labelDownloadError); commented
                                notify.message(messages.labelDownloadError);
                            }
                        }
                    });
                } else {
                    //toaster.pop("error", messages.labelInvalid); commented
                    notify.message(messages.labelInvalid);
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
			
			$scope.getProductInventory = function (product,key) {
				
                var params = {
                    id: product
                }
                $bus.fetch({
                    name: 'products',
                    api: 'products',
                    params: params,
                    data: null
                })
                    .done(function (success) {
						
                        var products = [];
                        var data = success.response.data;
                        if (!_.isArray(data.products)) {
                            _.forEach(data.products, function (product) {
								
								$scope.model.products[key].length = product.length;
								$scope.model.products[key].width = product.width;
								$scope.model.products[key].height = product.height;
								
								$scope.model.products[key].dimensionUnit = product.dimensionUnit;
								$scope.model.products[key].weight = product.weight;
								$scope.model.products[key].weightUnit = product.weightUnit;
								$scope.model.products[key].isActive = product.isActive;
                                
                                $scope.model.products[key].codeType = product.codeType;
                                $scope.model.products[key].articleCode = product.articleCode;
                                $scope.model.products[key].isExportable = product.isExportable;
								
                            });
                                     
                                  $scope.populatePagination();     

                            } else {
                            $scope.model.products = data.products;
                        }
                    }).fail(function (error) {
                                $scope.model.products = 0;
                    });
            };

            $scope.populatePagingData = function () {
                var inboundCode = $routeParams.sku;
                if ($rootScope.shipInbounds) {
                    for(var index = 0; index < $rootScope.shipInbounds.length; index++) {
                        if ($rootScope.shipInbounds[index] == inboundCode) {
                            $scope.currentObjPos = index + 1;
                            break;
                        }
                    }
                }
            };

            $scope.getNextItem = function (index) {
                if (index < 0 || index >= $rootScope.shipInbounds.length) return;
                var path = '/shipments/view/' + $rootScope.shipInbounds[index];
                $location.path(path);
            };
	    
	    $scope.populatePagination = function() {
                $scope.fromRecord = (($scope.pagingOptions.pageSize * $scope.pagingOptions.currentPage) - $scope.pagingOptions.pageSize) + 1;
                $scope.toRecord = $scope.model.products.length < ($scope.pagingOptions.pageSize * $scope.pagingOptions.currentPage) ? $scope.model.products.length : ($scope.pagingOptions.pageSize*$scope.pagingOptions.currentPage);               
                $scope.setPageSizeClickLength();
                $scope.pagedData =  $scope.model.products.slice(($scope.fromRecord - 1), $scope.toRecord);                    
             }  

             $scope.paging = function (page, index) {

                if (index == 'last') {
                    page = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                }

                if ($scope.pagingOptions.currentPage != page && page > 0) {

                    $scope.pagingOptions.currentPage = page;                   
                }
                $scope.pagingOptions.currentPage = (page > 0) ? page : $scope.pagingOptions.currentPage;
            }

            $scope.getPagingNum = function (currentPage, index) {
                return (currentPage + index);
            }

            $scope.setPageSizeClickLength = function () {
                var totalPages = Math.ceil($scope.model.products.length / $scope.pagingOptions.pageSize);
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
			
            $scope.duplicate = function(code){
                $scope.shipmentEdited = true;
                $location.path('shipments/create').search({clone: code});
            };


            $scope.init = function () {
				
				$(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });
		
		$scope.pagingOptions = {
                    pageSizes: [10,25,50,100],  
                    pageSize : 10,                     
                    currentPage: 1
                };

                 $scope.pageSize = {
                    pageSizeClickLength: [1]
                };


                 $scope.$watch('pagingOptions', function (newVal, oldVal) {
                    if (newVal !== oldVal) {                 
                    $scope.populatePagination();   
                    }
                }, true); 

                $scope.populatePagingData();
                $rootScope.getShipmentsCount();
                $scope.productLabelList = $scope.constants.productLabelList[0];
                $scope.boxLabelList = $scope.constants.boxLabelList[0];
                var params = {
                    id: $routeParams.sku || ''
                }
                $bus.fetch({
                    name: 'shipments',
                    api: 'shipments',
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        var data = success.response.data;
                        if (data && data.shipment) {
                            $scope.model = new model(data.shipment);
                            $scope.model.history = data.shipment.history;
							$scope.getCountryName($scope.model.header.addressCountry);
                            //toaster.pop("success", messages.shipmentDetail, messages.retrivedSuccess);
                            $scope.getStatus($scope.model.header.status);
                            $scope.getLabel($scope.model.header.labelBy);
							angular.forEach($scope.model.products,function(val,key){
								angular.forEach(val,function(valTwo,keyTwo){
									if (keyTwo=='sku') {
										$scope.getProductInventory(valTwo,key);
									}
								});
							});						
                        } else {
                            //toaster.pop("error", messages.shipmentFetchError); commented
                            notify.message(messages.shipmentFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        //toaster.pop("error", messages.shipmentFetchError); commented
                        notify.message(messages.shipmentFetchError);
                        ngProgress.complete();
                    });
            };
    }]);
});