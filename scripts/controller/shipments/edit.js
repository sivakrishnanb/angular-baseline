define(['app', 'model/shipments/details', 'utility/messages'], function (app, model, messages) {
    app.controller('EditShipments', ['$scope', '$bus', '$location', 'ngProgress', '$rootScope','$window','$routeParams', '$constants', '$timeout', 'notify',
        function ($scope, $bus, $location, ngProgress, $rootScope,$window, $routeParams, $constants, $timeout,notify) {

            $scope.model = new model();

            $scope.shipmentEdited = false;

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.labelList = $constants.labelList;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            };

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

            // Dynamic - from DB
            $scope.toggleTooltip = function(index) {
                if($('#carrier-popover-' + index).hasClass('in')) {
                    $('.popoverHldr .popover').removeClass('in');
                } else {
                    $('.popoverHldr .popover').not('#carrier-popover-' + index).removeClass('in');
                    $('#carrier-popover-' + index).addClass('in');
                }
            }

            $scope.postalCodeVaidate = function() {

               if($scope.countryOfOriginCtrl  && $scope.countryOfOriginCtrl.countryCode=='SG') {
                    if(!$scope.model.header.addressPostalCode || !(/^[0-9]{6}$/.test($scope.model.header.addressPostalCode))){
                        $scope.invalidPostalShipment = angular.copy($constants.validationMessages.zipCodeNew);
                        return false;
                    }
                    else {
                        return true;
                    }

                }
                else if(!$scope.model.header.addressPostalCode) {
                    $scope.invalidPostalShipment = angular.copy($constants.validationMessages.required);
                    return false;

                }

                return true;
            }

            $scope.addProduct = function (product) {
                if ($scope.model.products.length > 0 && _.findIndex($scope.model.products, {
                    sku: product.fbspSkuId
                }) != -1) {
                    $("#shipment-edit-product-quantity-" + _.findIndex($scope.model.products, {
                        sku: product.fbspSkuId
                    })).focus();
                } else {
                    //if (product.isActive == 'true' || product.isActive == '1') {
                        var _product = new $scope.model._products();
                        _product.sku = product.fbspSkuId;
                        _product.merchantSku = product.sku;
                        _product.productDesc = product.productName;
                        _product.quantity = 1;
                        _product.labelQuantity = 1;
                        _product.isExportable = product.isExportable;
                        _product.isActive = product.isActive;
                        $scope.getProductInventory(_product).done(function (product) {
                            $scope.model.products.push(product);
                            $scope.searchKey = '';
                            $scope.suggestions = [];
                        }).fail(function (product) {
                            $scope.model.products.push(product);
                            $scope.searchKey = '';
                            $scope.suggestions = [];
                        });
                    //} else {
                        //notify.message(messages.addActiveProducts);
                   //}
                }
            }

            $scope.updateLabelQuantity = function (product, index) {
                product.labelQuantity = product.quantity;
                $('#shipment-edit-product-labelquantity-' + index).removeClass('has-error').closest('div').removeClass('has-error').find('.validationMessage').remove();
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
                            product.showHighlight = 1;
                            product.isActive = products[0].isActive;
                            product.isExportable = products[0].isExportable;
                            product.codeType = products[0].codeType;
                            product.articleCode = products[0].articleCode;
                            product.fulFilQty = products[0].qtyFulfillable;
                            product.receivedQty = products[0].qtyInShipment;
                            product.quarantinedQty = products[0].qtyDamaged;
                            product.damagedQty = products[0].qtyDamaged;
                            product.mainProductCategory = $scope.getCategory(products[0].mainProductCategory);
                            product.merchantSku = products[0].sku;
                            deferred.resolve(product);
                        } else {
                            product.showHighlight = 1;
                            product.fulFilQty = 0;
                            product.receivedQty = 0;
                            product.quarantinedQty = 0;
                            product.damagedQty = 0;
                            deferred.reject(product);
                        }
                    }).fail(function (error) {
                        product.showHighlight = 1;
                        product.fulFilQty = 0;
                        product.receivedQty = 0;
                        product.quarantinedQty = 0;
                        deferred.reject(product);
                    });
                return deferred.promise();
            }

            $scope.removeProduct = function (product) {
                $scope.model.products = _.without($scope.model.products, product)
                $scope.active=false;
            }

            $scope.highlightSuggest = function (str, match) {
                if(str && match){
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
                                            $('#shipment-edit-product-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
                                            $timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        }else{
                                            $('#shipment-edit-product-search-suggestion').hide();
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #shipment-edit-search-product, div.nano-pane, div.nano-slider").click(function (e) {
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

            $scope.$on('$locationChangeStart', function (event, next, current) {
                
                if (!$scope.shipmentEdited) {
                    
                    event.preventDefault();
                    
                    $('#confirm-modal').modal();
                    
                    $('#modalCancel,#model-close').on('click',function(e){
                        $('#modalOk').off('click');
                    }); 
                        
                    $('#modalOk').on('click',function(e){
                        $scope.shipmentEdited = true;
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

            $scope.getShipmentDetails = function () {
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
                            $scope.updateComboValue();
                            _.each($scope.model.products,function(prod){
                                $scope.getProductInventory(prod);
                            });
 
                        } else {
                            notify.message(messages.shipmentFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        notify.message(messages.shipmentFetchError);
                        ngProgress.complete();
                    });
            }

            $scope.getCircle = function (val) {
                if (val == 0 || val == 2) {
                    return false;
                }
                if (val == 1) {
                    return true;
                }
            }

            $scope.editShipment = function () {


               if ($scope.model.products.length) {                    
                    for (i = 0; i < $scope.model.products.length; i++){
                        if ($scope.model.products[i].isActive=='0' || $scope.model.products[i].isActive == '2'){

                                $scope.active=true;
                                break;
                        }
                    }
                }

                if ($scope.model.products.length && $scope.active==false) {
                    
                    if($scope.model.header && $scope.model.header.status==2){
                        $scope.model.header.estArrivalDate = $scope.model.header.estArrivalDate.replace(/\-/g,'/');
                        $scope.model.header.estShipDate = $scope.model.header.estShipDate.replace(/\-/g,'/');
                    }

                    $scope.cleanData();
                    $bus.fetch({
                        name: 'editshipments',
                        api: 'editshipments',
                        params: null,
                        data: JSON.stringify($scope.model)
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                $scope.shipmentEdited = true;
                                notify.message(messages.shipmentUpdateSucess,'','succ');
                                $location.path('shipments/send/' + success.response.data.shipment.header.inboundCode);
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors))
                                } else {
                                    notify.message(messages.shipmentUpdateError);
                                }
                            }
                        }).fail(function (error) {
                            notify.message(messages.shipmentUpdateError);
                        });
                } 
                if ($scope.model.products.length == 0) {
                    $('#modal-shipment-edit').modal();
                }
            }

            $scope.duplicate = function(code){
                $scope.shipmentEdited = true;
                $location.path('shipments/create').search({clone: code});
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
                //$scope.shipmentEdited = true;
                if (index < 0 || index >= $rootScope.shipInbounds.length) return;
                var path = '/shipments/edit/' + $rootScope.shipInbounds[index];
                $location.path(path);
            };

            $scope.init = function () {
                $scope.active=false;
                $timeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                },1000);

                $scope.populatePagingData();
                $rootScope.getShipmentsCount();
                $scope.getShipmentDetails();
                $rootScope.getCountryList();
                ngProgress.complete();
                $scope.attachEventsForTypeAhead();
                $scope.fullEditShipment = false;

                if($rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length){
                    $scope.fullEditShipment = true;
                }

            };

    }]);
});