define(['app', 'model/orders/details', 'utility/messages'], function (app, model, messages) {
    app.controller('EditOrders', ['$scope', '$bus', '$location', 'ngProgress', '$constants', '$rootScope', '$timeout', '$window', '$routeParams','notify','highlight',
        function ($scope, $bus, $location, ngProgress, $constants, $rootScope, $timeout, $window, $routeParams,notify,highlight) {

            //ngProgress.start();
            $scope.model = new model();

            $scope.validationMessages = $constants.validationMessages;

            $scope.constants = $constants;

            $scope.currentLocation = $constants.currentLocation;

            $scope.isReviewOrder = false;

            $scope.isInternationalOrder = false;

            $scope.isApprove = false;
            $scope.toggleTooltip = function(index) {
                if($('#carrier-popover-' + index).hasClass('in')) {
                    $('.popoverHldr .popover').removeClass('in');
                } else {
                    $('.popoverHldr .popover').not('#carrier-popover-' + index).removeClass('in');
                    $('#carrier-popover-' + index).addClass('in');
                }
            }



            $scope.incrementAddInfo = function () {
                $scope.addInfo++;
                 element = "order-edit-addInfo" + $scope.addInfo;

                var style = window.getComputedStyle(document.getElementById(element));
                if(style!=null)
                {
                    $scope.incrementAddInfo();
                }     
            }
            $scope.shippingOptions = [];
            $scope.orderStatus = "";
            $scope.getOrderStatus = function(status){
                $scope.orderStatus = _.findWhere($constants.orderStatus, {
                        "value": status
                    }) ? _.findWhere($constants.orderStatus, {
                        "value": status
                    }).display : $constants.notAvailableText;
            }
            
            $scope.domesticCarrierPreference = null;
            $scope.internationalCarrierPreference = null;
            $scope.domesticEnhancedLiabilityPreference = false;
            $scope.internationalEnhancedLiabilityPreference = false;
            $scope.categoryOfShipmentPreference = null;
            $scope.nonDeliveryInstructionPreference = null;
            
            $scope.draftMerchantOrderId = function(text) {
                if($scope.model.orderStatus != 'DRAFT')
                    return true;
                else if (text && /^[a-zA-Z0-9\-]{0,30}$/.test(text))
                    return true;
                else
                    return false;
            };
            
            $scope.updateDisplayableOrderId = function() {
                    $scope.model.displayableOrderId = $scope.model.merchantOrderId;
                     if(typeof($scope.model.merchantOrderId)=='undefined' || $scope.model.merchantOrderId.length==0)
                        $scope.isOrderExists = false;
            };

            $scope.showOrdersHasIssues = function(val,title) {
                
                if(title) {
                    var showTitle = false;
                    _.map(val,function (param) { 
                        if(param && param.issue && param.issue.issueKey!='validateOrderLineInventory' && param.issue.issueKey!='validateInventoryOnSave' && param.issue.issueKey!='validateInventoryOnApprove')
                            showTitle = true;
                    });
                    return showTitle;
                }else{

                    return (val!='validateOrderLineInventory' && val!='validateInventoryOnSave' && val!='validateInventoryOnApprove')?true:false;
                }

            };

            $scope.getFullfillableRow = function(param,paramIndex) {

                $('#insufficientInventory_'+paramIndex).show().text('');

                var flag = false;

                if(param.length && typeof(param[0])!='undefined' && _.isEmpty(param[0])){
                    $('#insufficientInventory_'+paramIndex).show().text(', Insufficient Inventory');
                    flag = true;    
                }
                if (param.length && typeof(param[0])!='undefined' && typeof(param[1])!='undefined' && !_.isEmpty(param[0]) && param[1] > param[0]){
                    $('#insufficientInventory_'+paramIndex).show().text(', Insufficient Inventory');
                    flag = true;   
                }
                if (param.length && typeof(param[2])!='undefined' && param[2]=='0'){
                    $('#insufficientInventory_'+paramIndex).show().text($('#insufficientInventory_'+paramIndex).show().text()+', Inactive');
                    flag = true;
                }
                if (param.length && typeof(param[2])!='undefined' && param[2]=='2'){
                    $('#insufficientInventory_'+paramIndex).show().text($('#insufficientInventory_'+paramIndex).show().text()+', Archived');
                    flag = true;
                }
                if (param.length && typeof(param[3])!='undefined' && param[3]=='0' && $scope.countryOfOriginCtrl && $scope.countryOfOriginCtrl.countryCode!=$constants.currentLocation){
                    $('#insufficientInventory_'+paramIndex).show().text($('#insufficientInventory_'+paramIndex).show().text()+', Non-exportable');
                    flag = true;
                }
                
                if(flag){

                    var message = $('#insufficientInventory_'+paramIndex).text();
                    
                    var index = $('#insufficientInventory_'+paramIndex).text().lastIndexOf(',');

                    if(index!=-1 && index > 0) {
                        var character = '&';
                        var finalMessage = message.substr(0, index) +' '+ character + message.substr(index+character.length);  
                        var finalMessage = finalMessage.replace(/\,/,'');
                    }else{
                        var finalMessage = message.substr(1,message.length);
                    }
                    
                     $('#insufficientInventory_'+paramIndex).show().text(finalMessage);

                    return 'fullfillableRow';
                }else{
                    return '';
                }

            };

             $scope.draftCleanUp = function()
            {
                $scope.internationalProductSelectAll = true;
                $scope.model.isDraft = true;
                $scope.model.customer.shippingAddress.countryCode = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
                $scope.model.customer.shippingAddress.firstname = $scope.model.customer.customerFirstname ? $scope.model.customer.customerFirstname : '';
                $scope.model.customer.shippingAddress.lastname = $scope.model.customer.customerLastname ? $scope.model.customer.customerLastname : '';
                if (!$scope.model.displayableOrderId)
                    $scope.model.displayableOrderId = $scope.model.merchantOrderId;
                if($scope.model.lineItems.length) {
                    _($scope.model.lineItems).forEach(function (data) {
                        //data.selected = true;
                        data.customs.itemDeclaredValue = Number(data.customs.itemDeclaredValueClone) * Number(data.quantity)
                        data.itemDeclaredValue = data.customs.itemDeclaredValue;
                        $rootScope.getCountryList().done(function () {
                              data.customs.originCountry = data.countryOfOriginCtrl ? data.countryOfOriginCtrl.countryCode : '';    
                        });
                    });
                }
                /*if($scope.model.displayableDate)
                $scope.model.displayableDate = $scope.convertDateFormat($scope.model.displayableDate,'mm/dd/yyyy');
                if($scope.model.processOrderDate)
                $scope.model.processOrderDate = $scope.convertDateFormat($scope.model.processOrderDate,'mm/dd/yyyy');*/
                delete $scope.model.orderHeaderId;
                delete $scope.model.ezcOrderNumber;
                delete $scope.model.orderStatus;
                delete $scope.model.hasIssues;
                /*$scope.model.lineItems = _.reject($scope.model.lineItems, {
                    'selected': false
                });*/
                if($scope.selectedShippingMethod) {
                    $scope.model.shipping.carrier = $scope.selectedShippingMethod.carrier;
                    $scope.model.shipping.methodCode = $scope.selectedShippingMethod.value;
                    $scope.model.shipping.methodName = $scope.selectedShippingMethod.name;
                    $scope.model.shipping.leadTime = $scope.selectedShippingMethod.leadTime;
                    $scope.model.shipping.fulfillRate = $scope.selectedShippingMethod.fulfillRate;
                    $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                    $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                    $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                    $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                }
                if ($scope.isInternationalOrder) {
                    $scope.model.shipping.categoryOfGoods = $scope.orderShipCategory ? $scope.orderShipCategory.value : null;
                    $scope.model.shipping.nonDeliveryInstr = $scope.orderDeliveryInstruction ? $scope.orderDeliveryInstruction.value : null;
                    if($scope.model.lineItems.length) {
                        _($scope.model.lineItems).forEach(function (data) {
                            $rootScope.getCountryList().done(function () {
                                data.customs.originCountry = data.countryOfOriginCtrl ? data.countryOfOriginCtrl.countryCode : '';
                            });
                        });
                    }
                } else {
                    $scope.model.shipping.categoryOfGoods = "";
                    $scope.model.shipping.nonDeliveryInstr = "";
                    $scope.model.shipping.categoryGoodsOther = "";
                }

                for(var i = 0; i < 12; i++) {
                    if($scope.model.additionalInfo['additionalInfo'+(i+1)] && $scope.model.additionalInfo['additionalInfoLabel'+(i+1)] != 'Additional Information ' + (i+1)) {
                        $scope.model.additionalInfo['additionalInfo'+(i+1)] = [$scope.model.additionalInfo['additionalInfoLabel'+(i+1)],$scope.model.additionalInfo['additionalInfo'+(i+1)]].join('|');
                    }
                    delete $scope.model.additionalInfo['additionalInfoLabel'+(i+1)];
                }
            }
            
            $scope.saveAsDraft = function(next){
                if($scope.model.merchantOrderId && /^[a-zA-Z0-9\-]{0,30}$/.test($scope.model.merchantOrderId)) { 
                    ngProgress.start();
                    $scope.draftCleanUp();
                    var params = {
                    id: $routeParams.sku || ''
                }

                    $bus.fetch({
                            name: 'editorders',
                            api: 'editorders',
                            params: params,
                            data: JSON.stringify({
                                order: JSON.stringify($scope.model)
                            })
                        })
                            .done(function (success) {
                                if (success.response.success && success.response.success.length) {
                                    $scope.orderCreated = true;
                                    notify.message(messages.orderDraftSuccess.replace('##',$scope.model.merchantOrderId?$scope.model.merchantOrderId:''), '', 'succ');
                                    highlight.added($scope.model.merchantOrderId);
                                    $scope.orderEdited = true;
                                    if(next) {
                                        $('#modalCancelSaveDraft').click();
                                        $('.modal-backdrop.fade.in').remove();
                                        $('#modalOkSaveDraft').off('click');
                                        $('#modalNoSaveDraft').off('click');
                                        $window.location=next;
                                    } else {
                                        $location.path('orders/drafts');
                                    }
                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        notify.message(messages.orderDraftError);
                                    }
                                }
                                ngProgress.complete();
                            }).fail(function (error) {
                                var errors = [];
                                _.forEach(error.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {

                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    notify.message(messages.orderCreateError);
                                }
                                ngProgress.complete();
                            });   
                } else {
                    $('#orders-create-merchant-id').addClass('has-error').focus().after('<label class="control-label has-error validationMessage">' + $constants.validationMessages.orderMerchantIdError + '</label>');
                }
            }

            $scope.checkMerchantOrderIdAvail = function(){
                ngProgress.start();
                var param = {
                    searchCol: 'merchOrderId',
                    searchTerm: $scope.model.merchantOrderId
                }

                 $bus.fetch({
                        name: 'orderexists',
                        api: 'orderexists',
                        params: param,
                        data: null
                    })
                        .done(function (success) {
                            if (success.response.success && success.response.success.length) {

                                if((success.response.success[1]=='No orders found.')){
                                    $scope.isOrderExists = false;
                                }else if((success.response.success[1]=='Order found.')){
                                    $scope.isOrderExists = true;
                                }
                                
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //notify.message(messages.productListFetchError);
                                }
                                $scope.isOrderExists = false;
                            }
                            ngProgress.complete();
                            
                        }).fail(function (error) {
                                $scope.isOrderExists = false;
                            ngProgress.complete();
                
                        });


                
            };


            
            
            $scope.getFulfillment = function() {
                ngProgress.start();
                $bus.fetch({
                    name: 'getPreferences',
                    api:  'getPreferences',
                    params: {
                        id: 'orderFulfillment'
                    },
                    data: null
                })
                .done(function (success) {
                    if (success && success.response && success.response.success && success.response.success.length > 0 && success.response && success.response.data && success.response.data.merchantPreferences) {
                            $scope.domesticCarrierPreference = success.response.data.merchantPreferences.ordDefDeliveryOptions ? success.response.data.merchantPreferences.ordDefDelOptDomOrders : null;
                            $scope.internationalCarrierPreference = success.response.data.merchantPreferences.ordDefDeliveryOptions ? success.response.data.merchantPreferences.ordDefDelOptIntOrders : null;
                            $scope.domesticEnhancedLiabilityPreference = (success.response.data.merchantPreferences.ordDefElDomOrders && success.response.data.merchantPreferences.ordDefAddEl) ? true : false;
                            $scope.internationalEnhancedLiabilityPreference = (success.response.data.merchantPreferences.ordDefElIntOrders && success.response.data.merchantPreferences.ordDefAddEl) ? true : false;
                            $scope.categoryOfShipmentPreference = success.response.data.merchantPreferences.ordDefCustDeclarationIntOrders ? success.response.data.merchantPreferences.ordDefCdioCatShip : null;
                            $scope.nonDeliveryInstructionPreference = success.response.data.merchantPreferences.ordDefCustDeclarationIntOrders ? success.response.data.merchantPreferences.ordDefCdioNonDeliveryIns : null;
                    } else {
                        //notify.message(messages.fulfillmentFetchError);
                    }
                    ngProgress.complete();
                })
                .fail(function (error) {
                    ngProgress.complete();
                });
            };
            
            $scope.getCategory = function (cat) {
                return _.findWhere($constants.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($constants.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            }

            $scope.updateSelectedProduct = function (product) {
                var deferred = $.Deferred();
                var params = {
                    id: product.ezcSku
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

                            product.vendorId                        = products[0].vendorId;
                            product.warehouseId                     = products[0].vendorProductId;
                            product.merchantSku                     = products[0].sku;
                            product.isActive                        = products[0].isActive;
                            product.productWeight                   = products[0].weight;
                            product.isExportable                    = products[0].isExportable ? true : false;
                            product.weightUnit                      = products[0].weightUnit;
                            product.ezcSku                          = products[0].fbspSkuId;
                            product.productCode                     = products[0].articleCode;
                            product.productCodeType                 = products[0].codeType;
                            product.marketplaceId                   = products[0].productId;
                            product.retailPrice                     = products[0].retailPrice;
                            product.retailCurrencyCode              = products[0].retailPriceCurrencyCode;
                            product.costPrice                       = products[0].costPrice;
                            product.costCurrencyCode                = products[0].costPriceCurrencyCode;
                            product.customs.customsDescription      = products[0].customsDescription;
                            product.customs.hsCode                  = products[0].hsCode;
                            product.customs.itemDeclaredValueClone  = products[0].declaredValue;
                            product.customs.itemDeclaredValue       = products[0].declaredValue;
                            product.customs.dvalueCurrencyCode      = products[0].declaredValueCurrencyCode;
                            product.customs.originCountry           = products[0].countryOfOriginCode;
                            product.qtyFulfillable                  = products[0].qtyFulfillable;
                            product.qtyDamaged                      = products[0].qtyDamaged;
                            product.qtyInShipment                   = products[0].qtyInShipment;

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

            $scope.updateProduct = function (selected, prod) {
                if($scope.model.lineItems.length == 0)return;
                prod.ezcSku = selected.fbspSkuId;
                $scope.updateSelectedProduct(prod);
            };

			$scope.phoneNumberValidate = function() {

                if($rootScope.isCountriesOptionsVisible('ordersRemovePhoneValidation')){
                    $scope.validationMessages.invalidphonecountrybased = $constants.validationMessages.invalidphone;
                    if($scope.model.customer.shippingAddress.phone[0].number && /[a-zA-Z]+/g.test($scope.model.customer.shippingAddress.phone[0].number)){
                        return false;
                    }else{
                        return true;    
                    }
                }
				
				if($scope.countryOfOriginCtrl && ($scope.countryOfOriginCtrl.countryCode==$constants.currentLocation) && $scope.model.customer.shippingAddress.phone[0].number && $scope.model.customer.shippingAddress.phone[0].number.length > 8){
					$scope.validationMessages.invalidphonecountrybased = $constants.validationMessages.invalidphonedomestic;
					return false;
				}
				else {
					$scope.validationMessages.invalidphonecountrybased = $constants.validationMessages.invalidphone;
					return true;
				}
			}

            $scope.postalCodeVaidate = function() {

                if ($scope.model.customer.shippingAddress.postalCode && $rootScope.isCountriesOptionsVisible('orderPostalCode')) {
                    if(_.isEmpty(_.findWhere($scope.australiaPostalCodes,{"value":$scope.model.customer.shippingAddress.postalCode}))) {
                        $scope.validationMessages.invalidPostal = $constants.validationMessages.invalidPostalCode;
                        return false;
                    }else {
                        return true;
                    }
                }
                else if($scope.countryOfOriginCtrl  && $scope.countryOfOriginCtrl.countryCode=='SG') {

                    if(!$scope.model.customer.shippingAddress.postalCode || !(/^[0-9]{6}$/.test($scope.model.customer.shippingAddress.postalCode))){
                        $scope.validationMessages.invalidPostal = $constants.validationMessages.zipCodeNew;
                        return false;
                    }
                    else {
                        return true;
                    }
                    
                }
                else if(!$scope.model.customer.shippingAddress.postalCode) {
                    $scope.validationMessages.invalidPostal = $constants.validationMessages.required;
                    return false;

                }

                return true;
            }
			
            $scope.addProduct = function (product) {
                if ($scope.model.lineItems.length > 0 && _.findIndex($scope.model.lineItems, {
                    ezcSku: product.fbspSkuId
                }) != -1) {
                    $("#order-edit-product-quantity-" + _.findIndex($scope.model.lineItems, {
                        ezcSku: product.fbspSkuId
                    })).focus();
                } else {
                    //if (product.isActive == 'true' || product.isActive == '1') {
                        var _product = new $scope.model.LineItems();
                        _product.fbsp_sku = product.fbspSkuId;
                        _product.description = product.productName;
                        $scope.getProductInventory(_product).done(function (product) {
                            $scope.model.lineItems.push(product);
                            $scope.searchKey = '';
                            $scope.suggestions = [];
                        }).fail(function (product) {
                            notify.message(messages.addProductError);
                        });
                    //} else {
                        //notify.message(messages.addActiveProducts);
                    //}
                }
            };


            $scope.checkInternationalOrder = function (text) {
                if ($scope.isInternationalOrder && !text)
                    return false;
                else
                    return true;
            };

            $scope.checkInternationalOrderCustomDesc = function (selected, index) {
                if (selected && $scope.isInternationalOrder && $scope.model.lineItems.length >= 0 &&  !$scope.model.lineItems[index].customs.customsDescription)
                    return false;
                else
                    return true;
            };

            $scope.checkInternationalOrderCustomHsCode = function (selected, index) {
				
				if($scope.model.lineItems[index].customs.hsCode && ($scope.model.lineItems[index].customs.hsCode.length < 6 || $scope.model.lineItems[index].customs.hsCode.length > 30))
					return false;
                else if (selected && $scope.isInternationalOrder && !$scope.model.lineItems[index].customs.hsCode)
                    return false;
                else
                    return true;
            };
			
			$scope.getCircle = function (val) {
                if (val == 0 || val == 2) {
                    return false;
                }
                if (val == 1) {
                    return true;
                }
            };
            
            $scope.checkOrderDValue = function (val) {
                var reg = new RegExp('^[0-9]+[\\.]?[0-9]{0,2}$');
                if(!$scope.model.shipping.liabilityTaken || !$scope.selectedShippingMethod.liabilityAvailable)
                    return true;
                else if (!val || _.isNaN(Number(val)) || !reg.test(val) || !Number(val))
                    return false;
                else
                    return true;
            }
			
            $scope.checkInternationalOrderDValue = function (selected, index) {
                var reg = new RegExp('^[0-9]+[\\.]?[0-9]{0,2}$');
                if ((selected && $scope.isInternationalOrder && _.isNaN(Number($scope.model.lineItems[index].customs.itemDeclaredValue))) || (selected && $scope.isInternationalOrder && !Number($scope.model.lineItems[index].customs.itemDeclaredValue)) || (selected && $scope.isInternationalOrder && !reg.test($scope.model.lineItems[index].customs.itemDeclaredValue)))
                    return false;
                else
                    return true;
            }

            $scope.checkInternationalOrderOCountry = function (selected, index) {
                if (selected && $scope.isInternationalOrder && !$scope.model.lineItems[index].countryOfOriginCtrl)
                    return false;
                else
                    return true;
            }

            $scope.checkOtherShipCategory = function (text, val) {
                if ($scope.isInternationalOrder && val == 'O' && !text)
                    return false;
                else
                    return true;
            }

            $scope.checkLiabilityValue = function (value, base) {
				
				var value = Number(value);
                var base = Number(base);
                var elMax = $scope.selectedShippingMethod ? Number($scope.selectedShippingMethod.elMax) : 0;
                var liabilityAvail = $scope.model.shipping.liabilityTaken ? true : false;
				
                if((value < 0)||(base < 0 ))
                    return false;
                else if ((!value || value > base || value > elMax) && liabilityAvail)
                    return false;
                else
                    return true;
            }

            $scope.updateDeliveryCharge = function () {
                if(!$scope.selectedShippingMethod.liabilityAvailable) {
                    $scope.model.shipping.liabilityTaken = false;
                }
                if ($scope.model.shipping.liabilityTaken) {
                    $scope.model.shipping.liabilityTaken = true;
                    $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                    $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                    $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                    $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                } else {
                    $scope.model.shipping.liabilityTaken = false;
                    $scope.model.shipping.estEnhancedCost = 0;
                    $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                    $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                    $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                }
            }

            $scope.previous = function () {
                $scope.isReviewOrder = false;
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
                $scope.model.lineItems = _.without($scope.model.lineItems, product)
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

            $scope.findSuggestion = function (txt, key, index) {
				$scope.emptySuggestions = false;
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        var el = typeof index != "undefined" ? $scope[key][index] : $scope[key];
                        if (txt == el) {
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
                                            $('#order-edit-product-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
											$timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        }else{
                                            $('#order-edit-product-search-suggestion').hide();
                                            $scope.emptySuggestions = true;    
                                        }
                                });
                        }
                    }, 300, false);
                } else {
                    $scope.suggestions.length = 0;
                }
            }

            $scope.attachEventsForTypeAhead = function () {
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #order-edit-search-product, div.nano-pane, div.nano-slider").click(function (e) {
					if(($(e.target).attr('class'))=='nano-pane' || ($(e.target).attr('class'))=='nano-slider'){
                        return false;
                        $('div.nano-pane, div.nano-slider').scroll(function() {
                            return false;
                        });
                    }
                    $scope.suggestions.length = 0;
                    $scope.searchKey = '';
                    $scope.searchKeys = [];
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.orderEdited = false;
            
            $scope.$on('$locationChangeStart', function (event, next, current) {
                if (!$scope.orderEdited && $scope.model.orderStatus=='DRAFT') {
                        event.preventDefault();
                        
                        $('#confirm-modal-draft').modal();
                        
                        $('#modalCancelSaveDraft,.model-close').on('click',function(e){
                            $('#modalOkSaveDraft').off('click');
                            $('#modalNoSaveDraft').off('click');
                        }); 
                            
                        $('#modalOkSaveDraft').on('click',function(e){
                            $scope.saveAsDraft(next)
                        });
                        $('#modalNoSaveDraft').on('click',function(e){
                            $scope.orderEdited = true;
                            $window.location=next;
                            $('#modalCancelSaveDraft').click();
                            $('.modal-backdrop.fade.in').remove();
                            $('#modalOkSaveDraft').off('click');
                            $('#modalNoSaveDraft').off('click');
                        });
						
						$('#confirm-modal-draft').keypress(function(e){
                            if(e.keyCode == 13){
                                $('#modalNoSaveDraft').click();
                            }
                            else if(e.keyCode == 32){
                                $('#modalOkSaveDraft').click();
                            }
						});
						
                    }
                    if (!$scope.orderEdited && $scope.model.orderStatus!='DRAFT') {
                        event.preventDefault();
                        
                        $('#confirm-modal').modal();
                        
                        $('#modalCancel,#model-close').on('click',function(e){
                            $('#modalOk').off('click');
                        }); 
                            
                        $('#modalOk').on('click',function(e){
                            $scope.orderEdited = true;
                            $window.location=next;
                            $('#modalCancel').click();
                            $('.modal-backdrop.fade.in').remove();
                            $('#modalOk').off('click');
                        });
						
						$('#confirm-modal').keypress(function(e){
							if(e.keyCode == 13 || e.keyCode == 32){
								$('#modalOk').click();
							}
						});
                    }
            });

            $scope.checkActive = function (product) {
                if (product.isActive == 'true' || product.isActive == '1')
                    return false;
                return true;
            }
            $scope.hasIssues = [];
            $scope.hasIssuestxt = "";
            $scope.cleanData = function () {
                $scope.hasIssues = [];
                if ($scope.isApprove) {
                    _($scope.model.lineItems).forEach(function (data) {
                        if(data.quantity > data.qtyFulfillable) {
                            $scope.hasIssues.push(data.merchantSku);
                        }
                    });
                }
                if ($scope.isApprove && !$scope.hasIssues.length) {
                    $scope.model.isApproved = true;
                    if (!$scope.model.displayableOrderId)
                    $scope.model.displayableOrderId = $scope.model.merchantOrderId;
                    if (!$scope.model.displayableDate)
                    $scope.model.displayableDate = $scope.today;
                    if (!$scope.model.processOrderDate)
                    $scope.model.processOrderDate = $scope.today;
                } else {
                    $scope.model.isApproved = false;
                }
                /*$scope.model.lineItems = _.reject($scope.model.lineItems, {
                    'selected': false
                });*/
                /*if($scope.model.displayableDate)
                $scope.model.displayableDate = $scope.convertDateFormat($scope.model.displayableDate,'mm/dd/yyyy');
                if($scope.model.processOrderDate)
                $scope.model.processOrderDate = $scope.convertDateFormat($scope.model.processOrderDate,'mm/dd/yyyy');*/
                delete $scope.model.hasIssues;
                $scope.model.shipping.carrier = $scope.selectedShippingMethod.carrier;
                $scope.model.shipping.methodCode = $scope.selectedShippingMethod.value;
                $scope.model.shipping.methodName = $scope.selectedShippingMethod.name;
                $scope.model.shipping.leadTime = $scope.selectedShippingMethod.leadTime;
                $scope.model.shipping.fulfillRate = $scope.selectedShippingMethod.fulfillRate;
                $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                if ($scope.isInternationalOrder) {
                    $scope.model.shipping.categoryOfGoods = $scope.orderShipCategory.value;
                    $scope.model.shipping.nonDeliveryInstr = $scope.orderDeliveryInstruction.value;
                    _($scope.model.lineItems).forEach(function (data) {
                        $rootScope.getCountryList().done(function () {
                            data.customs.originCountry = data.countryOfOriginCtrl ? data.countryOfOriginCtrl.countryCode : '';
                        });
                    });
                } else {
                    $scope.model.shipping.categoryOfGoods = "";
                    $scope.model.shipping.nonDeliveryInstr = "";
                    $scope.model.shipping.categoryGoodsOther = "";
                }
                for(var i = 0; i < 12; i++) {
                    if($scope.model.additionalInfo['additionalInfo'+(i+1)] && $scope.model.additionalInfo['additionalInfoLabel'+(i+1)] != 'Additional Information ' + (i+1)) {
                        $scope.model.additionalInfo['additionalInfo'+(i+1)] = [$scope.model.additionalInfo['additionalInfoLabel'+(i+1)],$scope.model.additionalInfo['additionalInfo'+(i+1)]].join('|');
                    }
                    delete $scope.model.additionalInfo['additionalInfoLabel'+(i+1)];
                }
            }

            $scope.updateProductBasedCalc = function () {
                //$scope.model.shipping.estShippingWeight = 0;
                $scope.model.shipping.orderDeclaredValue = 0;
                //$scope.model.shipping.orderRetailValue = 0;
                _($scope.model.lineItems).forEach(function (data) {
                    if (data.selected) {
                        //$scope.model.shipping.estShippingWeight += (Number(data.productWeight) * Number(data.quantity));
                        $scope.model.shipping.orderDeclaredValue += Number(data.customs.itemDeclaredValue);
                        //$scope.model.shipping.orderRetailValue += (Number(data.retailPrice) * Number(data.quantity));
                    } else {
                        $scope.internationalProductSelectAll = false;
                    }
                });
                //$scope.model.shipping.estShippingWeight += ($scope.model.shipping.estShippingWeight * 10)/100;
                $scope.model.shipping.liabilityValue = $scope.model.shipping.orderDeclaredValue;
                
            }

            $scope.convertDateFormat = function (date, format, separator,toseperator) {
                var separator = separator || "/";
                var dates = date.split(separator);
                var dd, mm, yyyy;
                dd   = dates[0];
                mm   = dates[1];
                yyyy = dates[2];
                if(typeof(toseperator)!='undefined') { separator = toseperator; }
                if      (format == "mm/dd/yyyy")    return mm + separator + dd + separator + yyyy;
                else if (format == "dd/mm/yyyy")    return dd + separator + mm + separator + yyyy;
				else if (format == "yyyy/mm/dd")    return yyyy + separator + mm + separator + dd;
            };

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

            $scope.validateDate = function (inputDate) {

                $scope.DisplayableOrderDate_isInvalid 	 = false;
                $scope.DisplayableOrderDate_errorMessage = "";

                if (!inputDate){
                    $scope.DisplayableOrderDate_errorMessage = "";
                    return $scope.DisplayableOrderDate_isInvalid 	 = false;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!inputDate.match(validDateFormat)) {
                    $scope.DisplayableOrderDate_errorMessage = "Invalid Date Format";
                    return $scope.DisplayableOrderDate_isInvalid 	 = true;
                }

                if (!inputDate.match(validDate) || new Date($scope.convertDateFormat(inputDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.DisplayableOrderDate_errorMessage = "Invalid Date";
                    return $scope.DisplayableOrderDate_isInvalid 	 = true;
                }

                return $scope.DisplayableOrderDate_isInvalid;
            };

            $scope.createProcessDateChanged = function () {
                $scope.processOrder_isDateInvalid = false;
                $scope.processOrder_errorMessage  = "";

                //selected Date
                var date = $scope.model.processOrderDate;

                //today's date
                var today = $scope.formatDate(new Date());
                var todayDate, enteredDate, maxDate;

                // regular expression to match required date format
                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                //No date selected
                if (!date) return $scope.processOrder_isDateInvalid ;

                todayDate   = new Date($scope.convertDateFormat(today, "mm/dd/yyyy"));

                //Date Entered is invalid
                if (!date.match(validDateFormat)) {
                    $scope.processOrder_isDateInvalid 	= true;
                    $scope.processOrder_errorMessage 	= "Invalid Date Format";
                    return $scope.processOrder_isDateInvalid;
                }

                //Date Entered is invalid
                if (!date.match(validDate) || new Date($scope.convertDateFormat(date, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.processOrder_isDateInvalid 	= true;
                    $scope.processOrder_errorMessage 	= "Invalid Date";
                    return $scope.processOrder_isDateInvalid;
                }

                else enteredDate = new Date($scope.convertDateFormat(date, "mm/dd/yyyy"));
                maxDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 7, 0, 0, 0, 0);

                if (!(todayDate <= enteredDate && enteredDate <= maxDate)) {
                    $scope.processOrder_isDateInvalid = true;
                    $scope.processOrder_errorMessage 	= "Date selected is out of range";
                    return $scope.processOrder_isDateInvalid;
                }

                return $scope.processOrder_isDateInvalid ;
            };

            $scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();
                    var processDate = new Date();
                    var checkin = $('#order-edit-displayable-date').datepicker()
                    .on('changeDate', function (ev) {
                        var newDate = new Date(ev.date);
                        //checkout.setValue(newDate);
                        checkin.hide();
                        $scope.model.displayableDate = $scope.formatDate(ev.date);
                        $scope.validateDate($scope.model.displayableDate);
                    }).data('datepicker');

                    var todayDate = new Date();
                    var tempCheckinSelect = new Date(checkin.date);
                    var checkout = $('#order-edit-process-date').datepicker({
                        startDate: new Date(),
                        endDate: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 7, 0, 0, 0, 0),
                        format: "dd/mm/yyyy",
                        onRender: function (date) {
                            var checkinSelect = new Date(checkin.date);
                            var processDate = new Date(checkinSelect.getFullYear(), checkinSelect.getMonth(), checkinSelect.getDate() + 6, 0, 0, 0, 0);
                            return ((date.valueOf() <= checkin.date.valueOf()) || (date.valueOf() > processDate.valueOf())) ? 'disabled' : '';
                        }
                    }).on('changeDate', function (ev) {
                        checkout.hide();
                        $scope.model.processOrderDate = $scope.formatDate(ev.date);
                        $scope.createProcessDateChanged();
                    }).data('datepicker');
                });
            }

            $scope.cleanDataPre = function () {
                $scope.internationalProductSelectAll = true;
                $scope.model.customer.shippingAddress.countryCode = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
                $scope.model.customer.shippingAddress.firstname = $scope.model.customer.customerFirstname;
                $scope.model.customer.shippingAddress.lastname = $scope.model.customer.customerLastname;
                /*if (!$scope.model.displayableOrderId)
                    $scope.model.displayableOrderId = $scope.model.merchantOrderId;*/
                /*if (!$scope.model.displayableDate)
                    $scope.model.displayableDate = $scope.formatDate(new Date());*/
                _($scope.model.lineItems).forEach(function (data) {
                    //data.selected = true;
                    data.customs.itemDeclaredValue = Number(data.customs.itemDeclaredValueClone) * Number(data.quantity)
                    data.itemDeclaredValue = data.customs.itemDeclaredValue;
                    $rootScope.getCountryList().done(function () {
                        data.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {
                            "countryCode": data.customs.originCountry
                        }) || '';
                    });
                });
                
            }

            $scope.updateShippingMethod = function (method) {
                _.each($scope.shippingOptions, function (option) {
                    option.ticked = false;
                });
                method.ticked = true;
                $scope.selectedShippingMethod = method;
                $scope.model.shipping.methodName = $scope.selectedShippingMethod.name;
                $scope.model.shipping.estEnhancedCost = method.estEnhancedCost;
                $scope.updateDeliveryCharge();
            }

            /*$scope.updateDeclaredValue = function () {
                $scope.model.shipping.orderDeclaredValue = 0;
                _($scope.model.lineItems).forEach(function (data) {
                    if (data.selected)
                        $scope.model.shipping.orderDeclaredValue += Number(data.customs.itemDeclaredValue);
                });
                $scope.model.shipping.liabilityValue = Number($scope.model.shipping.orderDeclaredValue);
            }*/

            $scope.formatLeadTime = function(fromDt , toDt) {
                var dateDiff = (fromDt == toDt) ? fromDt : fromDt + "-" + toDt;
                var days = (toDt > 1) ? "days" : "day";
                return dateDiff + " " + days;
            };
            $scope.fetchCarrier = function() {
                var deferred = $.Deferred();
                var elValue = 0;
                var declaredValue = 0;
                if($scope.model.customer.shippingAddress.countryCode != $scope.currentLocation) {
                    _($scope.model.lineItems).forEach(function (data) {
                        if(data.selected){
                            declaredValue += Number(data.customs.itemDeclaredValue);
                        }
                    });
                    elValue = ($scope.model.shipping.liabilityValue && Number($scope.model.shipping.liabilityValue) > declaredValue) ? declaredValue : $scope.model.shipping.liabilityValue;
                } else {
                    elValue = ($scope.model.shipping.orderDeclaredValue && $scope.model.shipping.liabilityValue && (Number($scope.model.shipping.liabilityValue) > Number($scope.model.shipping.orderDeclaredValue))) ? $scope.model.shipping.orderDeclaredValue : $scope.model.shipping.liabilityValue;
                }
                var data = {
                            quoteRequest : {
                                shippingAddress : $scope.model.customer.shippingAddress,
                                orderValues : {liabilityValue : elValue},
                                lineItems : $scope.model.lineItems
                            }
                        }
                $bus.fetch({
                    name: 'ordercarriers',
                    api: 'ordercarriers',
                    params: null,
                    data: JSON.stringify({
                        quoteRequest: JSON.stringify(data)
                    })
                })
                .done(function (success) {
                    if (success.response.success && success.response.success.length) {
                        $scope.shippingOptions = [];
                        _.forEach(success.response.data, function (item) {
                            var carrier = {};
                            var currentTime = new Date();
                            var cutoffTime = new Date();
                            carrier.name = item.service;
                            carrier.description = item.description;
                            carrier.value=item.serviceCode;
                            carrier.ticked=false;
                            carrier.valid = item.valid ? true : false;
                            carrier.error = item.quote ? item.quote.error : $constants.notAvailableText;
                            carrier.carrier = item.carrier;
                            carrier.currency = "$";
                            carrier.fuelSurcharge = (item.quote && item.quote.fuelSurcharge) ? item.quote.fuelSurcharge : null;
                            carrier.elMax = _.findWhere($constants.domesticShippingOptions, {"name": carrier.name}) ?  _.findWhere($constants.domesticShippingOptions, {"name": carrier.name}).elMax : (_.findWhere($constants.internationalShippingOptions, {"name": carrier.name}) ? _.findWhere($constants.internationalShippingOptions, {"name": carrier.name}).elMax : "0");
                             carrier.declaredValue = (item.quote && item.quote.debug && item.quote.debug.declaredValue) ? Number(Number((item.quote.debug.declaredValue)).toFixed(2)) : 0;
                            carrier.totalWeight = (item.quote && item.quote.debug && item.quote.debug.totalWeight)?Number(Number((item.quote.debug.totalWeight)).toFixed(2)):0;
                            carrier.liabilityAvailable = (item.quote && item.quote.liability && item.quote.liability.available) ? true : false;
                            carrier.deliveryRate =  (item.quote && item.quote.deliveryRate) ? Number(Number((item.quote.deliveryRate)).toFixed(2)) : 0;
                            carrier.fulfillRate = (item.quote && item.quote.fulfillRate) ? Number(Number((item.quote.fulfillRate)).toFixed(2)): 0;
                            carrier.estEnhancedCost = (item.quote && item.quote.liabilityRate) ? Number(Number((item.quote.liabilityRate)).toFixed(2)) : 0;
                            carrier.cost = (carrier.deliveryRate || 0) + (carrier.fulfillRate || 0);
                            carrier.leadFromDays = (item.quote && item.quote.transitTime && item.quote.transitTime.from) ? item.quote.transitTime.from : $constants.notAvailableText;
                            carrier.leadToDays = (item.quote && item.quote.transitTime && item.quote.transitTime.to) ? item.quote.transitTime.to : $constants.notAvailableText;
                            carrier.leadTime =  (item.quote && item.quote.transitTime && item.quote.transitTime.from && item.quote.transitTime.to && item.quote.transitTime.to=="N/A" && item.quote.transitTime.from=="N/A") ? $constants.notAvailableText : ((item.quote && item.quote.transitTime && item.quote.transitTime.from && item.quote.transitTime.to) ? ($scope.formatLeadTime(item.quote.transitTime.from, item.quote.transitTime.to)) : $constants.notAvailableText);
                            carrier.miniDate = (item.quote && item.quote.transitTime && item.quote.transitTime.minDate) ? item.quote.transitTime.minDate : $constants.notAvailableText;
                            carrier.maxiDate = (item.quote && item.quote.transitTime && item.quote.transitTime.maxDate) ? item.quote.transitTime.maxDate : $constants.notAvailableText;
                            carrier.cutoffTime = (item.quote && item.quote.transitTime && item.quote.transitTime.cutoffTime) ? item.quote.transitTime.cutoffTime : null;
                            //carrier.day = ((item.quote && item.quote.transitTime && item.quote.transitTime.minDate - )) ? item.quote.transitTime.cutoffTime : $constants.notAvailableText;
                            carrier.currentTime = (item.quote && item.quote.transitTime && item.quote.transitTime.currentTime) ? item.quote.transitTime.currentTime : null;
                            var _currentTime = carrier.currentTime ? carrier.currentTime.split(':') : [];
                            var _cutoffTime = carrier.cutoffTime ? carrier.cutoffTime.split(':') : [];
                            _currentTime.length ? currentTime.setHours(_currentTime[0],_currentTime[1]) : '';
                            _cutoffTime.length ? cutoffTime.setHours(_cutoffTime[0],_cutoffTime[1]) : '';
                            carrier.day = (currentTime > cutoffTime) ? 'tomorrow' : 'today';

                            $scope.shippingOptions.push(carrier);
                        });
                        //if ($scope.model.shipping.methodName) {
                            if(_.findWhere($scope.shippingOptions, {
                                "name": $scope.model.shipping.methodName,
                                "valid": true
                                })) {
                                    $scope.selectedShippingMethod = _.findWhere($scope.shippingOptions, {
                                                                        "name": $scope.model.shipping.methodName,
                                                                        "valid": true
                                                                        });
                            } else if(_.findWhere($scope.shippingOptions, {
                                "name": $scope.domesticCarrierPreference,
                                "valid": true
                                })) {
                                    $scope.selectedShippingMethod = _.findWhere($scope.shippingOptions, {
                                                                        "name": $scope.domesticCarrierPreference,
                                                                        "valid": true
                                                                        });
                            } else if(_.findWhere($scope.shippingOptions, {
                                "name": $scope.internationalCarrierPreference,
                                "valid": true
                                })) {
                                    $scope.selectedShippingMethod = _.findWhere($scope.shippingOptions, {
                                                                    "name": $scope.internationalCarrierPreference,
                                                                    "valid": true
                                                                    });
                            } else if(_.findWhere($scope.shippingOptions, {
                                "valid": true
                                })){
                                    $scope.selectedShippingMethod = _.findWhere($scope.shippingOptions, {
                                                                    "valid": true
                                                                    });
                            } else {
                                $scope.selectedShippingMethod = null;
                            }
                            
                            /*$scope.selectedShippingMethod = _.findWhere($scope.shippingOptions, {
                                "name": $scope.model.shipping.methodName
                            }) || (_.where($scope.shippingOptions, {
                                "valid": true
                            }).length ? _.where($scope.shippingOptions, {
                                "valid": true
                            })[0]  : null);
                        } else {
                            $scope.selectedShippingMethod = _.where($scope.shippingOptions, {
                                "valid": true
                            }).length ? _.where($scope.shippingOptions, {
                                "valid": true
                            })[0]  : null;
                        }*/
                        if($scope.selectedShippingMethod) { 
                            $scope.selectedShippingMethod.ticked=true;
                            $scope.model.shipping.carrier = $scope.selectedShippingMethod.carrier;
                            $scope.model.shipping.methodCode = $scope.selectedShippingMethod.value;
                            $scope.model.shipping.methodName = $scope.selectedShippingMethod.name;
                            $scope.model.shipping.leadTime = $scope.selectedShippingMethod.leadTime;
                            $scope.model.shipping.fulfillRate = $scope.selectedShippingMethod.fulfillRate;
                            $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                            $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                            if($scope.model.shipping.liabilityTaken && $scope.selectedShippingMethod.liabilityAvailable) {
                            $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                                $scope.model.shipping.liabilityTaken = true;
                            } else {
                                $scope.model.shipping.liabilityTaken = false;
                                $scope.model.shipping.estEnhancedCost = 0;
                            }
                            $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                            $scope.model.shipping.estShippingWeight = $scope.selectedShippingMethod.totalWeight;
                            //$scope.model.shipping.orderDeclaredValue = $scope.selectedShippingMethod.declaredValue;
                            //$scope.model.shipping.liabilityValue = $scope.selectedShippingMethod.declaredValue;
                            $scope.updateDeliveryCharge();
                        }
                        deferred.resolve(success);
                    } else {
                        deferred.reject(success);
                    }
                }).fail(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise();
            }
            
            $scope.calculateInsurance = function() {
                $('.elValidation label.has-error.validationMessage').remove();
                if(!$scope.checkLiabilityValue($scope.model.shipping.liabilityValue, $scope.model.shipping.orderDeclaredValue)) {
                    $('#orders-edit2-enhanced-liability-amount').focus().after('<label class="control-label has-error validationMessage">'+ $constants.validationMessages.orderELValueError +'</label>').closest('div').addClass('has-error');
                } else {
                ngProgress.start();
                $scope.fetchCarrier()
                .done(function(success){
                    ngProgress.complete();
                    notify.message(messages.insuranceUpdateSuccess,'','succ',1);
                }).fail(function(error) {
                    var errors = [];
                    _.forEach(error.response.errors, function (error) {
                        errors.push(error)
                    });
                    if (errors.length) {
                        notify.message($rootScope.pushJoinedMessages(errors,1),'','',1);
                    } else {
                        notify.message(messages.orderCarrierServiceError,'','',1);
                    }
                    ngProgress.complete();
                });
                }
            }

            $scope.draftOrder = function () {
                if ($scope.model.lineItems.length) {
                    if (_.where($scope.model.lineItems, {
                        "isActive": 0
                    }).length ) {
                        //$('#modal-order-create-inactive-error').modal();
                        //notify.message(messages.addActiveProducts);
                        $scope.active=true;
                    } 
                    else if (_.where($scope.model.lineItems, {
                        "isActive": 2
                    }).length ) {                        
                        $scope.active=true;
                    }
                    else {
                    if (_.where($scope.model.lineItems, {
                        "isExportable": false
                    }).length && $scope.countryOfOriginCtrl.countryCode != $scope.currentLocation) {
                        $scope.active=true;
                        notify.message(messages.addExpoProducts);
                    } else {
                        ngProgress.start();
                        $scope.cleanDataPre();
                        if($scope.model.orderStatus=='DRAFT') {
                            var param = {
                                searchCol: 'merchOrderId',
                                searchTerm: $scope.model.merchantOrderId
                            }
                            $bus.fetch({
                                name: 'orderexists',
                                api: 'orderexists',
                                params: param,
                                data: null
                            })
                                .done(function (success) {
                                    if (!success.response.data) {
                                        $scope.fetchCarrier()
                                        .done(function(success){
                                            if(!_.findWhere($scope.shippingOptions, {"valid": true})){
                                                notify.message(messages.noCarrierAvailable);
                                            } else {
                                                 $rootScope.removeNotificationMsgs();
                                                if ($scope.model.customer.shippingAddress.countryCode == $scope.currentLocation) {
                                                    $scope.model.shipping.deliveryType = "DOMESTIC";
                                                    $scope.isInternationalOrder = false;
                                                    if(($scope.model.shipping.liabilityTaken && $scope.selectedShippingMethod.liabilityAvailable) || ($scope.domesticEnhancedLiabilityPreference && $scope.selectedShippingMethod.liabilityAvailable)) {
                                                        $scope.model.shipping.liabilityTaken = true;
                                                        $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                                                        $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                                        $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                                        $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                                    } else {
                                                        $scope.model.shipping.liabilityTaken = false;
                                                        $scope.model.shipping.estEnhancedCost = 0;
                                                        $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                                        $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                                        $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                                    }
                                                } else {
                                                    $scope.orderShipCategory = _.findWhere($constants.orderShipCategory, {
                                                        "value": $scope.model.shipping.categoryOfGoods
                                                    }) || _.findWhere($constants.orderShipCategory, {
                                                        "name": $scope.categoryOfShipmentPreference
                                                    }) || $constants.orderShipCategory[0];
                                                    $scope.orderDeliveryInstruction = _.findWhere($constants.orderDeliveryInstruction, {
                                                        "value": $scope.model.shipping.nonDeliveryInstr
                                                    }) || _.findWhere($constants.orderDeliveryInstruction, {
                                                        "name": $scope.nonDeliveryInstructionPreference
                                                    }) || $constants.orderDeliveryInstruction[0];
                                                    $scope.model.shipping.deliveryType = "INTERNATIONAL";
                                                    $scope.isInternationalOrder = true;
                                                    if(($scope.model.shipping.liabilityTaken && $scope.selectedShippingMethod.liabilityAvailable) || ($scope.internationalEnhancedLiabilityPreference && $scope.selectedShippingMethod.liabilityAvailable)) {
                                                        $scope.model.shipping.liabilityTaken = true;
                                                        $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                                                        $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                                        $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                                        $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                                    } else {
                                                        $scope.model.shipping.liabilityTaken = false;
                                                        $scope.model.shipping.estEnhancedCost = 0;
                                                        $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                                        $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                                        $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                                    }
                                                }
                                                $scope.model.shipping.orderRetailValue = 0;
                                                $scope.model.shipping.orderDeclaredValue = 0;
                                                $scope.model.shipping.calcDeclaredValue = 0;
                                                _($scope.model.lineItems).forEach(function (data) {
                                                        $scope.model.shipping.orderRetailValue += (Number(data.retailPrice) * Number(data.quantity));
                                                        if(data.selected || !$scope.isInternationalOrder){
                                                            $scope.model.shipping.orderDeclaredValue += Number(data.customs.itemDeclaredValue);
                                                        }
                                                        $scope.model.shipping.calcDeclaredValue += Number(data.customs.itemDeclaredValue);
                                                });
                                                if(!$scope.isInternationalOrder){
                                                    $scope.model.shipping.orderDeclaredValue = $scope.model.shipping.orderDeclaredValueClone ? $scope.model.shipping.orderDeclaredValueClone : $scope.model.shipping.orderDeclaredValue;
                                                }
                                                if(!$scope.model.shipping.liabilityValue || ($scope.model.shipping.liabilityValue > $scope.model.shipping.orderDeclaredValue))
                                                    $scope.model.shipping.liabilityValue = $scope.model.shipping.orderDeclaredValue;
                                                $scope.isReviewOrder = true;
                                                $window.scrollTo(0, 0);
                                            }
                                            ngProgress.complete();
                                        }).fail(function(error) {
                                            var errors = [];
                                            _.forEach(error.response.errors, function (error) {
                                                errors.push(error)
                                            });
                                            if (errors.length) {
                                                notify.message($rootScope.pushJoinedMessages(errors));
                                            } else {
                                                notify.message(messages.orderCarrierServiceError);
                                            }
                                            ngProgress.complete();
                                        });
                                    } else {
                                        notify.message(messages.orderMerchantIdNotAvailable);
                                    }
                                    ngProgress.complete();
                                }).fail(function (error) {
                                    var errors = [];
                                    _.forEach(error.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        notify.message(messages.orderMerchantIdServiceError);
                                    }
                                    ngProgress.complete();
                                });
                        } else {
                            $scope.fetchCarrier()
                            .done(function(success){
                                if(!_.findWhere($scope.shippingOptions, {"valid": true})){
                                    notify.message(messages.noCarrierAvailable);
                                } else {
                                     $rootScope.removeNotificationMsgs();
                                    if ($scope.model.customer.shippingAddress.countryCode == $scope.currentLocation) {
                                        $scope.model.shipping.deliveryType = "DOMESTIC";
                                        $scope.isInternationalOrder = false;
                                        if(($scope.model.shipping.liabilityTaken && $scope.selectedShippingMethod.liabilityAvailable) || ($scope.domesticEnhancedLiabilityPreference && $scope.selectedShippingMethod.liabilityAvailable)) {
                                            $scope.model.shipping.liabilityTaken = true;
                                            $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                                            $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                            $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                            $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                        } else {
                                            $scope.model.shipping.liabilityTaken = false;
                                            $scope.model.shipping.estEnhancedCost = 0;
                                            $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                            $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                            $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                        }
                                    } else {
                                        $scope.orderShipCategory = _.findWhere($constants.orderShipCategory, {
                                            "value": $scope.model.shipping.categoryOfGoods
                                        }) || _.findWhere($constants.orderShipCategory, {
                                            "name": $scope.categoryOfShipmentPreference
                                        }) || $constants.orderShipCategory[0];
                                        $scope.orderDeliveryInstruction = _.findWhere($constants.orderDeliveryInstruction, {
                                            "value": $scope.model.shipping.nonDeliveryInstr
                                        }) || _.findWhere($constants.orderDeliveryInstruction, {
                                            "name": $scope.nonDeliveryInstructionPreference
                                        }) || $constants.orderDeliveryInstruction[0];
                                        $scope.model.shipping.deliveryType = "INTERNATIONAL";
                                        $scope.isInternationalOrder = true;
                                        if(($scope.model.shipping.liabilityTaken && $scope.selectedShippingMethod.liabilityAvailable) || ($scope.internationalEnhancedLiabilityPreference && $scope.selectedShippingMethod.liabilityAvailable)) {
                                            $scope.model.shipping.estEnhancedCost = $scope.selectedShippingMethod.estEnhancedCost;
                                            $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                            $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                            $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                        } else {
                                            $scope.model.shipping.liabilityTaken = false;
                                            $scope.model.shipping.estEnhancedCost = 0;
                                            $scope.model.shipping.estDeliveryCharge = $scope.selectedShippingMethod.deliveryRate;
                                            $scope.model.shipping.estFulfillmentCharge = $scope.selectedShippingMethod.fulfillRate;
                                            $scope.model.shipping.totalCharge = ($scope.model.shipping.estDeliveryCharge + $scope.model.shipping.estFulfillmentCharge + $scope.model.shipping.estEnhancedCost).toFixed(2);
                                        }
                                    }
                                    $scope.model.shipping.orderRetailValue = 0;
                                    $scope.model.shipping.orderDeclaredValue = 0;
                                    $scope.model.shipping.calcDeclaredValue = 0;
                                    _($scope.model.lineItems).forEach(function (data) {
                                            $scope.model.shipping.orderRetailValue += (Number(data.retailPrice) * Number(data.quantity));
                                            if(data.selected || !$scope.isInternationalOrder){
                                                $scope.model.shipping.orderDeclaredValue += Number(data.customs.itemDeclaredValue);
                                            }
                                            $scope.model.shipping.calcDeclaredValue += Number(data.customs.itemDeclaredValue);
                                    });
                                    if(!$scope.isInternationalOrder){
                                                    $scope.model.shipping.orderDeclaredValue = $scope.model.shipping.orderDeclaredValueClone ? $scope.model.shipping.orderDeclaredValueClone : $scope.model.shipping.orderDeclaredValue;
                                                }
                                    if(!$scope.model.shipping.liabilityValue || ($scope.model.shipping.liabilityValue > $scope.model.shipping.orderDeclaredValue))
                                        $scope.model.shipping.liabilityValue = $scope.model.shipping.orderDeclaredValue;
                                    $scope.isReviewOrder = true;
                                    $window.scrollTo(0, 0);
                                }
                                ngProgress.complete();
                            }).fail(function(error) {
                                var errors = [];
                                _.forEach(error.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    notify.message(messages.orderCarrierServiceError);
                                }
                                ngProgress.complete();
                            });
                        }
                    }
                  }
                } else {
                    //$('#modal-order-edit').modal();
                    notify.message(messages.addProducts);
                }
            }

            $scope.checkUncheckAll = function (value) {
                _.each($scope.model.lineItems, function (item) {
                    if (value) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                });
                $scope.updateProductBasedCalc();
                //$scope.updateDeclaredValue();
            }
            
            $scope.editService = function() {
                ngProgress.start();
                var params = {
                    id: $routeParams.sku || ''
                }
                $bus.fetch({
                        name: 'editorders',
                        api: 'editorders',
                        resturl: true,
                        params: params,
                        data: JSON.stringify({
                            order: JSON.stringify($scope.model)
                        })
                    })
                        .done(function (success) {
                            if (success.response.success && success.response.success.length) {
                                $scope.orderEdited = true;
                                notify.message(messages.orderUpdateSucess,'','succ');
								var redirectPath = (_.where($constants.orderStatus,{value:success.response.data.orderStatus}))?_.where($constants.orderStatus,{value:success.response.data.orderStatus})[0].name:'unapproved';
								highlight.added($scope.model.merchantOrderId);
								if (success.response.data.orderStatus=='PROCESS_MGR') {
                                        $location.path('orders/inprocess');
                                }else if (redirectPath) {
									$location.path('orders/'+redirectPath);
								}else if ($scope.model.isApproved) {
                                    $location.path('orders/inprocess');
                                } else {
                                    $location.path('orders/unapproved');
                                }
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    notify.message(messages.orderUpdateError);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors));
                            } else {
                                notify.message(messages.orderUpdateError);
                            }
                            ngProgress.complete();
                        });   
            }

            $scope.editOrder = function () {
                 
                 if ($scope.model.lineItems.length) {                    
                    for (i = 0; i < $scope.model.lineItems.length; i++){
                        if ($scope.model.lineItems[i].isActive=='0' || $scope.model.lineItems[i].isActive == '2'){

                                $scope.active=true;
                                break;
                        }
                    }
                }


                if ($scope.model.lineItems.length && $scope.active==false) {                
                //if ($scope.model.lineItems.length) {
                    $scope.cleanData();
                    $scope.fetchCarrier()
                    .done(function(success){
                        if($scope.model.isApproved) {
                            // var answer = confirm('Are you sure you want to approve the order?') commented
                            $('#confirm-orderApprove-modal').modal();
                    
                            $('#orderApprove-modalCancel,#orderApprove-model-close').on('click',function(e){
                                $('#orderApprove-modalOk').off('click');
                            }); 
                                
                            $('#orderApprove-modalOk').on('click',function(e){
                                // $scope.productEdited = true;
                                
                                if($scope.admminOrderEdit($scope.model.orderStatus))
                                    $scope.model.isMgrApproved = true;

                                $scope.editService();
                                $('#orderApprove-modalCancel').click();
                                $('.modal-backdrop.fade.in').remove();
                                $('#orderApprove-modalOk').off('click');
                            });
                            
                            $('#confirm-orderApprove-modal').keypress(function(e){
                                if(e.keyCode == 13 || e.keyCode == 32){
                                    $('#orderApprove-modalOk').click();
                                }
                            });
                        } else if($scope.hasIssues.length) {
                            $scope.hasIssuesTxt = ($scope.hasIssues.length == 1) ? $scope.hasIssues[0] : [$scope.hasIssues.slice(0, -1).join(', '), $scope.hasIssues.slice(-1)[0]].join(' and ');
                            $('#modal-order-unapprove-error').modal();
                    
                            $('#orderUnApprove-modalCancel,#orderUnApprove-modalClose').on('click',function(e){
                                $('#orderUnApprove-modalOk').off('click');
                            }); 
                                
                            $('#orderUnApprove-modalOk').on('click',function(e){
                                // $scope.productEdited = true;
                                $scope.editService();
                                $('#orderUnApprove-modalCancel').click();
                                $('.modal-backdrop.fade.in').remove();
                                $('#orderUnApprove-modalOk').off('click');
                            });
                            
                            $('#modal-order-unapprove-error').keypress(function(e){
                                if(e.keyCode == 13 || e.keyCode == 32){
                                    $('#orderUnApprove-modalOk').click();
                                }
                            });
                        } else {
                            $scope.editService();
                        }
                        
                        
                     }).fail(function (error) {
                        var errors = [];
                        _.forEach(error.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            notify.message(messages.orderCreateError);
                        }
                        ngProgress.complete();
                    });
                } 
                if ($scope.model.lineItems.length == 0) {
                    //$('#modal-order-edit').modal();
                    notify.message(messages.addProducts);
                }
            }

            $scope.getItemDetails = function (product) {
                var params = {
                    id: product.ezcSku
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
                                _.forEach(data.products, function (item) {
                                    products.push(item)
                                });
                            } else {
                                products = data.products;
                            }

                            product.productWeight = products[0].weight;
                            product.productCategory = products[0].mainProductCategory;
                            product.productLength = products[0].length;
                            product.productWidth = products[0].width;
                            product.productHeight = products[0].height;
                            product.retailPrice = products[0].retailPrice;
                            product.retailCurrencyCode = products[0].retailPriceCurrencyCode;
                            product.isActive = products[0].isActive ? true : false;
                            product.isExportable = products[0].isExportable ? true : false;
                            if (product.customs.itemDeclaredValue || product.customs.itemDeclaredValue == 0) {
                                product.customs.itemDeclaredValueClone = Number(product.customs.itemDeclaredValue) / Number(product.quantity);
                            } else {
                                product.customs.itemDeclaredValueClone = products[0].declaredValue;
                            }
                            if (!product.customs.customsDescription) {
                                product.customs.customsDescription = products[0].customsDescription;
                            }
                            if (!product.customs.hsCode) {
                                product.customs.hsCode = products[0].hsCode;
                            }
                            if (!product.customs.originCountry) {
                                product.customs.originCountry = products[0].countryOfOriginCode;
                            }
                            product.weightUnit = products[0].weightUnit;
                            product.qtyFulfillable = products[0].qtyFulfillable;
                            product.qtyDamaged = products[0].qtyDamaged;
                            product.qtyInShipment = products[0].qtyInShipment;
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
                        }
                    }).fail(function (error) {
                        notify.message(messages.productFetchError);
                    });
            }

            $scope.mapToEdit = function (data) {
                var phNumber = data.customer.shippingAddress.phone;
                var phType = data.customer.shippingAddress.type || 'CELL';
                $scope.model = new model(data);
                $scope.model.hasIssues = data.hasIssues;
                $scope.model.shipping.orderDeclaredValueClone = data.shipping ? data.shipping.orderDeclaredValue : 0;
                $scope.getOrderStatus($scope.model.orderStatus);
                $scope.model.shipping = new $scope.model.Shipping(data.shipping);
                $rootScope.getCountryList().done(function () {
                    $scope.countryOfOriginCtrl = $scope.model.customer.shippingAddress.countryCode ? _.findWhere($rootScope.countryList, {
                        "countryCode": $scope.model.customer.shippingAddress.countryCode
                    }) : '';
                });
                $scope.model.customer.customerEmail = data.customerEmail;
                $scope.model.customer.customerFirstname = data.customerFirstname;
                $scope.model.customer.customerLastname = data.customerLastname;
                $scope.model.customer.shippingAddress.phone = [new $scope.model.Phone()]
                $scope.model.customer.shippingAddress.phone[0].type = phType;
                $scope.model.customer.shippingAddress.phone[0].number = phNumber;
                $scope.model.additionalInfo = new $scope.model.AdditionalInfo()
                _(data.additionalInfo).forEach(function (info) {
                    _(info).forIn(function (value, key) {
                        $scope.model.additionalInfo[key] = value;
                    });
                });
                for(var i = 0; i < 12; i++) {
                    if($scope.model.additionalInfo['additionalInfo'+(i+1)] && $scope.model.additionalInfo['additionalInfo'+(i+1)].indexOf('|') != -1) {
                        $scope.model.additionalInfo['additionalInfoLabel'+(i+1)] = $scope.model.additionalInfo['additionalInfo'+(i+1)].split('|')[0] || 'Additional Information ' + (i+1);
                        $scope.model.additionalInfo['additionalInfo'+(i+1)] = $scope.model.additionalInfo['additionalInfo'+(i+1)].split('|')[1] || '';
                    } else {
                        $scope.model.additionalInfo['additionalInfoLabel'+(i+1)] = 'Additional Information ' + (i+1);
                    }
                }
                _($scope.model.lineItems).forEach(function (item) {
                    item.selected = item.selected == undefined ? true : (item.selected ? true : false);
                    item.customs = new $scope.model.Customs();
                    item.customs.customsDescription = item.customsDescription;
                    item.customs.hsCode = item.hsCode;
                    item.customs.itemDeclaredValue = item.itemDeclaredValue;
                    item.customs.dvalueCurrencyCode = item.dvalueCurrencyCode;
                    item.customs.originCountry = item.originCountry;
                    if(item.ezcSku) {
                        $scope.getItemDetails(item);
                    }
                });
                if ($scope.model.customer.shippingAddress.countryCode != $constants.currentLocation) {
                    $scope.isInternationalOrder = true;
                }
                $scope.model.processOrderDate = (new Date($scope.convertDateFormat($scope.model.processOrderDate,'mm/dd/yyyy', '-')) > new Date()) ? $scope.formatDate(new Date($scope.convertDateFormat($scope.model.processOrderDate,'mm/dd/yyyy', '-'))) : $scope.today;
                if($scope.model.displayableDate)
                    $scope.model.displayableDate = $scope.formatDate(new Date($scope.convertDateFormat($scope.model.displayableDate,'yyyy/mm/dd', '-','/')));
                $scope.model.shipping.liabilityTaken = $scope.model.shipping.liabilityTaken ? true : false;
                $scope.model.shipping.liabilityValue = $scope.model.shipping.liabilityValue ? Number($scope.model.shipping.liabilityValue) : 0;
                $scope.model.customer.shippingAddress.saveToBook = $scope.model.customer.shippingAddress.saveToBook ? true : false;
            }

            $scope.fetchData = function () {
                var params = {
                    id: $routeParams.sku || ''
                }
                $scope.isInternationalOrder = false;
                $bus.fetch({
                    name: 'orders',
                    api: 'orders',
                    resturl: true,
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        var data = success.response.data;
                        if (data && data.order) {
                            
                            $scope.mapToEdit(data.order[0]);
                            $scope.model.purchaseOrders = (data.order[0].purchaseOrders && data.order[0].purchaseOrders.length)?data.order[0].purchaseOrders:'';
                            //notify.message(messages.retrivedSuccess);
                        } else {
                            notify.message(messages.orderFetchError);
                        }
                               _($scope.model.lineItems).forEach(function (item, key) {
                                
                                $scope.model.lineItems[key].cancelQtyFulfillable = '0';
                                $scope.model.lineItems[key].cancelQtyDamaged = '0';
                                $scope.model.lineItems[key].cancelQtyMissing = '0';
                                
                            });
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        notify.message(messages.orderFetchError);
                        ngProgress.complete();
                    });
            }

                   // For popover 
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

            $scope.duplicate = function(code){
                $scope.orderEdited = true;
                $location.path('orders/create').search({clone: code});
            };

            $scope.populatePagingData = function () {
                var prodSku = $routeParams.sku;
                if ($rootScope.orderHeaders) {
                    for(var index = 0; index < $rootScope.orderHeaders.length; index++) {
                        if ($rootScope.orderHeaders[index] == prodSku) {
                            $scope.currentObjPos = index +1;
                            break;
                        }
                    }
                }
            };

            $scope.getNextItem = function (index) {
                //$scope.orderEdited = true;
                if (index < 0 || index >= $rootScope.orderHeaders.length) return;
                var path = '/orders/edit/' + $rootScope.orderHeaders[index];
                $location.path(path);
            };

            $scope.isTotalQtyValid = function(row) {
                
                var flag = true;

                $('.orderCancelQuantities div').removeClass('has-error');
                $('.cancelOrderText').hide().text('');
                $('#order-cancel-remarks').parent('div.form-group').removeClass('has-error').children().remove('label.has-error.validationMessage');

                _.forEach($scope.model.lineItems,function(value,key) {


                    $scope.model.lineItems[key].cancelQtyFulfillable = (!$scope.model.lineItems[key].cancelQtyFulfillable)?'0':$scope.model.lineItems[key].cancelQtyFulfillable;
                    $scope.model.lineItems[key].cancelQtyDamaged = (!$scope.model.lineItems[key].cancelQtyDamaged)?'0':$scope.model.lineItems[key].cancelQtyDamaged;
                    $scope.model.lineItems[key].cancelQtyMissing = (!$scope.model.lineItems[key].cancelQtyMissing)?'0':$scope.model.lineItems[key].cancelQtyMissing;


                    if((row!='' && key==row) || !row){

                        var regEx = /^[0-9]+$/
                        
                        if(value.cancelQtyFulfillable && !regEx.test(value.cancelQtyFulfillable)){

                            $('.ordcnclfull.error_'+key).addClass('has-error');
                            $('#cancelOrder_'+key).show().text('Fulfillable quantity requires a number');
                            flag = false;
                        }
                        else if(value.cancelQtyDamaged && !regEx.test(value.cancelQtyDamaged)){

                            $('.ordcncldmg.error_'+key).addClass('has-error');
                            $('#cancelOrder_'+key).show().text('Damaged quantity requires a number');
                            flag = false;
                        }
                        else if(value.cancelQtyMissing && !regEx.test(value.cancelQtyMissing)){

                            $('.ordcnclmiss.error_'+key).addClass('has-error');
                            $('#cancelOrder_'+key).show().text('Missing quantity requires a number');
                            flag = false;
                        }
                        else if(value.quantity && (value.cancelQtyDamaged || value.cancelQtyFulfillable || value.cancelQtyMissing)) {
                            
                            var totalQuantity = 0;

                            totalQuantity+=parseInt(value.cancelQtyDamaged) || 0;
                            totalQuantity+=parseInt(value.cancelQtyFulfillable) || 0;
                            totalQuantity+=parseInt(value.cancelQtyMissing) || 0;




                            if(parseInt(value.quantity) != parseInt(totalQuantity)) {
                                
                                $('.orderCancelQuantities .error_'+key).addClass('has-error');
                                $('#cancelOrder_'+key).show().text('Fulfillable + Damaged + Missing should be equal to No.of Units');
                                flag =  false;
                            }
                        }
                        else{
                            $('#cancelOrder_'+key).show().text('Enter any of the above value');
                            $('.orderCancelQuantities .error_'+key).addClass('has-error');
                            flag = false;
                        }
                    }
                });

                if(!$scope.remarks){
                    $('#order-cancel-remarks').parent('div.form-group').addClass('has-error').append('<label class="control-label has-error validationMessage">This field is required</label>');
                    flag = false;
                }

                if(!flag){
                    return false;
                }
                else {
                    return true;
                }
                
            }


            $scope.resetCancelOrder = function() {

                $('.orderCancelQuantities div').removeClass('has-error');
                $('.cancelOrderText').hide().text('');

                _($scope.model.lineItems).forEach(function (item, key) {

                    $scope.model.lineItems[key].cancelQtyFulfillable = '0';
                    $scope.model.lineItems[key].cancelQtyDamaged = '0';
                    $scope.model.lineItems[key].cancelQtyMissing = '0';

                });
            }
            
            $scope.checkVal =  function(){




                if($scope.cancelOrderRemarks==null || $scope.cancelOrderRemarks.length==0){
                    $('#order-cancel-remarks-old').focus().after('<label class="control-label has-error validationMessage" id="validation-remarks-label">'+ $constants.validationMessages.required +'</label>').closest('div').addClass('has-error');
                    return false
                }
                else{
                    $("#validation-remarks-label" ).remove();
                    $("#order-cancel-remarks-old").closest('div').removeClass('has-error');
                   
                    return true;
                }
            }

            $scope.cancelOrder = function(){

                   $("#validation-remarks-label" ).remove();
                    $("#order-cancel-remarks-old").closest('div').removeClass('has-error');

                //old modal-order-cancel-old  modal-order-cancel-new


/*
                   $('#confirm-modal-cancelOrder').modal();

                  
                    $('#modalCancelCancelOrder,#model-close').on('click',function(e){
                        $('#modalOk').off('click');
                    }); 
                        
                    $('#modalOkButtonCancelOrder').on('click',function(e){
                        $scope.cancelOrderService();
                        $('#modalCancelCancelOrder').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#modalOkButtonCancelOrder').off('click');
                    });
                    
                    $('#confirm-modal-cancelOrder').keypress(function(e){
                            if(e.keyCode == 13){
                                $('#modalCancelCancelOrder').click();
                            }
                    });*/


                    //New Modal



                 
                    if($scope.model.orderStatus=='HAS_ISSUES' || $scope.model.orderStatus=='UNAPPROVED'){

                   
                      
                        $('#modal-order-cancel-old').modal();
                            
                            $('#modalCancelCancelOrder,#model-close').on('click',function(e){
                                
                                $('#order-cancel-modalOk').off('click');
                            }); 
                                    
                            $('#modalOkButtonCancelOrder').on('click',function(e){


                                    if($scope.checkVal()){

                                        $('#modalCancelCancelOrder').click();
                                        $('.modal-backdrop.fade.in').remove();
                                        $('#modalOkButtonCancelOrder').off('click');
                                            $scope.cancelOrderService();
                                    }


                                    
                                 
                                });
                                
                                $('#modalOkButtonCancelOrder').keypress(function(e){
                                    if(e.keyCode == 13){
                                        $('#order-cancel-modalOk').click();
                                    }
                                });


                        



                    }
                    else{
                            // new modal
                            $('#modal-order-cancel-new').modal();
                            $('#order-cancel-modalCancel,#model-close').on('click',function(e){
                                $('#modal-order-cancel .form-group,textarea,input[type="text"],input[type="number"],div.has-error').removeClass('has-error');
                                $('#modal-order-cancel label.control-label.has-error.validationMessage').remove();
                                $('#order-cancel-modalOk').off('click');
                            }); 
                                    
                                $('#order-cancel-modalOk').on('click',function(e){
                                    
                                    if($scope.isTotalQtyValid()){

                                        $('#cancel-order-modalClose').click();
                                        $('.modal-backdrop.fade.in').remove();
                                            $scope.cancelOrderService();
                                    }
                                
                                });
                                
                                $('#modal-order-cancel-new').keypress(function(e){
                                    if(e.keyCode == 13){
                                        $('#order-cancel-modalOk').click();
                                    }
                                });

                    }

                 


             

            }

            $scope.cancelOrderService = function(){
                
                var updateJSON={
                    orderHeaderId        :   ($scope.model.orderHeaderId)?$scope.model.orderHeaderId:'',
                    ezcOrderNumber       :   ($scope.model.ezcOrderNumber)?$scope.model.ezcOrderNumber:'',
                    merchantOrderId      :   ($scope.model.merchantOrderId)?$scope.model.merchantOrderId:'',
                    purchaseOrderNumber  :   ($scope.model.purchaseOrders.length)?$scope.model.purchaseOrders.poNumber:'',
                    updateType           :   'cancelWholeOrder',
                    updateRemark         :   'Order Cancelled',
                    lineItems            :   []
                };

           

                for(i=0;i<$scope.model.lineItems.length;i++) {
                    
                    if($scope.model.orderStatus=='HAS_ISSUES' || $scope.model.orderStatus=='UNAPPROVED') {
                        
                        var qtyCancelled = qtyFulfillable = (!$scope.model.lineItems[i].quantity) ? 0 : parseInt($scope.model.lineItems[i].quantity);

                        var eachItem = {
                            orderLineId                     :   $scope.model.lineItems[i].orderLineId,
                            ezcSku                          :   $scope.model.lineItems[i].ezcSku,
                            channelLineId                   :   $scope.model.lineItems[i].channelLineId,
                            quantityCancelled               :   qtyCancelled,
                            orderlineQuantityDamaged        :   0,
                            orderlineQuantityFulfillable    :   qtyFulfillable,
                            orderlineQuantityMissing        :   0
                        };
                        updateJSON.lineItems.push(eachItem);

                    }else {
                        
                        var qtyCancelled = (!$scope.model.lineItems[i].quantity) ? 0 : parseInt($scope.model.lineItems[i].quantity);
                        var qtyFulfillable = (!$scope.model.lineItems[i].cancelQtyFulfillable) ? 0 : parseInt($scope.model.lineItems[i].cancelQtyFulfillable);
                        var qtyDamaged = (!$scope.model.lineItems[i].cancelQtyDamaged) ? 0 : parseInt($scope.model.lineItems[i].cancelQtyDamaged);
                        var qtyMissing = (!$scope.model.lineItems[i].cancelQtyMissing) ? 0 : parseInt($scope.model.lineItems[i].cancelQtyMissing);

                        var eachItem = {
                            orderLineId                     :   $scope.model.lineItems[i].orderLineId,
                            ezcSku                          :   $scope.model.lineItems[i].ezcSku,
                            channelLineId                   :   $scope.model.lineItems[i].channelLineId,
                            quantityCancelled               :   qtyCancelled,
                            orderlineQuantityDamaged        :   qtyDamaged, 
                            orderlineQuantityFulfillable    :   qtyFulfillable,  
                            orderlineQuantityMissing        :   qtyMissing,
                        };
                        updateJSON.lineItems.push(eachItem);
                    }
                }

                $bus.fetch({
                    name: 'ordersUpdate',
                    api : 'ordersUpdate',
                    data: JSON.stringify({
                            update: JSON.stringify(updateJSON)
                    })
                })
                    .done(function (data) {

                        var successMsgs = [];
                        if (data.response.success && data.response.success.length) {

                            $scope.orderEdited = true;
                            successMsgs = data.response.success;
                            notify.message(successMsgs.join(','),'','succ');

                            highlight.added($scope.model.merchantOrderId);
                            $location.path('orders/cancelled');
                        } else {
                            var errors = [];
                            _.forEach(data.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) notify.message($rootScope.pushJoinedMessages(errors));
                            else notify.message(messages.cancelOrderError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        notify.message(messages.cancelOrderError);
                        ngProgress.complete();
                    });
                    
             };

            $scope.getStrMonth = function (dateStr) {
                if (!dateStr) return;
                var date = [];
                date = dateStr.split('-');
                var month_names     = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                var dtString = date[2] + '/' + date[1] + '/' + date[0];
                var day = days[new Date(dtString).getDay()];
                if (date.length == 3) return (date[0] + ' ' + month_names[parseInt(date[1])] + ',' + date[2] + ' (' + day + ')');
            };

            $scope.getCutoffDtStr = function (fromDt, toDt) {
                if (fromDt && toDt) {
                //The order will be delivered between {{selectedShippingMethod.miniDate}} - {{selectedShippingMethod.maxiDate}} if you approve it before {{selectedShippingMethod.cutoffTime}} am {{selectedShippingMethod.day}}
                    var str = (fromDt == toDt) ? ("The order will be delivered on or before " + $scope.getStrMonth(fromDt)) : ("The order will be delivered between " + $scope.getStrMonth(fromDt) +' - '+ $scope.getStrMonth(toDt));
                    return str;
                }
            };

            $scope.getCutoffTimeStr = function (time, day) {
                //if you approve it before {{selectedShippingMethod.cutoffTime}} am {{selectedShippingMethod.day}}
                if (time) {
                    var times = time.split(':')
                    var time = (times[0] > 12) ? times[0] - 12 + ':' + times[1] + ' pm': times [0] + ':' + times[1] + ' am';
                    return ' if you approve it before '+ time + ' ' + day ;
                }
            };

            $scope.init = function () {
                $scope.active=false;
                $rootScope.getCountryList();
                $scope.dateinit();
                $scope.populatePagingData();
                $scope.fetchData();
                $rootScope.getOrdersCount();
                $scope.getFulfillment();
                ngProgress.complete();
                $scope.attachEventsForTypeAhead();
                $("#edit-order-review").on('click', 'button[type="submit"]', function (e) {
                    $scope.isApprove = $(this).hasClass("approve") ? true : false;
                });

                if($rootScope.isCountriesOptionsVisible('orderPostalCode')){

                    $scope.australiaPostalCodes = [];

                    $rootScope.getAustraliaPostalCodes().done(function(data){

                        $scope.australiaPostalCodes  = data;

                    });

                }

                $scope.admminOrderEdit = function(param) {
                    //admin edit orders
                    if(param=='PROCESS_MGR' && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length)
                        return true;
                    else
                       return false;
                };
                
                _($scope.model.lineItems).forEach(function (item, key) {
                    $scope.model.lineItems[key].cancelQtyFulfillable = '0';
                    $scope.model.lineItems[key].cancelQtyDamaged = '0';
                    $scope.model.lineItems[key].cancelQtyMissing = '0';
                    
                });

                $scope.managerOrderEditFields = function(param) {
                    //stop manager orders editable fields
                    if( param && param=='PROCESS_MGR' && (_.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length))
                        return true;
                    else
                       return false;
                };

            };
    }]);
});