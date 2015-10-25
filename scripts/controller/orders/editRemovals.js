define(['app', 'model/orders/details', 'utility/restapi', 'utility/messages'], function (app, model, restapi, messages) {
    app.controller('EditRemovalOrders', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', 'fileUpload', '$rootScope','notify','$timeout','$routeParams',
        function ($scope, $bus, $location, ngProgress, $http, $constants, fileUpload, $rootScope,notify,$timeout,$routeParams) {

            $scope.model = new model();
            $scope.validationMessages = $constants.validationMessages;
            $scope.constants = $constants;

            $scope.removalsModel = {
                "removal":{
                    "ezcOrderNumber":"",
                    "isApproved":false,
                    "isDraft":false,
                    "orderStatus":"",
                    "merchant":[],
                    "lineItems":[],
                     "shipping":{   
                         "carrier":"PICKUP",
                         "removalCharge":""
                    },
                    "remark":""
                }
            };

            var lineItemModel = function() {
                this.merchantCode = "";
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

            $scope.updateRemoval = function() {
                $scope.removalsModel.removal.isApproved = $scope.isApproveRemoval;

                angular.forEach($scope.removalsModel.removal.lineItems, function(product){
                    product.quantity = (Number(product.quantityDamaged) + Number(product.quantityFulfillable));
                });

                $scope.removalsModel.removal.shipping = {"carrier":"PICKUP","removalCharge":""};
                $scope.removalsModel.removal.shipping.removalCharge = $scope.totalRemovalFee?$scope.totalRemovalFee:'';

                var params = {
                    orderHeaderId: $routeParams.remvalid || ''
                };
                $bus.fetch({
                    name: 'updateRemovals',
                    api: 'updateRemovals',
                    resturl: true,
                    params: params,
                    data: {"removal":JSON.stringify($scope.removalsModel)}
                })
                    .done(function (success) {
                        if (success && success.response && success.response.success) {
                            $location.path('/orders/removals');
                            notify.message(success.response.success.join(', '), '', 'succ');
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        if (error && error.response && error.response.errors) {
                            notify.message(error.response.errors.join(', '));
                            //notify.message(messages.removalSubmitError);
                        }
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
                                      orderHeaderId:$scope.removalsModel.removal.orderHeaderId,
                                      ezcOrderNumber:$scope.removalsModel.removal.ezcOrderNumber,
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
            }
            
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
                            product.merchantCode = products[0].merchantCode;
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

            $scope.removeProduct = function (product) {
                $scope.removalsModel.removal.lineItems = _.without($scope.removalsModel.removal.lineItems, product);

                if($.inArray(product.fbspSkuId,$rootScope.appendOrdersArray)!=-1 && product.fbspSkuId) {
                    $rootScope.appendOrdersArray = jQuery.grep($rootScope.appendOrdersArray, function(value) {
                        return value != product.fbspSkuId;
                    });
                }
                $scope.active=false;
            }

            $scope.highlightSuggest = function (str, match) {
                if (str && match) {
                    var regex = new RegExp("(" + match + ")", 'gi');
                    return str.replace(regex, '<strong>$1</strong>');
                }
                return str;
            }

            $scope.suggestions = [];
            $scope.findSuggestion = function (txt) {
                $scope.emptySuggestions = false;
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: 'suggestproducts',
                                api: 'suggestproducts',
                                params: {
                                    skey: txt,
                                    scol: 'all'
                                },
                                data: null
                            })
                                .done(function (success) {
                                    if (success.response && success.response.data && success.response.data.docs)
                                        if (success.response.data.docs.length) {
                                            $('#order-create-product-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
                                            $timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        } else {
                                            $('#order-create-product-search-suggestion').hide();
                                            $scope.emptySuggestions = true;
                                        }
                                });
                        }
                    }, 300, false);
                } else {
                    $scope.suggestions.length = 0;
                }
            };

            $scope.addProduct = function (product) {
                if ($scope.removalsModel.removal.lineItems.length > 0 && _.findIndex($scope.removalsModel.removal.lineItems, {
                        ezcSku: product.fbspSkuId
                    }) != -1) {
                    $("#order-create-product-quantity-" + _.findIndex($scope.removalsModel.removal.lineItems, {
                        ezcSku: product.fbspSkuId
                    })).focus();
                } else {
                    //if (product.isActive == 'true' || product.isActive == '1') {
                    var _product = new $scope.model.LineItems();
                    _product.fbsp_sku = product.fbspSkuId;
                    _product.description = product.productName;
                    $scope.getProductInventory(_product).done(function (product) {
                        //if(product.isActive) {
                        product.quantity = Number(product.qtyFulfillable) + Number(product.qtyDamaged);
                        product.quantityDamaged = Number(product.qtyDamaged);
                        //product.quantityFulfillable = Number(product.qtyFulfillable);
                        product.quantityFulfillable = 0;
                        product.isIncludeDamage = false;
                        $scope.removalsModel.removal.lineItems.push(product);
                        $scope.searchKey = '';
                        $scope.suggestions = [];
                        $scope.getRemovalFee();
                        // }
                    }).fail(function (product) {
                        notify.message(messages.addProductError);
                    });
                    //} else {
                    //notify.message(messages.addActiveProducts);
                    //}
                }
            };

            $scope.attachEventsForTypeAhead = function () {
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #order-create-search-product, div.nano-pane, div.nano-slider").click(function (e) {
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
            };

            $scope.getTotalWeight = function() {
                if (!$scope.removalsModel.removal.lineItems.length) return 0;

                var totalWeight = 0;
                angular.forEach($scope.removalsModel.removal.lineItems, function(product) {

                    var qtyDamaged = angular.copy(product.quantityDamaged);
                    var qtyFulfillable = angular.copy(product.quantityFulfillable);
                    
                    if(!(/^[0-9]*$/.test(qtyDamaged)))
                        qtyDamaged = 0;

                    if(!(/^[0-9]*$/.test(qtyFulfillable)))
                        qtyFulfillable = 0;

                    totalWeight += product.productWeight * (Number(qtyDamaged) + Number(qtyFulfillable));
                });
                return parseFloat(totalWeight).toFixed(2);
            };

            $scope.getTotalUnits = function() {
                if (!$scope.removalsModel.removal.lineItems.length) return 0;

                var totalQty = 0;
                angular.forEach($scope.removalsModel.removal.lineItems, function(product) {

                    var qtyDamaged = angular.copy(product.quantityDamaged);
                    var qtyFulfillable = angular.copy(product.quantityFulfillable);
                    
                    if(!(/^[0-9]*$/.test(qtyDamaged)))
                        qtyDamaged = 0;

                    if(!(/^[0-9]*$/.test(qtyFulfillable)))
                        qtyFulfillable = 0;

                    totalQty = totalQty + Number(qtyDamaged) + Number(qtyFulfillable);
                });
                return totalQty;
            };

            $scope.calculateDamage = function(product) {
                product.quantityDamaged = product.isIncludeDamage ?  angular.copy(product.qtyDamaged) : 0;

            };

            $scope.getRemovalFee = function() {
                if (!$scope.removalsModel.removal.lineItems.length) {
                    $scope.totalRemovalFee = 0;
                    return;
                }
                var quote = {
                    "quoteRequest":{
                        "lineItems":[]
                    }
                };

                angular.forEach($scope.removalsModel.removal.lineItems, function(product) {

                    var qtyDamaged = angular.copy(product.quantityDamaged);
                    var qtyFulfillable = angular.copy(product.quantityFulfillable);

                    if(!(/^[0-9]*$/.test(qtyDamaged)))
                        qtyDamaged = 0;

                    if(!(/^[0-9]*$/.test(qtyFulfillable)))
                        qtyFulfillable = 0;
                    
                    var tempQty = Number(qtyDamaged) + Number(qtyFulfillable);
                    if (tempQty > 0) {
                        var lineItem = {
                            "quantity": Number(qtyDamaged) + Number(qtyFulfillable),
                            "quantityDamaged": qtyDamaged,
                            "quantityFulfillable":qtyFulfillable,
                            "merchantSku": product.merchantSku,
                            "ezcSku": product.ezcSku
                        };
                        quote.quoteRequest.lineItems.push(lineItem);
                    }
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

            $scope.openConfModal = function () {

                if ($scope.removalsModel.removal.lineItems.length < 1) {
                    notify.message(messages.removalZeroOrderline);
                    return;
                }

                // edit confirmation modal
                $('#confirm-edit-removal-modal').modal();

                $('#edit-removal-modal-cancel,#confirm-edit-removal-close').on('click',function(e){
                    $('#edit-removal-modal-btn').off('click');
                });

                $('#edit-removal-modal-btn,#edit-approve-removal-modal-btn').on('click',function(e){
                    $scope.updateRemoval();
                    $('#edit-removal-modal-cancel').click();
                    $('.modal-backdrop.fade.in').remove();
                    $('#edit-removal-modal-btn').off('click');
                });

                $('#confirm-edit-removal-modal').keypress(function(e){
                    if(e.keyCode == 13 || e.keyCode == 32){
                        $('#edit-removal-modal-btn').click();
                    }
                })
            };

            $scope.validateFulfillableUnit = function (prod,index) {
                
                $scope.validationMessages.invalidRemovalFullfillableUnitShow =  angular.copy($scope.validationMessages.invalidRemovalFullfillableUnit);
                $('#invalidUnits_'+index).hide().text('');

                if(!prod) return false;
                else if (Number(prod.quantityFulfillable) < 0)
                    return false;
                else if (!$scope.checkValidUnits(prod)) {
                    $scope.validationMessages.invalidRemovalFullfillableUnitShow = '';
                    $('#invalidUnits_'+index).show().text($scope.validationMessages.invalidRemovalUnits).css('color','#a94442');
                    return false;
                }
                else
                    return (Number(prod.quantityFulfillable) <= Number(prod.qtyFulfillable));
            };

            $scope.validateDamagedUnit = function (prod,index) {

                $scope.validationMessages.invalidRemovalDamagedUnitShow = angular.copy($scope.validationMessages.invalidRemovalDamagedUnit);
                $('#invalidUnits_'+index).hide().text('');

                if(!prod) return false;
                else if (Number(prod.quantityDamaged) < 0 )
                    return false;
                else if (!$scope.checkValidUnits(prod)){
                    $scope.validationMessages.invalidRemovalDamagedUnitShow = '';
                    $('#invalidUnits_'+index).show().text($scope.validationMessages.invalidRemovalUnits).css('color','#a94442');
                    return false;
                }
                else
                    return (Number(prod.quantityDamaged) <= Number(prod.qtyDamaged));
            };

            $scope.checkValidUnits = function(prod) {
                
                if( Number(prod.quantityFulfillable)==0 && Number(prod.quantityDamaged)==0 )
                    return false;
                else 
                    return true;
            }

            $scope.showAppendedOrders = function() {

                if($rootScope.appendOrdersArray.length) {
                    angular.forEach($rootScope.appendOrdersArray, function(value, key) {
                        $scope.addProduct({fbspSkuId:value});
                    });
                } else {
                    return ((Number(prod.quantityFulfillable) <= Number(prod.qtyFulfillable)) && Number(prod.quantityFulfillable) > 0);
                }
            };

            $scope.getFullfillableRow = function(param,paramIndex) {

                $('#insufficientInventory_'+paramIndex).show().text('');

                var flag = false;

                if(param.length && (!param[0] && !param[1])) {
                    $('#insufficientInventory_'+paramIndex).show().text('Insufficient Inventory');
                    flag = true;   
                }
                if(flag){

                    return 'fullfillableRow';

                }else{
                    return '';
                }

            };

            $scope.init = function () {
                $scope.attachEventsForTypeAhead();
                $rootScope.getOrdersCount();
                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                },2000);

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


                $("#edit-removal-form").on('click', 'button[type="submit"]', function (e) {
                    $scope.isApproveRemoval = $(this).hasClass("approve") ? true : false;
                });


                $scope.isApproveRemoval = false;
                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });

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

                            $scope.removalsModel.removal = angular.copy(data.removal[0]);
                            $scope.removalsModel.removal.lineItems = [];
                           angular.forEach(data.removal[0].lineItems, function(prduct){
                                var _product = new lineItemModel();
                                _product.fbsp_sku = prduct.ezcSku;
                                _product.description = prduct.description;
                                $scope.getProductInventory(_product)
                                    .done(function (product) {
                                        product.quantity = Number(prduct.quantityFulfillable) + Number(prduct.quantityDamaged);
                                        product.quantityDamaged = Number(prduct.quantityDamaged);
                                        product.quantityFulfillable = Number(prduct.quantityFulfillable);
                                        product.isIncludeDamage = false;
                                        $scope.removalsModel.removal.lineItems.push(product);
                                        $scope.getRemovalFee();
                                    })
                                    .fail(function (product) {
                                        notify.message(messages.addProductError);
                                    });

                            });
                            $scope.getRemovalFee();
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
    }]);
});