define(['app', 'model/products/details', 'utility/messages'], function (app, model, messages) {
    app.controller('EditProducts', ['$window','$scope', '$bus', '$location', 'ngProgress', '$rootScope', '$routeParams', '$constants','notify','highlight',
        function ($window,$scope, $bus, $location, ngProgress, $rootScope, $routeParams, $constants,notify,highlight) {

            $scope.model = new model();

            $scope.productEdited = false;

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.codeType = $constants.codeType;

            $scope.incrementAddInfo = function () {
                $scope.addInfo++;
                element = "product-edit-addInfo" + $scope.addInfo;

                var style = window.getComputedStyle(document.getElementById(element));
                if(style!=null)
                {
                    $scope.incrementAddInfo();
                }                
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


            //added
            $scope.$on('$locationChangeStart', function (event, next, current) {
                
                if (!$scope.productEdited) {
                    
                    event.preventDefault();
                    
                    $('#confirm-modal').modal();
                    
                    $('#modalCancel,#model-close').on('click',function(e){
                        $('#modalOk').off('click');
                    }); 
                        
                    $('#modalOk').on('click',function(e){
                        $scope.productEdited = true;
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
            }); //added
            $scope.isCodeValidPrice = function (text, value) {
                  if (!value)
                    return true;
                var reg = new RegExp('^[0-9]+[\\.]?[0-9]{0,2}$');
                if (!reg.test(value))
                    return false;
                else
                    return true;
            }

            $scope.isHsCodeValid = function (text) {
                if (!text)
                    return true;
                var reg = new RegExp('^[0-9]{6,}$');
                if ($scope.model.isExportable && (text.length < 6 || text.length > 30)) 
                    return false;
                else
                    return true;
            }

            $scope.isCodeValid = function (text, value) {
                if (!text && value)
                    return false;
                else
                    return true;
            }

            $scope.productIdInvalidMessages = $constants.validationMessages.invalidnumber;

            $scope.isCodeValidPid = function(text,value) {
                
                var retValue = false;
                
                if (text && !value){
                    $scope.productIdInvalidMessages = $constants.validationMessages.invalidnumber;
                    retValue = false;
                }else if (!text && !value){
                    retValue = true;
                }
                else if (!text && value){
                    $scope.productIdInvalidMessages = '';
                    retValue = false;
                }
                else if(text && value){
                    _.each($constants.codeType,function(option){
                        if(option.name==text){
                            _.each(option.validationlength,function(valLength){
                                if (valLength == value.length) {
                                    retValue = true;
                                }else{
                                    _.find($constants.validationMessages, function (valMsg,key) {
                                        if (key==text) { $scope.productIdInvalidMessages=valMsg; }
                                    });
                                }
                            });
                        }
                    });
                }
                else{
                    $scope.productIdInvalidMessages = $constants.validationMessages.invalidnumber;
                    retValue = false;
                }
                return retValue;
            }

            $scope.isExportSelected = function (text) {
                if ($scope.model.isExportable && !text)
                    return false;
                else
                    return true;
            }

            $scope.cleanData = function () {
                $scope.model.mainProductCategory = $scope.mainProductCategoryCtrl ? $scope.mainProductCategoryCtrl.value : '';
                $scope.model.declaredValueCurrency = $scope.declaredValueCurrencyCtrl ? $scope.declaredValueCurrencyCtrl.currencyCode : '';
                $scope.model.retailPriceCurrency = $scope.retailPriceCurrencyCtrl ? $scope.retailPriceCurrencyCtrl.currencyCode : '';
                $scope.model.codeType = $scope.model.codeTypeCtrl ? $scope.model.codeTypeCtrl.value : '';
                $scope.model.costPriceCurrency = $scope.costPriceCurrencyCtrl ? $scope.costPriceCurrencyCtrl.currencyCode : '';
                $scope.model.countryOfOrigin = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
            };

            $scope.updateComboValue = function () {
                $scope.mainProductCategoryCtrl = _.findWhere($scope.categoryOptions, {
                    "value": $scope.model.mainProductCategory
                }) || '';
                $rootScope.getCountryList().done(function () {
                    $scope.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {
                        "countryCode": $scope.model.countryOfOriginCode
                    }) || '';
                });
                $rootScope.getCurrencyList().done(function () {
					/*
                    $scope.declaredValueCurrencyCtrl = _.findWhere($rootScope.currencyList, {
                        "currencyCode": $scope.model.declaredValueCurrencyCode
                    }) || '';
                    $scope.retailPriceCurrencyCtrl = _.findWhere($rootScope.currencyList, {
                        "currencyCode": $scope.model.retailPriceCurrencyCode
                    }) || '';
                    $scope.costPriceCurrencyCtrl = _.findWhere($rootScope.currencyList, {
                        "currencyCode": $scope.model.costPriceCurrencyCode
                    }) || '';
                    */
                });
            }

            $scope.getProductDetails = function () {

                $scope.showProductCode = $scope.showMerSku = false;

                var params = {
                    id: $routeParams.sku || ''
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
                                products.push(product)
                            });
                        } else {
                            products = data.products;
                        }
                        $scope.model = new model(products[0]);
                        if($scope.model.inventoryAlertLevel == 'undefined' || $scope.model.inventoryAlertLevel == '' || $scope.model.inventoryAlertLevel == null) {
                            $scope.model.inventoryAlertLevel =  $scope.constants.notAvailableText;
                        }
                        
                        if(!_.isEmpty(products[0]) && products[0].inventoryAlertLevel==0)
                            $scope.model.inventoryAlertLevel = 0;

                        if ($scope.model.isExportable) {
                            $scope.model.isExportable = true;
                        } else {
                            $scope.model.isExportable = false;
                        }
                        if ($scope.model.isActive) {
                            $scope.model.isActive = true;
                        } else {
                            $scope.model.isActive = false;
                        }
                        
                        if(!$scope.model.codeType && !$scope.model.articleCode)
                            $scope.showProductCode = true;

                        if($rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length)
                            $scope.showProductCode = $scope.showMerSku = true;


                        $scope.model.retailPrice = Number($scope.model.retailPrice) || null;
                        $scope.model.declaredValue = Number($scope.model.declaredValue) || null;
                        $scope.model.costPrice = Number($scope.model.costPrice) || null;
                        $scope.model.codeTypeCtrl = _.findWhere($constants.codeType,{name:$scope.model.codeType})?_.findWhere($constants.codeType,{name:$scope.model.codeType}):'';
                        $scope.updateComboValue();
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        notify.message(messages.productFetchError);
                        ngProgress.complete();
                    });
            }


        $scope.checkAlertLevelEdit = function(param){

                var pattern = /^([0-9\\]{0,3}|1000)$/;

                if(param && param=='NA')
                    return true;
                else if(param && !pattern.test(param))
                    return false;
                else 
                    return true;

            };

            $scope.editProduct = function () {
				
                 if (!$scope.model.isActive) {
					//event.preventDefault();
                    $('#confirm-inactive-edit-modal').modal();
                    
                    $('#inactiveEditmodalCancel,.inactive-edit-model-close').on('click',function(e){
                        $('#inactive-edit-modalOk').off('click');
                    }); 
                        
                    $('#inactive-edit-modalOk').on('click',function(e){
						$scope.triggerService();
                        $('#inactiveEditmodalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#inactive-edit-modalOk').off('click');
                    });
					
					$('#confirm-inactive-edit-modal').keypress(function(e){
						if(e.keyCode == 13 || e.keyCode == 32){
							$('#inactive-edit-modalOk').click();
						}
					});
                }else{
					$scope.triggerService();
				}
            }

            $scope.archive = function (val) {
                //var answer = confirm(messages.productArchiveConfirm) commented
                    $('#confirm-archive-modal').modal();
                    
                    $('#archivemodalCancel,#archive-model-close').on('click',function(e){
                        $('#archive-modalOk').off('click');
                    }); 
                        
                    $('#archive-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        var request = {
                            fbspSkuId: $scope.model.fbspSkuId,
                            archived: val
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
                                    $scope.model.dateArchived = products[0].dateArchived;
                                    notify.message(messages.productArchiveSuccess,'','succ');
                                    $scope.productEdited = true;
                                    $location.path('products');
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
			
			$scope.triggerService = function() {
                
                $scope.model.inventoryAlertLevel = ($scope.model.inventoryAlertLevel==$constants.notAvailableText || $.trim($scope.model.inventoryAlertLevel)=='')?null:$scope.model.inventoryAlertLevel;

				$scope.cleanData();
                $bus.fetch({
                    name: 'editproducts',
                    api: 'editproducts',
                    params: null,
                    data: JSON.stringify($scope.model)
                })
                .done(function (success) {
                    if (success.response.success.length) {
                        $scope.productEdited = true;
                        notify.message(messages.productUpdateSucess,'','succ');
						highlight.added($scope.model.sku);
                        $location.path(($scope.model.isActive)?'products':'products/inactive');
                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));

                        } else {
                            notify.message(messages.productUpdateError);
                        }
                    }
                }).fail(function (error) {
                    notify.message(messages.productUpdateError);
                });
			};

            $scope.populatePagingData = function () {
                var prodSku = $routeParams.sku;
                if ($rootScope.prodSKUs) {
                    for(var index = 0; index < $rootScope.prodSKUs.length; index++) {
                        if ($rootScope.prodSKUs[index] == prodSku) {
                            $scope.currentObjPos = index +1;
                            break;
                        }
                    }
                }
            };

            $scope.getNextItem = function (index) {
                //$scope.productEdited = true;
                if (index < 0 || index >= $rootScope.prodSKUs.length) return;
                var path = '/products/edit/' + $rootScope.prodSKUs[index];
                $location.path(path);
            };


            $scope.init = function () {
                $scope.populatePagingData();
                $rootScope.getProductsCount();
                $scope.getProductDetails();
                $rootScope.getCountryList();
                $rootScope.getCurrencyList();
                ngProgress.complete();
            };

    }]);
});