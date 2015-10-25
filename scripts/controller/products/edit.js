define(['app', 'model/products/details', 'utility/messages'], function (app, model, messages) {
    app.controller('EditProducts', ['$window','$scope', '$bus', '$location', 'ngProgress', 'toaster', '$rootScope', '$routeParams', '$constants','notify','highlight',
        function ($window,$scope, $bus, $location, ngProgress, toaster, $rootScope, $routeParams, $constants,notify,highlight) {

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
                        //toaster.pop("success", messages.productDetail, messages.retrivedSuccess);
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        //toaster.pop("error", messages.productFetchError); commented
                        notify.message(messages.productFetchError);
                        ngProgress.complete();
                    });
            }


        $scope.checkAlertLevelEdit = function(param){

                var pattern = /^[0-9\\]{0,4}$/;

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
                                    //toaster.pop("success", messages.productArchiveSuccess); commented
                                    notify.message(messages.productArchiveSuccess,'','succ');
                                    $scope.productEdited = true;
                                    $location.path('products');
                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        //toaster.pop("error", errors.join(', '), '', 0); commented
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        //toaster.pop("error", messages.productArchiveError, "", 0); commented
                                        notify.message(messages.productArchiveError);
                                    }
                                }
                            }).fail(function (error) {
                                //toaster.pop("error", messages.productArchiveError); commented
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
                        //toaster.pop("success", messages.productUpdateSucess); commented
                        notify.message(messages.productUpdateSucess,'','succ');
						highlight.added($scope.model.sku);
                        $location.path(($scope.model.isActive)?'products':'products/inactive');
                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            //toaster.pop("error", errors.join(', '), '', 0); commented
                            notify.message($rootScope.pushJoinedMessages(errors));

                        } else {
                            //toaster.pop("error", messages.productUpdateError, "", 0); commented
                            notify.message(messages.productUpdateError);
                        }
                    }
                }).fail(function (error) {
                    //toaster.pop("error", messages.productUpdateError); commented
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

            $scope.line = {
                options:{
                    chart: {
                        "type": "lineChart",
                        "height": 280,
                        "margin": {"top": 20,"right": 20,"bottom": 40,"left": 55},
                        "useInteractiveGuideline": true,
                        showLegend: false,
                        /*"dispatch": {},*/
                        "xAxis": {
                            //"axisLabel": "Date",
                            tickFormat:d3.time.format('%d-%b'),rotateLabels:-20},
                        "yAxis": {"axisLabel": "Count","axisLabelDistance": 10},
                        xScale : d3.time.scale(),
                        "transitionDuration": 250
                    }
                },
                data: []
            };
            $scope.populateProdLineChart= function() {
                var prodData = [];
                angular.forEach($scope.lineSampleData, function(prod, $index){
                    prodData.push({x:(new Date(prod[0])), y:prod[1]});
                });

                $scope.lineChartData = [{
                    values: prodData,
                    key: '',
                    color: '#fff',
                    width: '10px'
                }];
            };
            $scope.initLineChart = function() {
                $scope.lineSampleData =  [
                    ["2015-01-01T00:00:00Z",44], ["2015-01-02T00:00:00Z",36], ["2015-01-03T00:00:00Z",29],
                    ["2015-01-04T00:00:00Z",54], ["2015-01-05T00:00:00Z",46], ["2015-01-06T00:00:00Z",46],
                    ["2015-01-07T00:00:00Z",39], ["2015-01-08T00:00:00Z",51], ["2015-01-09T00:00:00Z",46],
                    ["2015-01-10T00:00:00Z",36], ["2015-01-11T00:00:00Z",52], ["2015-01-12T00:00:00Z",46],
                    ["2015-01-13T00:00:00Z",29], ["2015-01-14T00:00:00Z",40], ["2015-01-15T00:00:00Z",56],
                    ["2015-01-16T00:00:00Z",37], ["2015-01-17T00:00:00Z",49], ["2015-01-18T00:00:00Z",35],
                    ["2015-01-19T00:00:00Z",33], ["2015-01-20T00:00:00Z",36], ["2015-01-21T00:00:00Z",25],
                    ["2015-01-22T00:00:00Z",45], ["2015-01-23T00:00:00Z",30], ["2015-01-24T00:00:00Z",42],
                    ["2015-01-25T00:00:00Z",40], ["2015-01-26T00:00:00Z",55], ["2015-01-27T00:00:00Z",45],
                    ["2015-01-28T00:00:00Z",48], ["2015-01-29T00:00:00Z",28], ["2015-01-30T00:00:00Z",50],
                    ["2015-01-31T00:00:00Z",54], ["2015-02-01T00:00:00Z",49], ["2015-02-02T00:00:00Z",57],
                    ["2015-02-03T00:00:00Z",57], ["2015-02-04T00:00:00Z",27], ["2015-02-05T00:00:00Z",53],
                    ["2015-02-06T00:00:00Z",31], ["2015-02-07T00:00:00Z",27], ["2015-02-08T00:00:00Z",34],
                    ["2015-02-09T00:00:00Z",59], ["2015-02-10T00:00:00Z",48], ["2015-02-11T00:00:00Z",36],
                    ["2015-02-12T00:00:00Z",49], ["2015-02-13T00:00:00Z",32], ["2015-02-14T00:00:00Z",35],
                    ["2015-02-15T00:00:00Z",59], ["2015-02-16T00:00:00Z",40], ["2015-02-17T00:00:00Z",37],
                    ["2015-02-18T00:00:00Z",34], ["2015-02-19T00:00:00Z",35], ["2015-02-20T00:00:00Z",41],
                    ["2015-02-21T00:00:00Z",54], ["2015-02-22T00:00:00Z",48], ["2015-02-23T00:00:00Z",33],
                    ["2015-02-24T00:00:00Z",58], ["2015-02-25T00:00:00Z",55], ["2015-02-26T00:00:00Z",60],
                    ["2015-02-27T00:00:00Z",36], ["2015-02-28T00:00:00Z",28], ["2015-03-01T00:00:00Z",51],
                    ["2015-03-02T00:00:00Z",40], ["2015-03-03T00:00:00Z",27], ["2015-03-04T00:00:00Z",49],
                    ["2015-03-05T00:00:00Z",37], ["2015-03-06T00:00:00Z",27], ["2015-03-07T00:00:00Z",47],
                    ["2015-03-08T00:00:00Z",59], ["2015-03-09T00:00:00Z",60], ["2015-03-10T00:00:00Z",56],
                    ["2015-03-11T00:00:00Z",43], ["2015-03-12T00:00:00Z",46], ["2015-03-13T00:00:00Z",43],
                    ["2015-03-14T00:00:00Z",27], ["2015-03-15T00:00:00Z",50], ["2015-03-16T00:00:00Z",52],
                    ["2015-03-17T00:00:00Z",51], ["2015-03-18T00:00:00Z",47], ["2015-03-19T00:00:00Z",32],
                    ["2015-03-20T00:00:00Z",25], ["2015-03-21T00:00:00Z",27], ["2015-03-22T00:00:00Z",33],
                    ["2015-03-23T00:00:00Z",43], ["2015-03-24T00:00:00Z",27], ["2015-03-25T00:00:00Z",27],
                    ["2015-03-26T00:00:00Z",57], ["2015-03-27T00:00:00Z",54], ["2015-03-28T00:00:00Z",39],
                    ["2015-03-29T00:00:00Z",59], ["2015-03-30T00:00:00Z",28], ["2015-03-31T00:00:00Z",49]
                ];
            };

            $scope.init = function () {
                $scope.populatePagingData();
                $rootScope.getProductsCount();
                $scope.getProductDetails();
                $rootScope.getCountryList();
                $rootScope.getCurrencyList();
                $scope.initLineChart();
                $scope.populateProdLineChart();
                ngProgress.complete();
            };

    }]);
});