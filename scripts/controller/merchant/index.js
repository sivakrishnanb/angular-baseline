define(['app','downloader'], function (app,downloader) {
    app.controller('Merchant', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', '$routeParams','$window', 'toaster', '$rootScope', '$timeout','notify', '$localStorage',
        function ($scope, $bus, $location, ngProgress, $http, $constants, $routeParams,$window, toaster, $rootScope, $timeout, notify, $localStorage) {

            $scope.merchantSearchOptions = angular.copy($constants.merchantSearchOptions);
            $scope.constants = $constants;

            $scope.resetForm = function (form) {
                document.getElementById(form).reset();
            };

            //Suggest
            $scope.getFirstMatchSuggest = function(param,match){
                if (param && match) {
                    var patt =  new RegExp(match,'gi');
                    var loopData = _.filter(_.compact(param.split(',')),function(n){ return patt.test(n); });
                    return (loopData.length)?_.first(loopData):_.first(_.compact(param.split(',')));
                }else{
                    return $constants.notAvailableText;
                }
            }

            $scope.highlightSuggest = function (str, match) {
                if (str && match) {
                    var regex = new RegExp("(" + match + ")", 'gi');
                    return str.replace(regex, '<strong>$1</strong>');
                }
                return str
            };


            $scope.parseCountryName = function (countryCode) {
                if (!countryCode) return "";
                for (var index = 0; index < $scope.countryList.length; index++) {
                    if ($scope.countryList[index].countryCode == countryCode) return $scope.countryList[index].countryName;
                }
            };

            $scope.suggestNavigation = function(suggest) {
                if(suggest) {
                    var url = 'merchant/showProfile/' + suggest.merchantCode;
                    $rootScope.changeLogginContent(suggest);
                    $location.url(url);
                }
            };

            $scope.suggestions = [];

            $scope.getSuggestionStatus = function() {

                if (_.isEmpty($routeParams)) {
                    return '1';
                }else if($routeParams && $routeParams.status!=''){
                    return (_.findWhere($constants.shipmentStatus,{name:$routeParams.status})?_.findWhere($constants.shipmentStatus,{name:$routeParams.status}).value:'')
                }
            };

            $scope.findSuggestion = function (txt, col) {
                $scope.emptySuggestions = false;
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: 'suggestmerchants',
                                api: 'suggestmerchants',
                                params: {
                                    skey: txt,
                                    scol: col[0].value
                                    /*status: $scope.getSuggestionStatus()*/
                                },
                                data: null
                            })
                                .done(function (success) {
                                    if (success.response && success.response.data && success.response.data.docs){
                                        if (success.response.data.docs.length) {
                                            $('#merchant-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
                                            $timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                            },100);
                                        }else{
                                            $('#merchant-search-suggestion').hide();
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #shipment-search-text, div.nano-pane, div.nano-slider").click(function (e) {
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

            $scope.attachEventsForTypeAhead = function () {
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #merchant-search-text, div.nano-pane, div.nano-slider").click(function (e) {
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

            $scope.readQueryParam = function (param) {
                $timeout(function () {
                    $scope.sortingOptions.field = $localStorage.pagingOptions.merchant.sortingOption;
                    $scope.sortingOptions.name = _.findWhere($constants.merchantSortingOptions, {"value": $scope.sortingOptions.field}).name;
                    $scope.sortingOptions.direction = $localStorage.pagingOptions.merchant.sortDir;
                     if (param.skey) {
                        $scope.searchKey = param.skey;
                        //param.scol
                        angular.forEach($scope.merchantSearchOptions, function(option){
                            if (option.value == param.scol) option.ticked = true;
                            else option.ticked = false;
                        });
                    }
                    angular.forEach($scope.constants.merchantFilterStatus , function(item){
                        if (param.activationPending && item.key == 'activationPending') item.ticked = true;
                        else if (param.blocked && item.key == 'blocked') item.ticked = true;
                        else if (param.status && item.key == 'status') item.ticked = true;
                        else if (param.verificationPending && item.key == 'verificationPending') item.ticked = true;
                        else item.ticked = false;
                    });
		    
                });
            };

            $scope.applyFilter = function (applyClicked) {
                var totalPageCount = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                var pageToFetch = ($scope.pagingOptions.currentPage > totalPageCount) ? totalPageCount : $scope.pagingOptions.currentPage;
                pageToFetch = (applyClicked)?'1':pageToFetch;

                var filterQuery = $routeParams;

                var query =
                    ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') +
                    ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') +
                    ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') +
                    ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction + '&': '') +
                    (((applyClicked || (filterQuery.scol && filterQuery.skey)) && $scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') +'&' : '') +
                    (((applyClicked || filterQuery.skey) && $scope.searchKey) ? 'skey=' + $scope.searchKey + '&' : '');


                if (applyClicked) {
                    angular.forEach($scope.statusFilter, function (item) {
                        query = (query ? query + '&': '') + item.key + '=' + item.value;
                    })
                }
                else  {
                    query = query + (filterQuery.status  ? '&status=1' : '') +
                    (filterQuery.blocked ? '&blocked=1' : '') +
                    (filterQuery.verificationPending ? '&verificationPending=1' : '') +
                    (filterQuery.activationPending   ? '&activationPending=1' : '');
                }

                if (query &&($location.url() != $location.path() + '?' + query)) {
                    //
                    $location.url($location.path() + '?' + query);
                    $scope.readQueryParam($routeParams);
                }
            };

            $scope.resetFilter = function () {

                var resetQueryForm = $scope.getQueryParam();
                var resetQuery = (resetQueryForm.p ? 'p=' + resetQueryForm.p + '&' : '')+(resetQueryForm.rcd ? 's=' + resetQueryForm.rcd + '&' : '')+(resetQueryForm.sortcol ? 'f=' + resetQueryForm.sortcol + '&' : '')+(resetQueryForm.sortmethod ? 'd=' + resetQueryForm.sortmethod + '&' : '');

                $location.url((resetQuery)?$location.path() + '?' +resetQuery:$location.path());
                $scope.readQueryParam($routeParams);
                $scope.searchKey = ""; // added
                $scope.statusFilter = [];
                $scope.merchantSearchOptions = angular.copy($constants.merchantSearchOptions);
                //$scope.form.$setPristine(); // added
            }
	    
            $scope.sort = function (field, name) {
              
                if ($scope.sortingOptions.field != field || $scope.sortingOptions.name != name) {
                    $scope.sortingOptions.field = field;
                    $localStorage.pagingOptions.merchant.sortingOption = field;
                    $scope.applyFilter();
                }
            }

            $scope.sortDirection = function () {
                if ($scope.sortingOptions.direction == 'desc') {
                    $scope.sortingOptions.direction = 'asc';
                    $localStorage.pagingOptions.merchant.sortDir = 'asc';
                } else {
                    $scope.sortingOptions.direction = 'desc';
                    $localStorage.pagingOptions.merchant.sortDir = 'desc';
                }
                $scope.applyFilter();
            };

            $scope.$watch('myData', function (items) {
                var indItemSelected = 0;
                angular.forEach(items, function (items) {
                    indItemSelected += items.Selected ? 1 : 0;
                });

                $scope.showSelectedLength = indItemSelected;
                ($scope.showSelectedLength) ? $scope.showSelected = 1 : $scope.showSelected = 0;


            }, true);

            $scope.checkOption = function(option){
            if($routeParams.status==undefined)
                $routeParams.status="pending";

               switch(option) {
                    case 'merchantId': return  'col-xs-12 col-sm-1 col-md-1';
                    break;

                    case 'status': return  'col-xs-12 col-sm-1 col-md-1';
                    break;

                    case 'registeredEmail': return  'col-xs-12 col-sm-2 col-md-2';
                    break;

                    case 'companyName': return  'col-xs-12 col-sm-2 col-md-1';
                    break;

                    case 'uen': return  'col-xs-12 col-sm-2 col-md-2';
                    break;

                    case 'merchantName': return  'col-xs-12 col-sm-2 col-md-1';
                    break;

                    case 'date': return  'col-xs-12 col-sm-2 col-md-1';
                    break;

                    case 'outstandingBill': return  'col-xs-12 col-sm-3 col-md-1';
                    break;

                    case 'action': return  'col-xs-12 col-sm-2 col-md-2';
                        break;
                }
        }

            $scope.sortLogo = function () {
                return ($localStorage.pagingOptions.merchant.sortDir == 'asc') ? true : false;
            }

            $scope.paging = function (page, index) {
                if (page > Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize)) return;
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
            };

            $scope.initDate = function () {
                $timeout(function () {
                    $('#payment-date').datepicker({
                        todayHighlight: true,
                        format: "dd/mm/yyyy"
                    });

                    $('#adj-date').datepicker({
                        todayHighlight: true,
                        format: "dd/mm/yyyy"
                    });
                });
            };

            $scope.clearPaymentForm = function(){
                $scope.resetForm("form-add-new-payment");
            };

            $scope.clearAdjustmentForm = function(){
                $scope.resetForm("form-add-new-adjustment");
            };
            $scope.clearPaymentModel = function(){
                $scope.paymentModel = {
                    "paymentRefNo" : "",
                    "invoiceRefNo" : "",
                    "paymentAmt"   : "",
                    "paymentDate"  : "",
                    "remarks"      : ""
                };
                $scope.addNewPaymentError = '';
            };

            $scope.clearAdjustmentModel = function() {
                $scope.adjustmentModel = {
                    "adjustmentRefNo"   : "",
                    "invoiceRefNo"      : "",
                    "adjustmentType"    : $scope.adjustmentType[0],
                    "adjustmentAmt"     : "",
                    "adjustmentDate"    : "",
                    "remarks"           : ""
                };
                $scope.addNewAdjError = '';
            };
            $scope.addNewPayment = function () {
                ngProgress.start();
                $bus.fetch({
                    name: 'addnewpayment',
                    api : 'addnewpayment',
                    params: null,
                    data: $scope.paymentModel
                })
                    .done(function (data) {
                        var successMessages = [];
                        if (data.response.success && data.response.success.length) {
                            successMessages = data.response.success;
                            notify.message(successMessages.join(','),'','succ');
                            $scope.getpayments();
                            $scope.clearPaymentModel();
                            $("#modal-add-new-payment").modal('hide');
                        } else {
                            var errors = [];
                            _.forEach(data.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length){
                                //notify.message($rootScope.pushJoinedMessages(errors));
                                $scope.addNewPaymentError = errors.join(', ')
                            }
                            else{
                                //notify.message(messages.merchantListFetchError);
                                $scope.addNewPaymentError = messages.merchantListFetchError;
                            }
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        //notify.message(messages.merchantListFetchError);
                        $scope.addNewPaymentError = error.response.errors.join(', ');
                        ngProgress.complete();
                    });
            };

            $scope.addNewAdjustment = function() {
                ngProgress.start();
                $bus.fetch({
                    name: 'addnewadjustments',
                    api : 'addnewadjustments',
                    params: null,
                    data: $scope.adjustmentModel
                })
                    .done(function (data) {
                        var successMessages = [];
                        if (data.response.success && data.response.success.length) {
                            successMessages = data.response.success;
                            notify.message(successMessages.join(','),'','succ');
                            $scope.clearAdjustmentModel();
                            $("#modal-add-new-adjustment").modal('hide');
                            $scope.getpayments();
                        } else {
                            var errors = [];
                            _.forEach(data.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length){
                                //notify.message($rootScope.pushJoinedMessages(errors));
                                $scope.addNewAdjError = errors.join(', ')
                            }
                            else{
                                //notify.message(messages.merchantListFetchError);
                                $scope.addNewAdjError = messages.merchantListFetchError;
                            }
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.merchantListFetchError);
                        //notify.message(messages.merchantListFetchError);
                        $scope.addNewAdjError = error.response.errors.join(', ');
                        ngProgress.complete();
                    });
            };

            $scope.doActivate = function (merchant) {
                ngProgress.start();
                $bus.fetch({
                    name: 'activatemerchant',
                    api : 'activatemerchant',
                    params: {id : merchant.merchantCode},
                    data: null
                })
                    .done(function (data) {
                        var successMsgs = [];
                        if (data.response.success && data.response.success.length) {
                            successMsgs = data.response.success;
                            notify.message(successMsgs.join(','),'','succ');
                            $scope.getPagedDataAsync();
                        } else {
                            var errors = [];
                            _.forEach(data.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) notify.message($rootScope.pushJoinedMessages(errors));
                            else notify.message(messages.merchantListFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.merchantListFetchError);
                        notify.message(messages.merchantListFetchError);
                        ngProgress.complete();
                    });
          
            };

             $scope.doUnblock = function (merchant) {

                $scope.selectedMerchantID = merchant.merchantCode;
                $scope.selectedCompanyName = merchant.companyName; 

                $scope.unblockedRemarks="";
                  $('#modal-unblock-confirm').modal();
                    
                    $('#unblockConfirm-modalCancel,#model-close').on('click',function(e){
                        $('#modal-unblock-confirm .form-group,textarea').removeClass('has-error');
                        $('#modal-unblock-confirm label.control-label.has-error.validationMessage').remove();
                        $('#modalOk').off('click');
                    }); 
                        
                    $('#unblockConfirm-modalOk').on('click',function(e){

                        if($scope.unblockedRemarks!=''){
                            $scope.doUnblockService(merchant);
                            $('#unblockConfirm-modalCancel').click();
                            $('.modal-backdrop.fade.in').remove();
                            $('#unblockConfirm-modalOk').off('click');
                        }
                    });
                    
                    $('#confirm-modal').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#modalOk').click();
                        }
                    });

              };

              $scope.doUnblockService = function (merchant) {

                ngProgress.start();

                $bus.fetch({
                    name: 'unblock',
                    api : 'unblock',
                    data: {merchantCode : merchant.merchantCode,unblockedRemarks  : $scope.unblockedRemarks}
                })
                    .done(function (data) {
                        var successMsgs = [];
                        if (data.response.success && data.response.success.length) {
                            successMsgs = data.response.success;
                            notify.message(successMsgs.join(','),'','succ');
                            $scope.getPagedDataAsync();
                        } else {
                            var errors = [];
                            _.forEach(data.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) notify.message($rootScope.pushJoinedMessages(errors));
                            else notify.message(messages.merchantListFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.merchantListFetchError);
                        notify.message(messages.merchantListFetchError);
                        ngProgress.complete();
                    });
          
            };



            $scope.doBlock = function (merchant) {
                

                $scope.selectedMerchantID = merchant.merchantCode;
                $scope.selectedCompanyName = merchant.companyName; 
                $scope.blockedRemarks="";
                  $('#modal-block-confirm').modal();
                    
                    $('#blockConfirm-modalCancel,#model-close').on('click',function(e){
                        $('#modal-block-confirm .form-group,textarea').removeClass('has-error');
                        $('#modal-block-confirm label.control-label.has-error.validationMessage').remove();
                        $('#modalOk').off('click');
                    }); 
                        
                    $('#blockConfirm-modalOk').on('click',function(e){
                        
                        if($scope.blockedRemarks!=''){
                            $scope.doBlockService(merchant);
                            $('#blockConfirm-modalCancel').click();
                            $('.modal-backdrop.fade.in').remove();
                            $('#blockConfirm-modalOk').off('click');    
                        }
                        
                    });
                    
                    $('#confirm-modal').keypress(function(e){
                        if(e.keyCode == 13 || e.keyCode == 32){
                            $('#modalOk').click();
                        }
                    });

              };

            $scope.doBlockService = function (merchant) {
          
                ngProgress.start();

                $bus.fetch({
                    name: 'block',
                    api : 'block',
                    //params: {merchantCode : merchant.merchantCode,blockedRemarks : $scope.blockedRemarks},
                    data: {merchantCode : merchant.merchantCode,blockedRemarks : $scope.blockedRemarks}
                })
                    .done(function (data) {

                        var successMsgs = [];
                        if (data.response.success && data.response.success.length) {
                            successMsgs = data.response.success;
                            notify.message(successMsgs.join(','),'','succ');
                            $scope.getPagedDataAsync();
                        } else {
                            var errors = [];
                            _.forEach(data.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) notify.message($rootScope.pushJoinedMessages(errors));
                            else notify.message(messages.merchantListFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.merchantListFetchError);
                        notify.message(messages.merchantListFetchError);
                        ngProgress.complete();
                    });
          
            };

            $scope.getStatus = function(merchant) {
                if (merchant.isBlocked)  return 'Blocked';
                else if (merchant.isEmailVerified && merchant.isActive)  return 'Active';
                else if (!merchant.isEmailVerified && !merchant.isActive) return 'Verification Pending';
                else if (merchant.isEmailVerified && !merchant.isActive) return 'Activation Pending';
                else if (merchant.inactiveDate && merchant.isEmailVerified && !merchant.isActive)  return 'Inactive';
                else    return $constants.notAvailableText;

            };
            $scope.getDates = function(merchant) {
                var dateString;
                dateString = (merchant.activeDate ?   'Active Date : '   + merchant.activeDate   +' ' : '') +
                             (merchant.createdDate ?  'Created Date : '  + merchant.createdDate  +' ' : '') +
                             (merchant.modifiedDate ? 'Modified Date : ' + merchant.modifiedDate +' ' : '');

                return (dateString.length > 0) ? dateString : $scope.constants.notAvailableText;
            };

            $scope.getQueryParam = function () {
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);
                $scope.pagingOptions.pageSize = $scope.showingSize = $localStorage.pagingOptions.merchant.pageSize;

                var params = {
		    
                    status: $routeParams.status ? 1 : null,
                    blocked: $routeParams.blocked ? 1 : null,
                    verificationPending: $routeParams.verificationPending ? 1 : null,
                    activationPending: $routeParams.activationPending ? 1 : null,
                    scol: $routeParams.scol || null,
                    skey: $routeParams.skey || null,
		    

                    p: $routeParams.p || null,
                    rcd:$scope.pagingOptions.pageSize || null,
                    sortcol: $localStorage.pagingOptions.merchant.sortingOption || null,
                    sortmethod: $localStorage.pagingOptions.merchant.sortDir || null
                };
                return _.omit(params, function (value, key) {
                    return !value;
                });
            }

            //Get Merchants
            $scope.getPagedDataAsync = function () {
                
                $scope.loading = {
                    nodata : false,
                    load : true
                }
                
                ngProgress.start();
                $bus.fetch({
                    name: 'merchants',
                    api : 'merchants',
                    params: $scope.getQueryParam(), // 0 - Pending; 1- existing
                    data: null
                })
                    .done(function (success) {
                        
                        $scope.loading = {
                            nodata : true,
                            load : false
                        }
                            
                        if (success.response && success.response.success.length) {
                            var merchants = [];
                            var data = success.response.data;
                            if (data && data.merchants) {
                                if (!_.isArray(data.merchants)) {
                                    _.forEach(data.merchants, function (merchant) {
                                        merchants.push(merchant)
                                    });
                                } else {
                                    merchants = data.merchants;
                                }
                                $scope.fromRecord = Number(data.fromRecord);
                                $scope.toRecord = Number(data.toRecord);
                                $scope.totalRecord = Number(data.totalRecords);
                                $scope.setPagingData(merchants, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
                                $scope.setPageSizeClickLength();
                            }
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                //toaster.pop("error", errors.join(', '), '', 0);
                                notify.message($rootScope.pushJoinedMessages(errors));
                            } else {
                                //toaster.pop("error", messages.merchantListFetchError, "", 0);
                                notify.message(messages.merchantListFetchError);
                            }
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.merchantListFetchError);
                        notify.message(messages.merchantListFetchError);
                        ngProgress.complete();
                    });
            };

            $scope.$watch('pagingOptions', function (newVal, oldVal) {

                if (newVal !== oldVal) {
                    $scope.showingSize = newVal.pageSize;
                    $localStorage.pagingOptions.merchant.pageSize = newVal.pageSize;
                    $scope.applyFilter();
                    //$scope.getPagedDataAsync();
                }
            }, true);

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
                        //toaster.pop("error", messages.productCountFetchError); commented
                        notify.message(messages.paymentFetchError);
                        $scope.payments = {};
                    });
            };

            $scope.getBillingCycle = function() {

                var today = new Date();
                var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                var todayDate = today.getDate();
                var month = month_names_short[today.getMonth()];

                var billingCycle = '';

                if (todayDate < 26) {
                    if (today.getMonth() - 1 >= 0){
                        billingCycle = '26'+ ' ' + month_names_short[today.getMonth() - 1] + ' ' + today.getFullYear() + ' - ' +
                                       '25'+ ' ' + month_names_short[today.getMonth() ] + ' ' + today.getFullYear();
                    }
                    else {
                        var lastYr = today.getFullYear()-1;
                        billingCycle = '26'+ ' ' + month_names_short[11] + ' ' + lastYr + ' - ' +
                                       '25'+ ' ' + month_names_short[today.getMonth()]  + ' ' + today.getFullYear();
                    }
                }
                else {
                    if (today.getMonth() + 1 <= 11){
                        billingCycle = '26'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear() + ' - ' +
                                       '25'+ ' ' + month_names_short[today.getMonth()+1] + ' ' + today.getFullYear();
                    }
                    else {
                        var nextYr = today.getFullYear()+1;
                        billingCycle = '26'+ ' ' + month_names_short[today.getMonth()] + ' ' + today.getFullYear() + ' - ' +
                                       '25'+ ' ' + month_names_short[0]  + ' ' + nextYr;
                    }
                }
                return billingCycle;
            };

            $scope.submitNewPayment = function() {
                $scope.isPaymentEditable  = false;
                $scope.addNewPaymentError = '';
            };

            $scope.submitNewAdjustment = function(){
                $scope.isAdjustmentEditable = false;
                $scope.addNewAdjError       = '';
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


            $scope.downloadMerchantList = function () {
                var url= $constants.baseUrl + restapi['exports'].url;
                $scope.getFileUrl(url);
            };

            $scope.applySme = function(merchantId){
                
                if(merchantId) {

                    ngProgress.start();

                    $bus.fetch({
                        name: 'applysme',
                        api:  'applysme',
                        params: null,
                        data: {
                            merchantCode: merchantId,
                            applySme: 1
                        },
                    })
                    .done(function (success) {
                        if (success && success.response && success.response && !_.isEmpty(success.response.data)) {

                            notify.message(messages.merchantApplySmeSuccess,'','succ',1);

                            $scope.getMerchantDetails(merchantId);
                        }
                        else {
                            notify.message(messages.merchantApplySmeError);
                        }
                        ngProgress.complete();
                    })
                    .fail(function (error) {
                        var errors = [];
                        _.forEach(error.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {

                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {

                            notify.message(messages.merchantApplySmeError);
                        }
                        ngProgress.complete();
                    });
                }else{

                        notify.message(messages.merchantApplySmeError);
                        ngProgress.complete();
                }

            };


            $scope.springApprove = function(merchant){

                if(!_.isEmpty(merchant)) {

                    $bus.fetch({
                        name: 'approveSpring',
                        api:  'approveSpring',
                        params: null,
                        data: {

                            merchantCode: (merchant.merchantCode)?merchant.merchantCode:'',
                            applySme: 1,
                            subsidyGranted: 1,
                            subsidyStartDate: ($scope.subsidyStartDate)?$scope.subsidyStartDate:'',
                            subsidyEndDate: ($scope.subsidyEndDate)?$scope.subsidyEndDate:'',
                            subsidyRemarks: ($scope.subsidyRemarks)?$scope.subsidyRemarks:'',

                        },
                    })
                    .done(function (success) {
                        if (success && success.response && success.response && !_.isEmpty(success.response.data)) {

                            notify.message(messages.merchantSpringApproveSuccess,'','succ',1);

                            $scope.getMerchantDetails(merchant.merchantCode);

                        }
                        else {
                            notify.message(messages.merchantSpringApproveError);
                        }
                        ngProgress.complete();
                    })
                    .fail(function (error) {
                        var errors = [];
                        _.forEach(error.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {

                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {

                            notify.message(messages.merchantSpringApproveError);
                        }
                        
                    });
                }else{

                        notify.message(messages.merchantSpringApproveError);
                }

            };



            $scope.springUnApprove = function(merchant){

                if(!_.isEmpty(merchant)) {

                    $bus.fetch({
                        name: 'approveSpring',
                        api:  'approveSpring',
                        params: null,
                        data: {

                            merchantCode: (merchant.merchantCode)?merchant.merchantCode:'',
                            applySme: 1,
                            subsidyGranted: 0,
                            subsidyRemarks: ($scope.subsidyRejectRemarks)?$scope.subsidyRejectRemarks:'',

                        },
                    })
                    .done(function (success) {
                        if (success && success.response && success.response && !_.isEmpty(success.response.data)) {

                            notify.message(messages.merchantSpringApproveSuccess,'','succ',1);

                            $scope.getMerchantDetails(merchant.merchantCode);
                        }
                        else {
                            notify.message(messages.merchantSpringApproveError);
                        }
                        ngProgress.complete();
                    })
                    .fail(function (error) {
                        var errors = [];
                        _.forEach(error.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {

                            notify.message($rootScope.pushJoinedMessages(errors));
                        } else {

                            notify.message(messages.merchantSpringApproveError);
                        }
                    });
                }else{

                        notify.message(messages.merchantSpringApproveError);
                }

            };


            $scope.validateDateFormat = function(param){

                if(param){

                    var changeFormat = param.split(' ');

                    changeFormat = changeFormat[0].split('/');

                    changeFormat = changeFormat[2]+'-'+changeFormat[1]+'-'+changeFormat[0];

                    return changeFormat;

                }else{
                    return '';
                }


            }

            $scope.formatDate = function (param) {

                if(param) {

                    var changeFormat = param.split(' ');

                    changeFormat = changeFormat[0].split('-');

                    changeFormat = changeFormat[2]+'-'+changeFormat[1]+'-'+changeFormat[0];

                    var nowTemp = new Date(changeFormat);

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

            }else {
                return '';
            }

        }   
        
        $scope.convertDateFormat = function (date, format) {
                var dates = date.split("/");
                if (dates.length != 3) return "Invalid Date";

                var dd, mm, yyyy;
                dd   = dates[0];
                mm   = dates[1];
                yyyy = dates[2];

                if      (format == "mm/dd/yyyy")    return mm + '/' + dd + '/' + yyyy;
                else if (format == "dd/mm/yyyy")    return dd + '/' + mm + '/' + yyyy;
        };

        $scope.checkDate = function(startDate,endDate){

            $scope.dateValidMessage = angular.copy($constants.validationMessages.required);

            $('#approve-end-date').next().removeClass('rgt15px').addClass('lft15px');
            
            if(startDate && endDate){

                if(new Date($scope.validateDateFormat(startDate)) > new Date($scope.validateDateFormat(endDate)) ){

                    $scope.dateValidMessage = messages.merchantSpringDateError;

                    $('#approve-end-date').next().removeClass('lft15px').addClass('rgt15px');

                    return false;

                }else{

                    return true;

                }

            }else{
                return false;
            }
            

        }

        $scope.validateDate = function (inputDate) {

                $scope.displayableDate_isInvalid    = false;
                $scope.displayableDate_errorMessage = "";

                if (!inputDate){
                    $scope.displayableDate_errorMessage = "";
                    return $scope.displayableDate_isInvalid     = false;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!inputDate.match(validDateFormat)) {
                    $scope.displayableDate_errorMessage = "Invalid Date Format";
                    return $scope.displayableDate_isInvalid     = true;
                }

                if (!inputDate.match(validDate) || new Date($scope.convertDateFormat(inputDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.displayableDate_errorMessage = "Invalid Date";
                    return $scope.displayableDate_isInvalid     = true;
                }
                return $scope.displayableDate_errorMessage
        };

        $scope.getSignupCategory = function(param) {

                if (!_.isEmpty(param)) {
                        var catSplit = _.map(param.split(','),function(n) {
                                return (_.findWhere($constants.categoryOptions,{value:n}))?(_.findWhere($constants.categoryOptions,{value:n}).name):'';
                        })
                        if(catSplit.length) {
                           if (catSplit.length > 2) {
                              var returnString = _.take(catSplit,2).join(',')+' +'+(catSplit.length-2)+' Others.';
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

            $scope.getMerchantDetails = function(merchantCode){

                var user;
                ngProgress.start();
                $bus.fetch({
                    name: 'merchants',
                    api:  'merchants',
                    params: {
                        id: merchantCode
                    },
                    data: null
                })
                    .done(function (success) {

                        if (success && success.response && success.response && success.response.data) {
                            _.each(success.response.data.merchant,function(val,key){
                                
                                $scope.merchant = val;

                                if($scope.merchant && $scope.merchant.subsidyStartDate)
                                    $scope.merchant.subsidyStartDate = $scope.formatDate($scope.merchant.subsidyStartDate);

                                if($scope.merchant && $scope.merchant.subsidyEndDate)
                                    $scope.merchant.subsidyEndDate = $scope.formatDate($scope.merchant.subsidyEndDate);

                                if($scope.merchant && $scope.merchant.subsidyRemarks)
                                    $scope.subsidyRemarks = $scope.merchant.subsidyRemarks;

                               $('#approve-start-date').datepicker({
                                    todayHighlight: true,
                                    format: "dd/mm/yyyy",
                                    //startDate:($scope.merchant.subsidyStartDate)?$scope.merchant.subsidyStartDate:new Date()
                                }).on('changeDate', function (ev) {
                                    
                                   $('#approve-end-date').datepicker("remove");

                                   $('#approve-end-date').datepicker({
                                        format: "dd/mm/yyyy",
                                        todayHighlight: true,
                                        startDate:new Date(ev.date),
                                        //orientation: "top right"
                                    });

                                });

                                $('#approve-end-date').datepicker({
                                    todayHighlight: true,
                                    format: "dd/mm/yyyy",
                                    startDate:($scope.merchant.subsidyStartDate)?$scope.merchant.subsidyStartDate:new Date(),
                                    //orientation: "top right"
                                });

                                $('#approve-start-date').datepicker('update', $scope.merchant.subsidyStartDate||new Date());
                                $('#approve-end-date').datepicker('update', $scope.merchant.subsidyEndDate||new Date());

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

                            notify.message(errors.join(', '));
                        } else {

                            notify.Message(messages.fulfillmentFetchError);
                        }
                        ngProgress.complete();
                    });
            }

            
            $scope.approveReject = function(action){
                if(action=="approve"){
                        $('#modal-spring-approve').modal();
                        
                        $('#springApprove-modalCancel').on('click',function(e){
                             $('#modal-spring-approve .form-group,textarea,input[type="text"]').removeClass('has-error');
                             $('#modal-spring-approve label.control-label.has-error.validationMessage').remove();
                        }); 
                            
                        $('#springApprove-modalOk').on('click',function(e){

                            if($scope.subsidyRemarks && $scope.subsidyStartDate && $scope.subsidyEndDate && $scope.checkDate($scope.subsidyStartDate,$scope.subsidyEndDate)) {
                                $('#springApprove-modalCancel').click();
                                $('.modal-backdrop.fade.in').remove();
                            }

                        });
                        
                        $('#modal-spring-approve').keypress(function(e){
                            if(e.keyCode == 13){
                                $('#springApprove-modalOk').click();
                            }
                        });
                }
                else{
                      $('#modal-spring-reject').modal();
                        
                        $('#springUnApprove-modalCancel').on('click',function(e){
                            $('#modal-spring-reject .form-group,textarea,input[type="text"]').removeClass('has-error');
                            $('#modal-spring-reject label.control-label.has-error.validationMessage').remove();
                        }); 
                        
                        $('#springUnApprove-modalOk').on('click',function(e){
                            
                            if($scope.subsidyRejectRemarks) {
                                $('#springUnApprove-modalCancel').click();
                                $('.modal-backdrop.fade.in').remove();
                            }
                            
                        });
                        
                        $('#modal-spring-reject').keypress(function(e){
                            if(e.keyCode == 13){
                                $('#springUnApprove-modalOk').click();
                            }
                        });

                }
            }
	
            $scope.getApprovalCounts = function (argument) {
                
                $bus.fetch({
                    name: 'approvalcount',
                    api:  'approvalcount',
                    params: {
                        status: 'PROCESS_MGR'
                    },
                    data: null
                })
                    .done(function (success) {
                        
                        if (success && success.response && !_.isEmpty(success.response.data)) {
                            
                            $scope.approvalCount = success.response.data;
                        }
                        else {
                            $scope.approvalCount = '';
                        }
                        
                    })
                    .fail(function (error) {

                        $scope.approvalCount = '';
                    });

            };
            
            $scope.displayCount = function(param){
                
                if(param && !_.isEmpty($scope.approvalCount) && _.has($scope.approvalCount,param)){
                    return $scope.approvalCount[param];
                }else {
                    return '0';
                }

            };

            $scope.showBlockInfo = function (merchant) {

                if(merchant.isBlocked && merchant.blockedRemarks)
                    return true;
                if(!merchant.isBlocked && merchant.unblockedRemarks)
                    return true;

                return false;
            };

            $scope.getBlockInfoNote = function(merchant){

                if(merchant.isBlocked && merchant.blockedRemarks)
                    return merchant.blockedRemarks;
                if(!merchant.isBlocked && merchant.unblockedRemarks)
                    return merchant.unblockedRemarks;

            };  

            $scope.merchantAutoApprovalOrder = function(autoApprove,merchantCode){


                    if(merchantCode) {
                        
                        $bus.fetch({
                            name: 'autoapproval',
                            api:  'autoapproval',
                            params : null,
                            data: {
                                merchantCode: (merchantCode)?merchantCode:'',
                                autoManagerOrdApprove : (autoApprove)?1:0
                            }
                        }).done(function (success) {
                            
                            if (success.response.success.length) {
                                notify.message(messages.merchantAutoApproveSuccess,'','succ');

                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error);
                                });
                                if (errors.length) {
                                    notify.message($rootScope.pushJoinedMessages(errors));
                                } else {
                                    notify.message(messages.merchantAutoApproveError);
                                }
                            }
                            
                        }).fail(function (error) {

                            notify.message(messages.merchantAutoApproveError);
                            
                        });

                    }else{

                        notify.message(messages.merchantAutoApproveError);
                    }

            };
            
            $scope.getCountryList = function () {
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


            $scope.init = function () {

                 $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                }, 2000);
                
                
                $scope.countryList = [];
                $scope.getCountryList();

                $scope.attachEventsForTypeAhead();
                if($routeParams.merchantCode){
                    $scope.getMerchantDetails($routeParams.merchantCode);
                }
  

                if ($location.path() == "/merchant/payments") {
                    $scope.getpayments();
                    $scope.initDate();
                }

                $scope.merchantStatus = 0;
                $scope.readQueryParam($routeParams);

                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });

                $scope.pagingOptions = {
                    pageSizes: [10, 25, 50, 100],
                    pageSize: $localStorage.pagingOptions.merchant.pageSize,
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
                $scope.sortingOptions.direction = $localStorage.pagingOptions.merchant.sortDir;

                $scope.setPagingData = function (data, page, pageSize, totalSize) {
                    $scope.myData = data;
                    $scope.totalServerItems = totalSize;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };

                $scope.adjustmentType = ["Refund", "Charge"];
                
		        $scope.statusFilter = [];
                $scope.searchColumn = [];
                $scope.searchKey = '';
		        
                $scope.clearAdjustmentModel();
                $scope.clearPaymentModel();
                $scope.getPagedDataAsync();
                $scope.getApprovalCounts();

                $scope.initPopOver = function() {
                    $('[data-toggle="popover"]').popover();
                };

                $('body').on('click', function (e) {
                    $('[data-toggle="popover"]').each(function () {
                        if ((($(e.target).attr('class'))=='glyphicon glyphicon-cross') || (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0)) {
                            $(this).popover('hide');
                        }
                    });
                });

            };
            
        }
    ]);
});