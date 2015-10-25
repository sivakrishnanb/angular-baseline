define(['app', 'model/returns/details', 'utility/messages'], function (app, model, messages) {
    app.controller('ViewReturns', ['$window','$scope', '$bus', 'ngProgress', '$constants', '$routeParams', '$rootScope', '$location', 'notify','highlight',
        function ($window,$scope, $bus, ngProgress, $constants, $routeParams, $rootScope, $location, notify,highlight) {

            $scope.constants = $constants;

            $scope.model = new model();

            $scope.validationMessages = $constants.validationMessages;

            $scope.getDescText = function() {
                    return messages.headerOrdersReturns;
            }

            $scope.getStatusDates = function(param,getstatus){
                
                if(_.isEmpty(param) && _.isEmpty(param.history)) {
                    return $constants.notAvailableText;
                }else{
                    return !_.isEmpty((_.findWhere(param.history,{status:getstatus})))?_.findWhere(param.history,{status:getstatus}).createdDate:$constants.notAvailableText;
                }

            }

            $scope.displayNumberOfPackages = function(start) {
                
                var result = [];

                if(!start){

                    return result;

                }else{
                    for (var i = 1; i <= start; i++) {
                        result.push(i);
                    }
                    return result;    
                }
                
            };

            $scope.formatOrderStatus = function (val) {

                if (val == '') {
                    return $scope.constants.notAvailableText;
                } else {
                    return _.findWhere($constants.orderStatus, {
                                "value": val
                            }) ? _.findWhere($constants.orderStatus, {
                                "value": val
                            }).display : $scope.constants.notAvailableText;
                }

            }

            $scope.returnsPerformAction = function(action, ordID) {

                if(action=='CANCELLED'){
                    
                    $('#modal-cancel-return-confirm').modal();

                    $('#modal-cancel-return-modalCancel,.modal-cancel-return-modalClose').on('click',function(e){
                        $('#modal-cancel-return-modalCancel').off('click');
                    }); 

                    $('#modal-cancel-return-modalOk').on('click',function(e){
                        $scope.updateService(action, ordID);
                        $('#modal-cancel-return-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#modal-cancel-return-modalOk').off('click');
                    });

                }else if (action=='CLOSED') {

                    $('#modal-close-return-confirm').modal();

                    $('#modal-close-return-modalCancel,.modal-close-return-modalClose').on('click',function(e){
                        $('#modal-close-return-modalCancel').off('click');
                    }); 

                    $('#modal-close-return-modalOk').on('click',function(e){
                        $scope.updateService(action, ordID);
                        $('#modal-close-return-modalCancel').click();
                        $('.modal-backdrop.fade.in').remove();
                        $('#modal-close-return-modalOk').off('click');
                    });
                }

            }

            $scope.updateService = function(action, ordID) {

                var param = {"status":action, "ezcReturnId":ordID}
                $bus.fetch({
                    name: 'returnsUpdateStatus',
                    api: 'returnsUpdateStatus',
                    data: param,
                })
                .done(function (success) {
                    if (success.response.success.length) {
                        notify.message(messages.orderReturnStatusUpdated, '', 'succ');
                        $location.path('orders/returns');
                    }
                    else {
                        var errors = [];
                        angular.forEach(success.response.errors, function (val, key) {
                            errors.push(val);
                        });
                        notify.message(errors.join(','));
                    }

                    ngProgress.complete();
                }).fail(function (error) {
                    notify.message(messages.orderReturnsFetchError);
                    ngProgress.complete();
                });
            }

            $scope.getTotalReturnCharges = function(param) {

                if(_.isEmpty(param) || !param.returns.totalReturnCharge || _.isEmpty(param.lineItems)) {
                    return $constants.notAvailableText;
                }else{
                    var individualReturnCharge = '';
                    _.each(param.lineItems,function(data) { individualReturnCharge+=(data.returnsCharge)?data.returnsCharge+' + ':''; });
                    individualReturnCharge = individualReturnCharge?individualReturnCharge.replace(/\+ $/, ''):'';
                    return param.returns.totalReturnCharge+' '+$constants.currentCurrency+' ( '+individualReturnCharge + ')';
                }
            }

            $scope.updateTrackingNumber = function(trackNumber){

                    if(!trackNumber)
                        return false;

                    var param = { 
                        'trackingNumber': $scope.model.returns.trackingNo ? $scope.model.returns.trackingNo :'',
                        'ezcReturnId' : $scope.model.returns.ezcReturnId ? $scope.model.returns.ezcReturnId :''
                    }

                    $bus.fetch({
                        name: 'returnsUpdateTrackNumber',
                        api: 'returnsUpdateTrackNumber',
                        params: null,
                        data: param
                    })
                    .done(function (success) {
                        
                        if (success && success.response && success.response.success.length) {
                            notify.message(messages.orderReturnsTrackNumberSuccess,'','succ');    
                        } else {
                            notify.message(messages.orderReturnsTrackNumberError);
                        }
                        
                    }).fail(function (error) {
                        notify.message(messages.orderReturnsTrackNumberError);
                        
                    });
            }

            $scope.init = function () {
                $rootScope.getOrdersCount();
                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });

                var params = {

                    id: $routeParams.id || ''
                }

                $bus.fetch({
                    name: 'ordersReturn',
                    api: 'ordersReturn',
                    params: params,
                    data: null
                })
                .done(function (success) {
                    var data = success.response.data;
                    if (data && data.returns) {
                        $scope.model = new model(data);
                    } else {
                        notify.message(messages.orderReturnsFetchError);
                    }
                    ngProgress.complete();
                }).fail(function (error) {
                    notify.message(messages.orderReturnsFetchError);
                    ngProgress.complete();
                });
            };
    }]);
});