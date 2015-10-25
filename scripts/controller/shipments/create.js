define(['app', 'model/shipments/details', 'utility/messages'], function (app, model, messages) {
    app.controller('CreateShipments', ['$scope', '$bus', '$location', 'ngProgress', '$constants', 'toaster', '$rootScope', '$timeout','notify','$window','highlight','$routeParams',
        function ($scope, $bus, $location, ngProgress, $constants, toaster, $rootScope, $timeout,notify,$window,highlight,$routeParams) {



            //ngProgress.start();
            $scope.model = new model();
            
            $scope.validationMessages = $constants.validationMessages;

            $scope.constants = $constants;

            $scope.labelList = $constants.labelList;

            $scope.whoLabelsCtrl = $constants.labelList[0];

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
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

            $scope.addProduct = function (product) {
                
                if ($scope.model.products.length > 0 && _.findIndex($scope.model.products, {
                    sku: product.fbspSkuId
                }) != -1) {
                    $("#shipment-create-product-quantity-" + _.findIndex($scope.model.products, {
                        sku: product.fbspSkuId
                    })).focus();
                } else {
                    // if (product.isActive == 'true' || product.isActive == '1') {
                        var _product = new $scope.model._products();
                        _product.sku = product.fbspSkuId;
                        _product.merchantSku = product.sku;
                        _product.productDesc = product.productName;
                        _product.quantity = 1;
                        _product.labelQuantity = 1;
                        _product.isExportable = product.isExportable;
                        _product.isActive = product.isActive;
                        $scope.getProductInventory(_product).done(function (product) {
                           // if(product.isActive) {
                                $scope.model.products.push(product);
                                $scope.searchKey = '';
                                $scope.suggestions = [];
                            //}
                        }).fail(function (product) {
                            //if(product.isActive) {
                                $scope.model.products.push(product);
                                $scope.searchKey = '';
                                $scope.suggestions = [];
                            //}
                        });                      
                }
            }

            $scope.updateLabelQuantity = function (product, index) {
                product.labelQuantity = product.quantity;
                $('#shipment-create-product-labelquantity-' + index).removeClass('has-error').closest('div').removeClass('has-error').find('.validationMessage').remove();
            }

            $scope.getProductInventory = function (product) {
                
                var deferred = $.Deferred();
                var params = {
                    id: product.sku
                }
                $bus.fetch({
                    name: 'products',
                    api: 'products',
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        if(success.response.success.length) {
                            var products = [];
                            var data = success.response.data;
                            if (!_.isArray(data.products)) {
                                _.forEach(data.products, function (product) {
                                    products.push(product)
                                });
                            } else {
                                products = data.products;
                            }                            

                            product.isActive = products[0].isActive;                            
                            product.isExportable = products[0].isExportable;
                            product.codeType = products[0].codeType;
                            product.articleCode = products[0].articleCode;
                            product.merchantSku = products[0].sku;
                            product.productDesc = products[0].productName;
                            product.fulFilQty = products[0].qtyFulfillable;
                            product.receivedQty = products[0].qtyInShipment;
                            product.quarantinedQty = products[0].qtyDamaged;
                            product.damagedQty = products[0].qtyDamaged;
                            product.mainProductCategory = $scope.getCategory(products[0].mainProductCategory);
                            deferred.resolve(product);
                        } else {
                            product.isActive = product.isActive || null;
                            product.isExportable = product.isExportable || 'NA';
                            product.merchantSku = product.merchantSku || 'NA';
                            product.productDesc = product.productDesc || 'NA';
                            product.fulFilQty = 0;
                            product.receivedQty = 0;
                            product.quarantinedQty = 0;
                            product.damagedQty = 0;
                            product.mainProductCategory = null;
                            deferred.reject(product);
                        }
                    }).fail(function (error) {
                        product.fulFilQty = 0;
                        product.receivedQty = 0;
                        product.quarantinedQty = 0;
                        product.mainProductCategory = null;
                        deferred.reject(product);
                    });
                return deferred.promise();
            }
            
            $scope.removeProduct = function (product) {
                
                $scope.model.products = _.without($scope.model.products, product);
                
                if($.inArray(product.sku,$rootScope.appendProductsArray)!=-1 && product.sku) {
                    $rootScope.appendProductsArray = jQuery.grep($rootScope.appendProductsArray, function(value) {
                        return value != product.sku;
                    });
                }
                $scope.active=false;
            }

            $scope.highlightSuggest = function (str, match) {
                if(str && match) {
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
                                    if (success.response && success.response.data && success.response.data.docs){
                                        if (success.response.data.docs.length) {
                                            $('#shipment-create-product-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
                                            $timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        }else{
                                            $('#shipment-create-product-search-suggestion').hide();
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
            
            $scope.showAppendedProducts = function() {

                if($rootScope.appendProductsArray.length && $routeParams.frmpage=='product') {
                    angular.forEach($rootScope.appendProductsArray, function(value, key) {
                        $scope.addProduct({fbspSkuId:value});
                    });
                } else {
                    $rootScope.appendProductsArray = [];
                }
            }
            

            $scope.attachEventsForTypeAhead = function () {
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #shipment-create-search-product, div.nano-pane, div.nano-slider").click(function (e) {
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
            
            $scope.shipmentCreated = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if (!$scope.shipmentCreated) {
                        event.preventDefault();
                        
                        $('#confirm-modal').modal();
                        
                        $('#modalCancel,#model-close').on('click',function(e){
                            $('#modalOk').off('click');
                        }); 
                            
                        $('#modalOk').on('click',function(e){
                            $scope.shipmentCreated = true;
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

            $scope.isLabelByMerchant = function (labelby, index) {
                if (labelby.value == "M" && !$scope.model.products[index].labelQuantity)
                    return false;
                else
                    return true;
            }

            $scope.checkActive = function (product) {
                if (product.isActive == 'true' || product.isActive == '1')
                    return false;
                return true;
            }

            $scope.cleanData = function () {
                $scope.model.header.addressCountry = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
                $scope.model.header.labelBy = $scope.whoLabelsCtrl ? $scope.whoLabelsCtrl.value : '';
            }

            $scope.createShipment = function () {

                
                
                
                if ($scope.model.products.length) {                    
                    for (i = 0; i < $scope.model.products.length; i++){
                        if ($scope.model.products[i].isActive=='0' || $scope.model.products[i].isActive == '2'){

                                $scope.active=true;
                                break;
                        }
                    }
                }


                if ($scope.model.products.length && $scope.active==false) {

                    $scope.cleanData();
                    $bus.fetch({
                        name: 'createshipments',
                        api: 'createshipments',
                        params: null,
                        data: JSON.stringify($scope.model)
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                var inboundCode = success.response.data.shipment.header.inboundCode;
                                $scope.shipmentCreated = true;
                                notify.message(messages.shipmentCreateSuccess.replace('##',inboundCode?inboundCode:''),'','succ');
                                //toaster.pop("success", messages.shipmentCreateSuccess); commented
                                highlight.added(inboundCode);
                                $location.path('shipments/send/' + inboundCode);
                            }
                            

                             else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    //toaster.pop("error", errors.join(', '), '', 0); commented
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    //toaster.pop("error", messages.shipmentCreateError, "", 0); commented
                                    notify.message(messages.shipmentCreateError);
                                }
                            }

                        }).fail(function (error) {
                            //toaster.pop("error", messages.shipmentCreateError); commented
                            notify.message(messages.shipmentCreateError);

                        });
                } 

                if ($scope.model.products.length == 0) {
                    $('#modal-shipment-create').modal();
                }
            }
            
            $scope.getCircle = function (val) {
                if (val == 0 || val == 2) {
                    return false;
                }
                else if (val == 1) {
                    return true;
                }
            }

            $scope.updateComboValue = function () {
                $scope.whoLabelsCtrl = _.findWhere($constants.labelList, {
                    "value": $scope.model.header.labelBy
                }) || '';
                $rootScope.getCountryList().done(function () {
                    $scope.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {
                        "countryCode": $scope.model.header.addressCountry
                    }) || '';
                });
            }

                  
            $scope.getDuplicateShipmentDetail = function(shipmentInboundID){
                    $scope.cleanData();
                   var params = {
                    id: shipmentInboundID || ''
                    }
                    $bus.fetch({
                        name: 'shipments',
                        api: 'shipments',
                        params: params,
                        data: null
                    })
                        .done(function (success) {

                            var data = success.response.data;
                            data.shipment.header.planName="";
                            if (data && data.shipment) {
                                $scope.model = new model(data.shipment);
                                $scope.updateComboValue();
                                _.each($scope.model.products,function(prod){
                                    $scope.getProductInventory(prod).done(function(data){
                                        
                                    });
                                });
     
                                //toaster.pop("success", messages.shipmentDetail, messages.retrivedSuccess);
                            } else {
                                // toaster.pop("error", messages.shipmentFetchError); commented
                                notify.message(messages.shipmentFetchError);
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            $scope.model = new model();
                            //toaster.pop("error", messages.shipmentFetchError); commented
                            notify.message(messages.shipmentFetchError);
                            ngProgress.complete();
                        });


            }
            $scope.init = function () {
                $scope.active=false;
                if($routeParams.clone)
                    $scope.getDuplicateShipmentDetail($routeParams.clone);

                $rootScope.getShipmentsCount();
                $rootScope.getCountryList().done(function(){
                    $scope.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {'countryCode': $constants.currentLocation});
                });
                ngProgress.complete();
                $scope.attachEventsForTypeAhead();
                $scope.showAppendedProducts();
            };
    }]);
});