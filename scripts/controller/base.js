
define(['angularAMD', 'socketio', 'utility/messages', 'utility/notificationtemplates'], function (angularAMD, io, messages, notificationTemplates) {
    angularAMD.controller('Base', ['$scope', '$bus', '$location', 'ngProgress', '$rootScope', '$window', 'toaster', '$constants', '$timeout', '$cookieStore', 'notify','highlight', '$localStorage', '$translate','$filter',
        function ($scope, $bus, $location, ngProgress, $rootScope, $window, toaster, $constants, $timeout, $cookieStore, notify,highlight, $localStorage, $translate, $filter) {
            $rootScope.messages = $filter('translate');
            $rootScope.setLang = function(langKey) {
                // You can change the language during runtime
                var promise = $translate.use(langKey);
                if (promise.$$state && !promise.$$state.status) {
                    $translate.use('en');
                }
                else {
                    $localStorage.preferredLanguage = langKey;
                }
            };

            $scope.isTabActive = function (tabName) {
				if ($location.path().indexOf('/accounts') != -1) {
                    return "";
                }
                else if ($location.path().indexOf('/' + tabName) != -1) {
                    return "active";
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
                        //toaster.pop("error", messages.productCountFetchError); commented

                        notify.message($messages('productCountFetchError'));
                        $rootScope.productCount = {};
                    });
            }

            $rootScope.checkAcl = function (e) {
                e.stopImmediatePropagation();
            };

			$rootScope.getOneMsgClass = function(){
				
				if ($rootScope.notificationMessages.length && $rootScope.notificationMessages.length==1) {
					return 'overFlowHidden';
				}
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
                        //toaster.pop("error", messages.shipmentCountFetchError); commented
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
                        //toaster.pop("error", messages.orderCountFetchError); commented
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
							$rootScope.countryListOrders = _.compact(_.map(countries,function(val){return (val.isOrderEnabled==1)?val:''}));
                        } else {
                            $rootScope.countryList = [];
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.countryFetchError); commented
                        notify.message(messages.countryFetchError);
                        $rootScope.countryList = {};
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
			
			$rootScope.selectSGD = true; //select SGD only and disable
			
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
							$rootScope.retailPriceCurrencyCtrl = $rootScope.declaredValueCurrencyCtrl = $rootScope.costPriceCurrencyCtrl = $rootScope.currencyList['43'];
                        } else {
                            $rootScope.currencyList = [];
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        //toaster.pop("error", messages.currencyFetchError); commented
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
                            //toaster.pop("success", "", "<a href='#/products/upload' title='" + messages.viewStatus + "'><em>" + messages.productFileProcessingCompleted + "</em></a>", 0, "trustedHtml");
							notify.message("<a href='#/products/upload' title='" + messages.viewStatus + "'><em>" + messages.productFileProcessingCompleted + "</em></a>",'','succ');
                            } else if(data.type==2) {
                            //toaster.pop("success", "", "<a href='#/shipments/upload' title='" + messages.viewStatus + "'><em>" + messages.shipmentFileProcessingCompleted + "</em></a>", 0, "trustedHtml");
							notify.message("<a href='#/shipments/upload' title='" + messages.viewStatus + "'><em>" + messages.shipmentFileProcessingCompleted + "</em></a>",'','succ');
                            } else if(data.type==3) {
                            //toaster.pop("success", "", "<a href='#/orders/upload' title='" + messages.viewStatus + "'><em>" + messages.orderFileProcessingCompleted + "</em></a>", 0, "trustedHtml");
							notify.message("<a href='#/orders/upload' title='" + messages.viewStatus + "'><em>" + messages.orderFileProcessingCompleted + "</em></a>",'','succ');
                            }
                            */
                            $scope.$broadcast('refreshUploadList');
                            $rootScope.getNotificationsCount();
                        });
                    }
                }
            }

            $scope.attachEvents = function () {
                $('body').on("click mousemove keyup", _.debounce(function () {
                    if ($cookieStore.get('isLoggedIn')) {
                        toaster.clear();
                        //toaster.pop("warning", "", "<em>" + messages.warnSessionExpire + "</em>&nbsp;&nbsp;&nbsp;<a href='javascript:;' title='" + messages.continueBrowsing + "'>" + messages.continueBrowsing + "</a>&nbsp;&nbsp;&nbsp;<a href='#/logout' title='" + messages.logOut + "'>" + messages.logOut + "</a>", 0, "trustedHtml");
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
			
			$rootScope.changeDateTimeAgo = function(param) {
				var paramSplit = param.split(' ');
				var paramDate = paramSplit[0];
				var paramTime = paramSplit[1];
				var changeDate = paramDate.split('-');
				var dd = changeDate[0],mm = changeDate[1], yyyy = changeDate[2];
                return(yyyy +'-'+ mm +'-'+ dd +'T'+ paramTime+'+08.00');
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
                
                $scope.myNotifications = [];

                $scope.getHeaderNotifications().done(function(data){

                    $scope.myNotifications = data;

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
                                                $scope.myNotifications.push(val);
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
                        
                        if(response.success.length){
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


            $scope.init = function () {

                if ($cookieStore.get('loggedInUser')) {
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
				


            };
            $scope.init();
    }]);
});