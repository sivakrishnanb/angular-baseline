define(['app', 'utility/restapi', 'utility/messages'], function (app, restapi, messages) {
    app.controller('UploadProducts', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', 'toaster', 'fileUpload', '$rootScope', 'notify','$timeout','$routeParams',
        function ($scope, $bus, $location, ngProgress, $http, $constants, toaster, fileUpload, $rootScope, notify,$timeout,$routeParams) {

            $scope.productTemplateXlsx = $constants.productTemplateXlsx;

            $scope.productTemplateCsv = $constants.productTemplateCsv;

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

            $scope.isUploadable = true;

            $scope.getRowHighlight = function (param) {
                
               if(param && $routeParams && $routeParams.highlight && $routeParams.highlight==param) {
                    return 'highlightAddedRow';
               }else{
                    return '';
               }
            };

            $scope.uploadProducts = function () {
                if ($scope.isUploadable || $constants.developerMode) {
                    if ($scope.myFile && $scope.validateFile($scope.myFile.name)) {
                        $rootScope.activateOverlay = true;
                        var file = $scope.myFile;
                        var uploadUrl = $constants.baseUrl + restapi.uploadproducts.url;
                        fileUpload.uploadFileToUrl(file, uploadUrl)
                            .done(function (response, status) {
                                if (response.success.length) {
                                    notify.message(messages.uploadSuccess,'','succ');
                                    //toaster.pop("success", messages.uploadSuccess); commented
                                    $("#upload-product-file").val('');
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
                                        //toaster.pop("error", messages.productUploadError, "", 0); commented
                                        notify.message(messages.productUploadError);
                                    }
                                }
                                $rootScope.activateOverlay = false;
                                ngProgress.complete();
                            }).fail(function (error) {
                                $rootScope.activateOverlay = false;
                                //toaster.pop("error", messages.productUploadError); commented
                                notify.message(messages.productUploadError);
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
                $rootScope.getProductsCount();
                  $timeout(function () {
                      $('[data-toggle="tooltip"]').tooltip();
                  }, 1000);
                $scope.getPagedDataAsync = function () {
                    ngProgress.start();
                    var params = {
                        p: 1,
                        rcd: 20
                    };
                    $bus.fetch({
                        name: 'importproducts',
                        api: 'importproducts',
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
                            // toaster.pop("error", messages.productListFetchError); commented
                            notify.message(messages.productListFetchError);
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
                    
                    $('#upload-product-button').addClass('disabled');
                    $('#upload-product-file').change(function (e) {
                        
                        if($(this).val()!=''){
                            $('#upload-product-button').removeClass('disabled');
                        }else{
                            $('#upload-product-button').addClass('disabled');
                        }
                        
                    });

               },1000);
                
            };

            ngProgress.complete();
    }]);
});