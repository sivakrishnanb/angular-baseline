define(['app', 'model/orders/details', 'utility/messages'], function (app, model, messages) {
    app.controller('ViewOrders', ['$window','$scope', '$bus', 'ngProgress', '$constants', '$routeParams', 'toaster', '$rootScope', '$location', 'notify','highlight',
        function ($window,$scope, $bus, ngProgress, $constants, $routeParams, toaster, $rootScope, $location, notify,highlight) {

            $scope.constants = $constants;

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            };
            
            $scope.getDisplayName = function (code, list) {
                return _.findWhere($constants[list], {
                    "value": code
                }) ? _.findWhere($constants[list], {
                    "value": code
                }).name : $constants.notAvailable;
            }
            $scope.displayCountryName = "";
            $scope.getCountryName = function (code) {
                $rootScope.getCountryList().done(function () {
                    $scope.displayCountryName = _.findWhere($rootScope.countryList, {
                        "countryCode": code
                    }) ? _.findWhere($rootScope.countryList, {
                        "countryCode": code
                    }).countryName : $constants.notAvailable;
                });
            }
            
	    $scope.orderStatus = "";
	    
	    $scope.getOrderStatus = function(status){
                $scope.orderStatus = _.findWhere($constants.orderStatus, {
                        "value": status
                    }) ? _.findWhere($constants.orderStatus, {
                        "value": status
                    }).display : $constants.notAvailableText;
            }
	    
            $scope.resetCancelOrder = function() {

                $('.orderCancelQuantities div').removeClass('has-error');
                $('.cancelOrderText').hide().text('');

                _($scope.model.lineItems).forEach(function (item, key) {

                    $scope.model.lineItems[key].cancelQtyFulfillable = '';
                    $scope.model.lineItems[key].cancelQtyDamaged = '';
                    $scope.model.lineItems[key].cancelQtyMissing = '';

                });
            }
            
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


            $scope.getDescText = function()
            {

               
                switch ($scope.orderStatus) {
                case 'Has Issues':
                    return messages.headerOrderViewHasIssues;
                    break;
                case 'Unapproved':
                    return messages.headerOrderViewUnapproved;
                    break;
                case 'In Process':
                    return messages.headerOrderViewInProcess;
                    break;
                case 'Fulfillment':
                    return messages.headerOrderViewUnderFulfilment;
                    break;
                case 'Shipped':
                    return messages.headerOrderViewShipped;
                    break;
                case 'Delivered':
                    return messages.headerOrderViewDelivered;
                    break;
                }
            }

            $scope.showPoOrderNumber = function(orderStatus,order){
                
                if(order && order.purchaseOrders && order.purchaseOrders.length && order.purchaseOrders[0].poNumber && orderStatus && (orderStatus=='IN_PROCESS' || orderStatus=='FULFILLMENT' || orderStatus=='SHIPPED' || orderStatus=='DELIVERED') && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length)
                    return true;
                else 
                    return false;

            }


            $scope.cancel = function () {
                //var answer = confirm(messages.orderCancelConfirm) commented
                if (!$scope.productEdited) {
                    
                    //event.preventDefault();
                    
                    $('#confirm-orderCanel-modal').modal();
                    
                    $('#orderCanel-modalCancel,#orderCanel-model-close').on('click',function(e){
                        $('#orderCanel-modalOk').off('click');
                    }); 
                        
                    $('#orderCanel-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        $window.location=next;
                        $('#orderCanel-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#orderCanel-modalOk').off('click');
                    });
                    
                    $('#confirm-orderCanel-modal').keypress(function(e){
						if(e.keyCode == 13 || e.keyCode == 32){
							$('#orderCanel-modalOk').click();
						}
					});
                    
                }
                if (answer) {
                    var request = {
                        inboundCode: $scope.model.header.inboundCode,
                        isCancel: 1
                    }
                    $bus.fetch({
                        name: 'editorders',
                        api: 'editorders',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length && success.response.data && success.response.data.order) {
                                $scope.model.header.cancelledDate = success.response.data.order.header.cancelledDate;
                                //toaster.pop("success", messages.orderCancelSuccess); commented
                                notify.message(messages.orderCancelSuccess,'','succ');
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //toaster.pop("error", errors.join(', '), '', 0); commented
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //toaster.pop("error", messages.orderCancelError, "", 0); commented
                                    notify.message(messages.orderCancelError);
                                }
                            }
                        }).fail(function (error) {
                            //toaster.pop("error", messages.orderCancelError); commented
                            notify.message(messages.orderCancelError);
                        });
                }
            }

            $scope.restore = function () {
                //var answer = confirm(messages.orderRestoreConfirm) commented
                //event.preventDefault();
                    
                    $('#confirm-orderRestore-modal').modal();
                    
                    $('#orderRestore-modalCancel,#orderRestore-model-close').on('click',function(e){
                        $('#orderRestore-modalOk').off('click');
                    }); 
                        
                    $('#orderRestore-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        $window.location=next;
                        $('#orderRestore-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#orderRestore-modalOk').off('click');
                    });
                    
                    $('#confirm-orderRestore-modal').keypress(function(e){
						if(e.keyCode == 13 || e.keyCode == 32){
							$('#orderRestore-modalOk').click();
						}
					});
                    
                if (answer) {
                    var request = {
                        inboundCode: $scope.model.header.inboundCode,
                        isRestore: 1
                    }
                    $bus.fetch({
                        name: 'editorders',
                        api: 'editorders',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length && success.response.data && success.response.data.order) {
                                $scope.model.header.cancelledDate = success.response.data.order.header.cancelledDate;
                                //toaster.pop("success", messages.orderRestoreSuccess); commented
                                notify.message(messages.orderRestoreSuccess,'','succ');
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //toaster.pop("error", errors.join(', '), '', 0); commented
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //toaster.pop("error", messages.orderRestoreError, "", 0); commented
                                    notify.message(messages.orderRestoreError);
                                }
                            }
                        }).fail(function (error) {
                            //toaster.pop("error", messages.orderRestoreError); commented
                            notify.message(messages.orderRestoreError);
                        });
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
            
            $scope.approve = function() {
                ngProgress.start();
                $scope.model.isMgrApproved = true;
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
                            if (success.response.success.length) {
                                //toaster.pop("success", messages.orderUpdateSucess); commented
                                notify.message(messages.orderApproveSuccess.replace('##',$scope.model.merchantOrderId),'','succ');
                                highlight.added($scope.model.merchantOrderId);
                                $location.path('orders/inprocess');
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //toaster.pop("error", errors.join(', '), '', 0); commented
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //toaster.pop("error", messages.orderUpdateError, "", 0); commented
                                    notify.message(messages.orderApproveError);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                //toaster.pop("error", errors.join(', '), '', 0); commented
                                notify.message($rootScope.pushJoinedMessages(errors));
                            } else {
                                //toaster.pop("error", messages.orderUpdateError, "", 0); commented
                                notify.message(messages.orderApproveError);
                            }
                            ngProgress.complete();
                        });  
            }
            $scope.trackingHistory = [];
            $scope.trackingNumber = null;
            $scope.shipmentWeight = null;
            $scope.shipmentDeliveryCharge = null;
            $scope.trackByNumber = function(index) {
                $scope.trackingHistory = $scope.model.shipments[index].shipmentHistory;
                $scope.trackingNumber = $scope.model.shipments[index].shipmentTrackingNumber;
                $scope.shipmentWeight = $scope.model.shipments[index].shipmentWeight;
                $scope.shipmentDeliveryCharge = $scope.model.shipments[index].shipmentDeliveryCharge;
				$('#modal-order-tracking-details').modal();
            }
            
            
            $scope.getCategory = function (cat) {
                return _.findWhere($constants.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($constants.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            }

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

            $scope.duplicate = function(code){
                $scope.orderEdited = true;

                $location.path('orders/create').search({clone: code});
            };
            $scope.getNextItem = function (index) {

                if (index < 0 || index >= $rootScope.orderHeaders.length) return;
                var path = '/orders/edit/' + $rootScope.orderHeaders[index];
                $location.path(path);
            };

            $scope.cancelOrder = function(){
                
                    $('#modal-order-cancel').modal();
                    
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
                    
                    $('#modal-order-cancel').keypress(function(e){
                        if(e.keyCode == 13){
                            $('#order-cancel-modalOk').click();
                        }
                    });
            }

            $scope.cancelOrderService = function(){

        
                var updateJSON = {
                    orderHeaderId       :   ($scope.model.orderHeaderId)?$scope.model.orderHeaderId:'',
                    ezcOrderNumber      :   ($scope.model.ezcOrderNumber)?$scope.model.ezcOrderNumber:'',
                    merchantOrderId     :   ($scope.model.merchantOrderId)?$scope.model.merchantOrderId:'',
                    purchaseOrderNumber :   ($scope.model.purchaseOrders.length)?$scope.model.purchaseOrders.poNumber:'',
                    updateType          :   'cancelWholeOrder',
                    updateRemark        :   ($scope.remarks)?$scope.remarks:'',
                    lineItems           :   []
                };


                for(i=0;i<$scope.model.lineItems.length;i++){
                    
                    var qtyCancelled = (!$scope.model.lineItems[i].quantity) ? 0 : parseInt($scope.model.lineItems[i].quantity);
                    var qtyFulfillable = (!$scope.model.lineItems[i].cancelQtyFulfillable) ? 0 : parseInt($scope.model.lineItems[i].cancelQtyFulfillable);
                    var qtyDamaged = (!$scope.model.lineItems[i].cancelQtyDamaged) ? 0 : parseInt($scope.model.lineItems[i].cancelQtyDamaged);
                    var qtyMissing = (!$scope.model.lineItems[i].cancelQtyMissing) ? 0 : parseInt($scope.model.lineItems[i].cancelQtyMissing);

                    //need to remove once service is up and ready
                    // if(qtyMissing && qtyCancelled > (qtyFulfillable + qtyDamaged )){
                    //     qtyFulfillable+=1;
                    // }

                    var eachItem = {
                        orderLineId                     :   $scope.model.lineItems[i].orderLineId,
                        ezcSku                          :   $scope.model.lineItems[i].ezcSku,
                        quantityCancelled               :   qtyCancelled,
                        orderlineQuantityDamaged        :   qtyDamaged, 
                        orderlineQuantityFulfillable    :   qtyFulfillable,  
                        orderlineQuantityMissing        :   qtyMissing,
                    };
                    updateJSON.lineItems.push(eachItem);
                }


                $bus.fetch({
                    name: 'ordersUpdate',
                    api : 'ordersUpdate',
                    data: JSON.stringify({
                            update: JSON.stringify(updateJSON)
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .done(function (data) {
                       
                        var successMsgs = [];
                        if (data.response.success && data.response.success.length) {
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
                        //toaster.pop("error", messages.merchantListFetchError);
                        notify.message(messages.cancelOrderError);
                        ngProgress.complete();
                    });
                    
             };

             $scope.showViewCancelOrder = function(param) {

                if((param=='IN_PROCESS' || param=='FULFILLMENT' || param=='PROCESS_MGR') && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length)
                    return true;
                else
                     return false;

            };


            $scope.init = function () {
                $scope.isTotalQty=false;

                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });
                $scope.populatePagingData();
                $rootScope.getOrdersCount();
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

                            data.order[0].customer.shippingAddress.email = data.order[0].customerEmail;
                            var phNumber = data.order[0].customer.shippingAddress.phone;
                            var phType = data.order[0].customer.shippingAddress.type || 'CELL';

                            $scope.model = new model(data.order[0]);
                            if ($scope.model.customer.shippingAddress.countryCode != $constants.currentLocation) {
                                $scope.isInternationalOrder = true;
                            }
							/*$scope.model.shipping.fulfillRate = 2.5;
							_($scope.model.lineItems).forEach(function (item, key) {
								$scope.model.shipping.fulfillRate += Number(item.quantity);
                                $scope.model.lineItems[key].productCategory = $scope.getCategory(item.productCategory);
                                $rootScope.getCountryNameByCode(item.originCountry).done(function(name){
                                    $scope.model.lineItems[key].countryByName = name;
                                });
                            });*/
                            
                            _($scope.model.lineItems).forEach(function (item, key) {
                                
                                $scope.model.lineItems[key].cancelQtyFulfillable = '0';
                                $scope.model.lineItems[key].cancelQtyDamaged = '0';
                                $scope.model.lineItems[key].cancelQtyMissing = '0';
                                
                            });
                            
                            $scope.getOrderStatus($scope.model.orderStatus);
                            $scope.model.customer.shippingAddress.phone = [new $scope.model.Phone()]
                            $scope.model.customer.shippingAddress.phone[0].type = phType;
                            $scope.model.customer.shippingAddress.phone[0].number = phNumber;
                            $scope.model.customer.shippingAddress.countryCode = $scope.getCountryName($scope.model.customer.shippingAddress.countryCode);
                            var elCharge = $scope.model.shipping.estEnhancedCost ? Number(Number($scope.model.shipping.estEnhancedCost).toFixed(2)) : 0;
                            var deliveryCharge = $scope.model.shipping.estDeliveryCharge ? Number(Number($scope.model.shipping.estDeliveryCharge).toFixed(2)) : 0;
                            var handlingfee = $scope.model.shipping.estFulfillmentCharge ? Number(Number($scope.model.shipping.estFulfillmentCharge).toFixed(2)) : 0;
                            $scope.model.shipping.totalCharge = Number(deliveryCharge) + Number(handlingfee) + Number(elCharge);
                            $scope.model.additionalInfo = new $scope.model.AdditionalInfo()
                            _(data.order[0].additionalInfo).forEach(function (info) {
                                _(info).forIn(function (value, key) {
                                    $scope.model.additionalInfo[key] = value;
                                });
                            });
                            $scope.model.shipments = data.order[0].shipments;
                            $scope.model.trackingNumber = _.pluck($scope.model.shipments, 'shipmentTrackingNumber');

                            if(($scope.model.orderStatus == 'SHIPPED' || $scope.model.orderStatus == 'DELIVERED') &&  $scope.model.shipments.length) {
                                $scope.model.shipping.estDeliveryCharge = 0;
                                $scope.model.shipping.estShippingWeight = 0;
                                _.each($scope.model.shipments, function(data){
                                    $scope.model.shipping.estDeliveryCharge += (data.shipmentDeliveryCharge ? Number(data.shipmentDeliveryCharge) : 0);
                                    $scope.model.shipping.estShippingWeight += (data.shipmentWeight ? Number(data.shipmentWeight) : 0);
                                });
                                deliveryCharge = $scope.model.shipping.estDeliveryCharge ? Number(Number($scope.model.shipping.estDeliveryCharge).toFixed(2)) : 0;
                                $scope.model.shipping.totalCharge = Number(deliveryCharge) + Number(handlingfee) + Number(elCharge);
                                $scope.model.shipping.estShippingWeight = Number($scope.model.shipping.estShippingWeight).toFixed(2);
                                
                            }
                            $scope.model.purchaseOrders = data.order[0].purchaseOrders;
                            //toaster.pop("success", messages.orderDetail, messages.retrivedSuccess);
                        } else {
                            //toaster.pop("error", messages.orderFetchError); commented
                            notify.message(messages.orderFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model(); 
                        //toaster.pop("error", messages.orderFetchError); commented
                        notify.message(messages.orderFetchError);
                        ngProgress.complete();
                    });
            };
    }]);
});