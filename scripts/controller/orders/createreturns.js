define(['app', 'model/returns/details', 'utility/messages'], function (app, model, messages) {
app.controller('CreateReturns', ['$scope', '$bus', '$location', 'ngProgress', '$constants', '$rootScope', '$timeout', '$window', 'notify','highlight','$routeParams',
    function ($scope, $bus, $location, ngProgress, $constants, $rootScope, $timeout, $window, notify,highlight,$routeParams) {

        $scope.model = new model();

        $scope.validationMessages = $constants.validationMessages;
    
        $scope.constants = $constants;

        $scope.currentLocation = $constants.currentLocation;

        $scope.attachEventsForTypeAhead = function () {
            $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #order-create-search-product, div.nano-pane, div.nano-slider").click(function (e) {
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
        }

        $scope.numberOfPackages = function(start, end) {
            var result = [];
            for (var i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        };

        $scope.displayNumberOfPackages = function(start) {
            var result = [];
            for (var i = 1; i <= start; i++) {
                result.push(i);
            }
            return result;
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

        $scope.cleanData = function() {

            if(!_.isEmpty($scope.model.returns.fromCountryObj))
                $scope.model.returns.fromCountry = $scope.model.returns.fromCountryObj.countryCode;

            if(!_.isEmpty($scope.model.returns.toCountryObj))
                $scope.model.returns.toCountry = $scope.model.returns.toCountryObj.countryCode;
            
            if(!_.isEmpty($scope.model.returns.returnsToObj))
                $scope.model.returns.returnsTo = $scope.model.returns.returnsToObj.name;

            $scope.model.returns.displayableReturnDate = $scope.formatDate(new Date());

            $scope.model.returns.labelRecipient = $scope.model.returns.labelRecipientObj?'CUSTOMER':'MERCHANT';

        }

        $scope.clearAdditionalInfoData = function(){

            $scope.showNumberOfPackages = $constants.notAvailableText;
            $scope.showReturnWeight = $constants.notAvailableText;
            $scope.showReturnCharges = $constants.notAvailableText;

        }

        $scope.createReturns = function() {


            $('#confirm-return-estimate-modal').modal();

            $('#return-estimate-modalCancel,.return-estimate-modal-close').on('click',function(e){
                $('#return-estimate-modalCancel').off('click');
            }); 

            $scope.getEstimateCost().done(function(param) {
                
                $scope.showNumberOfPackages = $scope.model.returns.noOfBoxes?$scope.model.returns.noOfBoxes:$constants.notAvailableText;
                $scope.showReturnWeight = $scope.getTotalReturnWeight(param);
                $scope.showReturnCharges = $scope.getTotalReturnCharges(param);

                $('#return-estimate-modalOk').on('click',function(e){
                    $scope.createService();
                    $('#return-estimate-modalCancel').click();
                    $('.modal-backdrop.fade.in').remove();
                    $('#return-estimate-modalOk').off('click');
                });

            });

        }

        $scope.getTotalReturnCharges = function(param) {

            if(_.isEmpty(param)) {
                return $constants.notAvailableText;
            }else{

                var individualReturnCharge = '';
                var totalReturnCharge=0;

                _.each(param,function(data) { 
                    
                    if(param.length > 1)
                        individualReturnCharge+=(data.returnsCharge)?data.returnsCharge+' + ':''; 

                    totalReturnCharge+=data.returnsCharge?Number(data.returnsCharge):'';
                });
                individualReturnCharge = individualReturnCharge?individualReturnCharge.replace(/\+ $/, ''):'';
                individualReturnCharge  = individualReturnCharge?' ( '+individualReturnCharge + ')':'';

                return totalReturnCharge.toFixed(2)+' '+$constants.currentCurrency + individualReturnCharge;
            }
        }

        $scope.getTotalReturnWeight = function(param) {

            if(_.isEmpty(param)) {

                return $constants.notAvailableText;

            }else{

                var totalReturnWeight=0;
                var individualReturnWeight='';

                _.each(param,function(data) { 
                    totalReturnWeight+=Number(data.weight);
                    
                    if(param.length > 1)
                        individualReturnWeight = individualReturnWeight+' + '+data.weight;
                });
                individualReturnWeight = individualReturnWeight?'( '+ individualReturnWeight.substr(2,individualReturnWeight.length) +' )':'';
                return totalReturnWeight?totalReturnWeight.toFixed(3)+' Kg '+individualReturnWeight:$constants.notAvailableText;
            }
        }

        $scope.updateEstimateCharge = function(index) {

            if(!$scope.model.returns.noOfBoxes)
                return false;

            var flag = false;
            var noOfPackages = 0;
            var packageWeight = [];

            $('.dynamicCalculation').remove();
            $('.packageLoop').removeClass('has-error');

            for(var i=0; i<$scope.model.returns.noOfBoxes; i++) {
                
                $('#package_'+i).removeClass('has-error');
                
                if($scope.model.lineItems[i] && $scope.model.lineItems[i].weight && /^[0-9]*(\.?[0-9]{1,3})?$/.test($scope.model.lineItems[i].weight) && $scope.validatePackageWeight($scope.model.lineItems[i].weight) ) {
                    noOfPackages += 1;
                    packageWeight.push($scope.model.lineItems[i]);
                    flag = true;
                }else{
                    $('#package_'+i).addClass('has-error');
                    $('#package_'+i).append('<label class="control-label has-error validationMessage dynamicCalculation">'+$scope.validationMessages.invalidReturnsPackageWeight+'</label>');
                }
            }


            if(flag){
                $scope.getEstimateCost(noOfPackages,packageWeight).done(function(data) {
                    $scope.showNumberOfPackages = noOfPackages?noOfPackages:$constants.notAvailableText;
                    $scope.showReturnWeight = $scope.getTotalReturnWeight(data);
                    $scope.showReturnCharges = $scope.getTotalReturnCharges(data);
                });
            }

        }

        $scope.getEstimateCost = function(noOfPackages,packageWeight) {

            var deferred = $.Deferred();

            var returnData = '';

            if(noOfPackages) {
                var sendNoOfPackage = noOfPackages;
            }else{
                var sendNoOfPackage = $scope.model.returns.noOfBoxes?$scope.model.returns.noOfBoxes:'';
            }

            if(!_.isEmpty(packageWeight)) {
                var sendPackageWeight = packageWeight;
            }else{
                var sendPackageWeight = !_.isEmpty($scope.model.lineItems)?$scope.model.lineItems:[];
            }

            var frameData = {
                "returns" : {
                    "noOfBoxes" : sendNoOfPackage,
                    "lineItems" : !_.isEmpty(sendPackageWeight)?sendPackageWeight:[]
                }
            }

            $bus.fetch({
                name: 'ordersReturnsEstimateCost',
                api: 'ordersReturnsEstimateCost',
                data: frameData,
                params: null
            })
            .done(function (success) {

                if (success && success.response && !_.isEmpty(success.response.data)) {
                    returnData = success.response.data.lineItems;
                } else {
                    notify.message(messages.orderReturnsEstimageError);
                }
                deferred.resolve(returnData);
            }).fail(function (error) {
                notify.message(messages.orderReturnsEstimageError);
                deferred.reject();
            });

            return deferred.promise();

        }

        $scope.createService = function() {

            _.map($scope.model.lineItems,function(item){
                if(!_.isEmpty(item) && item.weight)
                    item.weight = Number(item.weight);
            });

            $scope.cleanData();
            ngProgress.start();
            $bus.fetch({
                name: 'ordersCreateReturns',
                api: 'ordersCreateReturns',
                data: $scope.model,
                params: null
            })
            .done(function (success) {
                var data = success.response.data;
                if (data && data.returns) {
                    $scope.returnCreated = true;
                    $scope.model = new model(data);
                    if(data && data.returns && data.returns.header && data.returns.header.ezcReturnId){
                        highlight.added(data.returns.header.ezcReturnId);
                    }
                    $location.path('orders/returns');
                } else {
                    var errors = [];
                    _.forEach(success.response.errors, function (error) {
                        errors.push(error)
                    });
                    if (errors.length) {
                        notify.message(errors[0]);
                    } else {
                        notify.message(messages.orderReturnsCreateError);
                    }
                }
                ngProgress.complete();
            }).fail(function (error) {
                notify.message(messages.orderReturnsCreateError);
                ngProgress.complete();
            });

        }

        $scope.checkEmail = function(param) {

            var patt = new RegExp("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

            return patt.test(param) ? true : false;

        }

        $scope.validatePackageWeight = function(param) {
            
            if(!param){
                return false;
            }
            else if(param && param > 30 ){
                return false;
            }
            else{
                return true;
            }

        }
        
        $scope.returnCreated = false;

        $scope.$on('$locationChangeStart', function (event, next, current) {
                
                if (!$scope.returnCreated) {
                    
                    event.preventDefault();
                    
                    $('#confirm-modal').modal();
                    
                    $('#modalCancel,#model-close').on('click',function(e){
                        $('#modalOk').off('click');
                    }); 
                        
                    $('#modalOk').on('click',function(e){
                        $scope.returnCreated = true;
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

        $scope.init = function () {

            $rootScope.getOrdersCount();

            $scope.model.returns.returnsToObj = $scope.constants.labelList[0];

            $('[data-toggle="popover"]').popover({
                title: function() {
                  return '<span class="glyphicon glyphicon-cross"></span>';
              },
              html:true
            });

            $rootScope.getCountryList().done(function(){
                $scope.model.returns.fromCountryObj =  $scope.model.returns.toCountryObj = _.findWhere($rootScope.countryList, {'countryCode': $constants.currentLocation});
            });

            $('body').on('click', function (e) {
                $('[data-toggle="popover"]').each(function () {
                    if ((($(e.target).attr('class'))=='glyphicon glyphicon-cross') || (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0)) {
                        $(this).popover('hide');
                    }
                });
            });

            $scope.attachEventsForTypeAhead();

        };
}]);
});