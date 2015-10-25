define(['app', 'downloader','jquery-ui'], function (app, downloader) {
    app.controller('Accounts',['$scope', '$bus', 'ngProgress', '$location', '$http', 'toaster', '$window', 'notify', '$cookieStore', '$constants', '$rootScope', '$routeParams', '$timeout',
        function ($scope, $bus, ngProgress, $location, $http, toaster,$window,notify,$cookieStore,$constants,$rootScope,$routeParams,$timeout) {
        
        $scope.ebaySiteIds = $constants.ebaySiteIds;
        
        $scope.validationMessages = $constants.validationMessages;
        
        $scope.constants = $constants;
        
        $scope.dateOptionsProducts = $constants.dateOptionsReports;
        $scope.dateOptionsOrders = $constants.dateOptionsReportsOrders;

        $scope.categoryOptions = $constants.categoryOptions;
        $scope.transReportRange = $constants.transReportRange;
        
        $scope.resetForm = function (form) {
            document.getElementById(form).reset();
        };
        


		$scope.addEbayChannel = function() {
          
              $rootScope.activateOverlay = true;
              
              //$cookieStore.put('ebaySiteCountry',$scope.ebaySiteCountry.value);
              $cookieStore.put('ebaySiteCountry','US');
              
              $bus.fetch({
                    name: 'getebaysession',
                    api: 'getebaysession',
                    //params: {site:$scope.ebaySiteCountry.value}
                    params: {site:'US'}
                  })
                .done(function (success) {
                  
                    $rootScope.activateOverlay = false;
                    
                    if(success.response.success.length && success.response.status=='Success') {
                        $window.location = success.response.data;
                    } else {
                      
                      notify.message(messages.ebayChannelError);
                    }
                }).fail(function (error) {
                    $rootScope.activateOverlay = false;
                    notify.message(messages.ebayChannelError);
                });
        }
        
        
        $scope.isOptionVisible = function (option) {
               var curPath = $location.path();

                switch (option) {
                  
                  case 'myAccAccSettingsCollapse':
                      return ((curPath=='/accounts/profile'||curPath=='/accounts/connections'||curPath=='/accounts/users'||curPath=='/accounts' || curPath=='/accounts/newSubAccount' || curPath=='/accounts/connections/integrateEbay'));
                      break;
                    
                  case 'myAccAccBillingCollapse':
                      return ((curPath=='/accounts/billingSummary'||curPath=='/accounts/fulfillmentCost'));
                      break;
                  
                  case 'myAccAccPrefCollapse':
                      return ((curPath=='/accounts/preferences/fulfillment'||curPath=='/accounts/preferences/email' ||curPath=='/accounts/preferences/others'));
                      break;
                    
                  case 'myAccAccRepCollapse':
                      return ((curPath=='/accounts/reports/products'||curPath=='/accounts/reports/shipments' ||curPath=='/accounts/reports/orders' ||curPath=='/accounts/reports/payments'));
                      break;
                    
                  default:
                      return false;
                }
            }
        
        $scope.getEbayToken = function() {
            
            $rootScope.activateOverlay = true;
            
            $bus.fetch({
                name: 'getebaytoken',
                api: 'getebaytoken',
                params: {site:$cookieStore.get('ebaySiteCountry')}
              })
              .done(function (success) {
               
                  $rootScope.activateOverlay = false;
                  if(success.response.success.length && success.response.status=='Success') {
                      $cookieStore.remove('ebaySiteCountry');
                      $location.path('accounts/connections');
                      notify.message(messages.ebaySuccessTokenAdd,'','succ');
                  } else {
                      //$scope.getEbayToken();
                      notify.message(messages.ebayChannelError);
                      $rootScope.activateOverlay = true;
                  }
              }).fail(function (error) {
                  //$scope.getEbayToken();
                  notify.message(messages.ebayChannelError);
                  $rootScope.activateOverlay = true;
              });
        }
        
        $scope.listChannels = function(){
              $scope.hideEbay = false;
              $scope.getChannelList = [];
              $scope.model = {};

              $bus.fetch({
                name: 'getebaychannels',
                api: 'getebaychannels',
                params: ''
              })
              .done(function (success) {

                if (success.response.status && success.response.status=='Success') {
                  $scope.getChannelList = success.response.data;
                  $scope.hideEbay = (_.filter(success.response.data,{channelCode:'ebay_sandbox'||'ebay'})).length?true:false;
                  _.map(success.response.data,function(param) {
                      if(param && param.channelCode && ['ebay_sandbox','ebay_live','ebay'].indexOf(param.channelCode)!=-1)
                          $scope.hideEbay = true;
                  });
                }else{
                        //notify.message(messages.ebayChannelListingError);
                }
             }).fail(function (error) {
                      //notify.message(messages.ebayChannelListingError);
             });

        };


            $('#updateTracking-modalOk').on('click',function(e){
              $('#myonoffswitch').attr('checked',false);
            }); 


             $scope.removeSalesChannel = function() {
                $('#remove-sales-channel').modal();
                $('#removeChannel-modalOk').click(function(e) {


                    $bus.fetch({
                      name: 'removechannel',
                      api: 'removechannel',
                      params: ''
                    })
                    .done(function (success) {

                      if (success.response.status && success.response.data.length) {
                        
                      }else{
                          
                      }
                    }).fail(function (error) {
                          
                    });

                });
             };

            $scope.trackingWarning = function(val) {
                if (!val) {
                  $scope.model.updateTrackingStatus = true;
                  $('#connection-update-tracking').modal();
                }
            };



        $scope.billingSummary = function() {
            
            $timeout(function () {

                $scope.getBillingDates = function() {
                    var today = new Date();
                    var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    var todayDate = today.getDate();
                    var month = month_names_short[today.getMonth()];

                    $scope.billingGeneratedDate = '';
                    $scope.billingYetToGenerateDate = '';
                    $scope.lastPaymentDate='';

                    if (todayDate>28) {
                        if (today.getMonth() + 1 <= 11){
                               $scope.lastPaymentDate='20'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear(); 
                             $scope.billingGeneratedDate = '28'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear();
                             $scope.billingYetToGenerateDate = '28'+ ' ' + month_names_short[today.getMonth() + 1 ] + ' ' + today.getFullYear();
                        }
                        else
                        {

                            var nextYr = today.getFullYear()+1;
                              $scope.lastPaymentDate = '20'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear();
                             $scope.billingGeneratedDate = '28'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear();
                             $scope.billingYetToGenerateDate = '28'+ ' ' + month_names_short[0] + ' ' + nextYr;

                        }
                    }
                    else
                    {

                          if (today.getMonth() - 1 >= 0){
                             $scope.lastPaymentDate = '20'+ ' ' + month_names_short[today.getMonth() - 1] + ' ' + today.getFullYear();
                             $scope.billingGeneratedDate = '28'+ ' ' + month_names_short[today.getMonth() - 1] + ' ' + today.getFullYear();
                             $scope.billingYetToGenerateDate = '28'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear();
                          }
                          else if (today.getMonth() + 1 <= 11)
                          {

                            var lastYr = today.getFullYear()-1;
                             $scope.lastPaymentDate = '20'+ ' ' + month_names_short[11] + ' ' + lastYr;
                             $scope.billingGeneratedDate = '28'+ ' ' + month_names_short[11] + ' ' + lastYr;
                             $scope.billingYetToGenerateDate = '28'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear();
                          }
                    }
                };

                $scope.getBalanceSummary = function () {
                    $bus.fetch({
                        name: 'balancesummary',
                        api: 'balancesummary',
                        params: null,
                        data: null
                    })
                        .done(function (success) {
                            if (success.response && success.response.data && success.response.data.merchantInvoiceSummary)
                                $scope.balanceSummary = success.response.data.merchantInvoiceSummary[0];
                            else {
                                $scope.balanceSummary = {};
                                if(success && success.response && _.isArray(success.response.errors)) {
                                  notify.message(success.response.errors.join(', '));
                                }
                            }
                        }).fail(function (error) {
                            notify.message(messages.errorBillingSummary);
                            $scope.balanceSummary = {};
                        });
                };

                $scope.getInvoices = function() {
					
					$scope.loading = {
                        nodata : false,
                        load : true
                    }
					
					
                    $bus.fetch({
                        name: 'invoices',
                        api: 'invoices',
                        params: null,
                        data: null
                    })
                        .done(function (success) {
							
							$scope.loading = {
                                nodata : true,
                                load : false
                            }


                                if (success.response && success.response.data && success.response.data.merchantInvoices)
                                    $scope.merchantInvoices = success.response.data.merchantInvoices;
                                if ($scope.merchantInvoices) $scope.selectedInvoice  = $scope.merchantInvoices[0];

                                else {
                                    $scope.merchantInvoices = {};
                                    if(success && success.response && _.isArray(success.response.errors)) {
                                      notify.message(success.response.errors.join(', '));  
                                    }
                                }
                            }).fail(function (error) {
                                notify.message(messages.errorBillingSummary);
                                $scope.merchantInvoices = {};
                            });
                    };

                $scope.setSelectedInv = function (inv) {
                    $scope.selectedInvoice = inv;
                };

                $scope.getBalanceSummary();
                $scope.getInvoices();
                $scope.getBillingDates();

                    $scope.formatBillingDate = function(startDate, endDate) {
                        var month_names     = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        if (startDate && endDate) {
                            sDate = startDate.split("-")[0]+ ' ' + month_names[parseInt(startDate.split("-")[1])] + ' ' + startDate.split("-")[2];
                            eDate = endDate.split("-")[0]+ ' ' + month_names[parseInt(endDate.split("-")[1])] + ' ' + endDate.split("-")[2];
                            return sDate + ' - ' + eDate;
                        }
                        return $scope.constants.notAvailableText;
                    };

                $scope.selectedInvoice= [];
                var nowTemp = new Date();
                var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                var today = new Date();

                var binddate = $scope.formatDate(nowTemp);

                $scope.model = {
                    displayableDate : binddate
                }

                var billingDate = $('#billing-summary-date').datepicker().on('changeDate', function (ev) {
                    var newDate = new Date(ev.date)
                    billingDate.hide();
                    $scope.model.displayableDate = $scope.formatDate(ev.date);
                    $('#billing-summary-date')[0].focus();
                }).data('datepicker');

                $scope.getpayments = function (){
					
					$scope.loading = {
                        nodata : false,
                        load : true
                    }
					
                    $bus.fetch({
                        name: 'getpayments',
                        api: 'getpayments',
                        params: null,
                        data: null
                    })
                        .done(function (success) {
							
							$scope.loading = {
                                nodata : true,
                                load : false
                            }

                            if (success.response.data.payments)
                                $scope.payments = success.response.data.payments;
                            else
                                $scope.payments = {};
                        }).fail(function (error) {
                            notify.message(messages.paymentFetchError);
                            $scope.payments = {};
                        });
                };
                $scope.getpayments();
                $scope.generateStatementPeriod();
              });

        }
        
        $scope.formatDate = function (nowTemp) {
                var dd = nowTemp.getDate();
                var mm = nowTemp.getMonth() + 1; //January is 0!
                var yyyy = nowTemp.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                return dd + '/' + mm + '/' + yyyy;
        };
            
        
        $scope.readQueryParam = function (param) {
            var retVal = '';
            if (param.connections && param.connections=='connections') {
                retVal = 'connections';
            }else if (param.channel && param.status && param.channel=='ebay') {
                retVal = 'ebay';
            }
            return retVal;
        };

		$scope.showShipmentOthers = function() {
			
			if($scope.shipmentCategory && $scope.shipmentCategory.value=='O'){
				$scope.showShipmentCategoryOthers = true;
			}else{
				$scope.showShipmentCategoryOthers = false;
				$scope.model.shipmentCategoryOptionsOthers = '';
			}
		};
		
        $scope.getFulfillment = function() {
            
            
            $scope.model = {}
            
            $scope.fulfillmentPref = [];
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

                if (success && success.response && success.response.success.length > 0 && success.response.data) {
				  
                    $scope.fulfillmentPref = success.response.data.merchantPreferences;
					
                    //$scope.model.isinternationalOrders = ($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefCustDeclarationIntOrders) ? true:false;
					$scope.model.isinternationalOrders = true;
                    $scope.shipmentCategoryOptions = [{value:($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefCdioCatShip) ? $scope.fulfillmentPref.ordDefCdioCatShip:$constants.orderShipCategory[0].name}];
					$scope.model.shipmentCategoryOptionsOthers = ($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefCdioCatShipOthers) ? $scope.fulfillmentPref.ordDefCdioCatShipOthers:'';
                    $scope.nonDelInstructionsOptions = [{value:($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefCdioNonDeliveryIns) ? $scope.fulfillmentPref.ordDefCdioNonDeliveryIns :$constants.orderDeliveryInstruction[0].name}];
                    
					$scope.showShipmentCategoryOthers = ($scope.model.shipmentCategoryOptionsOthers && $scope.shipmentCategoryOptions[0].value=='O')?true:false;
                    
                    //$scope.model.isShippingDefaults = ($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefDeliveryOptions) ? true : false,
					$scope.model.isShippingDefaults = true;
                    $scope.domesticOrderOption = [{name:($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefDelOptDomOrders) ? $scope.fulfillmentPref.ordDefDelOptDomOrders:$constants.domesticShippingOptions[0].name}];
                    $scope.internationalOrderOption = [{name:($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefDelOptIntOrders) ? $scope.fulfillmentPref.ordDefDelOptIntOrders:$constants.internationalShippingOptions[0].name}];
                    
                    
                    $scope.model.isEL = ($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefAddEl) ? true:false;
                    $scope.model.isELInternational = ($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefElIntOrders) ? true:false;
                    $scope.model.isELDomestic = ($scope.fulfillmentPref && $scope.fulfillmentPref.ordDefElDomOrders) ? true:false;
                    
                    
                    $scope.model.isFulfillOrdApprove = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdApprove) ? true : false;
                    
                    $scope.model.isautoFuldomOrder = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdappDom) ? true : false;
                    $scope.model.fulfillOrdAppDomHoldOrdVal = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdAppDomHoldOrdVal) ? $scope.fulfillmentPref.fulfillOrdAppDomHoldOrdVal:'',
                    $scope.orderDomNotificationOptions = [{name:($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdAppDomHoldOrdNotify) ? $scope.fulfillmentPref.fulfillOrdAppDomHoldOrdNotify :'email'}];
                   
                    
                    $scope.model.isautoFulintOrder = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdappInt) ? true : false;
                    $scope.model.fulfillOrdAppIntOrdHoldVal = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdAppIntOrdHoldVal) ? $scope.fulfillmentPref.fulfillOrdAppIntOrdHoldVal:'',
                    $scope.orderIntNotificationOptions = [{name:($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdappIntOrdHoldNotify) ? $scope.fulfillmentPref.fulfillOrdappIntOrdHoldNotify : 'email'}];
                    
                    $scope.model.isHoldOrder = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdappHold) ? true : false;
                    $scope.model.fulfillOrdappHoldAllOrdDays = ($scope.fulfillmentPref && $scope.fulfillmentPref.fulfillOrdappHoldAllOrdDays) ? $scope.fulfillmentPref.fulfillOrdappHoldAllOrdDays : '';

                    
                    _.each($constants.orderShipCategory, function (valMsg,key){
                      _.each(valMsg, function (valMsgTwo,keyTwo){
                          if (valMsgTwo==$scope.shipmentCategoryOptions[0].value) {
                            $scope.shipmentCategory = $scope.shipmentCategoryOptions[0];
                          }
                      });
                    });
                    
                    _.each($constants.orderDeliveryInstruction, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.nonDelInstructionsOptions[0].value) {
                           $scope.nonDelInstruction = $scope.nonDelInstructionsOptions[0];
                         }
                     });
                   });
                   
                    
                     _.each($constants.domesticShippingOptions, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.domesticOrderOption[0].name) {
                           $scope.domesticOrder = $scope.domesticOrderOption[0];
                         }
                     });
                   });
                   
                     _.each($constants.internationalShippingOptions, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.internationalOrderOption[0].name) {
                           $scope.internationalOrder = $scope.internationalOrderOption[0];
                         }
                     });
                   });
                  
                   _.each($constants.autoNotify, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.orderDomNotificationOptions[0].name) {
                           $scope.domOrderNotification = $scope.orderDomNotificationOptions[0];
                         }
                     });
                   });
                   
                  
                   _.each($constants.autoNotify, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.orderIntNotificationOptions[0].name) {
                           $scope.intOrderNotification = $scope.orderIntNotificationOptions[0];
                         }
                     });
                   });

                  $scope.showElDisabledText = false;

                  if($scope.domesticOrder.name!='Domestic Standard' && $scope.internationalOrder.name!='International Priority'){
                      $scope.model.isEL = false;
                      $scope.deliveryOptionsAddEl =  $scope.deliveryOptionsIntOrder = $scope.deliveryOptionsDomOrder = true;
                  }
                  if($scope.domesticOrder.name=='Domestic Standard' && $scope.internationalOrder.name=='International Priority'){
                      $scope.deliveryOptionsAddEl =  $scope.deliveryOptionsIntOrder = $scope.deliveryOptionsDomOrder = false;
                  }
                  if($scope.domesticOrder.name=='Domestic Standard' && $scope.internationalOrder.name!='International Priority'){
                      $scope.deliveryOptionsAddEl =  false;
                      $scope.deliveryOptionsIntOrder = true;
                  }
                  if($scope.domesticOrder.name!='Domestic Standard' && $scope.internationalOrder.name=='International Priority'){
                      $scope.deliveryOptionsAddEl =  false;
                      $scope.deliveryOptionsDomOrder = true;
                  }

                  if($scope.domesticOrder.name!='Domestic Standard' || $scope.internationalOrder.name!='International Priority')
                      $scope.showElDisabledText = true;

                  
                }
            })
            .fail(function (error) {
                var errors = [];
                _.forEach(error.response.errors, function (error) {
                    errors.push(error)
                });
                if (errors.length) {
                    notify.message($rootScope.pushJoinedMessages(errors));
                } else {
                    notify.message(messages.fulfillmentFetchError);
                }
                ngProgress.complete();
            });
        
        };
 
        
        $scope.saveFulfillment = function() {
		  
            $scope.models = {
            
                  preferenceType : "orderFulfillment",

                  ordDefCustDeclarationIntOrders : $scope.model.isinternationalOrders ? true:false,
                  ordDefCdioCatShip : $scope.shipmentCategory ? $scope.shipmentCategory.value:'',
				          ordDefCdioCatShipOthers : $scope.model.shipmentCategoryOptionsOthers ? $scope.model.shipmentCategoryOptionsOthers:'',
                  ordDefCdioNonDeliveryIns : $scope.nonDelInstruction ? $scope.nonDelInstruction.value:'',
                  
                  ordDefDeliveryOptions : $scope.model.isShippingDefaults ? true:false,
                  ordDefDelOptDomOrders : $scope.domesticOrder ? $scope.domesticOrder.name:'',
                  ordDefDelOptIntOrders : $scope.internationalOrder ? $scope.internationalOrder.name:'',
                  
                  ordDefAddEl : $scope.model.isEL ? true:false,
                  ordDefElIntOrders : $scope.model.isELInternational ? true:false,
                  ordDefElDomOrders : $scope.model.isELDomestic ? true:false,
                  
                  fulfillOrdApprove : $scope.model.isFulfillOrdApprove ? true:false,
                  
                  fulfillOrdappDom : $scope.model.isautoFuldomOrder ? true:false,
                  fulfillOrdAppDomHoldOrdVal : $scope.model.fulfillOrdAppDomHoldOrdVal ? $scope.model.fulfillOrdAppDomHoldOrdVal:'',
                  fulfillOrdAppDomHoldOrdNotify : $scope.domOrderNotification ? $scope.domOrderNotification.name : '',
                  
                  fulfillOrdappInt : $scope.model.isautoFulintOrder ? true : false,
                  fulfillOrdAppIntOrdHoldVal : $scope.model.fulfillOrdAppIntOrdHoldVal ? $scope.model.fulfillOrdAppIntOrdHoldVal : '',
                  fulfillOrdappIntOrdHoldNotify : $scope.intOrderNotification ? $scope.intOrderNotification.name : '',
                  
                  
                  fulfillOrdappHold : $scope.model.isHoldOrder ? true : false,
                  fulfillOrdappHoldAllOrdDays : $scope.model.fulfillOrdappHoldAllOrdDays ? $scope.model.fulfillOrdappHoldAllOrdDays : ''
                  
                  
          }
          
          $bus.fetch({
                    name: 'savePreferences',
                    api: 'savePreferences',
                    params: null,
                    data: JSON.stringify($scope.models)
                })
              .done(function (success) {
              
              if (success.response.status && success.response.status=='Success') {
                
                 notify.message(messages.fulfillmentSaveSuccess,'','succ');
              } else {

                 notify.message(messages.fulfillmentSaveError);
              }
          }).fail(function (error) {
          
				notify.message(messages.fulfillmentSaveError);
          });
              
        };
        
        $scope.getEmail = function() {
           
            $scope.emailgetPref = [];
            ngProgress.start();
            $bus.fetch({
                name: 'getPreferences',
                api:  'getPreferences',
                params: {
                    id: 'email'
                },
                data: null
            })
                .done(function (success) {
                    if (success && success.response && success.response.success.length > 0 && success.response.data) {
                        
						$scope.emailgetPref = success.response.data.merchantPreferences;
                        
                        $scope.model = {
            
                            isProductUpload:($scope.emailgetPref && $scope.emailgetPref.prdUploadCompleted) ? true:false,
                            isProductDimUpdated:($scope.emailgetPref && $scope.emailgetPref.prdDimensionUpdated) ? true:false,
                            isProductInvAlertlevel:($scope.emailgetPref && $scope.emailgetPref.prdInvFulfillableAlertLevel) ? true:false,
                            
                            isOrderUpload:($scope.emailgetPref && $scope.emailgetPref.ordUploadCompleted) ? true:false,
                            isOrderHasIssues:($scope.emailgetPref && $scope.emailgetPref.ordStatusIssues) ? true:false,
                            isOrderUnapproved:($scope.emailgetPref && $scope.emailgetPref.ordStatusUnapproved) ? true:false,
                            isOrderInProcess:($scope.emailgetPref && $scope.emailgetPref.ordStatusInprocess) ? true:false,
                            isOrderShipped:($scope.emailgetPref && $scope.emailgetPref.ordStatusShipped) ? true:false,
                            isOrderDelivered:($scope.emailgetPref && $scope.emailgetPref.ordStatusDelivered) ? true:false,
                            
                            isShipmentUpload:($scope.emailgetPref && $scope.emailgetPref.shipUploadCompleted) ? true:false,
                            isShipmentInTransit:($scope.emailgetPref && $scope.emailgetPref.shipStatusTransit) ? true:false,
                            isShipmentReceived:($scope.emailgetPref && $scope.emailgetPref.shipStatusReceived) ? true:false,
                            isSummaryPendingItems:($scope.emailgetPref && $scope.emailgetPref.othersDailySummary) ? true:false,
                            isMonthlyInvoice:($scope.emailgetPref && $scope.emailgetPref.othersMonthlyInvoice) ? true:false
                          
                        }
                    }
                })
                .fail(function (error) {
                    var errors = [];
                    _.forEach(error.response.errors, function (error) {
                        errors.push(error)
                    });
                    if (errors.length) {
                        notify.message($rootScope.pushJoinedMessages(errors));
                    } else {
                        notify.message(messages.emailFetchError);
                    }
                    ngProgress.complete();
                });
        };
        
        $scope.saveEmail = function() {

          $scope.models = {
            
            preferenceType : "email",
            prdUploadCompleted : $scope.model.isProductUpload ? true:false,
            prdDimensionUpdated : $scope.model.isProductDimUpdated ? true:false,
            prdInvFulfillableAlertLevel : $scope.model.isProductInvAlertlevel ? true:false,
            
            ordUploadCompleted : $scope.model.isOrderUpload ? true:false,
            ordStatusIssues : $scope.model.isOrderHasIssues ? true:false,
            ordStatusUnapproved : $scope.model.isOrderUnapproved ? true:false,
            ordStatusInprocess : $scope.model.isOrderInProcess ? true:false,
            ordStatusShipped : $scope.model.isOrderShipped ? true:false,
            ordStatusDelivered : $scope.model.isOrderDelivered ? true:false,
            
            shipUploadCompleted : $scope.model.isShipmentUpload ? true:false,
            shipStatusTransit : $scope.model.isShipmentInTransit ? true:false,
            shipStatusReceived : $scope.model.isShipmentReceived ? true:false,
            othersDailySummary : $scope.model.isSummaryPendingItems ? true:false,
            othersMonthlyInvoice : $scope.model.isMonthlyInvoice ? true:false
            
          }
          
          $bus.fetch({
                    name: 'savePreferences',
                    api: 'savePreferences',
                    params: null,
                    data: JSON.stringify($scope.models)
                })
              .done(function (success) {
    
              if (success.response.status && success.response.status=='Success') {
                 notify.message(messages.emailSaveSuccess,'','succ');
              } else {
				 notify.message(messages.emailSaveError);
              }
              
          }).fail(function (error) {
				notify.message(messages.emailSaveError);
          });
          
        }
        
        $scope.checkContextValidation = function(val,context) {
          
          if (context && !val)
            return false;
          
          return true;
        
        }
        
        
        $scope.saveOthers = function(){
           
           $scope.models = {
            
                  preferenceType : "other",

                  printDefPrdLabel : $scope.model.isProductLabel ? true:false,
                  printDefPrdLabelTemplate : $scope.productLabelTemplate ? $scope.productLabelTemplate.value:'',
                  
                  printDefBoxLabel : $scope.model.isProductBoxLabel ? true:false,
                  printDefBoxLabelTemplate :$scope.boxLabelTemplate ? $scope.boxLabelTemplate.value:'',
                  
                  printPackingHeader :$scope.model.isNameOnPackingList ? true:false,
                  printPackingHeaderMsg :$scope.model.brandName?$scope.model.brandName:'',
                  
                  printPackingFooter :$scope.model.isFooterInfoOnPackingList ? true:false,
                  printPackingFooterMsg :$scope.model.footerInfo?$scope.model.footerInfo:''
           }
           
          $bus.fetch({
                    name: 'savePreferences',
                    api: 'savePreferences',
                    params: null,
                    data: JSON.stringify($scope.models)
                })
              .done(function (success) {
              
              if (success.response.status && success.response.status=='Success') {
                 notify.message(messages.othersSaveSuccess,'','succ');
              } else {
				 notify.message(messages.othersSaveError);
              }
          }).fail(function (error) {
				notify.message(messages.othersSaveError);
          });
          
        }
        
        $scope.getOthers = function() {
          
            $scope.othergetPref = [];
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
                    $scope.othergetPref = success.response.data.merchantPreferences;
                    
                    $scope.templateOptions = [{value:($scope.othergetPref && $scope.othergetPref.printDefPrdLabelTemplate) ? $scope.othergetPref.printDefPrdLabelTemplate:null}];
                    $scope.BoxtemplateOptions = [{value:($scope.othergetPref && $scope.othergetPref.printDefBoxLabelTemplate) ? $scope.othergetPref.printDefBoxLabelTemplate:null}];
                    
                     $scope.model = {
                        brandName : ($scope.othergetPref && $scope.othergetPref.printPackingHeaderMsg) ? $scope.othergetPref.printPackingHeaderMsg : '',
                        footerInfo : ($scope.othergetPref && $scope.othergetPref.printPackingFooterMsg) ? $scope.othergetPref.printPackingFooterMsg : '' ,
                        
                        isProductLabel : ($scope.othergetPref && $scope.othergetPref.printDefPrdLabel)  ? true : false,
                        isProductBoxLabel : ($scope.othergetPref && $scope.othergetPref.printDefBoxLabel)  ? true : false,
                        isNameOnPackingList : ($scope.othergetPref && $scope.othergetPref.printPackingHeader) ? true : false,
                        isFooterInfoOnPackingList : ($scope.othergetPref && $scope.othergetPref.printPackingFooter) ? true : false
                     };
                     
                   _.each($constants.productLabelList, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.templateOptions[0].value) {
                           $scope.productLabelTemplate = $scope.templateOptions[0];
                         }
                     });
                   });
                   
                   _.each($constants.boxLabelList, function (valMsg,key){
                     _.each(valMsg, function (valMsgTwo,keyTwo){
                         if (valMsgTwo==$scope.BoxtemplateOptions[0].value) {
                           $scope.boxLabelTemplate = $scope.BoxtemplateOptions[0];
                         }
                     });
                   });


                }
            })
            .fail(function (error) {
                var errors = [];
                _.forEach(error.response.errors, function (error) {
                    errors.push(error);
                });
                if (errors.length) {
                    notify.message($rootScope.pushJoinedMessages(errors));
                } else {
                    notify.message(messages.othersFetchError);
                }
              ngProgress.complete();
            });  
		  
        }
      
	  	$scope.autoOrderProcess = function(val) {
			$scope.autoOrderDisable = false;
			if(val) {
				$scope.model.isinternationalOrders = $scope.model.isShippingDefaults = true;
				$scope.autoOrderDisable = true;
			}
		}
		
         $scope.isPasswordMatching = function(newPw, retypePw) {
            if (newPw == retypePw) return true;
            return false;
        };

        $scope.changePassword = function() {
            ngProgress.start();
            $bus.fetch({
                name    : 'changePassword',
                api     : 'changePassword',
                params  : {
                    "currentPassword" : $scope.password.currentPw,
                    "newPassword"     : $scope.password.newPw,
                    "retypePassword"  : $scope.password.retypePw

                },
                data: null
            })
                .done(function (data) {
                    if (data.response.success && data.response.success.length > 0) {
                        var successMsgs = [];
                        _.forEach(data.response.success, function (eachItem) {
                            successMsgs.push(eachItem);
                        });
                        if (data.response.success.length) {
                            notify.message(successMsgs.join(', '),'','succ');
                        }
                        $scope.resetForm("form-change-password");
                    }
                    else if(data && data.response && data.response.errors && data.response.errors["5007"]) {
                        notify.message(data.response.errors["5007"]);
                    }
                    else if(data && data.response && data.response.errors && data.response.errors["5008"]) {
                        notify.message(messages.changePwEWrong);
                    }
                    else {
                        notify.message(messages.changePwError);
                    }
                    ngProgress.complete();
                })
                .fail(function (error) {
                    var errors = [];
                    _.forEach(error.response.errors, function (error) {
                        errors.push(error)
                    });
                    if (errors.length) {
                        //toaster.pop("error", errors.join(', '), '', 0); commented
                        notify.message(errors.join(', '));
                    } else {
                        //toaster.pop("error", messages.orderFetchError, "", 0); commented
                        notify.Message(messages.editMerchantError);
                    }
                    ngProgress.complete();
                });
        };

            $scope.editContact = function () {
                $scope.isEditing    = true;
                $scope.tempMerchant = [];
                $scope.tempMerchant = angular.copy($scope.merchant);
                $scope.tempMerchant.contactNoCountryCode = $scope.merchant.contactNoCountryCode?$scope.merchant.contactNoCountryCode:'+65';
                $scope.tempMerchant.countryCode = $scope.merchant.countryCode?$scope.merchant.countryCode:'SG';
            };

            $scope.validatePhone = function (phone) {
                if (!phone)return true;
                //var phoneValidator = /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
                var phoneValidator = /^[\ \-\+\d]{0,20}$/; // allowed :"+,-,space, numeric"
                if (phone.match(phoneValidator)) return true;
                return false;
            };

        $scope.updateContact = function () {

            var setMerchantContacts = function (data) {
                var merch;

                //temp solution. since the data is in key-value format
                _.each(data,function(val,key){
                    merch = val;
                });

                $scope.merchant.addressLine1 = merch.addressLine1;
                $scope.merchant.addressLine2 = merch.addressLine2;
                $scope.merchant.city         = merch.city;
                $scope.merchant.contactPhone = merch.contactPhone;
                $scope.merchant.countryCode  = merch.countryCode;
                $scope.merchant.landline     = merch.landline;
                $scope.merchant.state        = merch.state;
                $scope.merchant.zipCode      = merch.zipCode;
            }

            var merchantEdited = {
                "addressLine1"  : $scope.tempMerchant.addressLine1,
                "addressLine2"  : $scope.tempMerchant.addressLine2,
                "city"          : $scope.tempMerchant.city,
                "state"         : $scope.tempMerchant.state,
                "countryCode"   : $scope.tempMerchant.countryCode,
                "zipCode"       : $scope.tempMerchant.zipCode,
                "contactPhone"  : $scope.tempMerchant.contactPhone,
                "landline"      : $scope.tempMerchant.landline
            };

            ngProgress.start();
            $bus.fetch({
                name    : 'updatemerchant',
                api     : 'updatemerchant',
                params  : null,
                data: merchantEdited
            })
                .done(function (success) {
                    if (success && success.response && success.response.success.length > 0) {
                        setMerchantContacts(success.response.data);
                        if (success.response.success.length) notify.message(success.response.success.join(', '),'','succ');
                        $scope.isEditing = false;
                    }
                    else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length)  notify.message(errors.join(', '));
                        else                notify.Message(messages.editMerchantError);
                        $scope.isEditing = true;
                    }
					ngProgress.complete();
                })
                .fail(function (error) {
                    $scope.isEditing = true;
                    var errors = [];
                    _.forEach(error.response.errors, function (error) {
                        errors.push(error)
                    });
                    if (errors.length) {
                        //toaster.pop("error", errors.join(', '), '', 0); commented
                        notify.message(errors.join(', '));
                    } else {
                        //toaster.pop("error", messages.orderFetchError, "", 0); commented
                        notify.Message(messages.editMerchantError);
                    }
                    ngProgress.complete();
                });


        };
        
        $scope.currencyVal = function(val,checkBox) {
            if(/^[0-9]+[\\.]?[0-9]{0,2}$/.test(val) && checkBox)
              return true;
			else if (!checkBox)
				return true;
            else
              return false;
        }

        $scope.cancelEditContact = function () {
            $scope.isEditing    = false;
        };

        $scope.getMerchantName = function () {

            var flag = false;
            angular.forEach($rootScope.loggedInContent.userRole.split(','), function(obj){
                if (obj == 'admin' || obj == 'csr' || obj == 'finance'){
                    flag = true;
                }
            });

            if(flag) {
                return $scope.constants.notAvailableText;
            }
            /*if ($scope.merchant.merFirstName && $scope.merchant.merLastName) {
                return ($scope.merchant.merLastName + ' ' + $scope.merchant.merFirstName);
            }*/
            if ($rootScope.loggedInContent.firstName && $rootScope.loggedInContent.lastName) {
                return ($rootScope.loggedInContent.lastName + ' ' + $rootScope.loggedInContent.firstName);
            }
            return $scope.constants.notAvailableText;
        };
        $scope.getMerchEmail = function() {

            var flag = false;
            angular.forEach($rootScope.loggedInContent.userRole.split(','), function(obj){
                if (obj == 'admin' || obj == 'csr' || obj == 'finance') flag = true;
            });

            if(flag) return $scope.constants.notAvailableText;
            return ($rootScope.loggedInContent.email)? $rootScope.loggedInContent.email : $scope.constants.notAvailableText;
        };

        $scope.getMerchCompany = function() {
            //merchant.companyName || constants.notAvailableText
            var flag = false;
            angular.forEach($rootScope.loggedInContent.userRole.split(','), function(obj){
                if (obj == 'admin' || obj == 'csr' || obj == 'finance') flag = true;
            });

            if(flag) return $scope.constants.notAvailableText;
            return ($rootScope.loggedInContent.companyName)? $rootScope.loggedInContent.companyName : $scope.constants.notAvailableText;
        };

        $scope.getMerchCompanyReg = function() {
            //merchant.companyRegType || constants.notAvailableText}} : {{merchant.companyRegNumber || constants.notAvailableText
            var flag = false;
            angular.forEach($rootScope.loggedInContent.userRole.split(','), function(obj){
                if (obj == 'admin' || obj == 'csr' || obj == 'finance') flag = true;
            });

            if(flag) return $scope.constants.notAvailableText;
            
            /*return ($rootScope.loggedInContent.companyRegType && $rootScope.loggedInContent.companyRegNumber)?
                ($rootScope.loggedInContent.companyRegType + ' : ' + $rootScope.loggedInContent.companyRegNumber) : $scope.constants.notAvailableText;
            */

            return ($rootScope.loggedInContent.companyRegType && $rootScope.loggedInContent.companyRegNumber)?
                ($rootScope.loggedInContent.companyRegType + ' : ' + $rootScope.loggedInContent.companyRegNumber) : (($scope.merchant.companyRegType && $scope.merchant.companyRegNumber)?
                ($scope.merchant.companyRegType + ' : ' + $scope.merchant.companyRegNumber) : $scope.constants.notAvailableText);
        };

		$scope.getUserRoleName = function(val){
            var isAdmin = false;
            _.each(val.split(','),function(dat){
                if (dat=='admin') {
                    isAdmin = true;
                }
            });
            if(isAdmin) {
                return $constants.notAvailableText;
            }

			if (val && val.length) {
				var retVal = '';
				_.each(val.split(','),function(dat){
					if (retVal=='') {
						retVal = (_.where($constants.userRoles,{name:dat}).length)?_.where($constants.userRoles,{name:dat})[0].value:'';
					}
				});
				return retVal;
			}
		}
		
		$scope.getCloseAccount =  function(val){
			if (val && val.length) {
				var retVal = false;
				_.each(val.split(','),function(dat,key){
						if (_.findWhere($constants.userRoles,{name:dat}) && (_.findWhere($constants.userRoles,{name:dat}).name == 'admin' || _.findWhere($constants.userRoles,{name:dat}).name == 'csr' || _.findWhere($constants.userRoles,{name:dat}).name == 'finance' )) {
							retVal = true;
						}
				});
				return retVal;
			}
		}
		
      $scope.deliveryOptionsElCarrier = function(param,type) {

        if(!_.isEmpty(param) && !_.isEmpty(type)){
          
          if(type =='domesticOrder' && param.name=='Domestic Standard'){
              $scope.deliveryOptionsDomOrder = false;         
          }
          if(type =='domesticOrder' && param.name!='Domestic Standard'){
              $scope.deliveryOptionsDomOrder = true;
              $scope.model.isELDomestic = false;
          }

          if(type =='internationalOrder' && param.name=='International Priority'){
              $scope.deliveryOptionsIntOrder = false;
          }
          if(type =='internationalOrder' && param.name!='International Priority'){
              $scope.deliveryOptionsIntOrder = true;
              $scope.model.isELInternational = false;
          }

          if($scope.domesticOrder.name!='Domestic Standard' && $scope.internationalOrder.name!='International Priority'){
              $scope.model.isEL = false;
              $scope.deliveryOptionsAddEl = true;
          }else{
              $scope.deliveryOptionsAddEl = false;
          }


          $scope.showElDisabledText = false;

          if($scope.domesticOrder.name!='Domestic Standard' || $scope.internationalOrder.name!='International Priority'){
            $scope.showElDisabledText = true;
          }
          
             
        }

      };


        $scope.clearPw = function() {
            $scope.password = {
                currentPw   : '',
                newPw       : '',
                retypePw    : ''
            }
        };

        $scope.getMerchant = function() {
            var user;
            if ($rootScope.loggedInContent) {
                user = $rootScope.loggedInContent; //$cookieStore.get('loggedInUser');
            }
            else return;

            $scope.merchant = [];
            $scope.clearPw();

            ngProgress.start();
            $bus.fetch({
                name: 'merchants',
                api:  'merchants',
                params: {
                    id: user.merchantCode
                },
                data: null
            })
                .done(function (success) {
                    if (success && success.response && success.response && success.response.data) {
                        _.each(success.response.data.merchant,function(val,key){
                            $scope.merchant = val;
                        })

                    }
                    else {
                        notify.message(success.response);
                    }
                    ngProgress.complete();
                })
                .fail(function (error) {
                    var errors = [];
                    _.forEach(error.response.errors, function (error) {
                        errors.push(error)
                    });
                    if (errors.length) {
                        //toaster.pop("error", errors.join(', '), '', 0); commented
                        notify.message(errors.join(', '));
                    } else {
                        //toaster.pop("error", messages.orderFetchError, "", 0); commented
                        notify.Message(messages.fulfillmentFetchError);
                    }
                    ngProgress.complete();
                });
        };



            $scope.reportsShipments = function() {

                $timeout(function () {

                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();

                    var binddate = $scope.formatDate(nowTemp);

                    $scope.model = {
                        displayableDate : binddate
                      }
  
                      var reportsShip = $('#acc-reports-ship-createDateRange').datepicker().on('changeDate', function (ev) {
                          var newDate = new Date(ev.date)
                          reportsShip.hide();
                          $scope.model.displayableDate = $scope.formatDate(ev.date);
                          $('#acc-reports-ship-createDateRange')[0].focus();
                      }).data('datepicker');
              });
        };
        
        $scope.reportsOrders = function() {
            $scope.selectedDateRangeOrders = [];
            $scope.repOrdFromdate = $scope.repOrdFromdate ? $scope.repOrdFromdate : $scope.formatDate(new Date());
            $scope.repOrdTodate = $scope.repOrdTodate ? $scope.repOrdTodate : $scope.formatDate(new Date());
            $scope.isDomestic = true;
            $scope.isInternational = true;

            angular.forEach($scope.dateOptionsOrders, function (option) {
                if (option.value == 'all'){
                    option.ticked = true;
                    $scope.selectedDateRangeOrders[0] = option;
                }
                else
                    option.ticked = false;
            });

            $scope.ordTickSelection = function (options, tickIndex) {
                if (!$scope.selectedDateRangeOrders) $scope.selectedDateRangeOrders = [];
                $scope.selectedDateRangeOrders[0] = options[tickIndex];
                angular.forEach($scope.dateOptionsOrders, function (option, index) {
                    if (index == tickIndex) {
                        $scope.dateOptionsOrders[index].ticked = true;
                    }
                    else $scope.dateOptionsOrders[index].ticked = false;
                });
            };

            $timeout(function () {

                /*var nowTemp = new Date();
                 var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                 var today = new Date();

                 var binddate = $scope.formatDate(nowTemp);

                 $scope.model = {
                 displayableDate : binddate
                 };

                 $scope.repOrdFromdate = binddate;
                 $scope.repOrdTodate = binddate;

                 //For Orders report


                 var checkin = $('#orders-reports-fromdate').datepicker({
                 todayHighlight: true,
                 endDate:new Date()
                 }).on('changeDate', function (ev) {
                 $scope.repOrdFromdate = $scope.formatDate(ev.date);
                 $scope.repOrdTodate = $scope.formatDate(ev.date);
                 checkout.setValue(ev.date);
                 checkout.setStartDate(ev.date);
                 checkin.hide();
                 $('#orders-reports-todate')[0].focus();
                 }).data('datepicker');


                 var checkout = $('#orders-reports-todate').datepicker({
                 todayHighlight: true,
                 endDate:new Date(),
                 onRender: function (date) {
                 return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                 }
                 }).on('changeDate', function (ev) {
                 checkout.hide();
                 $scope.repOrdTodate = $scope.formatDate(ev.date);
                 }).data('datepicker');

                 var reportsOrd = $('#acc-reports-ord-createDateRange').datepicker().on('changeDate', function (ev) {
                 var newDate = new Date(ev.date);
                 reportsOrd.hide();
                 $scope.model.displayableDate = $scope.formatDate(ev.date);
                 $('#acc-reports-ord-createDateRange')[0].focus();
                 }).data('datepicker');
                 });
                 $scope.today = $scope.formatDate(new Date());
                 $scope.repOrdFromdate = $scope.today;
                 $scope.repOrdTodate = $scope.today;*/

                $scope.rangepicker;
                $scope.isRangepickerShowing = !$scope.isRangepickerShowing;
                if (!$scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.hide();
                else if ($scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.show();

                $scope.rangepicker = $('.input-daterange').datepicker({
                    inputs: $('#orders-reports-fromdate, #orders-reports-todate'),
                    format: "dd/mm/yyyy",
                    endDate: new Date(),
                    todayHighlight: true

                }).on('changeDate', function (ev) {
                    $scope.$apply();
                    $scope.ordTickSelection($scope.dateOptionsProducts, 8);
                    if ($('#orders-reports-fromdate').datepicker('getDate') != "Invalid Date" && $('#pay-reports-todate').datepicker('getDate') != "Invalid Date") {
                        $scope.repOrdFromdate = $scope.formatDate($('#orders-reports-fromdate').datepicker('getDate'));
                        $scope.repOrdTodate = $scope.formatDate($('#orders-reports-todate').datepicker('getDate'));
                    }
                    else if ($('#orders-reports-fromdate').datepicker('getDate') == "Invalid Date" && $('#orders-reports-todate').datepicker('getDate') != "Invalid Date") {
                        $scope.repOrdFromdate = $scope.formatDate($('#orders-reports-todate').datepicker('getDate'));
                        $scope.repOrdTodate = $scope.formatDate($('#orders-reports-todate').datepicker('getDate'));
                    }
                    else {
                        $scope.repOrdFromdate = $scope.formatDate(($('#orders-reports-fromdate').datepicker('getDate') != "Invalid Date") ? $('#orders-reports-fromdate').datepicker('getDate') : new Date());
                        $scope.repOrdTodate = ($('#orders-reports-todate').datepicker('getDate') != "Invalid Date") ? $scope.formatDate($('#orders-reports-todate').datepicker('getDate')) : $scope.repOrdFromdate;
                    }
                    $('#orders-reports-fromdate').datepicker('update', $scope.repOrdFromdate);
                    $('#orders-reports-todate').datepicker('update', $scope.repOrdTodate);
                    $('.input-daterange').datepicker('updateDates');
                });

                $('#orders-reports-fromdate').datepicker('update', ($scope.repOrdFromdate || $scope.formatDate(new Date())));
                $('#orders-reports-todate').datepicker('update', ($scope.repOrdTodate || $scope.formatDate(new Date())));
                $('.input-daterange').datepicker('updateDates');
            });
        }
		
		$scope.getSignupCategory = function(param){
                if (!_.isEmpty(param)) {
                        var catSplit = _.map(param.split(','),function(n) {
                                return (_.findWhere($constants.categoryOptions,{value:n}))?(_.findWhere($constants.categoryOptions,{value:n}).name):'';
                        })
                        if(catSplit.length) {
                           if (catSplit.length > 2) {
                                var returnString =  _.take(catSplit,2).join(',') + ' +' + (catSplit.length-2)+ ' Others.';
                                    $scope.itemsToDispay =  (catSplit.join(','));
                                return returnString;
                           }else{
                                return catSplit.join(',')
                           }
                        }
                }else{
                        return $scope.constants.notAvailableText;
                }
        }
        
        $scope.reportsPayments = function() {
          

                $scope.repPayDate       = [];
                $scope.repPayFromDate   = null;
                $scope.repPayToDate     = null;

                $scope.transRepFromDateCustom  = $scope.transRepFromDateCustom ? $scope.transRepFromDateCustom : $scope.formatDate(new Date());
                $scope.transRepToDateCustom    = $scope.transRepToDateCustom ? $scope.transRepToDateCustom : $scope.formatDate(new Date());

                angular.forEach($scope.transReportRange, function(option){
                    option.ticked = false;
                });

            $scope.transTickSelection = function (options, tickIndex) {
                if (!$scope.repPayDate) $scope.repPayDate = [];
                $scope.repPayDate[0] = options[tickIndex];
                angular.forEach($scope.transReportRange, function (option, index) {
                    if (index == tickIndex) {
                        $scope.transReportRange[index].ticked = true;
                    }
                    else $scope.transReportRange[index].ticked = false;
                });
            };
                $timeout(function () {
                    /*var checkin = $('#pay-reports-fromdate').datepicker({
                        todayHighlight: true,
                        endDate:new Date()
                    })
                        .on('changeDate', function (ev) {
                            $scope.transRepFromDateCustom = $scope.formatDate(ev.date);
                            checkout.setStartDate(ev.date);
                            checkin.hide();
                            $('#pay-reports-todate')[0].focus();
                        })
                        .data('datepicker');

                    var checkout = $('#pay-reports-todate').datepicker({
                        todayHighlight: true,
                        endDate:new Date()
                    }).on('changeDate', function (ev) {
                        checkout.hide();
                        $scope.transRepToDateCustom = $scope.formatDate(ev.date);
                    }).data('datepicker');*/

                    $scope.rangepicker;
                    $scope.isRangepickerShowing = !$scope.isRangepickerShowing;
                    if (!$scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.hide();
                    else if ($scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.show();

                    $scope.rangepicker = $('.input-daterange').datepicker({
                        inputs: $('#pay-reports-fromdate, #pay-reports-todate'),
                        format: "dd/mm/yyyy",
                        endDate: new Date(),
                        todayHighlight: true

                    }).on('changeDate', function (ev) {
                        $scope.$apply();
                        $scope.transTickSelection($scope.transReportRange, 4);
                        if ($('#pay-reports-fromdate').datepicker('getDate') != "Invalid Date" && $('#pay-reports-todate').datepicker('getDate') != "Invalid Date") {
                            $scope.transRepFromDateCustom = $scope.formatDate($('#pay-reports-fromdate').datepicker('getDate'));
                            $scope.transRepToDateCustom = $scope.formatDate($('#pay-reports-todate').datepicker('getDate'));
                        }
                        else if ($('#pay-reports-fromdate').datepicker('getDate') == "Invalid Date" && $('#pay-reports-todate').datepicker('getDate') != "Invalid Date") {
                            $scope.transRepFromDateCustom = $scope.formatDate($('#pay-reports-todate').datepicker('getDate'));
                            $scope.transRepToDateCustom = $scope.formatDate($('#pay-reports-todate').datepicker('getDate'));
                        }
                        else {
                            $scope.transRepFromDateCustom = $scope.formatDate(($('#pay-reports-fromdate').datepicker('getDate') != "Invalid Date") ? $('#pay-reports-fromdate').datepicker('getDate') : new Date());
                            $scope.transRepToDateCustom = ($('#pay-reports-todate').datepicker('getDate') != "Invalid Date") ? $scope.formatDate($('#pay-reports-todate').datepicker('getDate')) : $scope.transRepFromDateCustom;
                        }
                        $('#pay-reports-fromdate').datepicker('update', $scope.transRepFromDateCustom);
                        $('#pay-reports-todate').datepicker('update', $scope.transRepToDateCustom);
                        $('.input-daterange').datepicker('updateDates');
                    });

                    $('#pay-reports-fromdate').datepicker('update', ($scope.transRepFromDateCustom || $scope.formatDate(new Date())));
                    $('#pay-reports-todate').datepicker('update', ($scope.transRepToDateCustom || $scope.formatDate(new Date())));
                    $('.input-daterange').datepicker('updateDates');
                });
        };
        
        $scope.enhancedLiability = function(addEl,intOrder,domOrder) {
          
          if (!addEl)
            return true;
          else if (addEl && intOrder)
            return true;
          else if(addEl && domOrder)
            return true;
          else
             return false;
        }
        
		
    		$scope.checkEL = function() {
    			
    			
          if($scope.domesticOrder.name!='Domestic Standard'){
            
            $scope.model.isELInternational = $scope.model.isEL;
          }
          if($scope.internationalOrder.name!='International Priority'){
              
            $scope.model.isELDomestic = $scope.model.isEL;
          }
          if(($scope.internationalOrder.name=='International Priority' && $scope.domesticOrder.name=='Domestic Standard')||($scope.internationalOrder.name!='International Priority' && $scope.domesticOrder.name!='Domestic Standard')){

              $scope.model.isELInternational = $scope.model.isELDomestic = $scope.model.isEL;
          }
          

    		}
		
        $scope.closeAccount = function() {
            $('#close-account-modal').modal();

            $('#close-account-modalCancel,#close-account-modal-close').on('click',function(e){
                $('close-account-modalOk').off('click');
            });

            $('#close-account-modalOk').on('click',function(e){
                //close account service call
                $('#close-account-modalCancel').click();
                $('.modal-backdrop.fade.in').remove();
                $('close-account-modalOk').off('click');
            });

            $('#close-account-modal').keypress(function(e){
                if(e.keyCode == 13 || e.keyCode == 32){
                    $('close-account-modalOk').click();
                }
            });
        };

        $scope.deleteUser = function(user) {
            $('#delete-user-modal').modal();

            $('#delete-user-modalCancel,#delete-user-modal-close').on('click',function(e){
                $('delete-user-modalOk').off('click');
            });

            $('#delete-user-modalOk').on('click',function(e){
                //close account service call
                $scope.removeUser(user);
                $('#delete-user-modalCancel').click();
                $('.modal-backdrop.fade.in').remove();
                $('delete-user-modalOk').off('click');
            });

            $('#delete-user-modal').keypress(function(e){
                if(e.keyCode == 13 || e.keyCode == 32){
                    $('delete-user-modalOk').click();
                }
            });
        };

        $scope.parseCountryName = function (countryCode) {
            if (!countryCode) return "";
            for (var index = 0; index < $scope.countryList.length; index++) {
                if ($scope.countryList[index].countryCode == countryCode) return $scope.countryList[index].countryName;
            }
        };

        $scope.getCountryList = function () {
            $scope.countryList = [];
            var url = "/content/country.json";
            $http({method: 'get', url: url, params : null, data: null,  cache: false}).
                success(function(data, status, headers, config) {
                    angular.forEach(data, function(item){
                        $scope.countryList.push(item);
                    }) ;
                }).
                error(function(data, status, headers, config) {
                    
                });
        };

        $scope.getUserRoles = function(roles) {
            //return (roles && roles.length) ? roles.join(', ') : $constants.notAvailableText;
            var userRolesAll = _.compact(_.map(roles,function(val){
               return (_.findWhere($constants.userRoles,{name:(val && val.groupName)?(val.groupName):''}))?(_.findWhere($constants.userRoles,{name:(val && val.groupName)?(val.groupName):''}).userInfo):'';
            }));

            return (userRolesAll.length)?userRolesAll.toString():'';
        };

        $scope.getUsers = function() {
            ngProgress.start();
            $bus.fetch({
                name: 'getusers',
                api: 'getusers',
                params: null,
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {

                        $scope.users = [];
                        var data = success.response.data;
                        if (data && data.users) {
                            if (!_.isArray(data.users)) {
                                _.forEach(data.users, function (user) {
                                    $scope.users.push(user);
                                });
                            } else {
                                $scope.users = data.users;
                            }
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
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    //notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });
        };

        $scope.editUser = function(user) {
            $scope.userEdited = {
                "userId" : user.userId,
                "merFirstName" : user.firstName,
                "merLastName" : user.lastName,
                "email" : user.email,
                "roles" : user.roles,
                "sendEmailToUser" : 1
            };
            ngProgress.start();
            $bus.fetch({
                name: 'edituser',
                api: 'edituser',
                params: $scope.userEdited,
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {

                        $scope.users = [];
                        var data = success.response.data;
                        if (data && data.users) {
                            if (!_.isArray(data.users)) {
                                _.forEach(data.users, function (user) {
                                    $scope.users.push(user);
                                });
                            } else {
                                $scope.users = data.users;
                            }
                        }
                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            notify.message(messages.productListFetchError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });

        };

        $scope.removeUser = function (user) {


            ngProgress.start();
            $bus.fetch({
                name: 'removeuser',
                api: 'removeuser',
                params: {userId : user.userId },
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {

                        $scope.users = [];
                        var data = success.response.data;
                        if (data && data.users) {
                            if (!_.isArray(data.users)) {
                                _.forEach(data.users, function (user) {
                                    $scope.users.push(user);
                                });
                            } else {
                                $scope.users = data.users;
                            }
                        }
                        $scope.getUsers();
                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            notify.message(messages.productListFetchError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });
        };

        $scope.getUser = function(userId) {
            ngProgress.start();
            $bus.fetch({
                name: 'getuser',
                api: 'getusers',
                params: {id:userId},
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {
                        $scope.user = success.response.data.user;
                        $scope.editUserRoles = [];

                        if ($scope.user.roles && $scope.user.roles.length) {
                            angular.forEach($scope.user.roles, function(role) {
                                if (role.groupName != 'MERCHANT')
                                    $scope.editUserRoles.push(role.groupName);
                            })
                        }
                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            notify.message(messages.productListFetchError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });
        };
        $scope.isPermissionAssigned = function() {
            if ($scope.isAddSubUser && $scope.newSubUser && $scope.newSubUser.roles)
                return ($scope.newSubUser.roles.length > 0);
            else if ($scope.user && $scope.user.roles)
                return ($scope.user.roles.length > 0);

        };

        $scope.hasPermission = function(role) {
            if($scope.editUserRoles && $scope.editUserRoles.length > 0) {
                for (var index = 0; index < $scope.editUserRoles.length; index++) {
                    if ($scope.editUserRoles[index] == role) return true;
                }
            }
            return false;
        };

        $scope.editUserRole = function (role) {
            var flag = false;
            if (!$scope.editUserRoles || $scope.editUserRoles.length == 0) {
                //$scope.tempUserRoles.push({"groupId":groupId, "groupName":groupName});
                $scope.editUserRoles = [];
                $scope.editUserRoles.push(role);
                flag = true;
            }
            else {
                for (index = 0; index < $scope.editUserRoles.length; index++) {
                    //if ($scope.tempUserRoles[index].groupId == groupId && $scope.tempUserRoles[index].groupName == groupName) {
                    if ($scope.editUserRoles[index] == role) {
                        $scope.editUserRoles.splice(index,1);
                        flag = true;
                        break;
                    }
                }
            }

            if (!flag) $scope.editUserRoles.push(role);
            $scope.user.roles = angular.copy($scope.editUserRoles.join(','));
        };

        $scope.addNewUserRole = function(role){
            var flag = false;
            if (!$scope.tempUserRoles || $scope.tempUserRoles.length == 0) {
                //$scope.tempUserRoles.push({"groupId":groupId, "groupName":role});
                $scope.tempUserRoles = [];
                $scope.tempUserRoles.push(role);
                flag = true;
            }
            else {
                for (index = 0; index < $scope.tempUserRoles.length; index++) {
                    //if ($scope.tempUserRoles[index].groupId == groupId && $scope.tempUserRoles[index].groupName == role) {
                    if ($scope.tempUserRoles[index] == role) {
                        $scope.tempUserRoles.splice(index,1);
                        flag = true;
                        break;
                    }
                }
            }

            if (!flag) $scope.tempUserRoles.push(role);
            //var newRole = {"groupId":groupId, "groupName":role};
            $scope.newSubUser.roles = angular.copy($scope.tempUserRoles.join(','));
        };

            $scope.clearSubUser = function() {
                $scope.newSubUserRetypePW = "";
                $scope.newSubUser = {
                    email           : "",
                    merFirstName    : "",
                    merLastName     : "",
                    password        : "",
                    retypePwd       : "",
                    roles           : "MERC_CATALOG_MGR,MERC_ORDER_MGR,MERC_CONFIG_MGR",
                    sendEmailToUser : 1
                }
                $scope.tempUserRoles = ['MERC_CATALOG_MGR','MERC_ORDER_MGR','MERC_CONFIG_MGR'];
                $scope.isCatalogManager   = true;
                $scope.isFulManager       = true;
                $scope.isConManager       = true;
            };

        $scope.createNewSubUser = function() {

            ngProgress.start();
            $bus.fetch({
                name: 'createuser',
                api: 'createuser',
                params: null,
                data: $scope.newSubUser
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {
                        notify.message(success.response.success.join(', ', '', 'succ'));
                        $location.path('/accounts/users');

                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            notify.message(messages.createUserError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    notify.message(messages.createUserError);
                    ngProgress.complete();
                });

        };

        $scope.updateSubUser = function() {

            var userEdited = {
                "userId"        : $scope.user.userId,
                "merFirstName"  : $scope.user.firstName,
                "merLastName"   : $scope.user.lastName,
                "email"         : $scope.user.email,
                "roles"         : $scope.editUserRoles.join(','),
                "sendEmailToUser" : 1
            }

            ngProgress.start();
            $bus.fetch({
                name: 'edituser',
                api: 'edituser',
                params: userEdited,
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {
                        /*notify.message(success.response.success.join(', '), '', 'succ');*/
                        notify.message(messages.updateUserSuccess, '', 'succ');
                        $location.path('/accounts/users');

                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            notify.message(messages.updateUserError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    notify.message(messages.updateUserError);
                    ngProgress.complete();
                });
        };

        $scope.generateStatementPeriod = function() {

            $scope.billingPeriods = [];

            var today           = new Date();
            var todayDate       = today.getDate();

            var month_names     = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var current_month_words = month_names[today.getMonth()];
            var current_month_no    =  today.getMonth();

            var currentYr           = today.getFullYear();
            var lastYr              = currentYr - 1;
            var nextYr = currentYr + 1;

            for (var index = 0; index < 12; index++) {
                var billingCycle = '';

                if (todayDate < 26) {
                    if (current_month_no - index - 1 > 0) {
                        billingCycle = '26'+ ' ' + month_names[current_month_no - index - 1] + ' ' + currentYr + ' - ' +
                        '25'+ ' ' + month_names[current_month_no ] + ' ' + currentYr;
                    }
                    else {
                        billingCycle = '26'+ ' ' + month_names[11 - Math.abs(current_month_no - index)] + ' ' + lastYr + ' - ' +
                        '25'+ ' ' + month_names[((current_month_no - index)>=0) ? (current_month_no-index) :
                            ((current_month_no - index) < 0)? (12 - Math.abs(index - current_month_no)) : (11- Math.abs(index - current_month_no))]  + ' ' +
                        (((current_month_no - index) < 0)? lastYr : currentYr);
                    }
                }
                else {
                    if (current_month_no + 1 - index > 0){
                        billingCycle = '26'+ ' ' + month_names[current_month_no - index] + ' ' + currentYr + ' - ' +
                        '25'+ ' ' + month_names[current_month_no + 1 - index] + ' ' + currentYr;
                    }
                    else {
                        var leftMonthAdj  = (12 - (Math.abs(current_month_no - index)) <= 11) ? (12 - (Math.abs(current_month_no - index))) : (11 - (Math.abs(current_month_no - index) - 1));
                        var rightMonthAdj = (leftMonthAdj + 1 > 11) ? 0 : leftMonthAdj + 1;
                        billingCycle = '26'+ ' ' + month_names[leftMonthAdj] + ' ' + lastYr + ' - ' +
                        '25'+ ' ' + month_names[rightMonthAdj]  + ' ' + lastYr;
                    }
                }
                $scope.billingPeriods.push(billingCycle);
            }
        };

        // Password Validation - 1st Password
        $scope.isPasswordFormat = function(password){
            if (typeof password == 'undefined'){
              $scope.pwErrorMessage1 = $scope.validationMessages.required;
              return false;
            }
            if(password.length <8){
              $scope.pwErrorMessage1 = $scope.validationMessages.invalidPasswordLength;
              return false;
            }
            //var patt = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).*$");
            var patt = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
            var res = patt.test(password);
            if(!res){
              $scope.pwErrorMessage1 = $scope.validationMessages.invalidPasswordFormat;
              return false;
            }
            return true;
        }

        // Password Validation - Retype Password 
        $scope.isPasswordMatch = function(password, reTypePw) {
                if (typeof reTypePw == 'undefined'){
                     $scope.pwErrorMessage = $scope.validationMessages.required;
                     return false;
                }
                if(reTypePw.length <8){
                     $scope.pwErrorMessage = $scope.validationMessages.invalidPasswordLength;
                        return false;
                }
                if (password != reTypePw) {
                        $scope.pwErrorMessage = $scope.validationMessages.pwmissmatch;
                        return false;
                }
                return true;
        };


            $scope.downloadProdRep = function () {
                //prod-category
                var prodCat = null;
                angular.forEach($scope.selectedProdCat, function(prod) {
                    if (!prodCat) prodCat = prod.value;
                    else prodCat = prodCat + ',' + prod.value;
                });

                var status = ($scope.isActive && $scope.isInActive) ? "0,1" : ($scope.isActive) ? "1" : ($scope.isInActive) ? "0" : null;

                //"custom"
                var date;
                if ($scope.selectedDateRange[0] && $scope.selectedDateRange[0].value) {
                    if ($scope.selectedDateRange[0].value == "custom") {
                        date = $scope.selectedDateRange[0].value;
                        $scope.customFromDate   = $scope.prodCustomFromDate;
                        $scope.customToDate     = $scope.prodCustomToDate;
                    }
                    else date = (!$scope.selectedDateRange[0] || $scope.selectedDateRange[0].value == 'all')? '' : $scope.selectedDateRange[0].value;
                }
                url= $constants.baseUrl + restapi['reports'].url + '?reportType=products' + (prodCat? '&cat='+prodCat:'') + (date?'&date='+date:'') + '&fromdate=' + $scope.customFromDate + '&todate=' + $scope.customToDate + (status?'&reportStatus='+status:'');
                $scope.getFileUrl(url);
            };

            $scope.downloadAllProdRep = function() {
                var url = $constants.baseUrl + restapi['reports'].url + '?reportType=products';
                $scope.getFileUrl(url);
            };

            // Order Report - Download

            $scope.downloadOrdersRep = function () {

            
                
                var status = ($scope.isDomestic && $scope.isInternational) ? "0,1" : ($scope.isDomestic) ? "1" : ($scope.isInternational) ? "0" : null;

                //"custom"
                var date;
                if ($scope.selectedDateRangeOrders[0] && $scope.selectedDateRangeOrders[0].value) {
                    if ($scope.selectedDateRangeOrders[0].value == "custom") {
                        date = $scope.selectedDateRangeOrders[0].value;
                        $scope.customFromDate   = $scope.repOrdFromdate;
                        $scope.customToDate     = $scope.repOrdTodate;
                    }
                    else date = (!$scope.selectedDateRangeOrders[0] || $scope.selectedDateRangeOrders[0].value == 'all')? '' : $scope.selectedDateRangeOrders[0].value;
                }
                if(status=="0,1")
                    status="";
                url= $constants.baseUrl + restapi['reports'].url + '?reportType=orders' + (date?'&date='+date:'') + '&fromdate=' + $scope.customFromDate + '&todate=' + $scope.customToDate + (status?'&isDomestic='+status:'');
                $scope.getFileUrl(url);
            };


            

            $scope.downloadTransRep = function() {

                if (!$scope.repPayDate[0]) {
                    var url = $constants.baseUrl + restapi['reports'].url + '?reportType=transactions';
                    $scope.getFileUrl(url);
                    return
                }

                var transFromDate;
                var transToDate;

                var today           = new Date();
                var currentMonth    = today.getMonth() + 1;
                var currentYr       = today.getFullYear();

                if ($scope.repPayDate && $scope.repPayDate[0].value != 'custom') {

                    transToDate   = $scope.formatDate(today);

                    //Current Month
                    if ($scope.repPayDate[0].value == '1m'){
                        transFromDate = '01/'+ ((currentMonth / 10 < 1) ? '0' + currentMonth : currentMonth) + '/' + currentYr;
                    }

                    //Current & Last Month
                    else if ($scope.repPayDate[0].value == '-1m'){
                        if (currentMonth == 1)      transFromDate = "01/12/" + (currentYr - 1);
                        else if (currentMonth > 1)  transFromDate = "01/" + (((currentMonth - 1) / 10 < 1) ? '0' + (currentMonth - 1) : currentMonth - 1) + '/' + currentYr;
                    }

                    //Current & Last 2 Month
                    else if ($scope.repPayDate[0].value == '-2m'){

                        if ((currentMonth - 2) < 1){
                            transFromDate = "01/" + (((12 - (currentMonth - 2)) / 10 < 1) ? '0' + (12 - (currentMonth - 2)) : (12 - (currentMonth - 2))) + "/" + (currentYr - 1);
                        }
                        else if ((currentMonth - 2) >= 1){
                            transFromDate = "01/" + (((currentMonth - 2) / 10 < 1) ? '0' + (currentMonth - 2) : currentMonth - 2) + '/' + ((currentMonth - 2 < 1) ? currentYr - 1 : currentYr);
                        }
                    }
                }
                //Custom Range
                else if ($scope.repPayDate && $scope.repPayDate[0].value == 'custom') {
                    transFromDate = $scope.transRepFromDateCustom;
                    transToDate   = $scope.transRepToDateCustom;
                }

                //url= $constants.baseUrl + restapi['reports'].url + '?reportType=transactions' + '&date=' + $scope.repPaydate[0].value + '&fromdate=' + $scope.repPayFromDate + '&todate=' + $scope.repPayToDate;
                var url= $constants.baseUrl + restapi['reports'].url + '?reportType=transactions' + '&date=custom' + '&fromdate=' + transFromDate + '&todate=' + transToDate;
                $scope.getFileUrl(url);
            };

            $scope.downloadShipmentRep = function (inboundReference) {
                var url= $constants.baseUrl + restapi['reports'].url + '?reportType=inbounds' + '&inboundReference=' + inboundReference;
                $scope.getFileUrl(url);
            };

            $scope.reportsProducts = function() {
                $scope.selectedProdCat    = null;
                $scope.selectedDateRange  = [];
                $scope.isActive           = true;
                $scope.isInActive         = null;
                $scope.customFromDate     = null;
                $scope.customToDate       = null;
                $scope.prodCustomFromDate = $scope.prodCustomFromDate ? $scope.prodCustomFromDate : $scope.formatDate(new Date());
                $scope.prodCustomToDate   = $scope.prodCustomToDate ? $scope.prodCustomToDate : $scope.formatDate(new Date());

                angular.forEach($scope.dateOptionsProducts, function(option){
                    if (option.value == 'all') {
                        option.ticked = true;
                        $scope.selectedDateRange[0] = option;
                    }
                    else option.ticked = false;
                });
                angular.forEach($scope.categoryOptions, function(option){
                    option.ticked = true;
                });

                $scope.prodTickSelection = function(options, tickIndex) {
                    if (!$scope.selectedDateRange) $scope.selectedDateRange = [];
                    $scope.selectedDateRange[0] = options[tickIndex];
                    angular.forEach($scope.dateOptionsProducts, function(option, index){
                        if (index == tickIndex) {
                            $scope.dateOptionsProducts[index].ticked = true;
                        }
                        else $scope.dateOptionsProducts[index].ticked = false;
                    });
                };

                $timeout(function () {
                   /* var checkin = $('#product-reports-fromdate').datepicker({
                        todayHighlight: true,
                        endDate:new Date()
                    })
                        .on('changeDate', function (ev) {
                            $scope.prodCustomFromDate = $scope.formatDate(ev.date);
                            checkout.setStartDate(ev.date);
                            checkin.hide();
                            $('#product-reports-todate')[0].focus();
                        }).data('datepicker');

                    var checkout = $('#product-reports-todate').datepicker({
                        todayHighlight: true,
                        endDate:new Date()
                    }).on('changeDate', function (ev) {
                        checkout.hide();
                        $scope.prodCustomToDate = $scope.formatDate(ev.date);
                    }).data('datepicker');*/

                    $timeout(function () {
                        $scope.rangepicker;
                        $scope.isRangepickerShowing = !$scope.isRangepickerShowing;
                        if (!$scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.hide();
                        else if ($scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.show();

                        $scope.rangepicker =  $('.input-daterange').datepicker({
                            inputs: $('#product-reports-fromdate, #product-reports-todate'),
                            format: "dd/mm/yyyy",
                            endDate: new Date(),
                            todayHighlight:true

                        }).on('changeDate', function (ev) {
                            $scope.$apply();
                            $scope.prodTickSelection($scope.dateOptionsProducts, 8);
                            if ($('#product-reports-fromdate').datepicker('getDate') != "Invalid Date" && $('#product-reports-todate').datepicker('getDate') != "Invalid Date") {
                                $scope.prodCustomFromDate = $scope.formatDate($('#product-reports-fromdate').datepicker('getDate'));
                                $scope.prodCustomToDate   = $scope.formatDate($('#product-reports-todate').datepicker('getDate'));
                            }
                            else if ($('#product-reports-fromdate').datepicker('getDate') == "Invalid Date" && $('#product-reports-todate').datepicker('getDate') != "Invalid Date") {
                                $scope.prodCustomFromDate = $scope.formatDate($('#product-reports-todate').datepicker('getDate'));
                                $scope.prodCustomToDate   = $scope.formatDate($('#product-reports-todate').datepicker('getDate'));
                            }
                            else {
                                $scope.prodCustomFromDate = $scope.formatDate(($('#product-reports-fromdate').datepicker('getDate') != "Invalid Date")? $('#product-reports-fromdate').datepicker('getDate'): new Date());
                                $scope.prodCustomToDate = ($('#product-reports-todate').datepicker('getDate') != "Invalid Date") ? $scope.formatDate($('#product-reports-todate').datepicker('getDate')) : $scope.prodCustomFromDate;
                            }
                            $('#product-reports-fromdate').datepicker('update', $scope.prodCustomFromDate);
                            $('#product-reports-todate').datepicker('update', $scope.prodCustomToDate);
                            $('.input-daterange').datepicker('updateDates');
                        });

                        $('#product-reports-fromdate').datepicker('update', ($scope.prodCustomFromDate || $scope.formatDate(new Date())));
                        $('#product-reports-todate').datepicker('update', ($scope.prodCustomToDate || $scope.formatDate(new Date())));
                        $('.input-daterange').datepicker('updateDates');

                    });
                });
            };

            $scope.getFileUrl = function (url) {

                $rootScope.notificationMessages = [];//to clear error toaster
                $.fileDownload(url, {
                    successCallback: function (url) {
                        //toaster.pop("success", messages.labelDownloadSuccess); commented
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
                                //toaster.pop("error", errors.join(', '), '', 0); commented
                                notify.message($rootScope.pushJoinedMessages(errors))
                                //notify.message(errors.join());
                            } else {
                                //toaster.pop("error", messages.labelDownloadError); commented
                                notify.message(messages.labelDownloadError);
                            }
                        } else {
                            //toaster.pop("error", messages.labelDownloadError); commented
                            notify.message(messages.labelDownloadError);
                        }
                        $scope.$apply();
                    }
                });
            };


            $scope.initFulfillmentCost = function() {

                var min = 1,
                max = 3000,
                range = [0,1,2,3,4,5,6,7,8,9],
                i = min,
                step = 1;

                if (min > 0 && min % 10 != 0) {
                    // prepare next min
                    var min_2 = min,
                    min_state = false;

                    range.push(min);

                    do {
                        min_2 += 1;

                        if (min_2 % 10 == 0) {
                            min_state = true;
                        }
                    } while (!min_state);

                    i = min_2;
                    }

                    do {
                        range.push(i);
                        i += step;

                        if (i >= 1 && i < 100) {
                            step = 1;
                        } else if (i >= 100 && i < 500) {
                            step = 10;
                        } else if (i >= 1000) {
                            step = 50;
                        }
                    } while (i <= max)

                    if (i != max) {
                        range.push(max);
                    }

                    var slider_min = 1,
                    slider_max = range.length - 1;

                    $("#my-slider").slider({
                        values: [slider_min],
                        min: slider_min,
                        max: slider_max,
                        animate:true,
                        slide: function(event, ui) {

                            $("#ex6SliderVal").text(range[ui.values[0]]);
                            $("#max_orders_per_month").val(range[ui.values[0]]);
                        },
                        stop: function(event, ui) {
                            ajaxPOSTRequest(successResponse);
                        }

                    });

                    $("#my-slider1").slider({
                        min: 1,
                        max: 10,
                        step: 0.5,
                        animate:true,
                        values: [1],
                        slide: function(event, ui) {
                            $("#amount").text(ui.values[0]);
                            $("#items_per_order").val(ui.values[0]);


                        },
                        stop: function(event, ui) {
                            ajaxPOSTRequest(successResponse);
                        }
                    });

                    $("#ft3-slider").slider({
                        min: 1,
                        max: 100,
                        step: 1,
                        animate:true,
                        values: [1],
                        slide: function(event, ui) {
                            $("#cbm_Val").text(ui.values[0]);
                            $("#max_storage_ft3").val(ui.values[0]);


                        },
                        stop: function(event, ui) {
                            ajaxPOSTRequest(successResponse);
                        }
                    });

                    $("#skus-slider").slider({
                        min: 1,
                        max: 600,
                        step: 1,
                        animate:true,
                        values: [1],
                        slide: function(event, ui) {
                            $("#sku_Val").text(ui.values[0]);
                            $("#max_skus").val(ui.values[0]);


                        },
                        stop: function(event, ui) {
                            ajaxPOSTRequest(successResponse);
                        }
                    });


                    function ajaxPOSTRequest(successCallback) {
                    var formData = $('#calculator_data').serialize(); //new FormData("#calculator_data");
                    //console.log(">>"+formData);
                    $.ajax({
                        type: "POST",
                        url: '/calculator/pricing.php',
                        data: formData,
                    //contentType: "application/json",
                    success: function(data, textStatus, request) {
                        if (data.status && data.status == 'failure' && data.reason == 'User session expired') {
                            sessionExpireModal();
                        }
                    //$("#spinner").hide();
                    successCallback(data);
                    }

                    });
                    }

                    function successResponse(data) {
                        $("#total_price").html("$" + data.price).css("display","none");
                        $("#total_price").fadeIn();
                        $("#cost_order").html("$" + data.price_per_order);
                        $("#cost_unit").html("$" + data.price_per_item);
                        $("#handling_cost_month").html("$" + data.handlingPrice);
                        $("#cost_month").html("$" + data.storagePrice);

                        $("#cost_order1").html("$" + data.price_per_order);
                        $("#cost_unit1").html("$" + data.price_per_item);
                        $("#handling_cost_month1").html("$" + data.handlingPrice);
                        $("#cost_month1").html("$" + data.storagePrice);

                        $("#cost_order2").html("$" + data.price_per_order);
                        $("#cost_unit2").html("$" + data.price_per_item);
                        $("#handling_cost_month2").html("$" + data.handlingPrice);
                        $("#cost_month2").html("$" + data.storagePrice);
                    //alert(data);
                    }

                    $( document ).ready(function() {
                        ajaxPOSTRequest(successResponse);

                        $(".numbers_only").keypress(function (e) {
                    //if the letter is not digit then display error and don't type anything
                    if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
                    //display error message
                    $("#errmsg").html("Numbers Only").show().fadeOut("slow");
                    return false;
                    }
                    });

                        var cum_val = 0;

                        $("#calculate").click(function(){
                            if($("#l_value").val() != '' && $("#w_value").val() != '' && $("#h_value").val() != ''){
                                cum_val = $("#l_value").val() * $("#w_value").val() * $("#h_value").val();
                                cum_val = cum_val/1000000;
                            }
                            if($("#avg_units").val() != ''){
                                cum_val = cum_val * $("#avg_units").val();
                            }
                            if($("#tot_product").val() != ''){
                                cum_val = cum_val * $("#tot_product").val();
                            }
                            cum_val = cum_val.toFixed(2);
                            $("#storage_capacity").html(cum_val);
                        });



                        $('#myModal').on('hidden.bs.modal', function () {
                            var storageCapacity = Number($('#storage_capacity').html());
                            if(storageCapacity && storageCapacity <= 100) {
                                $("#cbm_Val").text(storageCapacity);
                                $("#max_storage_ft3").val(storageCapacity);
                                $("#ft3-slider").slider({
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    animate:true,
                                    values: [storageCapacity],
                                    slide: function(event, ui) {
                                        $("#cbm_Val").text(ui.values[0]);
                                        $("#max_storage_ft3").val(ui.values[0]);


                                    },
                                    stop: function(event, ui) {
                                        ajaxPOSTRequest(successResponse);
                                    }
                                });
                                ajaxPOSTRequest(successResponse);
                            }
                        })

                    });

            };

            $('html').click(function (e) {
                if ($scope.rangepicker && ($(e.target).closest(".dropdown-submenu").length ||
                    $(e.target).attr('class')=='day' || $(e.target).attr('class')=='month' || $(e.target).attr('class')=='year'||
                    $(e.target).attr('class')=='old day' || $(e.target).attr('class')=='range day'|| $(e.target).attr('class')=='old range day' ||
                    $(e.target).attr('class')=='selected day' || $(e.target).attr('class')=='today selected day' || $(e.target).attr('class')=='today day' ||
                    $(e.target).attr('class')=='active selected day'|| $(e.target).attr('class')=='new day' || $(e.target).attr('class')=='today active selected day'||
                    $(e.target).attr('class')=='new active selected day' || $(e.target).attr('class')=='new selected day' || $(e.target).attr('class')=='new range day' || 
                    $(e.target).attr('class')=='new today day' || $(e.target).attr('class')=='new today selected day')) {
                    e.stopPropagation();
                }
            });

            $scope.init = function () {

                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                }, 1000);
                
                var currentRoute = $scope.readQueryParam($routeParams);

                $scope.selectedProdCat      = null;
                $scope.selectedDateRange    = null;
                var path = $location.path();
            var tempPath = path.substring(0, path.lastIndexOf("/"));
            path = (tempPath == "/accounts/editUser") ? tempPath : path;
            switch (path) {
                case '/accounts/preferences/email':
                    $scope.getEmail();
                    break;

                case '/accounts/preferences/fulfillment':
                    $scope.getFulfillment();
                    break;

                case '/accounts/fulfillmentCost':
                    $scope.initFulfillmentCost();
                    break;
                
                case '/accounts/preferences/others':
                    $scope.getOthers();
                    break;
                  
                case '/accounts/connections/ebay/success':
                    $scope.getEbayToken();
                    break;
                
                case '/accounts/connections':
                    $scope.listChannels();
                    break;
                
                case '/accounts/billingSummary':
                    $scope.billingSummary();
                    break;
                  
                case '/accounts/reports/products':
                    $scope.reportsProducts();
                    break;
                
                case '/accounts/reports/shipments':
                    $scope.reportsShipments();
                    break;
                
                case '/accounts/reports/orders':
                    $scope.reportsOrders();
                    break;
                  
                case '/accounts/reports/payments':
                    $scope.reportsPayments();
                    //$scope.generateStatementPeriod();
                    break;

                case '/accounts/users':
                    $scope.getUsers();
                    break;

                case '/accounts/editUser':
                    $scope.isAddSubUser = false;
                    var location = $location.path();
                    var locations = location.split('/');
                    var userId = locations[locations.length-1];

                    $scope.getUser(userId);
                    break;

                case '/accounts/newSubAccount':
                    $scope.isAddSubUser = true;
                    $scope.clearSubUser();
                    $scope.roles = [];
                    break;

                default :
                    $scope.getMerchant();
                    $scope.getCountryList();
                    break;
            }
        };

    }]);
});