
define(['angularAMD', 'socketio', 'utility/messages', 'utility/notificationtemplates'], function (angularAMD, io, messages, notificationTemplates) {
    angularAMD.controller('Base', ['$scope', '$bus', '$location', 'ngProgress', '$rootScope', '$window', '$constants', '$timeout', '$cookieStore', 'notify','highlight', '$localStorage',
        function ($scope, $bus, $location, ngProgress, $rootScope, $window, $constants, $timeout, $cookieStore, notify,highlight, $localStorage) {

            $scope.termsAndConditionFile = '/content/ezyCommerce General T&Cs.pdf';

            $scope.isTabActive = function (tabName) {
				if ($location.path().indexOf('/accounts') != -1) {
                    return "";
                }

		        else if ($location.path().indexOf('/' + tabName) == 0) {
                    return "active";

                /*else if ($location.path().indexOf('/' + tabName) != -1) {
                    return "active";*/
                }
            };
			
			$scope.isTabActiveRight = function (tabName) {
                if ($location.path().indexOf('/' + tabName) != -1) {
                    return "activeRightHeader";
                }
            };

            $scope.isNavActive = function (tabName, navName, initial) {
                if (($location.path() === '/' + tabName + (navName ? '/' + navName : '')) ||
					(initial == 'default' && $location.path() === '/' + tabName) ||
					($location.path() === '/'+tabName+'/'+navName+'/'+initial)) {
                    return "active";
                }
            };
			
            $rootScope.changeShowPriority = function(param){
                
                $localStorage.dashboardPopUp = false;

                if(param)
                    $localStorage.dashboardPopUp = true;
                else
                    $localStorage.dashboardPopUp = false;
            }


			$scope.notificationTemplates = notificationTemplates;
			
			$rootScope.constantsBase = $scope.constantsBase = $constants;

			$rootScope.notificationMessages = [];
			$rootScope.selectedItems=[];
			$rootScope.productSelected = [];
			
			$rootScope.highlightCreated = [];
			
            $rootScope.getProductsCount = function () {
                $bus.fetch({
                    name: 'productscount.refresh',
                    api: 'productscount',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.data.productCount)
                            $rootScope.productCount = success.response.data.productCount;
                        else
                            $rootScope.productCount = {};
                    }).fail(function (error) {
                        notify.message(messages.productCountFetchError);
                        $rootScope.productCount = {};
                    });
            };

            $rootScope.checkAcl = function (e) {
                e.stopImmediatePropagation();
            };

			$rootScope.getOneMsgClass = function(){
				
				if ($rootScope.notificationMessages.length && $rootScope.notificationMessages.length==1) {
					return 'overFlowHidden';
				}
			}

            $rootScope.checkOrderids = function(param) {

                if(param && /\s/g.test(param))
                    return false;
                else
                    return true;
            }
			
			$rootScope.getLoginClass = function() {
				
				if ($location.path()=='/' || $location.path()=='/login' || $location.path()=='/logout') {
					return 'loginNotify';
				}
			}
			
			$rootScope.getUserLoggedIn = function(){
				return (!$.isEmptyObject($cookieStore.get('loggedInUser')));
			}
			
            $rootScope.getShipmentsCount = function () {
                $bus.fetch({
                    name: 'shipmentscount.refresh',
                    api: 'shipmentscount',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.data && success.response.data.inboundCount)
                            $rootScope.shipmentCount = success.response.data.inboundCount;
                        else
                            $rootScope.shipmentCount = {};
                    }).fail(function (error) {
                        notify.message(messages.shipmentCountFetchError);
                        $rootScope.shipmentCount = {};
                    });
            }
			
			$rootScope.removeNotificationMsgs = function() {
				$('.notificationContainer').hide();
				$('#removeNotificationMsgs').hide();
				$rootScope.notificationMessages = [];
				
			}
			
			$rootScope.getNotifiClass = function(msg) {
				if(msg && msg.indexOf("~") > 0) { return 'successPop'; }
			}
			
			$rootScope.getDispNoti = function(msg) {
				if(msg && msg.length > 0) {
					msg = msg.replace("~", "");
					msg = msg.replace("@", "");
					return msg;
				}
			}
			
			$rootScope.getSuggestionClass = function (val) {
                if (val && (val!='false' && val!=false)) {
                    return true;
                }else{
                    return false;
                }
            }

            $rootScope.getOrdersCount = function () {
                $bus.fetch({
                    name: 'orderscount.refresh',
                    api: 'orderscount',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.data) {
                            var ordersTotalCount = 0;
                            angular.forEach(success.response.data, function (value, key) {
                                ordersTotalCount += value;
                            });
                            $rootScope.ordersCountTotal = (ordersTotalCount) ? ordersTotalCount : "0";
                            $rootScope.ordersCount = success.response.data;
                        } else {
                            $rootScope.ordersCount = {};
                        }
                    }).fail(function (error) {
                        notify.message(messages.orderCountFetchError);
                        $rootScope.ordersCount = {};
                    });
            };
			
            $rootScope.getLoginRedirectUrl = function(path) {

                if(path && ($constants.loginRedirectRoutes.indexOf('/'+path.split('/')[1])==-1)){
                    $rootScope.redirectUrlAfterLogin = path;
                }else{
                    $rootScope.redirectUrlAfterLogin = '';
                }

            };
			
			$rootScope.highlightAdded = function(val) {
				if(val && $rootScope.highlightCreated.length && val==$rootScope.highlightCreated[0]) {
					return true;
				}
			};

			
			$rootScope.$watch('notificationMessages',function(newVal, oldVal){
				
				var removeTimeout = true;
				var removeScroll = false;
				$rootScope.hideErrMsg = false;

				if($.unique(newVal)!=$.unique(oldVal) && newVal.length > 0){
					
					$('#removeNotificationMsgs,.notificationContainer').show();
					
					
					for (var x in newVal) {
						if(newVal[x].indexOf("~") == -1 ){
							removeTimeout = false;
							$rootScope.hideErrMsg = true;
						}
						if(newVal[x].indexOf("@") != -1 ){
							removeScroll = true;
						}
					}
					
					if (!removeScroll) {
						window.scrollTo(0,0);
					}
					
					setTimeout(function(){
						$('#removeNotificationMsgs').show();
						if (removeTimeout) {
							$("#removeNotificationMsgs").fadeOut('slow',function(){
							  $('.notificationContainer').hide();
							  $(this).hide();
							   $rootScope.notificationMessages=[];
						  });
						}
					},4000);
					
				}
			},true);
			
			$rootScope.pushJoinedMessages = function(errors,noScroll) {
				for (var x in errors) {
					notify.message(errors[x],true,'',noScroll);
				}
			}
			
			$rootScope.disableElement = function(val) {
				return ((val==false) ? true:false);
			}
			
			$rootScope.appendProductsArray = $rootScope.appendOrdersArray = [];
			
			
            $rootScope.getCountryList = function () {
                var deferred = $.Deferred();
                $bus.fetch({
                    name: 'country.static',
                    api: 'country',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        var countries = [];
                        if (success.response) {
                            if (!_.isArray(success.response)) {
                                _.forEach(success.response, function (country) {
								countries.push(country);
                                });
                            } else {
                                countries = success.response;
                            }
                            $rootScope.countryList = countries;
							//$rootScope.countryListOrders = _.compact(_.map(countries,function(val){return (val.isOrderEnabled==1)?val:''}));
                            $rootScope.countryListOrders = countries;
                        } else {
                            $rootScope.countryList = [];
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        notify.message(messages.countryFetchError);
                        $rootScope.countryList = {};
                        deferred.reject();
                    });
                return deferred.promise();
            };


            $rootScope.getAustraliaPostalCodes = function () {

                var deferred = $.Deferred();

                var postalCodes = [];

                $bus.fetch({
                    name: 'aupostalcodes.static',
                    api: 'aupostalcodes',
                    params: null,
                    data: null
                })
                    .done(function (success) {

                        if (success.response) {
                            postalCodes = success.response;
                        } else {
                            postalCodes = [];
                        }
                        deferred.resolve(postalCodes);

                    }).fail(function (error) {

                        notify.message(messages.countryPostalCodeError);

                        deferred.reject(postalCodes);

                    });

                return deferred.promise();
            };


            $rootScope.getCaseList = function () {
                var deferred = $.Deferred();
                $bus.fetch({
                    name: 'cases.static',
                    api: 'cases',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        var cases = [];
                        if (success.response) {
                            $rootScope.caseList = success.response;
                        } else {
                            $rootScope.caseList = {};
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        $rootScope.caseList = {};
                        deferred.reject();
                    });
                return deferred.promise();
            }
			
			
			$rootScope.getCountryNameByCode = function(code) {
				var deferred = $.Deferred();
				if ($rootScope.countryList) {
					deferred.resolve(_.findWhere($rootScope.countryList, {'countryCode': code})?_.findWhere($rootScope.countryList, {'countryCode': code}).countryName:'');
				}else{
					$rootScope.getCountryList().done(function(){
					deferred.resolve(_.findWhere($rootScope.countryList, {'countryCode': code})?_.findWhere($rootScope.countryList, {'countryCode': code}).countryName:'');
					});
				}
				return deferred.promise();
			}
			
			$rootScope.disableCurrency = true; //select only one and disable
			
            $rootScope.getCurrencyList = function () {
                var deferred = $.Deferred();
                $bus.fetch({
                    name: 'currency.static',
                    api: 'currency',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        var currencies = [];
                        if (success.response) {
                            if (!_.isArray(success.response)) {
                                _.forEach(success.response, function (currency) {
                                    currencies.push(currency)
                                });
                            } else {
                                currencies = data;
                            }
                            $rootScope.currencyList = currencies;
							$rootScope.retailPriceCurrencyCtrl = $rootScope.declaredValueCurrencyCtrl = $rootScope.costPriceCurrencyCtrl = !_.isEmpty(_.findWhere($rootScope.currencyList,{currencyCode:$constants.currentCurrency}))?_.findWhere($rootScope.currencyList,{currencyCode:$constants.currentCurrency}):'';
                        } else {
                            $rootScope.currencyList = [];
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        notify.message(messages.currencyFetchError);
                        $rootScope.currencyList = {};
                        deferred.reject();
                    });
                return deferred.promise();
            }
			
			$rootScope.removeHighlightChange = function() {
				if($('.row').hasClass('highlightAddedRow')){
					$('.row').removeClass('highlightAddedRow');
					$rootScope.highlightCreated = [];
				}
			}
		
            $scope.toggleLeftNav = function () {
                /*if($('aside').hasClass('full')) {
        		$('aside').removeClass('full').addClass('short');
        	} else {
        		$('aside').removeClass('short').addClass('full');	
        	}
        	if($('aside .expOrCol').hasClass('full')) {
        		$('aside .expOrCol').removeClass('full').addClass('short');
        	} else {
        		$('aside .expOrCol').removeClass('short').addClass('full');	
        	}
        	if($('section.content').hasClass('full')) {
        		$('section.content').removeClass('full').addClass('short');
        	} else {
        		$('section.content').removeClass('short').addClass('full');	
        	}*/
            };

            $scope.back = function () {
                $window.history.back();
            };

            $scope.navigate = function (url) {
                $location.path(url);
            };

            $rootScope.notifyUpload = function () {

                if (io && $rootScope.loggedInContent && !$rootScope.socket) {

                    //var uploadSocketUrl = ($location.host().indexOf('localhost')!=-1)?$constants.uploadproductsocketUrl+':'+$constants.uploadproductsocket:$location.protocol()+"://"+$location.host()+':'+$constants.uploadproductsocket;

                    var uploadSocketUrl = ($location.host().indexOf('localhost')!=-1)?$constants.uploadproductsocketUrl+':'+$constants.uploadproductsocket:'https'+"://"+$location.host()+':'+$constants.uploadproductsocket;

                    //uploadSocketUrl = $constants.uploadproductsocketUrl+':'+$constants.uploadproductsocket; //for time being has to be removed
                    
                    $rootScope.loggedInContent.merchantCode = $rootScope.loggedInContent.merchantCode || '';
                    $rootScope.socket = io.connect(uploadSocketUrl,{'force new connection': true });
                    if ($rootScope.socket) {
                        $rootScope.socket.on("connect", function () {
                            console.log("Connected!");
                        });
						$rootScope.socket.on("disconnect", function () {
                            console.log("Disconnected!");
                        });
						
                        $rootScope.socket.on($constants.uploadproductsocketkey + $rootScope.loggedInContent.merchantCode, function (data) {
                            //$scope.getPagedDataAsync();
                            /*
                            if(data.type==1) {
							notify.message("<a href='#/products/upload' title='" + messages.viewStatus + "'><em>" + messages.productFileProcessingCompleted + "</em></a>",'','succ');
                            } else if(data.type==2) {
							notify.message("<a href='#/shipments/upload' title='" + messages.viewStatus + "'><em>" + messages.shipmentFileProcessingCompleted + "</em></a>",'','succ');
                            } else if(data.type==3) {
							notify.message("<a href='#/orders/upload' title='" + messages.viewStatus + "'><em>" + messages.orderFileProcessingCompleted + "</em></a>",'','succ');
                            }
                            */
                            $scope.$broadcast('refreshUploadList');
                            $scope.$broadcast('listChannels');
                            $rootScope.getNotificationsCount();
                        });
                    }
                }
            }

            $scope.attachEvents = function () {
                $('body').on("click mousemove keyup", _.debounce(function () {
                    if ($cookieStore.get('isLoggedIn')) {
						notify.message("<em>" + messages.warnSessionExpire + "</em>&nbsp;&nbsp;&nbsp;<a href='javascript:;' title='" + messages.continueBrowsing + "'>" + messages.continueBrowsing + "</a>&nbsp;&nbsp;&nbsp;<a href='#/logout' title='" + messages.logOut + "'>" + messages.logOut + "</a>");
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                }, $constants.idleTimeout));
            }

            //Typeahead - methods
            $scope.highlightSuggest = function (str, match) {
				if (str && match) {
					var regex = new RegExp("(" + match + ")", 'gi');
					return str.replace(regex, '<strong>$1</strong>');
				}
				return str;
            };

            $scope.findSuggestion = function (txt, col) {
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.search.searchKey) {
                            $bus.fetch({
                                name: 'suggestproducts',
                                api: 'suggestproducts',
                                params: {
                                    skey: txt,
                                    scol: "all"
                                },
                                data: null
                            })
                                .done(function (success) {
                                    if (success.response && success.response.data && success.response.data.docs)
                                        $scope.suggestions = success.response.data.docs;
                                });
                        }
                    }, 500, false);
                } else {
                    $scope.suggestions.length = 0;
                }
            };

            $scope.beginSearch = function () {
                if ($scope.typeahead.beginSearch) return;

                $scope.typeahead.beginSearch = true;

                $("#typeahead-text").focus();
                $scope.suggestions = [];
                $scope.search.searchKey       = $rootScope.loggedInContent.merchantCode;
                $scope.search.oldSearchKey =  $scope.search.searchKey;
                //$scope.search.searchKey = "";
                //$scope.search.searchKey       = $rootScope.loggedInContent.merchantCode;


            };

            $scope.valueSelected = function (value) {
                $scope.typeahead.selectedItem = value;
                $scope.typeahead.beginSearch = false;
                $scope.typeahead.showResults = false;
                $scope.suggestions = [];
                $scope.search.oldSearchKey = "";
            };

            $scope.closeResult = function () {
                $scope.search.searchKey = '';
                $scope.typeahead.beginSearch=false;
                $scope.showResults = false;
            };

            $scope.attachEventsForTypeAhead = function () {
                $('html').not("#typeahead-text, #typeahead-results, #typeahead-label, #typeahead-search-button").click(function (e) {
                    //$scope.closeResult();
                });
                /*$('html').not("#typeahead-text, #typeahead-results, #typeahead-search-button, #typeahead-label").click(function (e) {

                 });*/
            };

			$rootScope.getTimeAgoFormat = function(param,toolTipParam) {
				if (param) {
					/*
					return (param)?$.timeago($scope.changeDateTimeAgo(param)):$constants.notAvailableText;
					var createdSeconds = new Date($scope.changeDateTimeAgo(param)).getTime();
					var currentTimeSeconds = new Date().getTime();
					var timeDiff = Math.abs(currentTimeSeconds - createdSeconds);
					var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
					if(toolTipParam && toolTipParam==1 && diffDays && diffDays <= $constants.timeAgoRestrict.days)
					   return param;
					else if (!toolTipParam && typeof(toolTipParam)=='undefined')
					   return (diffDays && diffDays <= $constants.timeAgoRestrict.days)?$.timeago($scope.changeDateTimeAgo(param)):param;
					*/
					if(toolTipParam && toolTipParam==1)
					   return param;
					else 
					   return $.timeago($scope.changeDateTimeAgo(param));
				}else{
					return $constants.notAvailableText;
				}
			};

            $rootScope.getTimeAgoAnnouncement = function(param,toolTipParam) {
                if (param) {
                    return $.timeago(param);
                }else{
                    return $constants.notAvailableText;
                }
            };
			
			$rootScope.changeDateTimeAgo = function(param) {
				var paramSplit = param.split(' ');
				var paramDate = paramSplit[0];
				var paramTime = paramSplit[1];
				var changeDate = paramDate.split('-');
				var dd = changeDate[0],mm = changeDate[1], yyyy = changeDate[2];
                return(yyyy +'-'+ mm +'-'+ dd +'T'+ paramTime+$rootScope.isCountriesOptionsVisible('timeagoTime'));
				//return (yyyy +'-'+ mm +'-'+ dd +'T'+ paramTime+'Z');
			};
			
            $scope.setMerchant = function(mechId, hideToaster) {
                $bus.fetch({
                name: 'switchmerccontext',
                api: 'switchmerccontext',
                params: {id:mechId},
                data: null
            })
                .done(function (success) {
                    if (success && success.response && success.response.success && success.response.success.length) {
                        if (!hideToaster) notify.message(success.response.success.join(', '),'','succ');
                    } else {
                        if (!hideToaster) notify.message(success.response.errors.join(','));
                    }
                }).fail(function (error) {
                        if (!hideToaster) notify.message(messages.switchContextError);
                });
            };
            $rootScope.changeLogginContent =function (merchant) {

                $rootScope.loggedInContent = {
                  
                    email           : (merchant.email)           ? merchant.email           : "",
                    firstName       : (merchant.merFirstName)    ? merchant.merFirstName    : "",
                    lastName        : (merchant.merLastName)     ? merchant.merLastName     : "",
                    merchantCode    : (merchant.merchantCode)    ? merchant.merchantCode    : "",
                    userId          : (merchant.userId)          ? merchant.userId          : "",
                    userName        : (merchant.userName)        ? merchant.userName        : "",
                    userRole        : (merchant.role)            ? merchant.role            : "MERC_SU",
                    activeDate      : (merchant.activeDate)      ? merchant.activeDate      : "",
                    companyName     : (merchant.companyName)     ? merchant.companyName     : "",
                    companyRegType  : (merchant.companyRegType)  ? merchant.companyRegType  : "",
                    companyRegNumber: (merchant.companyRegNumber)? merchant.companyRegNumber: ""
                };
                
                $scope.typeahead.selectedItem = $rootScope.loggedInContent.merchantCode;
                $cookieStore.put('loggedInContent', $rootScope.loggedInContent);
                $scope.setMerchant(merchant.merchantCode);
                if (io && $rootScope.socket) {
                    $rootScope.socket.disconnect();
                    delete $rootScope.socket;
                }
                $rootScope.notifyUpload();
            };

            $rootScope.$watch('loggedInContent', function(newVal, oldVal) {
              if (newVal == oldVal && !newVal) return;
              $scope.typeahead.selectedItem = $rootScope.loggedInContent.merchantCode;
            });

            //to hide popover
            $('body').on('click', function (e) {
                $('a#noti-button').each(function () {
                    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                        $rootScope.popupShown = false;
                        $(this).popover('destroy');
                    }
                });
            });


			$scope.getHeaderNotifications = function(nextPage) {
				
                var deferred = $.Deferred();
                
				$bus.fetch({
						name: 'notifications',
						api: 'notifications',
						params : {rcd:$constants.notifications.intialRecords,p:(nextPage)?(nextPage):1}
				})
				.done(function (success) {
					var notifications = [];
					if (success.response.data && success.response.data.notifications && success.response.data.notifications.length) {
						var data  = success.response.data.notifications;
						if (!_.isArray(data)) {
							_.forEach(data, function (notifiy) { notifications.push(notifiy) });
						}
						else {
								notifications = success.response.data.notifications;
						}
                        $rootScope.headerNotificationTotalPages = Math.ceil(success.response.data.totalRecords / $constants.notifications.intialRecords);
					}else{
							
					}
                    deferred.resolve(notifications);

				}).fail(function (error) {
                        var notifications = [];
						deferred.resolve(notifications);
				});

                return deferred.promise();

			};
						
            $scope.getContext = function(content){
                if (content && content.userRole) {
                    var roles = content.userRole.split(',');
                    var isMerchant = false;

                    if (roles) {
                        for (var index = 0; index < roles.length; index++) {
                            if (!isMerchant && (roles[index] == 'admin' || roles[index] == 'csr' || roles[index] == 'finance')) {
                                isMerchant = false;
                                break;
                            }
                            else if (index == roles.length - 1){
                                isMerchant = true;
                            }
                        };

                        if (isMerchant) {
                            if(content.companyName) return content.companyName;
                        }

                        else {
                            var rolesHierarchy = ['admin','csr', 'finance'];
                            var tempRole = '';
                            for (var roleIndex = 0; roleIndex < rolesHierarchy.length; roleIndex++){
                                for (var index = 0; index < roles.length; index++) {
                                    if (roles[index] == rolesHierarchy[roleIndex]) {
                                        tempRole = rolesHierarchy[roleIndex];
                                        break
                                    }
                                }
								
                                if (tempRole) {
									if (tempRole =='admin')   return "Admin";
									if (tempRole =='csr')     return "CSR";
									if (tempRole =='finance') return "Finance";
								}
                            }
                        }
                    }

                }
            };

            $rootScope.isRouteAllowed = function() {

                var routesNotAllowed     = ['login', 'verify', 'forgotpassword', 'resetpassword', 'activate', 'logout'];
                var currentPathComponent = ($location.path().split("/") != '') ? $location.path().split("/")[1] : '';

                if (currentPathComponent) {
                    for(index = 0; index < routesNotAllowed.length - 1; index++) {
                        if (routesNotAllowed[index] == currentPathComponent) return false;
                    }
                    return true;
                }
                else return false;
            };

            $scope.hasAccess = function(role) {
                if (!role) return false;
                roles = role.split(",");
                for (var index = 0; index < roles.length; index++) {
                    if (roles[index] == 'admin' || roles[index] == 'csr' || roles[index] == 'finance') return true;
                }
                return false;
            };


            $rootScope.getNotificationsCount = function (param) {

                $rootScope.notificationCounts = 0;
                
                $bus.fetch({
                        name: 'notificationscount',
                        api: 'notificationscount',
                        params: {status:1},
                        data: null
                })
                .done(function (success) {

                    if (success.response.data && success.response.data.count) {
                        $rootScope.notificationCounts = success.response.data.count;
                    }else{
                        $rootScope.notificationCounts = 0;
                    }

                }).fail(function (error) {
                       $rootScope.notificationCounts = 0;
                });

            };

            $rootScope.callHeaderNotifications = function (param) {

                if($rootScope.popupShown) {
                    $rootScope.popupShown = false;
                    $('a#noti-button').popover('destroy');
                    return false;
                }
                
                $bus.fetch({
                    name: 'notificationsreset',
                    api: 'notificationsreset',
                    params: null,
                    data: null
                })
                .done(function (data) {
                    if(data && data.response && data.response.success && data.response.success.length)
                        $rootScope.notificationCounts = 0;
                })

                $('a#noti-button').popover('destroy');

                var showPopover = $.fn.popover.Constructor.prototype.show;
                $.fn.popover.Constructor.prototype.show = function() {
                    showPopover.call(this);
                    if (this.options.showCallback) {
                        this.options.showCallback.call(this);
                    }
                };

                
                $('a#noti-button').popover({
                    html : true,
                    title: function () {
                        return "<span class='notificationTitle fleft'>Notifications</span><a href='javascript:;' class='viewAllLink'></a>";
                    },
                    animation: false,
                    trigger : 'manual',
                    content: function() {
                        return $('#notification-popover-content-loading').html();
                    },showCallback : function() {
                        $(".notifypopup .popover-title").removeClass('popover-title').addClass('notify-popover-title');
                    }
                });
                $('a#noti-button').popover('show');

                $rootScope.currentNotificationPage = 1;
                
                $rootScope.myNotifications = [];

                $scope.getHeaderNotifications().done(function(data){

                    $rootScope.myNotifications = data;

                    $timeout(function() {

                        $('a#noti-button').popover('destroy');

                        $('a#noti-button').popover({
                            html : true,
                            trigger : 'manual',
                            title: function () {
                                return "<span class='notificationTitle fleft'>Notifications</span><a href='#/home/viewall' class='viewAllLink'>View all</a>";
                            },
                            animation: false,
                            content: function() {
                                return $('#notification-popover-content').html();
                            },showCallback : function() {
                                
                                $rootScope.popupShown = true;

                                $('.nano-content div span.internalControl').removeAttr('data');
                                $(".notifypopup .popover-title").removeClass('popover-title').addClass('notify-popover-title');
                                $(".notifypopup .popover-content").addClass('col-sm-12');
                                $(".notifypopup .popover-content .nano").nanoScroller({ flash: true,preventPageScrolling: true});
                                $(".notifypopup .nano").bind("scrollend", function(e){
                                    e.stopImmediatePropagation();
                                    
                                    if(++$rootScope.currentNotificationPage <= $rootScope.headerNotificationTotalPages) {
                                        
                                        $scope.getHeaderNotifications($rootScope.currentNotificationPage).done(function(data){
                                            _.each(data,function(val) { 
                                                $rootScope.myNotifications.push(val);
                                            });
                                            $timeout(function() {
                                                $('a#noti-button').popover('show');
                                                 $(".notifypopup .popover-content .nano").nanoScroller({ scrollTop: '350' });
                                            },100);

                                        });

                                    }
                                
                                });
                                $(".notiticationTimeAgo").timeago();                                   
                            }
                        });

                        $('a#noti-button').popover('show');

                    }, 300); 

                });
            };

            $scope.showFooterPopUp = function(){

                if(!_.isEmpty($rootScope.loggedInContent) && !_.isEmpty($rootScope.loggedInContent.merchantCode) && ($rootScope.constantsBase.loginRedirectRoutes.indexOf('/'+$location.path().split('/')[1])==-1)){
                    return true;
                }
                return false;

            };

            
            $rootScope.popUpValidationMessages = $constants.validationMessages;
            
            $scope.popUpValidateFile = function (file_name) {
                
                var aValidExtensions = ["jpg", "jpeg","png","bmp","JPG","JPEG","PNG","BMP"];
                var aFileNameParts = file_name.split(".");
                if (aFileNameParts.length > 1) {
                    var sExtension = aFileNameParts[aFileNameParts.length - 1];
                    return ($.inArray(sExtension, aValidExtensions) >= 0) ? true : false;
                } else {
                    return false;
                }
            };

            $scope.cleanPopUpform  = function(){

                //$scope.attachment1 = $scope.attachment2 = $scope.attachment3 = $scope.popUpSubject = $scope.popUpMessage = '';
                $scope.attachment3 = $scope.popUpSubject = $scope.popUpMessage = '';
                $('#contactForm')[0].reset();
            };

            $scope.cleanSupportForm  = function(){
                $scope.supportSubject=$scope.category=$scope.supportSubType1=$scope.supportSubType2=$scope.supportMsg='';
                $('#supportForm')[0].reset();
                $('.handle').click();
                $scope.$apply();
            };

            $scope.supportFormSubmit = function() {
		/*
                if(!_.isEmpty($scope.attachment1) && !$scope.popupSupportFileCheck($scope.attachment1)){
                    notify.message(messages.supportFileError);
                    return false;
                }
		*/
                var data = new FormData();

                $.each($('.attachments'),function(i){

                    $.each($('.attachments')[i].files, function(j, file) {
                        data.append('attachment'+(i+1), file);
                    });

                });

                data.append('formCode','ezc-support');
                data.append('email', $rootScope.loggedInContent.email);
                data.append('Subject',      $scope.supportSubject   ? $scope.supportSubject:'');
                data.append('Category',     $scope.category         ? $scope.category:'');
                data.append('SubCategory',  $scope.supportSubType1  ? $scope.supportSubType1:'');
                data.append('Details',      $scope.supportSubType2  ? $scope.supportSubType2:'');
                data.append('Description',  $scope.supportMsg       ? $scope.supportMsg:'');
                data.append('screenShot',   $scope.canvasCode       ? $scope.canvasCode:'');

                notify.message(messages.supportSubmitInprocess,'','succ');
                $('#supportform-submit-button').addClass('disabled');

                $.ajax({
                    url: $constants.baseUrl+'/dynform',
                    data: data,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function(response){
                        
                        $('#supportform-submit-button').removeClass('disabled');

                        if(response && response.success && response.success.length){
                            notify.message(messages.supportSubmitSuccess,'','succ');
                            $scope.cleanSupportForm();
                            $scope.deleteScrnshot();
                            $('#supportForm').find('.has-error').removeClass('has-error');
                            $('#supportForm').find('label.control-label.validationMessage').remove();
                        } else if (response && response.errors) {
                            var errors = [];
                            _.forEach(response.errors,function(val, key){
                                errors.push(val)
                            })
                            if (errors.length){
                                $rootScope.notificationMessages = [];
                                notify.message($rootScope.pushJoinedMessages(errors));
                            }
                            else {
                                $rootScope.notificationMessages = [];
                                notify.message(messages.supportSubmitError);
                            }
                            $scope.$apply();
                        }
                    },
                    error: function(error) {
                        
                        $('#supportform-submit-button').removeClass('disabled');

                        if (error && error.response && error.response.errors) {
                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                notify.message($rootScope.pushJoinedMessages(errors));
                            }
                        }
                        else {
                            notify.message(messages.supportSubmitError);
                        }
                        $scope.$apply();
                    }
                });

            };

            $scope.subType2Val = function(param){
                
                if(!param){
                    return true;
                }
                else if(param && param.length && $scope.supportSubType2){
                    return true;
                }
                else {
                    return false;
                }

            }
            $scope.popUpSubmit = function() {

                $('.footerPopUpContainer .submitMessage').text('').removeClass('txtGreen').removeClass('txtRed');
                    
                    //if(_.isEmpty($scope.attachment1) && _.isEmpty($scope.attachment2) && _.isEmpty($scope.attachment3)){
                    if(_.isEmpty($scope.attachment3)){

                        $('.footerPopUpContainer .submitMessage').text(messages.popUpEmptyFile).addClass('txtRed');
                        return false;

                    }/*
                    else if (!_.isEmpty($scope.attachment1) && !$scope.popUpValidateFile($scope.attachment1.name)){

                        $('.footerPopUpContainer .submitMessage').text(messages.popUpWrongFileExtension).addClass('txtRed');
                        return false;

                    }else if (!_.isEmpty($scope.attachment2) && !$scope.popUpValidateFile($scope.attachment2.name)){

                        $('.footerPopUpContainer .submitMessage').text(messages.popUpWrongFileExtension).addClass('txtRed');
                        return false;

                    }*/
                    else if (!_.isEmpty($scope.attachment3) && !$scope.popUpValidateFile($scope.attachment3.name)){

                        $('.footerPopUpContainer .submitMessage').text(messages.popUpWrongFileExtension).addClass('txtRed');
                        return false;

                    }else{
                        $('.footerPopUpContainer .submitMessage').text('').removeClass('txtGreen').removeClass('txtRed');
                    }

                    var data = new FormData();    
                    
                    $.each($('.attachments'),function(i){

                        $.each($('.attachments')[i].files, function(j, file) {
                            data.append('attachment'+(i+1), file);
                        });

                    });

                    data.append('formCode','contact-us');
                    data.append('subject',$scope.popUpSubject?$scope.popUpSubject:'');
                    data.append('message',$scope.popUpMessage?$scope.popUpMessage:'');
                    
                    $('.footerPopUpContainer .submitMessage').text(messages.popUpSubmitProcessing).addClass('txtGreen');

                    $.ajax({
                      url: '/dynform',
                      data: data,
                      processData: false,
                      contentType: false,
                      type: 'POST',
                      success: function(response){
                        
                        if(response && response.success && response.success.length){
                            $scope.cleanPopUpform();
                            $('.footerPopUpContainer .submitMessage').text(messages.popUpSubmitSuccess).addClass('txtGreen');
                        }else{
                            $scope.cleanPopUpform();
                            $('.footerPopUpContainer .submitMessage').text(messages.popUpSubmitError).addClass('txtRed');    
                        }

                      },
                      error: function(data){
                        $scope.cleanPopUpform();
                        $('.footerPopUpContainer .submitMessage').text(messages.popUpSubmitError).addClass('txtRed');
                      }
                    });

            };
            $('.slide-out-div').tabSlideOut({
                tabHandle: '.hidesupport',                     //class of the element that will become your tab
                pathToTabImage: '', //path to the image for the tab //Optionally can be set using css
                imageHeight: '28px',                     //height of tab image           //Optionally can be set using css
                imageWidth: '118px',                       //width of tab image            //Optionally can be set using css
                tabLocation: 'right',                      //side of screen where tab lives, top, right, bottom, or left
                speed: 300,                               //speed of animation
                action: 'click',                          //options: 'click' or 'hover', action to trigger animation
                topPos: '10%',                          //position from the top/ use if tabLocation is left or right
                leftPos: '120px',                          //position from left/ use if tabLocation is bottom or top
                fixedPosition: true                      //options: true makes it stick(fixed position) on scroll
            });

            $scope.getSubType1 = function (categoroy) {
                if (!categoroy) return;
                var subType = $rootScope.caseList[categoroy];
                var typeKeys = [];
                for (var index = 0; index < subType.length; index++) {
                    var type = subType[index];
                    if (typeof type === 'string') {
                        typeKeys.push(subType[index]);
                    }
                    if (typeof type === 'object') {
                        _.each(type,function(val, key){
                            typeKeys.push(key);
                        })
                    }
                }
                return typeKeys
            };
            
            $rootScope.getProductUploadTemplatesUrl = function(param) {

                if($constants.currentLocation == $constants.countryShortCodes.australia){
                    return 'content/AU/Product Template v 1.0.0.xlsx';
                }else{
                    return param;
                }
            }

            $rootScope.getShipmentUploadTemplatesUrl = function(param) {

                if($constants.currentLocation == $constants.countryShortCodes.australia){
                    return 'content/AU/Shipment Template v 1.0.0.xlsx';
                }else{
                    return param;
                }
            }

            $rootScope.getOrdersUploadTemplatesUrl = function(param) {

                if($constants.currentLocation == $constants.countryShortCodes.australia){
                    return 'content/AU/Order Template v 1.0.1.xlsx';
                }else{
                    return param;
                }
            }

            $rootScope.isCountriesOptionsVisible = function(param) {

                switch(param) {

                    case 'pieChart':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;
                    break;

                    case 'timeagoTime':
                        if($constants.currentLocation == $constants.countryShortCodes.australia) return '+10.00';
                        else return '+08.00';
                    break;

                    case 'showRemovals':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:true;
                    break;

                    case 'showReturns':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'ordersDisableCountry':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;
                    break;

                    case 'ordersRemovePhoneValidation':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;
                    break;

                    case 'ordersRemoveEnhancedLiability':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'ordersRemoveInsuranceCoverage':
                            return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'preferencesCustomsDecl':
                            return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;

                    case 'preferencesInternationalOrders':
                            return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;                            
                    break;

                    case 'preferencesEnhancedLiability':
                            return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;                            
                    break;

                    case 'supportCallUs':
                            return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;                            
                    break;

                    case 'supportCallTimings':
                            if($constants.currentLocation == $constants.countryShortCodes.australia) { return '9:30 am – 5:30 pm AEST except on weekends & public holidays'; }
                            else { return '9:30 am - 5:30 pm except on weekends & public holidays'; }
                    break;

                    case 'supportHelpLinks':
                            return ($constants.currentLocation).toLowerCase();
                    break;

                    case 'welcomePopUpFile':
                            return $constants.currentLocation;
                    break;

                    case 'createProductWeight':

                        if($constants.currentLocation == $constants.countryShortCodes.australia) {
                            return { max:'22.00', placeholder:'Max. 22 kg', invalid_message:$constants.validationMessages.invalidweightau  }
                        }else { return {max:'30.00', placeholder:'Max. 30 kg', invalid_message:$constants.validationMessages.invalidweight  } }

                    break;

		            case 'createProductMaxLimit':

                        if($constants.currentLocation == $constants.countryShortCodes.australia) {
                            return { max:'5000.00', placeholder:'Max. 5000', invalid_message:$constants.validationMessages.invalidMaxLimitAu}
                        }else { return {max:'20000.00', placeholder:'Max. 20000', invalid_message:$constants.validationMessages.invalidMaxLimit} }

                    break;

                    case 'productDimensionLmt':
                        if($constants.currentLocation == $constants.countryShortCodes.australia) {
                            return {max:'',  placeholder:'Max. 105', invalid_message:$constants.validationMessages.invalidFieldValue}
                        }else { return {max:'105.00', placeholder:'Max. 105', invalid_message:$constants.validationMessages.invalidDimensiontotal} }

                    break;

                    case 'pieShipmentHeader':

                        if($constants.currentLocation == $constants.countryShortCodes.australia) {
                            return 'Order Distribution';
                        }
                        else return 'Domestic / International';

                    break;

                    case 'springGrant':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'corpAccNo':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'refType':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'domesticShippingMethod':

                        if($constants.currentLocation == $constants.countryShortCodes.australia) {
                            $constants.domesticShippingOptions = [];
                            $constants.domesticShippingOptions = [{name:"Domestic Standard"},{name:"Domestic Expedited"}];
                        }

                    break;

                    case 'internationalAUShippingMethod':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;
                    break;

                    case 'orderPostalCode':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;
                    break;

                    case 'productDimensions':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?true:false;
                    break;

                    case 'activate':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?
                            "Have questions? Contact us at support@au.ezycommerce.com or browse our FAQs and Help section" :
                            "Have questions? Contact us at <b> +65 62295979</b> or email us at <b>support@ezycommerce.com</b>";
                    break;

                    case 'ordersLandingDomShippintMethod':
                        if($constants.currentLocation == $constants.countryShortCodes.australia) {
                            $constants.domesticShippingOptions.push({name:"Domestic Expedited"});
                        }

                    break;

                    case 'ordersViewEnhancedLiability':
                        return ($constants.currentLocation == $constants.countryShortCodes.australia)?false:true;
                    break;

                    case 'termsAndConditionDoc':
                        if($constants.currentLocation == $constants.countryShortCodes.australia){
                            $scope.termsAndConditionFile = '/content/AU/ezyCommerce General T&Cs.pdf';
                        }
                    break;

                    case 'dunnagePercentage':
                        if($constants.currentLocation == $constants.countryShortCodes.australia){
                           return '10%';
                        }else{
                            return '10%';
                        }
                    break;

                    default:
                        return false;
                }
            }
            
            $scope.popupSupportFileCheck = function(file_name){
                
                if(file_name){
                    var name = file_name.name;
                    var aValidExtensions = ["jpg", "JPG","jpeg","JPEG","png","PNG","bmp","BMP","gif","GIF"];
                    var aFileNameParts = name.split(".");
                    if (aFileNameParts.length > 1) {
                        var sExtension = aFileNameParts[aFileNameParts.length - 1];
                        return ($.inArray(sExtension, aValidExtensions) >= 0) ? true : false;
                    } else {
                        return false;
                    }
                }
            }
            $scope.setSubType2 = function (categoroy, subType) {
                if (!categoroy && !subType) return;
                var subTypes = $rootScope.caseList[categoroy];
                var typeKeys = [];
                var flag = 0;
                for (var index = 0; index < subTypes.length; index++) {
                    var type = subTypes[index];
                    if (typeof type === 'object') {
                        _.each(type,function(val, key){
                            if (subType == key) {
                                typeKeys=val;
                                flag = 1;
                            }
                        })
                    }
                }
                if (flag) $scope.supportSubTypes2 = typeKeys;
            };

            $scope.openTab = function (searchKey) {
                var url = "http://www.ezycommerce.com/" + $scope.constantsBase.currentLocation.toLowerCase() + "/?s=" + searchKey;
                var win = window.open(url, '_blank');
                win.focus();
            };

            $("#support-search").on('keypress', function(e){
                if (e.which == 13) $scope.openTab($scope.supportSearchText);
            });

            $scope.deleteScrnshot = function() {
                $('#canvas-img').remove();
                $scope.canvasCode = '';
                $scope.isScreenCaptured = false;
            };

            $scope.openImageModel = function() {
                $('#img-modal').modal();
                $('#canvas-img-modal').html('<img class="canvas-img-mdl" src="'+$rootScope.canvasImg+'" alt="">');
            };

            $scope.takescrnshot = function() {
                
                $('.screenshot-loader').show();
                $('#canvas-img').remove();
                $('.ezyBase').addClass('screenshot');
                html2canvas($('body'), {
                    onrendered: function (canvas) {
                        $('.screenshot-loader').hide();
                        $scope.isScreenCaptured = true;
                        $rootScope.canvasImg = canvas.toDataURL("image/jpg");
                        $scope.canvasCode = canvas.toDataURL();
                        $('#canvasImg').html('<img id="canvas-img" class="canvas-img" src="'+$rootScope.canvasImg+'" alt="">');
                        //$('#canvasImg').html(canvas);
                        $('.ezyBase').removeClass('screenshot');
                        $scope.$apply();
                    }
                });
            };

            $scope.init = function () {

                /* time ago settings string */
                $.timeago.settings.strings = {
                    
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "",
                    suffixFromNow: "from now",
                    inPast: 'any moment now',
                    seconds: "just now",
                    minute: "a min",
                    minutes: "%d mins",
                    hour: "an hr",
                    hours: "%d hrs",
                    day: "a day",
                    days: "%d days",
                    week: "a week",
                    weeks: "%d weeks",
                    month: "a month",
                    months: "%d months",
                    year: "a year",
                    years: "%d years",
                }
                $.timeago.settings.allowFuture = true;
                /* time ago settings string */

                $rootScope.isCountriesOptionsVisible('termsAndConditionDoc');

                if ($cookieStore.get('loggedInUser')) {
                    $rootScope.getCaseList();
                    $rootScope.loggedInUser = $cookieStore.get('loggedInUser');
                    if (!$cookieStore.get('loggedInContent')) {
                        $rootScope.loggedInContent = $rootScope.loggedInUser;
                        if ($rootScope.loggedInContent.merchantCode && $rootScope.isRouteAllowed() && $scope.hasAccess($rootScope.loggedInUser.userRole))
                            $scope.setMerchant($rootScope.loggedInContent.merchantCode, true);
                    }
                }
                if ($cookieStore.get('loggedInContent') && $rootScope.loggedInUser && $scope.hasAccess($rootScope.loggedInUser.userRole)) {
                    $rootScope.loggedInContent = $cookieStore.get('loggedInContent');
                    if ($rootScope.loggedInContent.merchantCode && $rootScope.isRouteAllowed())
                        $scope.setMerchant($rootScope.loggedInContent.merchantCode, true);
                }

                if (!$localStorage.pagingOptions) {
                    $localStorage.pagingOptions = {};
                    $localStorage.pagingOptions = $scope.constantsBase.defaultPagin;
                }
                $('body').on("keydown keypress", ".multiSelectItem.multiSelectFocus" , function(e){
                    if(e.keyCode == 13) {
                        $(this).trigger('click');
                        $('.selectboxhldr input[type="text"]').focus();
                    }
                });

                $scope.attachEventsForTypeAhead();
                $scope.searchText = {text:"search"};
                $scope.search = 'undefined';
                $scope.search = {searchKey : "", oldSearchKey:""};
                $scope.typeahead = {
                    beginSearch : false,
                    selectedItem:"",
                    showResults:false
                };
                if (!$scope.typeahead.selectedItem && $rootScope.loggedInContent) {
                    $scope.typeahead.selectedItem = $rootScope.loggedInContent.merchantCode;
                    $scope.search.searchKey       = $rootScope.loggedInContent.merchantCode;
                    $scope.search.oldSearchKey    = $rootScope.loggedInContent.merchantCode;
                }

                $scope.suggestions = [];

                $rootScope.notifyUpload();
                if ($location.path() == '/404')
                    $rootScope.noPage = true;

                $('body').on('click', '.panel-heading input[type="checkbox"]', function (e) {
                    e.stopPropagation();
                });

				
				$('body').on('click','.glyphicon-noti-RightArrow',function(e) {
									
					$('.notificationContainer').toggleClass('overFlowHidden');
					$(this).toggleClass('collapsed');
					e.stopImmediatePropagation();
				});

                $timeout(function() {
                    $('body').on('click','.viewAllLink',function(e){
                        if($('.widgetnotify').length) {
                            $('html, body').animate({
                                scrollTop: ($(".widgetnotify").offset().top)-120
                            }, 2000);
                        }
                    });

                    $('.footerPopUpContainer .header').click(function(e){
                            e.stopImmediatePropagation();          
                            if($('.footerPopUpContainer').hasClass('footerPopSlide-up')) {
                                $('.footerPopUpContainer').addClass('footerPopSlide-down', 1000, 'easeOutBounce');
                                $('.footerPopUpContainer').removeClass('footerPopSlide-up');
                                $('.footerPopUpContainer span.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

                            } else {
                                $('.footerPopUpContainer').removeClass('footerPopSlide-down');
                                $('.footerPopUpContainer').addClass('footerPopSlide-up', 1000, 'easeOutBounce'); 
                                $('.footerPopUpContainer span.glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                            }
                    });

               },1000);
				    
                
                $(".feedback-cnt .nano").nanoScroller({ preventPageScrolling:true });
            };
            $scope.init();
    }]);
});