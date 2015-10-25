define(['angularAMD'], function (angularAMD) {
    angularAMD
        .directive('showEmptyMsg', ['$compile', '$timeout', function ($compile, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var msg = (attrs.showEmptyMsg) ? attrs.showEmptyMsg : 'No Data to display';
                    var template = "<div class='nodatarow' ng-hide='myData.length'>" + msg + "</div>";
                    var tmpl = angular.element(template);
                    $compile(tmpl)(scope);
                    $timeout(function () {
                        element.find('.ngViewport').append(tmpl).height('60px');
                    }, 0);
                }
            };
        }])
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }])
        .directive('notificationMessages', [function () {

            return {
                restrict: 'A',
                replace:true,
                controller:function(){

                },
                template:
                '<div class="container-fluid" id="removeNotificationMsgs">'+
                '<div class="row blockRow" ng-repeat="showMsg in $root.notificationMessages track by $index">'+
                '<div class="notificationRow" ng-class="getNotifiClass(showMsg)" ng-if="$root.notificationMessages.length > 1 && $index==0">'+
                '<div class="notificationRowMsg"><div class="glyphicon collapsed glyphicon-noti-RightArrow"></div><span ng-bind-html="getDispNoti(showMsg)"></span><a ng-if="$index==0" href="javascript:void(0)" ng-click="removeNotificationMsgs()"><span class="glyphicon glyphicon-notificationClose notificationClose"></span></a></div>'+
                '</div>'+
                '<div class="notificationRow showAllMsgs" ng-class="getNotifiClass(showMsg)" ng-if="$root.notificationMessages.length > 1 && $index >= 1">'+
                '<div class="notificationRowMsg notificationRowMsgMore"><span ng-bind-html="getDispNoti(showMsg)"></span></div>'+
                '</div>'+
                '<div class="notificationRow" ng-class="getNotifiClass(showMsg)" ng-if="$root.notificationMessages.length==1 && $index==0">'+
                '<div class="notificationRowMsg"><span ng-bind-html="getDispNoti(showMsg)"></span><a href="javascript:void(0)" ng-click="removeNotificationMsgs()"><span class="glyphicon glyphicon-notificationClose notificationClose"></span></a></div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '</div>'+
                '</div>'
            };
        }])
        .directive('checkAcl', ['$route','$compile',function ($route,$compile) {

            return {
                restrict: 'A',
                replace:true,
                controller: ['$rootScope','$scope', '$element', '$attrs','role','$cookieStore', function($rootScope,$scope, $element, $attrs,role,$cookieStore) {

                    if(!role.checkSection($route,$attrs.checkAcl,$cookieStore.get('loggedInUser'))){
                        if($attrs && $attrs.showmessage && $attrs.showmessage=='hide'){
                            $element.show().text('You don\'t have access to perform this operation.');
                        }else if($element[0] && $element[0].tagName.toLowerCase()=='button'){
                            $compile($element.removeAttr('check-acl').removeAttr('ng-disabled').addClass('disabled').removeAttr('ng-click').attr('disabled',true).attr('ng-disabled',1).attr('ng-click','checkAcl($event)'))($scope);
                        }else{
                            $element.remove();
                        }
                    }
                }]
            };
        }])
        .directive('stringToNumber', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function(value) {
                        return '' + value;
                    });
                    ngModel.$formatters.push(function(value) {
                        return parseFloat(value, 10);
                    });
                }
            };
        })
        .directive('headerNotifications',['$rootScope',function($rootScope){

            return {
                replace : true,
                restrice : 'E',
                link  : function (scope, element, attrs) {

                    var eventObj = JSON.parse(attrs.data);
                    var eventPayload = JSON.parse(eventObj.eventPayload);
                    var createdTime = eventObj.createdDate;


                    scope.formTemplateData = {

                        getTemplate : (_.findWhere(scope.notificationTemplates,{eventName:eventPayload.eventName,eventType:(eventPayload.eventType)?eventPayload.eventType:null}))?(_.findWhere(scope.notificationTemplates,{eventName:eventPayload.eventName,eventType:(eventPayload.eventType)?eventPayload.eventType:null})):'',

                        passTemplateData : eventPayload
                    }

                    scope.frameTemplate = function() {

                        var frameHeaderText = scope.formTemplateData.getTemplate.headerText;

                        var frameBodyText = scope.formTemplateData.getTemplate.bodyText;

                        var frameLinkText = scope.formTemplateData.getTemplate.linkText;

                        var frameLink = scope.formTemplateData.getTemplate.link;

                        var frameIcon = scope.formTemplateData.getTemplate.cssClass;

                        var viewLink  = scope.formTemplateData.getTemplate.viewLink?scope.formTemplateData.getTemplate.viewLink:'';

                        /*products,shipments,orders upload */

                        if(/#FS#/.test(frameBodyText)){
                            var frameBodyText = frameBodyText.replace('#FS#',(_.findWhere(scope.constantsBase.notifications.fileStatus,{value:scope.formTemplateData.passTemplateData.fileStatus})?_.findWhere(scope.constantsBase.notifications.fileStatus,{value:scope.formTemplateData.passTemplateData.fileStatus}).name:'done'));
                        }

                        if(/#CC#/.test(frameBodyText)){
                            var frameBodyText = frameBodyText.replace('#CC#','Created : '+scope.formTemplateData.passTemplateData.successRecords);
                        }

                        if(/#RC#/.test(frameBodyText) && (scope.formTemplateData.passTemplateData.totalRecords - scope.formTemplateData.passTemplateData.successRecords)){
                            var frameBodyText = frameBodyText.replace('#RC#','Errors : '+(scope.formTemplateData.passTemplateData.totalRecords - scope.formTemplateData.passTemplateData.successRecords));
                        }
                        else if(/#RC#/.test(frameBodyText) && !(scope.formTemplateData.passTemplateData.totalRecords - scope.formTemplateData.passTemplateData.successRecords)){
                            var frameBodyText = frameBodyText.replace('#RC#','');
                        }
                        /*products,shipments,orders upload */

                        /*inbound receipt */
                        if(/#INBR#/.test(frameBodyText)){
                            var frameBodyText = frameBodyText.replace('#INBR#',scope.formTemplateData.passTemplateData.inboundCode);
                        }
                        /*inbound receipt */

                        // if (!_.isEmpty(frameLinkText)&& !_.isEmpty(frameLink)) {

                        //     var linkId = eventPayload.txnId?'/'+eventPayload.txnId:'';

                        //     if(eventPayload && eventPayload.fileStatus && eventPayload.fileStatus=='1' && eventPayload.eventType && eventPayload.eventType=='2' && eventPayload.inboundCode){
                        //         frameBodyText += '<a class="frameLink" href='+viewLink+''+eventPayload.inboundCode+'>'+frameLinkText+'</a>';
                        //     }
                        //     else {
                        //         frameBodyText += '<a class="frameLink" href='+frameLink+''+linkId+'>'+frameLinkText+'</a>';
                        //     }

                        // }

                        if (!_.isEmpty(frameLinkText)&& !_.isEmpty(frameLink)) {

                            var linkId = eventPayload.txnId?'/'+eventPayload.txnId:'';

                            if(eventPayload && eventPayload.fileStatus && eventPayload.fileStatus=='1' && eventPayload.eventType && eventPayload.eventType=='2' && eventPayload.inboundCode){
                                scope.viewRowLink = viewLink+''+eventPayload.inboundCode;
                            }
                            else if(eventPayload && eventPayload.eventName=='inboundReceiptUpdateInventory' && eventPayload.inboundCode!=''){
                                scope.viewRowLink = frameLink+eventPayload.inboundCode;
                            }
                            else {
                                scope.viewRowLink = frameLink+''+linkId;
                            }

                        }


                        return temaplate = {
                            headerText : frameHeaderText,
                            bodyText : frameBodyText,
                            headerIcon : frameIcon
                        };

                    };

                    scope.checkCount = function(val) {
                        return (!val)?'noNotifications':'';
                    };

                    scope.internalControl = function() {

                        var headerText = scope.frameTemplate().headerText;

                        var bodyText = scope.frameTemplate().bodyText;

                        var headerIcon = scope.frameTemplate().headerIcon;

                        return (bodyText)?'<a href='+scope.viewRowLink+' class="notificationRowLink"><span class="templateContainer"><span class="iconContainers"><span class=\"'+headerIcon+'\"></span></span><span>'+'<strong class=\"headerText\">'+headerText+'<span class=\"notiticationTimeAgo\" title=\"'+$rootScope.changeDateTimeAgo(createdTime)+'\"></span></strong>'+'<span>'+bodyText+'</span>'+'</span><span class="clear"></span>':'';
                    };
                },
                template : '<span ng-bind-html="internalControl()" class="internalControl"></span></span></a>'

            };

        }])
        .directive('countTo', ['$timeout', '$filter', function ($timeout, $filter) {
        return {
            replace: false,
            scope: true,
            link: function (scope, element, attrs) {
                var e = element[0];
                var num, refreshInterval, duration, steps, step, countTo, value, increment;

                var calculate = function () {
                    refreshInterval = 30;
                    step = 0;
                    scope.timoutId = null;
                    countTo =  parseFloat(attrs.countTo) || 0;
                    scope.value = parseInt(attrs.value, 10) || 0;
                    scope.decimal = parseInt(attrs.decimal) || 0;
                    duration = (parseFloat(attrs.duration) * 1000) || 0;

                    steps = Math.ceil(duration / refreshInterval);
                    increment = ((countTo - scope.value) / steps);
                    num = scope.value;
                }

                var tick = function () {
                    scope.timoutId = $timeout(function () {
                        num += increment;
                        step++;
                        if (step >= steps) {
                            $timeout.cancel(scope.timoutId);
                            num = countTo;
                            e.textContent = $filter('number')(countTo, scope.decimal); // $filter('number')(number, fractionSize)
                        } else {
                            e.textContent = $filter('number')(num, scope.decimal);// Math.round(num);
                            tick();
                        }
                    }, refreshInterval);

                }

                var start = function () {
                    if (scope.timoutId) {
                        $timeout.cancel(scope.timoutId);
                    }
                    calculate();
                    tick();
                }

                attrs.$observe('countTo', function (val) {
                    if (val) {
                        start();
                    }
                });

                attrs.$observe('value', function (val) {
                    start();
                });

                return true;
            }
        }

    }]);
});