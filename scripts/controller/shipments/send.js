define(['app', 'model/shipments/details', 'downloader', 'utility/restapi', 'utility/messages'], function (app, model, downloader, restapi, messages) {
    app.controller('SendShipments', ['$scope', '$bus', '$location', 'ngProgress', '$constants', '$rootScope', '$routeParams', '$timeout','notify','$window','highlight',
        function ($scope, $bus, $location, ngProgress, $constants, $rootScope, $routeParams, $timeout,notify,$window,highlight) {

            //ngProgress.start();
            $scope.model = new model();
            $scope.tempModel = {};

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.labelList = $constants.labelList;

            $scope.shipmentCreated = false;

            $scope.toggleTooltip = function() {

                if($('#carrier-popover-productCat').hasClass('in')) {
                    
                    $('.popoverHldr .popover').removeClass('in');
                } else {

                    $('.popoverHldr .popover').not('carrier-popover-productCat').removeClass('in');
                    $('#carrier-popover-productCat').addClass('in');
                }
            }

            $scope.getCutoffTimeStr = function (time) {
                if (time) {
                    var times = time.split(':')
                    var time = (times[0] > 12) ? times[0] - 12 + ':' + times[1] + ' pm': times [0] + ':' + times[1] + ' am';
                    return time ;
                }
            };

            $scope.getStrMonth = function (dateStr) {
                if (!dateStr) 
                    return;
                var date = [];
                date = dateStr.split('/');
                var month_names     = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                var dtString = date[2] + '/' + date[1] + '/' + date[0];
                var day = days[new Date(dtString).getDay()];

                if (date.length == 3) 

                    return (date[0] + ' ' + month_names[parseInt(date[1])] + ',' + date[2] + ' (' + day + ')');
            }
            $scope.goBackTransitLandPage = function(){
                    $('.modal-backdrop.fade.in').remove();                       
                     $location.path('shipments/intransit');
            }

            $scope.downloadShipDeliveryreceipt = function () {
                url= $constants.baseUrl + restapi['shipDeliveryReceipt'].url + '?id=' + $scope.model.header.inboundCode;
                
                $scope.getFileUrlDeliveryReceipt(url);
            };

            $scope.getFileUrlDeliveryReceipt = function (url) {

                $.fileDownload(url, {
                    successCallback: function (url) {
                        notify.message(messages.labelDownloadSuccess,'','succ');
                    },
                    failCallback: function (error, url) {
                        var err = JSON.parse($(error).text());
                        if (err && err.errors) {
                            var errors = [];
                            _.forEach(err.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors))
                                //notify.message(errors.join());
                            } else {
                                notify.message(messages.labelDownloadError);
                            }
                        } else {
                            notify.message(messages.labelDownloadError);
                        }
                        $scope.$apply();
                    }
                });
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
            
            
            $scope.getPreference = function() {
                ngProgress.start();
                $bus.fetch({
                    name: 'getPreferences',
                    api:  'getPreferences',
                    params: {
                        id: 'other'
                    },
                    data: null
                })
                .done(function (success) {
                    if (success && success.response && success.response.success.length > 0 && success.response && success.response.data) {
                        if(success.response.data.merchantPreferences && success.response.data.merchantPreferences.printDefPrdLabel){
                            $scope.productLabelList = _.findWhere($constants.productLabelList, {
                                                "value": success.response.data.merchantPreferences.printDefPrdLabelTemplate
                                            }) || $scope.constants.productLabelList[0];
                        } else {
                            $scope.productLabelList = $scope.constants.productLabelList[0];
                        }
                        if(success.response.data.merchantPreferences && success.response.data.merchantPreferences.printDefBoxLabel) {
                            $scope.boxLabelList = _.findWhere($constants.boxLabelList, {
                                                "value": success.response.data.merchantPreferences.printDefBoxLabelTemplate
                                            }) || $scope.constants.boxLabelList[0];
                        } else {
                            $scope.boxLabelList = $scope.constants.boxLabelList[0];
                        }
                    } else {
                        $scope.productLabelList = $scope.constants.productLabelList[0];
                        $scope.boxLabelList = $scope.constants.boxLabelList[0];
                    }
                    ngProgress.complete();
                })
                .fail(function (error) {
                    $scope.productLabelList = $scope.constants.productLabelList[0];
                    $scope.boxLabelList = $scope.constants.boxLabelList[0];
                    ngProgress.complete();
                });  

            }
            
            $scope.$on('$locationChangeStart', function (event, next, current) {
				
                if (!$scope.shipmentCreated && next.indexOf('cancelled')==-1) {
                    //var answer = confirm(messages.warnPageNavigation) commented
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
                }else{
					$scope.shipmentCreated = true;
				}
            });

            $scope.cancel = function () {
                //var answer = confirm(messages.shipmentCancelConfirm) commented
                //event.preventDefault();
                    
                    $('#confirm-shipcancel-modal').modal();
                    
                    $('#shipcancel-modalCancel,#shipcancel-model-close').on('click',function(e){
                        $('#shipcancel-modalOk').off('click');
                    }); 
                        
                    $('#shipcancel-modalOk').on('click',function(e){
                        // $scope.productEdited = true; commented
                        var request = {
                            inboundCode: $scope.model.header.inboundCode,
                            isCancel: 1
                        }
                        $bus.fetch({
                            name: 'editshipments',
                            api: 'editshipments',
                            params: null,
                            data: JSON.stringify(request)
                        })
                            .done(function (success) {
                                if (success.response.success.length && success.response.data && success.response.data.shipment) {
                                    $scope.model.header.cancelledDate = success.response.data.shipment.header.cancelledDate;
                                    $scope.model.header.status = success.response.data.shipment.header.status;
									highlight.added($scope.model.header.inboundCode);
                                    notify.message(messages.shipmentCancelSuccess,'','succ');
                                    $location.path('shipments/cancelled');
                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        notify.message(messages.shipmentCancelError);
                                    }
                                }
                            }).fail(function (error) {
                                notify.message(messages.shipmentCancelError);
                            });
                        $('#shipcancel-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#shipcancel-modalOk').off('click');
                        
                    });
					
					$('#confirm-shipcancel-modal').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#shipcancel-modalOk').click();
                        }
                    });
            }

            $scope.restore = function () {
                //var answer = confirm(shipmentRestoreConfirm) commented
                //event.preventDefault();
                    
                    $('#confirm-shiprestore-modal').modal();
                    
                    $('#shiprestore-modalCancel,#shiprestore-model-close').on('click',function(e){
                        $('#shiprestore-modalOk').off('click');
                    }); 
                        
                    $('#shiprestore-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        var request = {
                            inboundCode: $scope.model.header.inboundCode,
                            isRestore: 1
                        }
                        $bus.fetch({
                            name: 'editshipments',
                            api: 'editshipments',
                            params: null,
                            data: JSON.stringify(request)
                        })
                            .done(function (success) {
                                if (success.response.success.length && success.response.data && success.response.data.shipment) {
                                    $scope.model.header.cancelledDate = success.response.data.shipment.header.cancelledDate;
                                    $scope.model.header.status = success.response.data.shipment.header.status;
                                    notify.message(messages.shipmentRestoreSuccess,'','succ');
                                } else {
                                    var errors = [];
                                    _.forEach(success.response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        notify.message(messages.shipmentRestoreError);
                                    }
                                }
                            }).fail(function (error) {
                                notify.message(messages.shipmentRestoreError);
                            });
                        $('#shiprestore-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#shiprestore-modalOk').off('click');
                    });
					
					$('#confirm-shiprestore-modal').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#shiprestore-modalOk').click();
                        }
                    });
            };

            $scope.$watch('tempModel.whoSendShipment', function(newValue) {
                if (typeof newValue == "undefined" || typeof newValue == "null") return;
                if ($scope.model && $scope.model.header) {
                    $scope.model.header.whoSendShipment = (newValue) ? 'Merchant' : 'Supplier';
                }
            });

            $scope.getShipmentDetails = function () {

                var deferred = $.Deferred();

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
                            $scope.tempModel.whoSendShipment = (typeof $scope.model.header.whoSendShipment == 'undefined' || typeof $scope.model.header.whoSendShipment == 'null' || $scope.model.header.whoSendShipment == '' || $scope.model.header.whoSendShipment=='Merchant')?true:false;
                            $scope.model.header.supplierEzcShipmentLabel = ($scope.model.header.supplierEzcShipmentLabel)?true:false;
                            if ($scope.model.header.status != 1) {
                                $scope.shipmentCreated = true;
                                
                                if(!$scope.fullEditShipment)
                                    $location.path('shipments/view/' + params.id);
                            }
                            var today = new Date();
                            var binddate = $scope.formatDate(today);
                            if (!$scope.model.header.estArrivalDate) $scope.model.header.estArrivalDate = binddate;
                            if (!$scope.model.header.estShipDate) $scope.model.header.estShipDate = binddate;

                            if($scope.fullEditShipment) {
                                $scope.model.header.estArrivalDate = $scope.model.header.estArrivalDate.replace(/\-/g,'/');
                                $scope.model.header.estShipDate = $scope.model.header.estShipDate.replace(/\-/g,'/');    
                            }
                        } else {
                            notify.message(messages.shipmentFetchError);
                        }
                        
                        deferred.resolve();

                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        notify.message(messages.shipmentFetchError);
                        ngProgress.complete();

                        deferred.resolve();

                    });
                    return deferred.promise();
            }

            $scope.convertDateFormat = function (date, format) {
                var dates = date.split("/");
                var dd, mm, yyyy;
                dd   = dates[0];
                mm   = dates[1];
                yyyy = dates[2];
                if      (format == "mm/dd/yyyy")    return mm + '/' + dd + '/' + yyyy;
                else if (format == "dd/mm/yyyy")    return dd + '/' + mm + '/' + yyyy;
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

            $scope.validateShipDate = function (shipDate) {
                $scope.shipDt_isInvalid 	 = false;
                $scope.shipDt_errorMessage = "";

                if (!shipDate){
                    $scope.shipDt_errorMessage = "";
                    return $scope.shipDt_isInvalid 	 = false;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!shipDate.match(validDateFormat)) {
                    $scope.shipDt_errorMessage = "Invalid Date Format";
                    return $scope.shipDt_isInvalid 	 = true;
                }

                if (!shipDate.match(validDate) || new Date($scope.convertDateFormat(shipDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.shipDt_errorMessage = "Invalid Date";
                    return $scope.shipDt_isInvalid 	 = true;
                }
                return $scope.shipDt_isInvalid;
            };

            $scope.validateArrivalDate = function (arrivalDate) {
                $scope.arrivalDt_isInvalid 	  = false;
                $scope.arrivalDt_errorMessage = "";

                if (!arrivalDate){
                    $scope.arrivalDt_errorMessage = "";
                    return $scope.arrivalDt_isInvalid 	  = false;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!arrivalDate.match(validDateFormat)) {
                    $scope.arrivalDt_errorMessage = "Invalid Date Format";
                    return $scope.arrivalDt_isInvalid = true;
                }

                if (!arrivalDate.match(validDate) || new Date($scope.convertDateFormat(arrivalDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.arrivalDt_errorMessage = "Invalid Date";
                    return $scope.arrivalDt_isInvalid = true;
                }

                var today = new Date();
                var enteredDate =  new Date($scope.convertDateFormat(arrivalDate, "mm/dd/yyyy"));
                if (enteredDate < today.setHours(0, 0, 0, 0)) {
                    $scope.arrivalDt_errorMessage = "Date should not Less than current date";
                    return $scope.arrivalDt_isInvalid = true;
                }
                return $scope.arrivalDt_isInvalid;
            };

            $scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();
                    var binddate = $scope.formatDate(nowTemp);
                    $scope.model.header.estShipDate = binddate;
                    $scope.model.header.estArrivalDate = binddate;

                    var checkin = $('#shipment-send-estimated-date').datepicker({
                        todayHighlight: true
                    })
                    .on('changeDate', function (ev) {
                        var newDate = new Date(ev.date);
                            //newDate.setDate(newDate.getDate() + 1);
                        checkout.setValue(newDate);
                        checkin.hide();
                        //$scope.model.header.estShipDate = $scope.formatDate(ev.date);
                        //$scope.model.header.estArrivalDate = $scope.formatDate(ev.date);
                        $scope.validateShipDate($scope.model.header.estShipDate);
                        //$('#shipment-send-estimated-arrival')[0].focus();
                    })
                    .data('datepicker');

                    var checkout = $('#shipment-send-estimated-arrival').datepicker({
                        todayHighlight: true,
                        startDate: new Date(),
                        onRender: function (date) {
                            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                        }
                    })
                    .on('changeDate', function (ev) {
                            checkout.hide();
                            //$scope.model.header.estArrivalDate = $scope.formatDate(ev.date);
                            $scope.validateArrivalDate($scope.model.header.estArrivalDate);
                        })
                    .data('datepicker');

                    checkin.setValue(binddate);
                    // newDate.setDate(newDate.getDate() + 1);
                    checkout.setValue(binddate);

                });
            };

            $scope.getFileUrl = function (type, label) {
                if (type) {
                    var newSheetRequired = $scope.newSheetRequired?1:0;
                    var url = $constants.baseUrl + restapi[label].url + '?inboundCode=' + $scope.model.header.inboundCode + '&standardCode=' + type.value+'&newSheetRequired='+newSheetRequired;
                    $.fileDownload(url, {
                        successCallback: function (url) {
                            notify.message(messages.labelDownloadSuccess,'','succ');
                        },
                        failCallback: function (error, url) {
                            var err = JSON.parse($(error).text());
                            if (err && err.errors) {
                                var errors = [];
                                _.forEach(err.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors))
                                } else {
                                    notify.message(messages.labelDownloadError);
                                }
                            } else {
                                notify.message(messages.labelDownloadError);
                            }
                        }
                    });
                } else {
                    notify.message(messages.labelInvalid);
                }
            }

            $scope.validateSupplierInfo = function(){

                if($scope.model.header.whoSendShipment=='Merchant') {
                    $scope.model.header.supplierEzcShipmentLabel = false;
                    $scope.model.header.supplierPoNumber = $scope.model.header.supplierEmail = '';
                }
                else if($scope.model.header.whoSendShipment=='Supplier') {
                    if($scope.model.header.supplierEzcShipmentLabel){
                        $scope.model.header.supplierPoNumber = $scope.model.header.supplierEmail = '';       
                    }
                }

            }

            $scope.sendService = function () {
                
                $scope.validateSupplierInfo();
                $bus.fetch({
                    name: 'editshipments',
                    api: 'editshipments',
                    params: null,
                    data: JSON.stringify($scope.model)
                })
                    .done(function (success) {
                        if (success.response.success.length) {
                            var inboundCode = success.response.data.shipment.header.inboundCode;
                            $scope.shipmentCreated = true;
                            notify.message(messages.shipmentUpdateSucess,'','succ');
                            highlight.added(inboundCode);
                            //$location.path('shipments/intransit');
                            $('#modal-shipment-receipt').modal();
                            $scope.downloadShipDeliveryreceipt();
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors));

                            } else {
                                notify.message(messages.shipmentUpdateError);
                            }
                        }
                    }).fail(function (error) {
                        notify.message(messages.shipmentUpdateError);
                    });
            }

            $scope.sendShipment = function () {
				
               

                if($scope.fullEditShipment && $scope.model.header.status==2){
                    $scope.sendService();
                    return false;
                }

                $('#modal-shipment-confirm').modal();
                    
                    $('#shipmentConfirm-modalCancel,#shipmentConfirm-modalClose').on('click',function(e){
                        $('#shipmentConfirm-modalOk').off('click');
                    }); 
                        
                    $('#shipmentConfirm-modalOk').on('click',function(e){
                        // $scope.productEdited = true;
                        $scope.sendService();
                        $('#shipmentConfirm-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#shipmentConfirm-modalOk').off('click');
                    });
                    
                    $('#modal-shipment-confirm').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#shipmentConfirm-modalOk').click();
                        }
                    });
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

            $scope.getWareHouseLeadTime=function(){

                    if(!$scope.model.header.estArrivalDate)
                        return false;

                    var request = {
                            warehouseCode: $scope.model.header.whCode?$scope.model.header.whCode:'QSSGEC',
                            arrivalDate:  $scope.model.header.estArrivalDate?$scope.model.header.estArrivalDate:''
                    }


                    $bus.fetch({
                        name: 'warehouseleadtime',
                        api: 'warehouseleadtime',
                        params: request,
                        data : null
                        
                    })
                        .done(function (success) {
                            if (success.response.success.length && !_.isEmpty(success.response.data)) {
                               $scope.warehouseleadtimeSuccessResponse=true; 
                               $scope.responseLeadTime = success.response.data;

                               $scope.responseLeadTime.calculatedLeadDate = $scope.getStrMonth( $scope.responseLeadTime.calculatedLeadDate);
                               $scope.responseLeadTime.arrivalDate = $scope.getStrMonth( $scope.responseLeadTime.arrivalDate);

                               $scope.responseLeadTime.cutOffTime = $scope.getCutoffTimeStr($scope.responseLeadTime.cutOffTime)



                           }else{
                                $scope.warehouseleadtimeSuccessResponse=false;
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    notify.message(messages.shipmentLeadTimeError);
                                }
                            }
                        }).fail(function (error) {
                            notify.message(messages.shipmentLeadTimeError);
                        });
            }   
            $scope.init = function () {
                $scope.warehouseleadtimeSuccessResponse=false;
                $scope.dateinit();
                $scope.populatePagingData();
                $rootScope.getShipmentsCount();
                $scope.getPreference();

                //$scope.getShipmentDetails(); 

                $scope.getShipmentDetails().done(function(){

                    $scope.getWareHouseLeadTime();

                });

                if($constants.currentLocation==$constants.countryShortCodes.australia) {
                    $scope.inTransitFooterText = "For Inbound Shipment notices received by the warehouse before the cut-off time at business day 0 by 4pm - goods will be received and ready for fulfilment latest by business day 1 by 5pm. This SLA does not apply if the Inbound shipment has problems such as damages, quantity discrepancies etc.";
                }else{
                    $scope.inTransitFooterText = "For Inbound Shipment notices received by the warehouse before the cut-off time at business day 0 by 4pm -  goods will be received and ready for fulfilment latest by business day 2 by 4pm. However we strive to receive all shipments within 1 business day.This SLA does not apply if the Inbound shipment has problems such as damages and quantity discrepancies.";
            }

                $rootScope.getCountryList();
                ngProgress.complete();

                $scope.fullEditShipment = false;

                if($rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length){
                    $scope.fullEditShipment = true;
                }
            };
    }]);
});