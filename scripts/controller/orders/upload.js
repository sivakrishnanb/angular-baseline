define(['app', 'utility/restapi', 'utility/messages'], function (app, restapi, messages) {
    app.controller('UploadOrders', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', 'toaster', 'fileUpload', '$rootScope','notify','$timeout','$routeParams',
        function ($scope, $bus, $location, ngProgress, $http, $constants, toaster, fileUpload, $rootScope,notify,$timeout,$routeParams) {

            $scope.orderTemplateXlsx = $constants.orderTemplateXlsx;

            $scope.orderTemplateCsv = $constants.orderTemplateCsv;

            $scope.fileStatus = $constants.fileStatus;

            $scope.fileValid = true;
            $scope.constants = $constants;

            $scope.validateFile = function (file_name) {
                //var aValidExtensions = ["xls", "xlsx", "csv"];
                var aValidExtensions = ["xls", "xlsx"];
                var aFileNameParts = file_name.split(".");
                if (aFileNameParts.length > 1) {
                    var sExtension = aFileNameParts[aFileNameParts.length - 1];
                    return ($.inArray(sExtension, aValidExtensions) >= 0) ? true : false;
                } else {
                    return false;
                }
            }

            $scope.$on('refreshUploadList', function () {
                $scope.getPagedDataAsync();
            });

            $scope.getRowHighlight = function (param) {
                
               if(param && $routeParams && $routeParams.highlight && $routeParams.highlight==param) {
                    return 'highlightAddedRow';
               }else{
                    return '';
               }
            };

            $scope.isUploadable = true;

            $scope.uploadOrders = function () {
                if ($scope.isUploadable || $constants.developerMode) {
                    if ($scope.myFile && $scope.validateFile($scope.myFile.name)) {
                        $rootScope.activateOverlay = true;
                        var file = $scope.myFile;
                        var uploadUrl = $constants.baseUrl + restapi.uploadorders.url;
                        fileUpload.uploadFileToUrl(file, uploadUrl)
                            .done(function (response, status) {
                                if (response.success.length) {
                                    //toaster.pop("success", messages.uploadSuccess); commented
                                    notify.message(messages.uploadSuccess,'','succ');
                                    $("#upload-order-file").val('');
                                    $scope.myFile = null;
                                    $scope.getPagedDataAsync();
                                } else {
                                    var errors = [];
                                    _.forEach(response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        //toaster.pop("error", errors.join(', '), '', 0); commented
                                        notify.message($rootScope.pushJoinedMessages(errors));
                                    } else {
                                        //toaster.pop("error", messages.orderUploadError, "", 0); commented
                                        notify.message(messages.orderUploadError);
                                    }
                                }
                                $rootScope.activateOverlay = false;
                                ngProgress.complete();
                            }).fail(function (error) {
                                $rootScope.activateOverlay = false;
                                //toaster.pop("error", messages.orderUploadError); commented
                                notify.message(messages.orderUploadError);
                                ngProgress.complete();
                            });
                    } else {
                        //toaster.pop("error", messages.uploadInvalidFiles); commented
                        notify.message(messages.uploadInvalidFiles);
                    }
                } else {
                    //toaster.pop("error", messages.uploadStopAnotherFile); commented
                    notify.message(messages.uploadStopAnotherFile);
                }
            }

            $scope.init = function () {
                $timeout(function () {
                      $('[data-toggle="tooltip"]').tooltip();
                }, 1000);
                $rootScope.getOrdersCount();
                $scope.getPagedDataAsync = function () {
                    ngProgress.start();
                    var params = {
                        p: 1,
                        rcd: 20
                    };
                    $bus.fetch({
                        name: 'importorders',
                        api: 'importorders',
                        params: params,
                        data: null
                    })
                        .done(function (success) {
                            var uploads = [];
                            var data = success.response.data;
                            if (data && data.dataUploadList) {

                                if (_.where(data.dataUploadList, {
                                    "duTxnFileStatus": 0
                                }).length) {
                                    $scope.isUploadable = false;
                                } else {
                                    $scope.isUploadable = true;
                                }

                                if (!_.isArray(data.dataUploadList)) {
                                    _.forEach(data.dataUploadList, function (upload) {
                                        uploads.push(upload)
                                    });
                                } else {
                                    uploads = data.dataUploadList;
                                }
                                $scope.myData = uploads;
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            //toaster.pop("error", messages.orderListFetchError); commented
                            notify.message(messages.orderListFetchError);
                            ngProgress.complete();
                        });
                };

                $scope.getPagedDataAsync();

                $timeout(function(){
                    if($('.row').hasClass('highlightAddedRow')){
                      $('.row').removeClass('highlightAddedRow');
                    }
                },10000);

               $timeout(function(){
                    if($(".highlightAddedRow").length) {
                        $('html, body').animate({
                            scrollTop: ($(".highlightAddedRow").offset().top)-120
                        }, 2000);
                    }
               },1000);


                $('#upload-order-button').addClass('disabled');
                $('#upload-order-file').change(function (e) {
                    
                    if($(this).val()!=''){
                        $('#upload-order-button').removeClass('disabled');
                    }else{
                        $('#upload-order-button').addClass('disabled');
                    }
                    
                });

            };


            ngProgress.complete();
    }]);
});