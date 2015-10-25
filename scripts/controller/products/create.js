define(['app', 'model/products/details', 'utility/messages'], function (app, model, messages) {
    app.controller('CreateProducts', ['$scope', '$bus', '$location', 'ngProgress', '$constants','$rootScope','$window','notify','highlight','$routeParams',
        function ($scope, $bus, $location, ngProgress, $constants,$rootScope,$window,notify,highlight,$routeParams) {

          // Dimension

        $scope.isPatternMatched = function (pattern, value) {
            if (!value) return false;
            var regEx = new RegExp(pattern);
                return regEx.test(value);
        };

    	$scope.isDimensionValidFunction = function(param1,param2,param3) {

            if($rootScope.isCountriesOptionsVisible('productDimensions')){
                $scope.validationMessages.invalidFieldValue = $constants.validationMessages.invalidFieldValue;
            }
            if( (!(isNaN(param1) || isNaN(param2) || isNaN(param3))) && ($rootScope.isCountriesOptionsVisible('productDimensions')) ){
               
                $scope.validationMessages.invalidDimensiontotal  =  $scope.validationMessages.invalidDimensiontotalCubicMeters;


                var length = parseFloat(param1) / 100;
                var width = parseFloat(param2) / 100;
                var height = parseFloat(param3) / 100;
               
                if ((length*width*height) > 0.25){
                	$scope.isDimensionValid=true;
                    $scope.validationMessages.invalidFieldValue ='';
                     return false;
                }
               	else
                {
               		$scope.isDimensionValid=false;
                    $scope.validationMessages.invalidFieldValue = $constants.validationMessages.invalidFieldValue;

                    return true;
                }
            }
            else if(!(isNaN(param1) || isNaN(param2) || isNaN(param3)) && !($rootScope.isCountriesOptionsVisible('productDimensions'))){
                var max = Math.max(param1,param2,param3);

                var totalDimension = Number(max) + (2*(Number(param1)+Number(param2)+Number(param3) - Number(max)));

                if(totalDimension>200 && (typeof(param1)!='object' && typeof(param2)!='object' && typeof(param3)!='object')){
                    $scope.isDimensionValid=true;
                    $scope.validationMessages.invalidLength = $scope.validationMessages.invalidWidth = $scope.validationMessages.invalidHeight ='';
                     return false;
                }
               	else
                {
                    $scope.isDimensionValid=false;
                    return true;
                }
           }
           else{
       				$scope.isDimensionValid=false;
                    $scope.validationMessages.invalidLength = $constants.validationMessages.invalidLength;
                    $scope.validationMessages.invalidWidth = $constants.validationMessages.invalidWidth;
                    $scope.validationMessages.invalidHeight = $constants.validationMessages.invalidHeight;
                    return true;
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


            //ngProgress.start();
            $scope.model = new model();

            $scope.validationMessages = angular.copy($constants.validationMessages);

            $scope.codeType = $constants.codeType;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.incrementAddInfo = function () {
                $scope.addInfo++;
            }

            $scope.productCreated = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
				
				if (!$scope.productCreated) {
					
					event.preventDefault();
					
					$('#confirm-modal').modal();
					
					$('#modalCancel,#model-close').on('click',function(e){
						$('#modalOk').off('click');
					});	
						
					$('#modalOk').on('click',function(e){
						$scope.productCreated = true;
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
			
			$scope.isCodeValidPrice = function (text, value) {
				
                if (!value)
                    return true;
                var reg = new RegExp('^[0-9]+[\\.]?[0-9]{0,2}$');
                if (!reg.test(value))
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

            $scope.cleanExportableData = function (value) {
                if (!value) {
                    $scope.model.customsDescription = "";
                    $scope.model.hsCode = "";
                    $scope.countryOfOriginCtrl = null;
                }
            }

			$scope.updateCustomItemDesc = function() {
				$scope.model.customsDescription = $scope.model.productName;
			}
			
            $scope.cleanData = function () {
                delete $scope.model.fbspSkuId;
                $scope.model.mainProductCategory = $scope.mainProductCategoryCtrl ? $scope.mainProductCategoryCtrl.value : '';
                $scope.model.declaredValueCurrency = $scope.declaredValueCurrencyCtrl ? $scope.declaredValueCurrencyCtrl.currencyCode : '';
                $scope.model.retailPriceCurrency = $scope.retailPriceCurrencyCtrl ? $scope.retailPriceCurrencyCtrl.currencyCode : '';
                $scope.model.codeType = $scope.codeTypeCtrl ? $scope.codeTypeCtrl.value : '';
                $scope.model.costPriceCurrency = $scope.costPriceCurrencyCtrl ? $scope.costPriceCurrencyCtrl.currencyCode : '';
                $scope.model.countryOfOrigin = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
            }
			
            $scope.createProduct = function () {


                if($scope.prodFullEdit) {
                    $scope.editProduct();
                    return false;
                }

                if (!$scope.model.isActive) {
					//event.preventDefault();
                    $('#confirm-inactive-modal').modal();
                    
                    $('#inactivemodalCancel,.inactive-model-close').on('click',function(e){
                        $('#inactive-modalOk').off('click');
                    }); 
                        
                    $('#inactive-modalOk').on('click',function(e){
						$scope.triggerService();
                        $('#inactivemodalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#inactive-modalOk').off('click');
                    });
					
					$('#confirm-inactive-modal').keypress(function(e){
						if(e.keyCode == 13 || e.keyCode == 32){
							$('#inactive-modalOk').click();
						}
					});
                }else if (!$scope.codeTypeCtrl)
                {
                	 $('#modal-product-confirm').modal();
                    
                    $('#productConfirm-modalCancel,#productConfirm-modalClose').on('click',function(e){
                        $('#productConfirm-modalOk').off('click');
                    }); 
                        
                    $('#productConfirm-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        $scope.triggerService();
                        $('#productConfirm-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#productConfirm-modalOk').off('click');
                    });
                    
                    $('#modal-product-confirm').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#productConfirm-modalOk').click();
                        }
                    });

                }else{
					$scope.triggerService();
				}
	
            }


            $scope.editProduct = function () {
                
                 if (!$scope.model.isActive) {
                    //event.preventDefault();
                    $('#confirm-inactive-edit-modal').modal();
                    
                    $('#inactiveEditmodalCancel,.inactive-edit-model-close').on('click',function(e){
                        $('#inactive-edit-modalOk').off('click');
                    }); 
                        
                    $('#inactive-edit-modalOk').on('click',function(e){
                        $scope.triggerServiceEditProduct();
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
                    $scope.triggerServiceEditProduct();
                }
            }

            $scope.triggerServiceEditProduct = function() {
                $scope.cleanData();
                $scope.model.fbspSkuId = ($routeParams && $routeParams.sku)?$routeParams.sku:'';
                $bus.fetch({
                    name: 'editproducts',
                    api: 'editproducts',
                    params: null,
                    data: JSON.stringify($scope.model)
                })
                .done(function (success) {
                    if (success.response.success.length) {
                        $scope.productCreated = true;
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


			$scope.triggerService = function() {

				$scope.cleanData();
				
						$bus.fetch({
						name: 'createproducts',
						api: 'createproducts',
						params: null,
						data: JSON.stringify($scope.model)
						})
						.done(function (success) {
							if (success.response.success.length) {
								$scope.productCreated = true;
								notify.message(messages.productCreateSuccess.replace('##',success.response.data.products.fbspSkuId?success.response.data.products.fbspSkuId:''),'','succ');
								var redirPath = ($scope.model.isActive)?'products':'products/inactive';
								highlight.added($scope.model.sku);
								$location.path(redirPath);
								$rootScope.getProductsCount();
							} else {
								
								var errors = [];
								_.forEach(success.response.errors, function (error) {
									errors.push(error)
								});
								if (errors.length) {
									notify.message($rootScope.pushJoinedMessages(errors));
								} else {
									notify.message(messages.productCreateError);
								}
							}
						}).fail(function (error) {
							notify.message(messages.productCreateError);
						});
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
					
                });
            };


			$scope.getProductDetails = function (param) {

                var params = {
                    id: param || ''
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

                        $scope.model.isFragile = ($scope.model.isFragile==1)?true:false;
                       	$scope.codeTypeCtrl = _.findWhere($constants.codeType,{name:$scope.model.codeType})?_.findWhere($constants.codeType,{name:$scope.model.codeType}):'';
                        $scope.model.retailPrice = Number($scope.model.retailPrice) || null;
                        $scope.model.declaredValue = Number($scope.model.declaredValue) || null;
                        $scope.model.costPrice = Number($scope.model.costPrice) || null;
                        $scope.updateComboValue();
                        
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        
                        notify.message(messages.productFetchError);
                        ngProgress.complete();
                    });

            };

			$scope.init = function () {
				$scope.max=0;
				$scope.isDimensionValid=false;
                $rootScope.getProductsCount();
                $rootScope.getCountryList();
                $rootScope.getCurrencyList();
                $scope.model.isActive=true;
                $scope.prodFullEdit = false;
                
				if($routeParams && $routeParams.sku && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin']).length && 0){
					$scope.getProductDetails($routeParams.sku);
					$scope.prodFullEdit = true;
				}

            };
	

            ngProgress.complete();
    }]);
});