define(['app', 'model/orders/details', 'utility/messages'], function (app, model, messages) {
    app.controller('Orders', ['$scope', '$bus', 'ngProgress', '$rootScope', '$routeParams', '$constants', '$location', '$timeout','notify',  '$localStorage',
        function ($scope, $bus, ngProgress, $rootScope, $routeParams, $constants, $location, $timeout,notify,$localStorage) {


            $scope.orderFilterOptions = angular.copy($constants.orderFilterOptions);

            $scope.dateOptions = $constants.orderDateOptions;

            $scope.orderStatus = $constants.orderStatus;

            $scope.orderTypeOptions = $constants.orderTypeOptions;

            $scope.orderInventoryOptions = $constants.orderInventoryOptions;

            $scope.orderChannelOptions = $constants.orderChannelOptions;

            $scope.orderSortingMapping = $constants.orderSortingMapping;

            $scope.constants = $constants;


            $scope.isOptionReturns = function(param) {

                switch (param) {
                    
                    case 'searchOrderText':
                        if ($routeParams) {
                            if      ($routeParams.status=='returns')  return 'Search Returns';
                            else if ($routeParams.status=='removals') return 'Search Removals';
                            else return 'Search Orders';
                        }
                    break;

                    case 'createdDateRange':
                    return ($routeParams && ($routeParams.status=='returns' || $routeParams.status=='removals'))?false:true;
                    break;

                    case 'createReturn':
                    return ($routeParams && $routeParams.status=='returns')?true:false;
                    break;

                    case 'sortCategory':
                    return ($routeParams && $routeParams.status=='returns')?false:true;
                    break;

                    case 'createRemovals':
                        return ($routeParams && $routeParams.status=='removals')?true:false;
                        break;

                    case 'orderChannel':
                    return ($routeParams && ($routeParams.status=='returns' || $routeParams.status=='removals'))?false:true;
                    break;

                    case 'orderType':
                    return ($routeParams && ($routeParams.status=='returns' || $routeParams.status=='removals'))? false : true;
                    break;

                    case 'actionsMenu':
                    return ($routeParams && ($routeParams.status=='returns' || $routeParams.status=='removals'))?false:true;
                    break;

                    case 'orderFilterOptions':
                    if($routeParams && $routeParams.status=='returns' || $routeParams.status == 'removals')
                        $scope.orderFilterOptions =  angular.copy($constants.orderReturnsFilterOptions);
                    break;

                    case 'ordersGrid':
                    return ($routeParams && ($routeParams.status=='returns' || $routeParams.status=='removals'))?false:true;
                    break;

                    case 'ordersReturnsGrid':
                    return ($routeParams && $routeParams.status=='returns')?true:false;
                    break;

                    case 'suggestionContainer':
                    return ($routeParams && $routeParams.status=='returns')?false:true;
                    break;

                    case 'suggestionReturnsContainer':
                    return ($routeParams && $routeParams.status=='returns')?true:false;
                    break;

                    case 'ordersCountryCode':
                    return ($routeParams && $routeParams.status=='returns')?true:false;

                    case 'ordersRemovalsGrid':
                    return ($routeParams && $routeParams.status=='removals')?true:false;
                    break;

                    case 'ordersCountryCode':
                    return ($routeParams && ($routeParams.status=='returns' || $routeParams.status=='removals'))?true:false;
                    break;

                    case 'searchOrderSuggestion':
                    if($routeParams && $routeParams.status=='returns')
                        return 'No matching returns found';
                    else 
                        return 'No matching orders found';

                    case 'sortCol':
                    return ($routeParams && $routeParams.status=='returns')?true:false;
                    break;

                    case 'sortOrder':
                    return ($routeParams && $routeParams.status=='returns')?true:false;
                    break;

                    case 'getSuggestionClass':
                    return ($routeParams && $routeParams.status=='returns')?'create-returns-suggestions':'';
                    break;

                    case 'getPagingClass':
                    return ($routeParams && $routeParams.status=='returns')?'pull-right':'';
                    break;

                    default:
                    return false;
                }

            }

            //
            $scope.getOrderStatus = function()
            {
                if ($routeParams.status=='all') {
                    return true;
                }
            }


             //
            $scope.getNoOrdersHeader = function()
            {
                if($routeParams && ($routeParams.scol || $routeParams.skey || $routeParams.date || $routeParams.type || $routeParams.c || $routeParams.inv)){
                    return messages.noOrdersHeaderTextFilter;
                
                }else if ($routeParams.status=='hasissues' ) {
                    return messages.noOrdersHeaderTextHasIssues;
                
                }else if ($routeParams.status=='all' || !($routeParams.status)) {
                    return messages.noOrdersHeaderTextAll;
                
                }else if ($routeParams.status=='unapproved') {
                    return messages.noOrdersHeaderTextUnaproved;
                
                }else if ($routeParams.status=='inprocess') {
                    return messages.noOrdersHeaderTextInProcess;
                
                }else if ($routeParams.status=='fulfillment') {
                    return messages.noOrdersHeaderTextUnderFulfillment;
                
                }else if ($routeParams.status=='shipped') {
                    return messages.noOrdersHeaderTextShipped;
                
                }else if ($routeParams.status=='delivered') {
                    return messages.noOrdersHeaderTextDelivered;
                
                }else if ($routeParams.status=='drafts') {
                    return messages.noOrdersHeaderTextDrafts;
                
                }else if ($routeParams.status=='cancelled') {
                    return messages.noOrdersHeaderTextCancelled;
                }else if ($routeParams.status=='undeliverable') {
                    return messages.noOrdersHeaderTextUndeliverable;
                }
                else if ($routeParams.status=='returns') {
                    return messages.noOrdersHeaderTextReturns;
                }
                else if ($routeParams.status=='removals') {
                    return messages.noOrdersHeaderTextRemovals;
                }
            }

            $scope.showPoOrderNumber = function(orderStatus,order){
                
                if(order && order.purchaseOrders && order.purchaseOrders[0].poNumber && orderStatus && (orderStatus=='IN_PROCESS' || orderStatus=='FULFILLMENT' || orderStatus=='SHIPPED' || orderStatus=='DELIVERED') && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length)
                    return true;
                else 
                    return false;

            }

            $scope.showRemovalPoOrderNumber = function(orderStatus,order){
                
                if(order && order.purchaseOrders && order.purchaseOrders[0].poNumber && orderStatus && (orderStatus=='IN_PROCESS' || orderStatus=='FULFILLMENT' || orderStatus=='SHIPPED' || orderStatus=='DELIVERED') && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin']).length)
                    return true;
                else 
                    return false;

            }
            $scope.showInventoryType = function(){
                
                if (($routeParams && $routeParams.status=='hasissues') || ($routeParams && $routeParams.status=='unapproved')) {
                    return true;
                }else{
                    return false;
                }
            }

            $scope.getNoOrderSubMessage = function()
            {
                
                if($routeParams && ($routeParams.scol || $routeParams.skey || $routeParams.date || $routeParams.type || $routeParams.c || $routeParams.inv)){
                    return messages.noOrderssHeaderSubTextFilter;
                
                }else if ($routeParams.status=='hasissues') {
                    return messages.noOrdersHeaderSubTextHasIssues;
                
                }else if ($routeParams.status=='all'  || !($routeParams.status)) {
                    return messages.noOrdersHeaderSubTextAll;
                
                }else if ($routeParams.status=='unapproved') {
                    return messages.noOrdersHeaderSubTextUnapproved;
                
                }else if ($routeParams.status=='inprocess') {
                    return messages.noOrdersHeaderSubTextInProcess;
                
                }else if ($routeParams.status=='fulfillment') {
                    return messages.noOrdersHeaderSubTextUnderFulfillment;
                
                }else if ($routeParams.status=='shipped') {
                    return messages.noOrdersHeaderSubTextDelivered;
                
                }else if ($routeParams.status=='delivered') {
                    return messages.noOrdersHeaderSubTextDelivered;
                
                }else if ($routeParams.status=='drafts') {
                    return messages.noOrdersHeaderSubTextDrafts;
                
                }else if ($routeParams.status=='cancelled') {
                    return messages.noOrdersHeaderSubTextCancelled;
                }else if ($routeParams.status=='undeliverable') {
                    return messages.noOrdersHeaderSubTextCancelled;
                }
                else if ($routeParams.status=='returns') {
                    return messages.noOrdersHeaderSubTextReturns;
                }
            }


            $scope.dynClass = function () {
                if ($routeParams.status == 'all') {
                    return true;
                }
            }
            
            $scope.getCategory = function (cat) {
                return _.findWhere($constants.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($constants.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            }


            $scope.getCountryName = function (code) {
                return code;
            }


            $scope.getShipmentTrackingNumber = function(param) {

                if(param){
                    return (_.compact(_.map(param.shipments,function(val) {  return(val && val.shipmentTrackingNumber)?(val.shipmentTrackingNumber):'';  }))).join(',');
                }else{
                    return $constants.notAvailableText;
                }

            };

            $scope.sort = function (field, name) {
                if ($scope.sortingOptions.field != field || $scope.sortingOptions.name != name) {
                    $scope.sortingOptions.field = field;
                    $localStorage.pagingOptions.orders.sortingOption = field;
                    $scope.applyFilter();
                }
            }

            $scope.sortDirection = function () {
                if ($scope.sortingOptions.direction == 'desc') {
                    $scope.sortingOptions.direction = 'asc';
                    $localStorage.pagingOptions.orders.sortDir = 'asc';
                } else {
                    $scope.sortingOptions.direction = 'desc';
                    $localStorage.pagingOptions.orders.sortDir = 'desc';
                }
                $scope.applyFilter();
            };
            
            $scope.getOrdersLandingDateOne = function(order){

               /* var date = (order.createdDate)?order.createdDate:$constants.notAvailableText;
                    return 'Created : '+date;*/
                var date = $constants.notAvailableText;
                
                if(order.orderStatus=='HAS_ISSUES' || order.orderStatus=='UNAPPROVED' || order.orderStatus=='IN_PROCESS' || order.orderStatus=='FULFILLMENT' || order.orderStatus=='DRAFT' || order.orderStatus=='PROCESS_MGR'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Created'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Created : '+date;
                   
                }else if(order.orderStatus=='SHIPPED' || order.orderStatus=='DELIVERED'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Approved'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Approved : '+date;
                   
                }else if(order.orderStatus=='CANCELLED'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Cancelled'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Cancelled : '+date;
                }else if(order.orderStatus=='UNDELIVERABLE'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Undeliverable'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Returned : '+date;
                }




            }

            $scope.getOrdersLandingDateTwo = function(order){
                
                /* var date = (order.modifiedDate)?order.modifiedDate:$constants.notAvailableText;
                    return 'Modified : '+date; */

                var date = $constants.notAvailableText;

                if(order.orderStatus=='HAS_ISSUES' || order.orderStatus=='UNAPPROVED' || order.orderStatus=='DRAFT' || order.orderStatus=='PROCESS_MGR'){

                    var date = (order.modifiedDate)?order.modifiedDate:$constants.notAvailableText;

                    return 'Modified : '+date;

                }else if(order.orderStatus=='IN_PROCESS' || order.orderStatus=='FULFILLMENT'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Approved'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Approved : '+date;

                }else if(order.orderStatus=='SHIPPED'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Shipped'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }



                    return 'Shipped : '+date;

                }else if(order.orderStatus=='DELIVERED'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Delivered'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }




                    return 'Delivered : '+date;

                }else if(order.orderStatus=='CANCELLED'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Created'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Created : '+date;

                }
                else if(order.orderStatus=='UNDELIVERABLE'){

                    for(i=0;i<order.history.length;i++){
                        if(order.history[i].historyTag=='Undeliverable'){
                             var date = (order.history[i].historyDate) ? order.history[i].historyDate : $constants.notAvailableText;
                        }
                    }
                    return 'Shipped : '+date;

                }

            }


            $scope.approve = function(order) {
                var phNumber = order.customer.shippingAddress.phone;
                var phType = order.customer.shippingAddress.type || 'CELL';
                var data = new model(order);
                data.customer.shippingAddress.phone = [new data.Phone()];
                data.customer.shippingAddress.phone[0].type = phType;
                data.customer.shippingAddress.phone[0].number = phNumber;
                ngProgress.start();
                data.isMgrApproved = true;
                var params = {
                    id: data.orderHeaderId || ''
                }
                $bus.fetch({
                        name: 'editorders',
                        api: 'editorders',
                        resturl: true,
                        params: params,
                        data: JSON.stringify({
                            order: JSON.stringify(data)
                        })
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                notify.message(messages.orderApproveSuccess.replace('##',data.merchantOrderId),'','succ','1');
                                order.orderStatus = 'IN_PROCESS';
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors),'','',1);
                                } else {
                                    notify.message(messages.orderApproveError,'','',1);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors),'','',1);
                            } else {
                                notify.message(messages.orderApproveError,'','',1);
                            }
                            ngProgress.complete();
                        });  
            };


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
                    $scope.model.displayableDate = $scope.formatDate(new Date($scope.convertDateFormat($scope.model.displayableDate,'yyyy/mm/dd', '-')));
                $scope.model.shipping.liabilityTaken = $scope.model.shipping.liabilityTaken ? true : false;
                $scope.model.shipping.liabilityValue = $scope.model.shipping.liabilityValue ? Number($scope.model.shipping.liabilityValue) : 0;
                $scope.model.customer.shippingAddress.saveToBook = $scope.model.customer.shippingAddress.saveToBook ? true : false;
            };


            $scope.getItemDetails = function (product) {
                var params = {
                    id: product.ezcSku
                };
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
                                errors.push(error);
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
            };

            $scope.convertDateFormat = function (date, format, separator) {
                var separator = separator || "/";
                var dates = date.split(separator);
                var dd, mm, yyyy;
                dd   = dates[0];
                mm   = dates[1];
                yyyy = dates[2];
                if      (format == "mm/dd/yyyy")    return mm + separator + dd + separator + yyyy;
                else if (format == "dd/mm/yyyy")    return dd + separator + mm + separator + yyyy;
                else if (format == "yyyy/mm/dd")    return yyyy + separator + mm + separator + dd;
            };

            $scope.merchantApprove = function(order) {

                ngProgress.start();

                $scope.mapToEdit(order);

                $scope.model.isApproved = true;

                var params = {
                    id: order.orderHeaderId || ''
                };

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
                                notify.message(messages.orderApproveSuccess.replace('##',order.merchantOrderId),'','succ','1');
                                $location.path('orders/inprocess');
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error);
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors),'','',1);
                                } else {
                                    notify.message(messages.orderApproveError,'','',1);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error);
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors),'','',1);
                            } else {
                                notify.message(messages.orderApproveError,'','',1);
                            }
                            ngProgress.complete();
                        });  

            };

            $scope.closeUpdateModal = function() {
                $('#order-bulk-approve').modal('hide');
                $('.modal-backdrop.fade.in').remove();
                $location.path('/orders/inprocess');
                $scope.getPagedDataAsync();
            };

            $scope.getBulkApprovePercentage = function(key) {
                if (!$rootScope.bulkProdUpdate) return;
                if      (key == 'total')    return Math.round(($rootScope.bulkProdUpdate.prodsSuccess + $rootScope.bulkProdUpdate.prodsFailed) / ($rootScope.bulkProdUpdate.totalProdsCount)*100);
                else if (key == 'success')  return Math.round($rootScope.bulkProdUpdate.prodsSuccess  / $rootScope.bulkProdUpdate.totalProdsCount*100);
                else if (key == 'failed')   return Math.round($rootScope.bulkProdUpdate.prodsFailed   / $rootScope.bulkProdUpdate.totalProdsCount*100)
            }


            $scope.changeOrderStauts = function() {

                $rootScope.prods = [];
                angular.forEach($scope.myData, function(prod) {
                    if (prod.Selected) {
                        $rootScope.prods.push(prod)
                    }
                });
                if ($rootScope.prods.length == 0) return;
                $('#order-bulk-approve').modal();
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
                };

                var changeStatus = function () {
                    var slicedProds = [];
                    if ($rootScope.prods.length > 5) {
                        slicedProds = $rootScope.prods.slice(0, 5);
                        $rootScope.prods.splice(0,5);
                    }
                    else slicedProds = angular.copy($rootScope.prods);
                    $rootScope.bulkProdUpdate.slicedProdsLength = slicedProds.length;


                    angular.forEach(slicedProds, function(orders) {

                        $scope.mapToEdit(orders);

                        if(orders.orderStatus=='UNAPPROVED') {
                            $scope.model.isApproved = true;
                            $scope.model.isMgrApproved = false;
                        }

                        if(orders.orderStatus=='PROCESS_MGR') {
                            $scope.model.isApproved = false;
                            $scope.model.isMgrApproved = true;
                        }

                        var params = {
                            id: orders.orderHeaderId || ''
                        };

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

                                // {"status":1,"errors":null,"success":["OrderCreate","Order created successfully"],"data":{"orderHeaderId":"2322","ezcOrderNumber":"FL00003134","orderStatus":"PROCESS_MGR"}}
                                // {"status":0,"errors":["Error","We found more than one non-Draft order that already has a merchantOrderId of: #1031. This should never happen.  Please notify the system admin immediately."],"success":null,"data":null}

                                if (success && success.response && success.response.errors && success.response.errors.length) {

                                    $rootScope.bulkProdUpdate.prodsFailed++;
                                    $rootScope.bulkProdUpdate.response.push(success);
                                    $rootScope.bulkProdUpdate.prodsHitCount++;
                                    var failureMsg = success.response.errors.join(',').replace('Error,','');
                                    $rootScope.bulkProdUpdate.failedSKU.push(orders.ezcOrderNumber + ' - ' + failureMsg);

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
                                    $rootScope.bulkProdUpdate.successSKU.push(orders.ezcOrderNumber);
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

                                var failureMsg = error.response.errors.join(',').replace('Error,','');
                                $rootScope.bulkProdUpdate.failedSKU.push(orders.ezcOrderNumber + ' - ' + failureMsg);

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


            $scope.isOptionVisible = function (option) {

                switch (option) {
                case 'products':
                    return ($routeParams.status == 'hasissues' || $routeParams.status == 'unapproved' ||
                        $routeParams.status == 'inprocess' || $routeParams.status == 'fulfillment' || $routeParams.status == 'drafts' ||
                        $routeParams.status == 'drafts' || $routeParams.status == 'cancelled');
                    break;
                case 'action':
                    return ($routeParams.status == 'drafts');
                    break;
                case 'approve':
                    return ($routeParams.status == 'delivered');
                    break;
                
                case 'bulkApprove':
                    return (!$routeParams.status || $routeParams.status=='all' || $routeParams.status=='unapproved' || ($routeParams.status == 'inprocess' && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length));
                    break;
                    
                case 'orderBulkDelete':
                    return (!$routeParams.status || $routeParams.status=='all' || $routeParams.status == 'drafts' || $routeParams.status == 'cancelled');
                    break;

                case 'cancel':
                    return ($routeParams.status != 'delivered' || $routeParams.status != 'cancelled');
                    break;
                case 'restore':
                    return ($routeParams.status == 'cancelled');
                    break;
                case 'orderStatus':
                    return ($routeParams.status == 'all' || !$routeParams.status);
                    break;
                case 'remarks':
                    return ($routeParams.status == 'hasissues' || $routeParams.status == 'unapproved' || $routeParams.status == 'inprocess' || $routeParams.status == 'fulfillment' || $routeParams.status == 'drafts');
                    break;
                case 'trackingNumber':
                    return ($routeParams.status == 'shipped' || $routeParams.status == 'delivered' || $routeParams.status == 'undeliverable');
                    break;
                case 'ordAccQtyShipped':
                    return ($routeParams.status == 'shipped' || $routeParams.status == 'delivered');
                        break;
                case 'ordersView':
                    return ($routeParams.status == 'cancelled' || $routeParams.status == 'delivered' || $routeParams.status == 'shipped' || $routeParams.status == 'fulfillment' || $routeParams.status == 'inprocess' || $routeParams.status == 'undeliverable' );
                    break;
                case 'ordersEdit':
                    return ($routeParams.status == 'all' || $routeParams.status == 'hasissues' || $routeParams.status == 'unapproved' || $routeParams.status == 'drafts' || !$routeParams.status);
                    break;

                case 'ordOthersCollapse':
                     return ($routeParams.status == 'returns' || $routeParams.status == 'removals' || $routeParams.status == 'drafts' || $routeParams.status == 'cancelled'  || $routeParams.status == 'undeliverable' );
                    break;

                case 'ordPendingCollapse':
                     return ($routeParams.status == 'hasissues' || $routeParams.status == 'unapproved');
                    break;
                case 'ordApprovedCollapse':
                    return ($routeParams.status == 'delivered' || $routeParams.status == 'shipped' || $routeParams.status == 'fulfillment' || $routeParams.status == 'inprocess');
                    break;
                case 'HAS_ISSUES':
                    if ($routeParams.status && $routeParams.status != 'hasissues') {
                        return true;
                    }
                    break;
                case 'trackingNumberFilter':
                    return (!$routeParams.status || $routeParams.status == 'all' || $routeParams.status == 'delivered' || $routeParams.status == 'shipped');
                    break;
                case 'poNumberFilter':
                    return (!$routeParams.status || $routeParams.status == 'all' || $routeParams.status == 'delivered' || $routeParams.status == 'shipped' || $routeParams.status == 'fulfillment' || $routeParams.status == 'inprocess');
                    break;
                default:
                    return false;
                }
            };

            $scope.getOrderEdit = function(param) {
                //admin edit orders
                if(param=='PROCESS_MGR' && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length)
                    return true;
                else
                     return false;

            };

            $scope.showDeleteOrder = function(param) {
                
                if(param=='DRAFT' || param=='CANCELLED')
                    return true;
                else
                     return false;
            }
            
            $scope.getOrderSuggestionsIcon = function(val) {
                
                return (_.find($constants.orderStatus,{"value": val}))?_.find($constants.orderStatus,{"value": val}).suggestionclass:'';
            }

            $scope.getHeaderText = function() {
                
                if ($routeParams.status=='hasissues') {
                    return messages.headerOrdersHasIssue;
                
                }else if ($routeParams.status=='all'  || !($routeParams.status)) {
                    return messages.headerOrdersAll;
                
                }else if ($routeParams.status=='unapproved') {
                    return messages.headerOrdersUnapproved;
                
                }else if ($routeParams.status=='inprocess') {
                    return messages.headerOrdersInprocess;
                
                }else if ($routeParams.status=='fulfillment') {
                    return messages.headerOrdersUnderFull;
                
                }else if ($routeParams.status=='shipped') {
                    return messages.headerOrdersShipped;
                
                }else if ($routeParams.status=='delivered') {
                    return messages.headerOrdersDelivered;
                
                }else if ($routeParams.status=='drafts') {
                    return messages.headerOrdersDraft;
                
                }else if ($routeParams.status=='cancelled') {
                    return messages.headerOrdersCancelled;
                }else if ($routeParams.status=='undeliverable') {
                    return messages.headerOrdersUndeliverable;
                }
                else if ($routeParams.status=='returns') {
                    return messages.headerOrdersReturns;
                }
                else if ($routeParams.status=='removals') {
                    return messages.headerOrdersRemovals;
                }
            }
             $scope.getTitleText = function() {
                
                if ($routeParams.status=='hasissues') {
                    return messages.headerTitleOrdersHasIssue;
                
                }else if ($routeParams.status=='all'  || !($routeParams.status)) {
                    return messages.headerTitleOrdersAll;
                
                }else if ($routeParams.status=='unapproved') {
                    return messages.headerTitleOrdersUnapproved;
                
                }else if ($routeParams.status=='inprocess') {
                    return messages.headerTitleOrdersInprocess;
                
                }else if ($routeParams.status=='fulfillment') {
                    return messages.headerTitleOrdersUnderFull;
                
                }else if ($routeParams.status=='shipped') {
                    return messages.headerTitleOrdersShipped;
                
                }else if ($routeParams.status=='delivered') {
                    return messages.headerTitleOrdersDelivered;
                
                }else if ($routeParams.status=='drafts') {
                    return messages.headeTitlerOrdersDraft;
                
                }else if ($routeParams.status=='cancelled') {
                    return messages.headerTitleOrdersCancelled;
                }else if ($routeParams.status=='undeliverable') {
                    return messages.headerTitleOrdersUndeliverable;
                }
                else if ($routeParams.status=='returns') {
                    return messages.headerTitleOrdersReturns;
                }
                else if ($routeParams.status=='removals') {
                    return messages.headerTitleOrdersRemovals;
                }
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

            $scope.toggleCheckBox = function (val) {

                var checkboxValue = (val) ? true : false;
                angular.forEach($scope.myData, function (order) {
                    order.Selected = checkboxValue;
                });

            }

            $scope.getOrderUnits = function (data) {
                var ordUnits = 0;
                angular.forEach(data.lineItems, function (val, key) {
                    ordUnits = ordUnits + val.quantity;
                });
                return ordUnits;
            }

            $scope.showingSizeRowsOrders = function () {

                if ($routeParams.status == 'all' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['ALL'] : "0";

                } else if ($routeParams.status == 'hasissues' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['HAS_ISSUES'] : "0";

                } else if ($routeParams.status == 'unapproved' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['UNAPPROVED'] : "0";

                } else if ($routeParams.status == 'inprocess' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['IN_PROCESS'] : "0";

                } else if ($routeParams.status == 'fulfillment' && $routeParams.status != '') {

                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['FULFILLMENT'] : "--";

                } else if ($routeParams.status == 'shipped' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['SHIPPED'] : "0";

                } else if ($routeParams.status == 'delivered' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['DELIVERED'] : "0";

                } else if ($routeParams.status == 'drafts' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['DRAFT'] : "0";

                } else if ($routeParams.status == 'cancelled' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['CANCELLED'] : "0";
                } else if ($routeParams.status == 'hasissues' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['HAS_ISSUES'] : "0";
                }else {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['UNDELIVERABLE'] : "0";
                }

            }


            $scope.$watch('myData', function (items) {
                var indItemSelected = 0;
                angular.forEach(items, function (items) {
                    indItemSelected += items.Selected ? 1 : 0;
                });

                $scope.showSelectedLength = indItemSelected;
                ($scope.showSelectedLength) ? $scope.showSelected = 1 : $scope.showSelected = 0;


            }, true);

            $scope.sortLogo = function () {
                return ($localStorage.pagingOptions.orders.sortDir=='asc') ? true : false;
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

            $scope.getFirstMatchSuggest = function(param,match){
				if (param && match) {
					var patt =  new RegExp(match,'gi');
					var loopData = _.filter(_.compact(param.split(',')),function(n){ return patt.test(n); });
					return (loopData.length)?_.first(loopData):_.first(_.compact(param.split(',')));
				}else{
					return $constants.notAvailableText;
				}
			}
            
            $scope.getOrdShipClass = function (data) {
                return (!data.lastname || !data.firstname || !data.address1 || !data.countryCode || !data.postalCode)
            }
            
            $scope.getShippingClass = function (value){
                
                var retVal = false;
                
                $rootScope.isCountriesOptionsVisible('ordersLandingDomShippintMethod');

                _.each($constants.internationalShippingOptions, function (option) {
                    if(option.name==value){ retVal=true; }
                });

                _.each($constants.domesticShippingOptions, function (option) {
                    if(option.name==value){ retVal=true; }
                });
                
                return retVal;
            }

            $scope.highlightSuggest = function (str, match) {
                if(str && match) {
                    var regex = new RegExp("(" + match + ")", 'gi');
                    return str.replace(regex, '<strong>$1</strong>');
                }
                return str;
            }
            
            $scope.suggestNavigation = function(suggest) {
                if(suggest) {
                  if(suggest.orderStatus == 'IN_PROCESS' || suggest.orderStatus == 'UNAPPROVED' || suggest.orderStatus == 'DRAFT' || suggest.orderStatus == 'HAS_ISSUES') {
                      var url = 'orders/edit/' + suggest.orderHeaderId;
                  } else if ($routeParams && $routeParams.status && $routeParams.status=='returns'){
                      var url = 'orders/returns/view/' + suggest.ezcReturnId;
                  }else {
                      var url = 'orders/view/' + suggest.orderHeaderId;
                  }
                  $location.url(url);
                }
            };

            $scope.readQueryParam = function (param) {
                var deferred = $.Deferred();
                $timeout(function () {
                    $scope.sortingOptions.field = $localStorage.pagingOptions.orders.sortingOption;
                    $scope.sortingOptions.name = _.findWhere($constants.ordersSortingOptions, {"value": $scope.sortingOptions.field}).name;
                    param.fromdate ? $scope.fromdate = param.fromdate : '';
                    param.todate ? $scope.todate = param.todate : '';
                    param.skey ? $scope.searchKey = param.skey : '';
                    _.map($scope.dateOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.orderInventoryOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.orderChannelOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.orderTypeOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });

                    _.map($scope.orderFilterOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    if (param.inv) {
                        _(param.inv.split(',')).forEach(function (inv) {
                            var inv = _.findWhere($scope.orderInventoryOptions, {
                                "value": inv
                            });
                            if (inv) inv.ticked = true;
                        });
                    }
                    if (param.c) {
                        _(param.c.split(',')).forEach(function (c) {
                            var c = _.findWhere($scope.orderChannelOptions, {
                                "value": c
                            });
                            if (c) c.ticked = true;
                        });
                    }
                    if (param.cn) {
                        _(param.cn.split(',')).forEach(function (cn) {
                            var cn = _.findWhere($scope.orderChannelOptions, {
                                "value": cn
                            });
                            if (cn) cn.ticked = true;
                        });
                    }
                    if (param.type) {
                        _(param.type.split(',')).forEach(function (type) {
                            var type = _.findWhere($scope.orderTypeOptions, {
                                "value": type
                            });
                            if (type) type.ticked = true;
                        });
                    }
                    if (param.scol) {
                        var scol = _.findWhere($scope.orderFilterOptions, {
                            "value": param.scol
                        });
                        if (scol) scol.ticked = true;
                    } else {
                        var scol = _.findWhere($scope.orderFilterOptions, {
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
            };

            $scope.resetFilter = function () {
                
                var resetQueryForm = $scope.getQueryParam();
                var resetQuery = (resetQueryForm.page ? 'p=' + resetQueryForm.page + '&' : '')+(resetQueryForm.rcdsPerPage ? 's=' + resetQueryForm.rcdsPerPage + '&' : '')+(resetQueryForm.sortCol ? 'f=' + resetQueryForm.sortCol + '&' : '')+(resetQueryForm.sortOrder ? 'd=' + resetQueryForm.sortOrder + '&' : '');
                
                $location.url((resetQuery)?$location.path() + '?' +resetQuery:$location.path());
                
                $scope.readQueryParam($routeParams);
                $scope.searchKey = ""; // added

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
                
                
            }

            $scope.applyFilter = function (applyClicked) {
                
                var totalPageCount = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                var pageToFetch = ($scope.pagingOptions.currentPage > totalPageCount) ? totalPageCount : $scope.pagingOptions.currentPage;
                pageToFetch = (applyClicked)?'1':pageToFetch;

                var filterQuery = $routeParams;
                
                $scope.tempChannel = [];
                $scope.tempChannelName = [];

                _.each($scope.channel,function(data) {

                    if(data && (data.value=='Shopify'||data.value=='eBay')){
                        $scope.tempChannelName.push(data);
                    }else {
                        $scope.tempChannel.push(data);
                    }
                });

                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') + (((applyClicked || (filterQuery.scol && filterQuery.skey)) && $scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&' : '') + (((applyClicked || filterQuery.skey) && $scope.searchKey) ? 'skey=' + $scope.searchKey + '&' : '') + (((applyClicked || (filterQuery.date)) && $scope.date.length) ? 'date=' + _.pluck($scope.date, 'value') + '&' : '') + (((applyClicked || filterQuery.fromdate) && $scope.date.length && $scope.date[0].value == 'custom' && $scope.fromdate) ? 'fromdate=' + $scope.fromdate + '&' : '') + (((applyClicked || filterQuery.todate) && $scope.date.length && $scope.date[0].value == 'custom' && $scope.todate) ? 'todate=' + $scope.todate + '&' : '') + ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') + ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction + '&' : '') + (((applyClicked || filterQuery.type) && $scope.type && $scope.type.length) ? 'type=' + _.pluck($scope.type, 'value') + '&' : '') + (((applyClicked || filterQuery.c) && $scope.tempChannel && $scope.tempChannel.length) ? 'c=' + _.pluck($scope.tempChannel, 'value') + '&' : '') + (((applyClicked || filterQuery.cn) && $scope.tempChannelName && $scope.tempChannelName.length) ? 'cn=' + _.pluck($scope.tempChannelName, 'value') + '&' : '')+ (((applyClicked || filterQuery.inv) && $scope.inventory && $scope.inventory.length) ? 'inv=' + _.pluck($scope.inventory, 'value') : '');
                if (query && ($location.url() != $location.path() + '?' + query)) {
                    $location.url($location.path() + '?' + query);
                    $scope.readQueryParam($routeParams);
                }
            };

            $scope.getQueryParam = function () {
                
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);
                $scope.pagingOptions.pageSize = $scope.showingSize = $localStorage.pagingOptions.orders.pageSize;

                var params = {
                    status: $routeParams.status ? _.findWhere($scope.orderStatus, {
                        "name": $routeParams.status
                    }).value : 'ALL',
                    page: $routeParams.p || null,
                    rcdsPerPage: $scope.pagingOptions.pageSize || null,
                    searchCol: $routeParams.scol || null,
                    searchTerm: $routeParams.skey || null,
                    dateRange: $routeParams.date || null,
                    fromDate: $routeParams.fromdate || null,
                    toDate: $routeParams.todate || null,
                    sortCol: $localStorage.pagingOptions.orders.sortingOption,
                    sortOrder: $localStorage.pagingOptions.orders.sortDir,
                    channel: $routeParams.c || null,
                    channelName: $routeParams.cn || null,
                    isDomestic: $routeParams.type || null,
                    hasInventory: $routeParams.inv || null
                };

                if ($routeParams && $routeParams.status == 'removals') params.status = '';

                if($scope.isOptionReturns('sortCol') && $scope.isOptionReturns('sortOrder') && !_.isEmpty(params)){
                    params.sortCol = 'createdDate';
                    params.sortOrder = 'desc';
                }

                return _.omit(params, function (value, key) {
                    return !value || (key == 'isDomestic' && value == 'all') || (key == 'isDomestic' && value == 'none') || (key == 'channel' && value == 'none') || (key == 'channel' && value == 'all') || (key == 'dateRange' && value == 'all') || (key == 'dateRange' && value == 'none') || (key == 'hasInventory' && value == 'all') || (key == 'hasInventory' && value == 'none');
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
           

            $scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();
                    var binddate = $scope.formatDate(nowTemp);
                    $scope.fromdate = binddate;
                    $scope.todate = binddate;

                    var checkin = $('#order-search-fromdate').datepicker({
                        todayHighlight: true,
                        endDate:new Date()
                    }).on('changeDate', function (ev) {
                        $scope.fromdate = $scope.formatDate(ev.date);
                        $scope.todate = $scope.formatDate(ev.date);
                        checkout.setValue(ev.date);
                        checkout.setStartDate(ev.date);
                        checkin.hide();
                        $('#order-search-todate')[0].focus();
                    }).data('datepicker');
                    var checkout = $('#order-search-todate').datepicker({
                        todayHighlight: true,
                        endDate:new Date(),
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
            }

            $scope.suggestions = [];
            
            $scope.getSuggestionStatus = function() {
                if (_.isEmpty($routeParams)) {
                    return 'ALL';
                }else if($routeParams && $routeParams.status){
                    return (_.findWhere($constants.orderStatus,{name:$routeParams.status})?_.findWhere($constants.orderStatus,{name:$routeParams.status}).value:'')
                }
            }
            
            $scope.findSuggestion = function (txt, col) {
                $scope.emptySuggestions = false; 
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: $scope.getSuggestionApiUrl(),
                                api: $scope.getSuggestionApiUrl(),
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
                                            $('#order-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
                                            $timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        }else{
                                            $('#order-search-suggestion').hide();
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #order-search-text, div.nano-pane, div.nano-slider").click(function (e) {
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

            $scope.pushOrders = function() {
                var orders = [];
                angular.forEach($scope.myData, function(item) {
                    orders.push(item.orderHeaderId);
                });
                $rootScope.orderHeaders = orders;
            };

            $scope.routeBasedFilter = function() {
                    if($rootScope.loggedInUser && $scope.isOptionVisible('trackingNumberFilter')){
                        $scope.orderFilterOptions.push({name:"Tracking Number", value:"trackNumber"});
                    }
                    if($rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length && $scope.isOptionVisible('poNumberFilter')){
                        $scope.orderFilterOptions.push({name:"PO Number", value:"poNumber"});
                    }
                }


            $scope.getProcessedDate = function(removal) {
                if (removal && removal.history) {
                    for (var index = 0; index < removal.history.length; index++) {
                        if (removal.history[index].historyTag == 'Processed') {
                            return removal.history[index].historyDate;
                        }
                    }
                }
                else return null;
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
                if (removal.cancelDate) return removal.cancelDate;
                else if (removal.history) {
                    for (var index = 0; index < removal.history.length; index++) {
                        if (removal.history[index].historyTag == 'Cancelled') {
                            return removal.history[index].historyDate;
                        }
                    }
                }
                else return null;
            };

            $scope.getFullfillmentDate = function (removal) {
                if (removal.cancelDate) return removal.cancelDate;
                else if (removal.history) {
                    for (var index = 0; index < removal.history.length; index++) {
                        if (removal.history[index].historyTag == 'Fulfilled') {
                            return removal.history[index].historyDate;
                        }
                    }
                }
                else return null;
            };

            $scope.deleteOrder = function(order) {
                
                $('#confirm-delete-order-modal').modal();
                    
                $('#deleteOrdermodalCancel,#delete-order-model-close').on('click',function(e){
                   $('#delete-order-modalOk').off('click');
                }); 

                $('#delete-order-modalOk').on('click',function(e){
                    $('#deleteOrdermodalCancel').click();
                    $('.modal-backdrop.fade.in').remove();
                    $('#delete-order-modalOk').off('click');
                    $scope.deleteOrderService(order);
                });
            }

            $scope.deleteOrderService = function(order) { 

                var request = {
                   "delete":{   
                      "orderHeaderId":order.orderHeaderId,
                      "merchantOrderId":"",
                      "ezcOrderId":""
                  }
              }
                $bus.fetch({
                    name: 'deleteOrders',
                    api: 'deleteOrders',
                    params: null,
                    data: {"delete":JSON.stringify(request)}
                })
                    .done(function (success) {
                        
                        if (success.response && success.response.success && success.response.success.length) {

                            notify.message(messages.orderDeleteSuccess,'','succ');
                            $scope.getPagedDataAsync();
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors),'','',1);
                            } else {
                                notify.message(messages.orderDeleteSuccess,'','',1);
                            }
                        }

                    }).fail(function (error) {
                        
                        var errors = [];
                        _.forEach(error.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors),'','',1);
                        } else {
                            notify.message(messages.orderApproveError,'','',1);
                        }

                    });
            }

            $scope.getorderScrollClassTop = function(){
                if(Number($(document).width() >= 992))
                    return '';
                else
                    return 'ordersPageScroll nano';
            }
            $scope.getorderScrollClassBot = function(){
                if(Number($(document).width() >= 992))
                    return '';
                else
                    return 'nano-content';
            }
            
            $scope.init = function () {

                $scope.routeBasedFilter();

                $scope.date = [];
                //$scope.dateinit();
                $scope.attachEventsForTypeAhead();
                $rootScope.getOrdersCount();
                $scope.readQueryParam($routeParams).done(function(){
                    $scope.showRangePicker();
                });
                $scope.totalServerItems = 0;

                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                },2000);
               
                $scope.pagingOptions = {
                    pageSizes: [10, 25, 50, 100],
                    pageSize: $localStorage.pagingOptions.orders.pageSize,
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
                $scope.sortingOptions.direction = $localStorage.pagingOptions.orders.sortDir;
                
                $scope.disableActionLinks = function(val,allLink) {
                    //return (!val)?'disableRemovalOrder':'';

                    if(!val){
                        return 'disableRemovalOrder';    
                    }else if(allLink){
                        return 'disableRemovalOrder';    
                    }else {
                        return '';
                    }


                }
                
                $scope.setPagingData = function (data, page, pageSize, totalSize) {
                    
                    $rootScope.getCountryList().done(function(){

                        if($scope.isOptionReturns('ordersCountryCode')) {


                        }else{
                            _(data).forEach(function (item) {
                                item.lineItemsUnits = 0;

                                if(item.customer && item.customer.shippingAddress && item.customer.shippingAddress.countryCode) {

                                $rootScope.getCountryNameByCode(item.customer.shippingAddress.countryCode).done(function(name){
                                    item.customer.shippingAddress.countryName = name;
                                });    
                                _(item.lineItems).forEach(function (i) {
                                    item.lineItemsUnits += Number(i.quantity);
                                });

                                }
                            }); 
                        }

                    });
                    
                    $scope.myData = data;

                    $scope.totalServerItems = totalSize;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };
                
                $scope.getProductWeight = function(val) {
                    return (val) ? val:$constants.unidentified;
                }

                $scope.getRestApiUrl = function() {

                    if($routeParams && $routeParams.status && $routeParams.status=='returns')  return 'ordersReturn';
                    else if ($routeParams && $routeParams.status && $routeParams.status=='removals') return 'ordersRemovals';
                    else return 'orders';
                }

                $scope.getSuggestionApiUrl = function() {

                    if($routeParams && $routeParams.status && $routeParams.status=='returns')
                        return 'suggestordersreturns';
                    else 
                        return 'suggestorders';
                }


            $scope.closeUpdateModalBulkDelete = function() {
                $('#order-bulk-delete').modal('hide');
                $('.modal-backdrop.fade.in').remove();
                $scope.getPagedDataAsync();
            };

            $scope.getBulkDeletePercentage = function(key) {
                if (!$rootScope.bulkProdUpdate) return;
                if      (key == 'total')    return Math.round(($rootScope.bulkProdUpdate.prodsSuccess + $rootScope.bulkProdUpdate.prodsFailed) / ($rootScope.bulkProdUpdate.totalProdsCount)*100);
                else if (key == 'success')  return Math.round($rootScope.bulkProdUpdate.prodsSuccess  / $rootScope.bulkProdUpdate.totalProdsCount*100);
                else if (key == 'failed')   return Math.round($rootScope.bulkProdUpdate.prodsFailed   / $rootScope.bulkProdUpdate.totalProdsCount*100)
            }


            $scope.changeBulkOrderDeleteStauts = function() {

                $rootScope.prods = [];
                angular.forEach($scope.myData, function(prod) {
                    if (prod.Selected) {
                        $rootScope.prods.push(prod)
                    }
                });
                if ($rootScope.prods.length == 0) return;
                $('#order-bulk-delete').modal();
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
                };

                var changeStatusBulkDelete = function () {
                    var slicedProds = [];
                    if ($rootScope.prods.length > 5) {
                        slicedProds = $rootScope.prods.slice(0, 5);
                        $rootScope.prods.splice(0,5);
                    }
                    else slicedProds = angular.copy($rootScope.prods);
                    $rootScope.bulkProdUpdate.slicedProdsLength = slicedProds.length;


                    angular.forEach(slicedProds, function(orders) {

                        var request = {
                           "delete":{   
                              "orderHeaderId":orders.orderHeaderId,
                              "merchantOrderId":"",
                              "ezcOrderId":""
                            }
                        }

                        $bus.fetch({
                            name: 'deleteOrders',
                            api: 'deleteOrders',
                            params: null,
                            data: {"delete":JSON.stringify(request)}
                        }).done(function (success) {

                                if (success && success.response && success.response.errors && success.response.errors.length) {

                                    $rootScope.bulkProdUpdate.prodsFailed++;
                                    $rootScope.bulkProdUpdate.response.push(success);
                                    $rootScope.bulkProdUpdate.prodsHitCount++;
                                    var failureMsg = success.response.errors.join(',').replace('Error,','');
                                    $rootScope.bulkProdUpdate.failedSKU.push(orders.ezcOrderNumber + ' - ' + failureMsg);

                                    ngProgress.complete();
                                    if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                        if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                            $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                            changeStatusBulkDelete();
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
                                    $rootScope.bulkProdUpdate.successSKU.push(orders.ezcOrderNumber);
                                    ngProgress.complete();
                                    if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                        if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                            $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                            changeStatusBulkDelete();
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

                                var failureMsg = error.response.errors.join(',').replace('Error,','');
                                $rootScope.bulkProdUpdate.failedSKU.push(orders.ezcOrderNumber + ' - ' + failureMsg);

                                ngProgress.complete();
                                if ($rootScope.bulkProdUpdate.prodsHitCount ==  $rootScope.bulkProdUpdate.slicedProdsLength) {
                                    if ( $rootScope.bulkProdUpdate.prodsSuccess +  $rootScope.bulkProdUpdate.prodsFailed !=  $rootScope.bulkProdUpdate.totalProdsCount) {
                                        $rootScope.bulkProdUpdate.prodsHitCount = 0;
                                        changeStatusBulkDelete();
                                    }
                                    else {
                                        $rootScope.activateOverlay = false;
                                    }
                                }

                            });
                    });
                };
                changeStatusBulkDelete();
            };

                $scope.getPagedDataAsync = function () {

                    var deferred = $.Deferred();

                    ngProgress.start();
                    
                    $scope.loading = {
                        nodata : false,
                        load : true
                    }
                    
                    $bus.fetch({
                        name: $scope.getRestApiUrl(),
                        api: $scope.getRestApiUrl(),
                        params: $scope.getQueryParam(),
                        data: null
                    })
                        .done(function (success) {
                            
                            $scope.loading = {
                                nodata : true,
                                load : false
                            }
                            
                            if (success.response && success.response.success && success.response.success.length) {
                                var orders = [];
                                var data = success.response.data;
                                //notify.Message(messages.orderList+' '+messages.retrivedSuccess);
                                if(data && data.returns){
                                    data.orders = [];
                                    data.orders = data.returns;
                                }


                                if (data && data.removals) {
                                    data.orders = [];
                                    data.orders = data.removals;
                                }

                                if (data && data.orders) {
                                    if (!_.isArray(data.orders)) {
                                        _.forEach(data.orders, function (order) {
                                            orders.push(order)
                                        });
                                    } else {
                                        orders = data.orders;
                                    }
                                    $scope.fromRecord = Number(data.fromRecord);
                                    $scope.toRecord = Number(data.toRecord);
                                    $scope.totalRecord = Number(data.totalRecords);
                                    $scope.setPagingData(orders, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
                                    $scope.setPageSizeClickLength();
                                }


                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //notify.message(messages.orderFetchError);
                                }
                            }
                            ngProgress.complete();
                            deferred.resolve();
                        }).fail(function (error) {
                            
                            $scope.loading = {
                                nodata : true,
                                load : false
                            }

                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                //notify.message($rootScope.pushJoinedMessages(errors));
                            } else {
                                //notify.message(messages.orderFetchError);
                            }
                            ngProgress.complete();
                            deferred.reject();
                        });

                        return deferred.promise();
                };

                $scope.getPagedDataAsync().done(function(){
                    $timeout(function() {
                        $(".ordersPageScroll.nano").nanoScroller({ flash: true,preventPageScrolling: true,iOSNativeScrolling: true});
                    }, 500);
                });
                $scope.isOptionReturns('orderFilterOptions');

                $scope.$watch('pagingOptions', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                      $scope.showingSize = newVal.pageSize;
                      $localStorage.pagingOptions.orders.pageSize = newVal.pageSize;
                      $scope.applyFilter();
                      //$scope.getPagedDataAsync();
                    }
                }, true);
                
                $('body').on('mouseover','.disableRemovalOrder',function(e) {
                    $(this).attr('href','javascript:;');
                });
                
                $timeout(function(){
                    if($('.row').hasClass('highlightAddedRow')){
                      $('.row').removeClass('highlightAddedRow');
                                  $rootScope.highlightCreated = [];
                    }
                },5000);
                
                $timeout(function(){

                    $('.timeago').timeago();

                    $('.timeago').mouseover(function(){
							$(this).attr('title','');		
					});
                    
                },1000);
            }

    }]);
});