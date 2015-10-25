define(['app', 'model/orders/details', 'utility/messages'], function (app, model, messages) {
    app.controller('ViewRemovalOrders', ['$window','$scope', '$bus', 'ngProgress', '$constants', '$routeParams', '$rootScope', '$location', 'notify','highlight',
        function ($window,$scope, $bus, ngProgress, $constants, $routeParams, $rootScope, $location, notify,highlight) {

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.removal = {
                "ezcOrderNumber":"",
                "isApproved":false,
                "isDraft":false,
                "orderStatus":"",
                "merchant":[],
                "lineItems":[],
                "remark":""
            };

            var lineItemModel = function() {

                this.vendorId  =  "";
                this.warehouseId = "";
                this.quantity = '';
                this.quantityDamaged = '';
                this.quantityFulfillable = '';
                this.merchantSku = "";
                this.ezcSku = "";
                this.productCode = "";
                this.productCodeType = "";
                this.productCategory = "";
                this.marketplaceId = "";
                this.description = "";
                this.productWeight = "";
                this.isExportable = "";
                this.isActive = "";
                this.retailPrice = "";
                this.retailCurrencyCode = "";
                this.costPrice = "";
                this.costCurrencyCode = "";
                this.itemDeclaredValue = "";
                this.customs = {
                    customsDescription : "",
                    hsCode : "",
                    itemDeclaredValue : "",
                    dvalueCurrencyCode : "",
                    originCountry :  ""
                }
            };

            $scope.getTotalWeight = function() {
                if (!$scope.removal) return 0;

                var totalWeight = 0;
                angular.forEach($scope.removal.lineItems, function(product) {
                    var isIncludeDamage = (Number(product.quantityDamaged) > 0) ? true : false;
                    totalWeight += product.productWeight * (isIncludeDamage ? Number(product.quantityDamaged) + Number(product.quantityFulfillable) : Number(product.quantityFulfillable));
                });
                return parseFloat(totalWeight).toFixed(2);
            };

            $scope.showRemovalPoOrderNumber = function(orderStatus,order){
                
                if(order && order.purchaseOrders && order.purchaseOrders[0].poNumber && orderStatus && (orderStatus=='IN_PROCESS' || orderStatus=='FULFILLMENT' || orderStatus=='SHIPPED' || orderStatus=='DELIVERED') && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin']).length)
                    return true;
                else 
                    return false;

            }
            
            $scope.getTotalUnits = function() {
                if (!$scope.removal) return 0;

                var totalQty = 0;
                angular.forEach($scope.removal.lineItems, function(product) {
                    totalQty = totalQty + (product.quantityFulfillable + product.quantityDamaged);
                });
                return totalQty;
            };

            $scope.getProductInventory = function (product) {
                var deferred = $.Deferred();
                var params = {
                    id: product.fbsp_sku
                }
                $bus.fetch({
                    name: 'products',
                    api: 'products',
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.success && success.response.success.length) {
                            var products = [];
                            var data = success.response.data;
                            if (!_.isArray(data.products)) {
                                _.forEach(data.products, function (product) {
                                    products.push(product)
                                });
                            } else {
                                products = data.products;
                            }
                            product.vendorId = products[0].vendorId;
                            product.warehouseId = products[0].vendorProductId;
                            product.merchantSku = products[0].sku;
                            product.isActive = products[0].isActive;
                            product.productWeight = products[0].weight;
                            product.productCategory = products[0].mainProductCategory;
                            product.quantity = 1;
                            product.isExportable = products[0].isExportable ? true : false;
                            product.weightUnit = products[0].weightUnit;
                            product.ezcSku = products[0].fbspSkuId;
                            product.productCode = products[0].articleCode;
                            product.productCodeType = products[0].codeType;
                            product.marketplaceId = products[0].productId;
                            product.description = products[0].productName;
                            product.retailPrice = products[0].retailPrice;
                            product.retailCurrencyCode = products[0].retailPriceCurrencyCode;
                            product.costPrice = products[0].costPrice;
                            product.costCurrencyCode = products[0].costPriceCurrencyCode;
                            product.customs.customsDescription = products[0].customsDescription;
                            product.customs.hsCode = products[0].hsCode;
                            product.customs.itemDeclaredValueClone = products[0].declaredValue;
                            product.customs.itemDeclaredValue = products[0].declaredValue;
                            product.customs.dvalueCurrencyCode = products[0].declaredValueCurrencyCode;
                            product.customs.originCountry = products[0].countryOfOriginCode;
                            product.qtyFulfillable = products[0].qtyFulfillable;
                            product.qtyDamaged = products[0].qtyDamaged;
                            product.qtyInShipment = products[0].qtyInShipment;
                            deferred.resolve(product);
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors));
                            } else {
                                notify.message(messages.productFetchError);
                            }
                            deferred.reject(product);
                        }
                    }).fail(function (error) {
                        deferred.reject(product);
                    });
                return deferred.promise();
            }
            $scope.getRemovalFee = function() {
                if (!$scope.removal) return 0;
                var quote = {
                    "quoteRequest":{
                        "lineItems":[]
                    }
                };

                angular.forEach($scope.removal.lineItems, function(product) {
                    var lineItem = {
                        "quantity": (product.quantityDamaged + product.quantityFulfillable) || 0,
                        "quantityDamaged": product.quantityDamaged || 0,
                        "merchantSku": product.merchantSku,
                        "ezcSku": product.ezcSku
                    };
                    quote.quoteRequest.lineItems.push(lineItem);
                });

                $bus.fetch({
                    name: 'getRemovalFee',
                    api: 'getRemovalFee',
                    params: null,
                    data: {"quoteRequest":JSON.stringify(quote)}
                })
                    .done(function (success) {
                        var data = success.response.data;
                        if (data && data.removalQuote && data.removalQuote) {
                            $scope.totalRemovalFee = data.removalQuote.removalTotalPickRate;
                        } else {
                            $scope.totalRemovalFee = 0;
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.totalRemovalFee = 0;
                        ngProgress.complete();
                    });



            };

            $scope.getCircle = function (val) {
                if (val == 0 || val == 2) {
                    return false;
                }
                if (val == 1) {
                    return true;
                }
            };
	    
	    $scope.getCategory = function (cat) {
                return _.findWhere($constants.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($constants.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            }
            
            $scope.cancelOrder = function (val) {
                    $('#confirm-orderCancel-modal').modal();
                    
                    $('#orderCancel-modalCancel,.orderCancel-model-close').on('click',function(e){
                        $('#orderCancel-modalOk').off('click');
                    }); 
                        
                    $('#orderCancel-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        var updateJSON = {   
                                      orderHeaderId:$scope.removal.orderHeaderId,
                                      ezcOrderNumber:$scope.removal.ezcOrderNumber,
                                      updateType:"cancelRemoval",
                                      updateRemark:null
                                }
                        $bus.fetch({
                            name: 'cancelRemovals',
                            api: 'cancelRemovals',
                            params: null,
                            data: JSON.stringify({
                                        update: JSON.stringify(updateJSON)
                                    })
                        })
                            .done(function (success) {
                                if (success && success.response && success.response.data && success.response.data.removalStatus == 'CANCELLED') {
                                    notify.message(success.response.success.join(','), '', 'succ');
                                    $location.path('/orders/removals')
                                } else {
                                    notify.message(messages.orderCancelError);
                                }
                                ngProgress.complete();
                            }).fail(function (error) {
                                notify.message(messages.orderCancelError);
                                ngProgress.complete();
                            });
                        $('#orderCancel-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#orderCancel-modalOk').off('click');
                    });
					
					$('#confirm-orderCancel-modal').keypress(function(e){
						if(e.keyCode == 13 || e.keyCode == 32){
							$('#orderCancel-modalOk').click();
						}
					});
            };

            $scope.getClosedDate = function(removal) {
                if (removal && removal.history) {
                    for (var index = 0; index < removal.history.length; index++) {
                        if (removal.history[index].historyTag == 'Closed') {
                            return removal.history[index].historyDate;
                        }
                    }
                }
                else return null;
            };

            $scope.getCancelledDate = function (removal) {
                if (removal && removal.history) {
                    for (var index = 0; index < removal.history.length; index++) {
                        if (removal.history[index].historyTag == 'Cancelled') {
                            return removal.history[index].historyDate;
                        }
                    }
                }
                else return null;
            };

            $scope.getProcessedDate = function(removal) {
                if (removal && removal.history) {
                    for (var index = 0; index < removal.history.length; index++) {
                        if (removal.history[index].historyTag == 'Processed') {
                            return removal.history[index].historyDate;
                        }
                    }
                }
                else return null;
            }

            $scope.formatOrderStatus = function (val) {

                if (val == '') {
                    return $scope.constants.notAvailableText;
                } else {
                    return _.findWhere($constants.orderStatus, {
                                "value": val
                            }) ? _.findWhere($constants.orderStatus, {
                                "value": val
                            }).display : $scope.constants.notAvailableText;
                }

            }

            $scope.updateRemarks = function() {

                if(!$scope.updateRemovals)
                    return false;
                
                var params = {
                    orderHeaderId: $routeParams.remvalid || ''
                };

                $scope.remarksModel = {
                    "removal":{
                        "orderHeaderId":$routeParams.remvalid?$routeParams.remvalid:'',
                        "remark":$scope.updateRemovals?$scope.updateRemovals:'',
                    }
                };

                $bus.fetch({
                    name: 'updateRemovals',
                    api: 'updateRemovals',
                    resturl: true,
                    params: params,
                    data: {"removal":JSON.stringify($scope.remarksModel)}
                })
                .done(function (success) {
                    if (success && success.response && success.response.success.length) {
                        notify.message(messages.removalRemarkSuccess,'','succ',1);
                        $scope.getData();
                        $scope.cancelRemarks();
                    }else{
                         notify.message(messages.removalRemarkError);
                    }
                }).fail(function (error) {
                    notify.message(messages.removalRemarkError);
                });

            };
            
            $scope.cancelRemarks = function() {
                $('#edit-container').hide();
                $('#edit-remarks').show();
                $('#manager-remarks,#edit-container').removeClass('has-error');
                $('#manager-remarks + label.control-label').remove();
            }

            $scope.editRemarks = function() {
                $scope.updateRemovals = $scope.removal.remark?angular.copy($scope.removal.remark):'';
                $('#edit-container').show();
                $('#edit-remarks').hide();
            }

            $scope.init = function() {
                
                $('#edit-remarks').show();
                $('#edit-container').hide();

                $rootScope.getOrdersCount();

                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });

                $('[data-toggle="popover"]').popover({
                    title: function() {
                        return '<span class="glyphicon glyphicon-cross"></span>';
                    },
                    html:true
                });

                $('body').on('click', function (e) {
                    $('[data-toggle="popover"]').each(function () {
                        if ((($(e.target).attr('class'))=='glyphicon glyphicon-cross') || (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0)) {
                            $(this).popover('hide');
                        }
                    });
                });

                $scope.getData = function() {
                    $scope.editRemarkShow = false;
                    var params = {
                        orderHeaderId: $routeParams.remvalid || ''
                    };

                    $bus.fetch({
                        name: 'viewRemovals',
                        api: 'viewRemovals',
                        resturl: true,
                        params: params,
                        data: null
                    })
                        .done(function (success) {
                            var data = success.response.data;
                            if (data && data.removal) {
                                $scope.removal = angular.copy(data.removal[0]);
                                $scope.removal.lineItems = [];
                                $scope.editRemarkShow = $scope.removal.orderStatus!='PENDING'?true:false;
                                angular.forEach(data.removal[0].lineItems, function(prduct){
                                    var _product = new lineItemModel();
                                    _product.fbsp_sku = prduct.ezcSku;
                                    _product.description = prduct.description;
                                    _product.quantityFulfillable = prduct.quantityFulfillable;
                                    _product.quantityDamaged     = prduct.quantityDamaged;
                                    $scope.getProductInventory(_product)
                                        .done(function (product) {
                                            $scope.removal.lineItems.push(product);
                                            $scope.getRemovalFee();
                                        })
                                        .fail(function (product) {
                                            notify.message(messages.addProductError);
                                        });

                                });
                            } else {
                                notify.message(messages.orderFetchError);
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            $scope.model = new model();
                            notify.message(messages.orderFetchError);
                            ngProgress.complete();
                        });
                }

                $scope.getData();

            };

    }]);
});