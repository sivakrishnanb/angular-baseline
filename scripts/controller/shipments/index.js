define(['app', 'utility/messages'], function (app, messages) {
    app.controller('Shipments', ['$scope', '$bus', 'ngProgress', '$rootScope', '$routeParams', '$constants', '$location', '$timeout','notify', '$localStorage',
        function ($scope, $bus, ngProgress, $rootScope, $routeParams, $constants, $location, $timeout,notify, $localStorage) {

            $scope.shipmentFilterOptions = $constants.shipmentFilterOptions;

            $scope.dateOptions = $constants.dateOptions;

            $scope.shipmentStatus = $constants.shipmentStatus;

            $scope.constants = $constants;

            $scope.getShipmentStatus = function(){
                if ($routeParams.status=='pending' || !($routeParams.status)) {
                    return true;
                }else if ($routeParams.status=='intransit') {
                    return true;
                }else if ($routeParams.status=='received') {
                    return false;
                }else if ($routeParams.status=='cancelled') {
                    return false;
                } 

            }

            $scope.getNoShipmentsHeader = function()
            {
								if ($routeParams && ($routeParams.date || $routeParams.scol || $routeParams.skey)) {
                    return messages.noShipmentsHeaderTextFilter;
                }else if ($routeParams.status=='pending' || !($routeParams.status)) {
                    return messages.noShipmentsHeaderTextPending;
                }else if ($routeParams.status=='intransit') {
                    return messages.noShipmentsHeaderTextInTransit;
                }else if ($routeParams.status=='received') {
                    return messages.noShipmentsHeaderTextReceived;
                }else if ($routeParams.status=='cancelled') {
                    return messages.noShipmentsHeaderTextCancelled;
                } 
            }


            $scope.getNoShipmentsSubMessage = function()
            {
                if ($routeParams && ($routeParams.date || $routeParams.scol || $routeParams.skey)) {
                    return messages.noShipmentsHeaderSubTextFilter;
                }else if ($routeParams.status=='pending' || !($routeParams.status)) {
                    return messages.noShipmentsHeaderSubTextPending;
                }else if ($routeParams.status=='intransit') {
                    return messages.noShipmentsHeaderSubTextInTransit;
                }else if ($routeParams.status=='received') {
                    return messages.noShipmentsHeaderSubTextReceived;
                }else if ($routeParams.status=='cancelled') {
                    return messages.noShipmentsHeaderSubTextCancelled;
                } 

                
            }


              
            $scope.isChanged= function(shipment)
            {
                if(shipment.Selected==true){
                    var isAlreadyPresent=false;
                    for (i = 0; i < $rootScope.selectedItems.length; i++) {
                        if ($scope.selectedItems[i].inboundCode == shipment.inboundCode) {
                          isAlreadyPresent =true;
                        }
                    }
                    if(isAlreadyPresent==false)
                        $rootScope.selectedItems.push(shipment);
                }
                else
                {
                    for (i = 0; i < $rootScope.selectedItems.length; i++) {
                        if ($scope.selectedItems[i].inboundCode == shipment.inboundCode) {
                            $rootScope.selectedItems.splice(i, 1);
                        }
                    }
                }
            }

            $scope.isOptionVisible = function (option) {
                switch (option) {
                case 'action':
                    return ($routeParams.status == 'received');
                    break;
                case 'cancel':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'intransit');
                    break;
                case 'restore':
                    return ($routeParams.status == 'cancelled');
                    break;
                case 'arrivalDetails':
                    return ($routeParams.status == 'received' || $routeParams.status == 'intransit');
                    break;
                case 'shipFrom':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'cancelled');
                    break;
                case 'receivedDetails':
                    return ($routeParams.status == 'received');
                    break;
                case 'inventoryReceived':
                    return ($routeParams.status == 'received');
                    break;
                case 'date':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'intransit');
                    break;
                case 'dateCancelled':
                    return ($routeParams.status == 'cancelled');
                    break;
                case 'labelBy':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'cancelled' || $routeParams.status == 'intransit' || $routeParams.status == 'received');
                    break;
                case 'pendingEdit':
                    return (!$routeParams.status || $routeParams.status == 'pending');
                    break;
                case 'othersView':
                    return ($routeParams.status && $routeParams.status != 'pending');
                    break;
                default:
                    return true;
                }
            }

								$scope.getHeaderText = function() {
                
										if ($routeParams.status=='pending' || !($routeParams.status)) {
												return messages.headerShipPending;
						
										}else if ($routeParams.status=='intransit') {
												return messages.headerShipInTransit;
						
										}else if ($routeParams.status=='received') {
												return messages.headerShipReceived;
						
										}else if ($routeParams.status=='cancelled') {
												return messages.headerShipCancelled;
						
										}
								}
								
								$scope.getTitleText = function() {
									if ($routeParams.status=='pending' || !($routeParams.status)) {
											return messages.headerTitleShipPending;
									
									}else if ($routeParams.status=='intransit') {
											return messages.headerTitleShipInTransit;
									
									}else if ($routeParams.status=='received') {
											return messages.headerTitleShipReceived;
									
									}else if ($routeParams.status=='cancelled') {
											return messages.headerTitleShipCancelled;
									
									}
								};
			

            $scope.sortLogo = function () {
                return ($localStorage.pagingOptions.shipments.sortDir == 'asc') ? true : false;
            }
			
			$scope.getFirstMatchSuggest = function(param,match,type){

				if(!_.isEmpty(param) && match && type){
                    
                    var index=patt='';
                    var filteredData = [];

                    var skuIndexArray = prIdIndexArray = merSkuIndexArray = prodDesIndexArray = [];

                    if(param.inbPrdSkus){
                        
                        var skuIndexArray = param.inbPrdSkus.substr(0,param.inbPrdSkus.length-1).split(',,');
                        
                        if(!_.isEmpty(skuIndexArray)){
                            if(index=='' || index==-1) {
                                var patt = new RegExp(match,'gi');
                                    var filteredData = _.filter(skuIndexArray,function(data){
                                        if(patt.test(data)){
                                           index = _.indexOf(skuIndexArray,data);
                                        }
                                });
                            }
                        }
                    }
                    if(param.inbProductIds){
                        
                        var prIdIndexArray = param.inbProductIds.substr(0,param.inbProductIds.length-1).split(',,');
                        
                        if(!_.isEmpty(prIdIndexArray)) {
                            
                            if(index=='' || index==-1) {
                                var patt = new RegExp(match,'gi');
                                var filteredData = _.filter(prIdIndexArray,function(data){
                                    if(patt.test(data)){
                                       index = _.indexOf(prIdIndexArray,data);
                                    }
                                });

                            }
                        }
                    }
                    if(param.inbMerchantSkus){
                                      
                        var merSkuIndexArray = param.inbMerchantSkus.substr(0,param.inbMerchantSkus.length-1).split(',,');

                        if(!_.isEmpty(merSkuIndexArray)){
                            
                             if(index=='' || index==-1) {
                                var patt = new RegExp(match,'gi');
                                var filteredData = _.filter(merSkuIndexArray,function(data){
                                    if(patt.test(data)){
                                       index = _.indexOf(merSkuIndexArray,data);
                                    }
                                });
                            }
                            
                        }
                    }
                    if(param.inbPrdDesc){
                        
                        var prodDesIndexArray = param.inbPrdDesc.substr(0,param.inbPrdDesc.length-1).split(', ,');

                        if(!_.isEmpty(prodDesIndexArray)){
       
                            if(index=='' || index==-1) {
                                var patt = new RegExp(match,'gi');
                                var filteredData = _.filter(prodDesIndexArray,function(data){
                                    if(patt.test(data)){
                                       index = _.indexOf(prodDesIndexArray,data);
                                    }
                                });
                            }
                            
                        }
                    }

                    if(type=='merSku'){

                        return (index!=-1 && index!='')?merSkuIndexArray[index]:merSkuIndexArray[0];
                    }
                    else if(type=='ezySku'){

                        return (index!=-1 && index!='')?skuIndexArray[index]:skuIndexArray[0];
                    }
                    else if(type=='prodName'){

                        return (index!=-1 && index!='')?prodDesIndexArray[index]:prodDesIndexArray[0];
                    }
                    else if(type=='prodId'){

                        return (index!=-1 && index!='')?prIdIndexArray[index]:prIdIndexArray[0];
                    }

                
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

            $scope.suggestNavigation = function(suggest) {
                if(suggest) {
                    if(suggest.status == 1) {
                        var url = 'shipments/edit/' + suggest.inboundCode;
                    } else {
                        var url = 'shipments/view/' + suggest.inboundCode;
                    }
                    $location.url(url);
                }
            };

            $scope.readQueryParam = function (param) {
                var deferred = $.Deferred();
                $timeout(function () {
                    $scope.sortingOptions.field = _.findWhere($constants.shipmentSortingOptions, {"value": $localStorage.pagingOptions.shipments.sortingOption}) ? $localStorage.pagingOptions.shipments.sortingOption : $constants.shipmentSortingOptions[0].value;
                    $scope.sortingOptions.name = _.findWhere($constants.shipmentSortingOptions, {"value": $scope.sortingOptions.field}).name;
                    param.fromdate ? $scope.fromdate = param.fromdate : '';
                    param.todate ? $scope.todate = param.todate : '';
                    param.skey ? $scope.searchKey = param.skey : '';
                    _.map($scope.dateOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.shipmentFilterOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    if (param.scol) {
                        var scol = _.findWhere($scope.shipmentFilterOptions, {
                            "value": param.scol
                        });
                        if (scol) scol.ticked = true;
                    } else {
                        var scol = _.findWhere($scope.shipmentFilterOptions, {
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
                var resetQuery = (resetQueryForm.p ? 'p=' + resetQueryForm.p + '&' : '')+(resetQueryForm.rcd ? 's=' + resetQueryForm.rcd + '&' : '')+(resetQueryForm.sortcol ? 'f=' + resetQueryForm.sortcol + '&' : '')+(resetQueryForm.sortmethod ? 'd=' + resetQueryForm.sortmethod + '&' : '');
                
                $location.url((resetQuery)?$location.path() + '?' +resetQuery:$location.path());
                $scope.readQueryParam($routeParams);
                $scope.searchKey = ""; // added
                //$scope.form.$setPristine(); // added
                
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
				
                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') + (((applyClicked || (filterQuery.scol && filterQuery.skey)) && $scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&' : '') + (((applyClicked || filterQuery.skey) && $scope.searchKey) ? 'skey=' + $scope.searchKey + '&' : '') + (((applyClicked || filterQuery.date) && $scope.date.length) ? 'date=' + _.pluck($scope.date, 'value') + '&' : '') + (((applyClicked || filterQuery.fromdate) && $scope.date.length && $scope.date[0].value == 'custom' && $scope.fromdate) ? 'fromdate=' + $scope.fromdate + '&' : '') + (((applyClicked || filterQuery.todate) && $scope.date.length && $scope.date[0].value == 'custom' && $scope.todate) ? 'todate=' + $scope.todate + '&' : '') + ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') + ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction : '');
                if (query && ($location.url() != $location.path() + '?' + query)) {
                    $location.url($location.path() + '?' + query);
                    $scope.readQueryParam($routeParams);
                }
            };

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

            $scope.$watch('myData', function (newValue, oldValue) {
                if (!oldValue && ! newValue || oldValue == newValue) return;

                var items = newValue

                var indItemSelected = 0;
          

                angular.forEach($rootScope.selectedItems, function (selectedItem) {
                  for (i=0; i < items.length; i++) {
                    if (selectedItem.inboundCode==items[i].inboundCode){
                        items[i].Selected=true;
                        break;
                    }
                  }
                    indItemSelected += items.Selected ? 1 : 0;
                });
                
               
                $scope.showSelectedLength = indItemSelected;
                ($scope.showSelectedLength) ? $scope.showSelected = 1 : $scope.showSelected = 0;
            }, true);

            $scope.toggleCheckBox = function () {


                $scope.toggleCheckBoxVal = ($scope.toggleCheckBoxVal) ? true : false;
                angular.forEach($scope.myData, function (shipment) {
                    shipment.Selected = $scope.toggleCheckBoxVal;
                    $scope.isChanged(shipment);
                });

            }

            $scope.getLabelDisplayValue = function (code) {
                return _.findWhere($constants.labelList, {
                    "value": code
                }) ? _.findWhere($constants.labelList, {
                    "value": code
                }).name : $constants.notAvailable;
            }

            $scope.getQueryParam = function () {
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);
                $scope.pagingOptions.pageSize = $localStorage.pagingOptions.shipments.pageSize;
                var params = {
                    status: $routeParams.status ? _.findWhere($scope.shipmentStatus, {
                        "name": $routeParams.status
                    }).value : _.findWhere($scope.shipmentStatus, {
                        "name": "pending"
                    }).value,
                    p: $routeParams.p || null,
                    rcd: $scope.pagingOptions.pageSize || null,
                    scol: $routeParams.scol || null,
                    skey: $routeParams.skey || null,
                    date: $routeParams.date || null,
                    fromdate: $routeParams.fromdate || null,
                    todate: $routeParams.todate || null,
                    sortcol: $localStorage.pagingOptions.shipments.sortingOption || null,
                    sortmethod: $localStorage.pagingOptions.shipments.sortDir || null
                };
                return _.omit(params, function (value, key) {
                    return !value || (key == 'date' && value == 'all') || (key == 'date' && value == 'none');
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
                    var checkin = $('#shipment-search-fromdate').datepicker({
                        todayHighlight: true,
                        endDate:new Date()
                    }).on('changeDate', function (ev) {
                        $scope.fromdate = $scope.formatDate(ev.date);
                        $scope.todate = $scope.formatDate(ev.date);
                        checkout.setValue(ev.date);
                        checkout.setStartDate(ev.date);
                        checkin.hide();
                        $('#shipment-search-todate')[0].focus();
                    }).data('datepicker');

                    var checkout = $('#shipment-search-todate').datepicker({
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
								
								if (_.isEmpty($routeParams.status)) {
                    return '1';
                }else if($routeParams && $routeParams.status!=''){
                    return (_.findWhere($constants.shipmentStatus,{name:$routeParams.status})?_.findWhere($constants.shipmentStatus,{name:$routeParams.status}).value:'')
                }
								
            }
						
            $scope.findSuggestion = function (txt, col) {
				$scope.emptySuggestions = false; 
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: 'suggestshipments',
                                api: 'suggestshipments',
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
                                            $('#shipment-search-suggestion').show();
                                            $scope.suggestions = success.response.data.docs;
											$timeout(function(){
                                                $(".nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                                $(".nano").nanoScroller();
                                            },100);
                                        }else{
                                            $('#shipment-search-suggestion').hide();
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



            $scope.sort = function (field, name) {
                if ($scope.sortingOptions.field != field || $scope.sortingOptions.name != name) {
                    $scope.sortingOptions.field = field;
                    $localStorage.pagingOptions.shipments.sortingOption = field;
                    $scope.applyFilter();
                }
            }

            $scope.sortDirection = function () {
                if ($scope.sortingOptions.direction == 'desc') {
                    $scope.sortingOptions.direction = 'asc';
                    $localStorage.pagingOptions.shipments.sortDir = 'asc';
                } else {
                    $scope.sortingOptions.direction = 'desc';
                    $localStorage.pagingOptions.shipments.sortDir = 'desc';
                }
                $scope.applyFilter();
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

            $scope.pushShipments = function() {
                var inboundCode = [];
                angular.forEach($scope.myData, function(item) {
                    inboundCode.push(item.inboundCode);
                });
                $rootScope.shipInbounds = inboundCode;
            };

            $scope.getshipmentScrollClassTop = function(){
                if(Number($(document).width() >= 992))
                    return '';
                else
                    return 'shipmentsPageScroll nano';
            }
            $scope.getshipmentScrollClassBot = function(){
                if(Number($(document).width() >= 992))
                    return '';
                else
                    return 'nano-content';
            }
            
            $scope.init = function () {
                $scope.date = [];
                //$scope.dateinit();
                $scope.attachEventsForTypeAhead();
                $rootScope.getShipmentsCount();
                $scope.readQueryParam($routeParams).done(function(){
                    $scope.showRangePicker();
                });
                $scope.totalServerItems = 0;

                $timeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                },2000);
				
                $scope.pagingOptions = {
                    pageSizes: [10, 25, 50, 100],
                    pageSize: $localStorage.pagingOptions.shipments.pageSize,
                    currentPage: 1
                };

                $scope.pageSize = {
                    pageSizeClickLength: [1]
                };

                $scope.sortingOptions = {
                    field: 'createdOn',
                    name: 'Date Created',
                    direction: 'desc'
                };
                $scope.sortingOptions.direction = $localStorage.pagingOptions.shipments.sortDir;

                $scope.setPagingData = function (data, page, pageSize, totalSize) {
					
					$rootScope.getCountryList().done(function(){	
						_(data).forEach(function (item) {
							$rootScope.getCountryNameByCode(item.addressCountry).done(function(name){
								item.addressCountryName = name;
							});
						});
					});
					
					$scope.myData = data;
                     
                    $scope.totalServerItems = totalSize;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };

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
			
                $scope.getPagedDataAsync = function () {

                    var deferred = $.Deferred();

                    ngProgress.start();
					
					$scope.loading = {
                        nodata : false,
                        load : true
                    }
					
                    $bus.fetch({
                        name: 'shipments',
                        api: 'shipments',
                        params: $scope.getQueryParam(),
                        data: null
                    })
                        .done(function (success) {
							
							$scope.loading = {
                                nodata : true,
                                load : false
                            }
							
                            if (success.response && success.response.success && success.response.success.length) {
                                var shipments = [];
                                var data = success.response.data;
								//notify.Message(messages.shipmentList+' '+messages.retrivedSuccess);
                                if (data && data.shipments) {
                                    if (!_.isArray(data.shipments)) {
                                        _.forEach(data.shipments, function (shipment) {
                                            shipments.push(shipment)
                                        });
                                    } else {
                                        shipments = data.shipments;
                                    }
                                    $scope.fromRecord = Number(data.fromRecord);
                                    $scope.toRecord = Number(data.toRecord);
                                    $scope.totalRecord = Number(data.totalRecords);
                                    $scope.setPagingData(shipments, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
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
                                    //notify.message(messages.shipmentListFetchError);
                                }
                            }
                            ngProgress.complete();
                            deferred.resolve();
                        }).fail(function (error) {
							
							$scope.loading = {
                                nodata : true,
                                load : false
                            }
							
                            //notify.message(messages.shipmentListFetchError);
                            ngProgress.complete();
                            deferred.reject();
                        });
                        return deferred.promise();
                };

                $scope.getPagedDataAsync().done(function(){
                    $timeout(function() {
                        $(".shipmentsPageScroll.nano").nanoScroller({ flash: true,preventPageScrolling: true,iOSNativeScrolling: true});
                    }, 500);
                });
                $scope.$watch('pagingOptions', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                      $scope.showingSize = newVal.pageSize;
                      $localStorage.pagingOptions.shipments.pageSize = newVal.pageSize;
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



                $scope.showEditShipment = function() {

                    if($routeParams && $routeParams.status=='intransit' && $rootScope.loggedInUser && _.intersection($rootScope.loggedInUser.userRole.split(','),['admin','csr']).length){
                        return true;
                    }
                };


            }

    }]);
});