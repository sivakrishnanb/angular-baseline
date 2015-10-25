define(['app', 'utility/messages','socketio','utility/config'], function (app, messages,io,configConst) {
    app.controller('Login',['$scope', '$bus', 'ngProgress', '$location', '$http', '$rootScope', '$cookieStore','notify','$constants', '$localStorage','$routeParams', function ($scope, $bus, ngProgress, $location, $http, $rootScope, $cookieStore,notify,$constants, $localStorage,$routeParams) {

        $scope.constants = $constants;
        $scope.validationMessages = $constants.validationMessages;
        
        $scope.routeParams = $routeParams.error;
        
        // Password Format Validation -         
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
                if(!res){$scope.pwErrorMessage1 = $scope.validationMessages.invalidPasswordFormat;
                    return false;
                }
                return true;
        }
        //2nd Password - Validation
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

        $scope.storeLoginCookieInfo = function (val) {
            
            if(val) {
                var cookieInfo = { 
                    loginRemember:true,
                    loginRememberUserName:($scope.email)?$scope.aesEncrypt($scope.email):'',
                    loginRememberPassword:($scope.password)?$scope.aesEncrypt($scope.password):''
                };
                $localStorage.loginData = cookieInfo;
            }else{
                $localStorage.loginData = '';
            }

        };


        $scope.aesEncrypt = function (val) {
            
            if(!_.isEmpty(CryptoJS) && !_.isEmpty(configConst.encryptSalt) && !_.isEmpty(val)) {

                return CryptoJS.AES.encrypt(val,configConst.encryptSalt).toString();

            }else {

                return false;
            }

        };

        $scope.aesDecrypt = function (val) {
            
            if(!_.isEmpty(CryptoJS) && !_.isEmpty(configConst.encryptSalt) && !_.isEmpty(val)) {

                return CryptoJS.AES.decrypt(val,configConst.encryptSalt).toString(CryptoJS.enc.Utf8);

            }else {

                return false;
            }

        };


        $scope.getLoginCookieInfo = function() {

            if(!_.isEmpty($localStorage.loginData)){

                return $localStorage.loginData;

            }else {

                return false;
            }

        };

        $scope.submit = function () {

            $scope.loginMsgs = '';            if ($rootScope.resetChangePWSuccess) $rootScope.resetChangePWSuccess = null;
            var data = {
                body: JSON.stringify({
                    username: $scope.email,
                    password: $scope.password
                })
            }
            $bus.fetch({
                name: 'login.refresh',
                api: 'login',
                params: null,
                data: JSON.stringify(data)
            })
                .done(function (success) {
                    if (success.response && success.response.data && success.response.success.length) {
                        $rootScope.loggedInUser = success.response.data;
                        $rootScope.loggedInContent = success.response.data;
                        $cookieStore.put('loggedInUser', $rootScope.loggedInUser);
                        $rootScope.notifyUpload();
                        $rootScope.getCaseList();
                        $scope.storeLoginCookieInfo($scope.loginRemember);
                        
                        if($rootScope.redirectUrlAfterLogin){
                            $location.path($rootScope.redirectUrlAfterLogin);
                            $rootScope.redirectUrlAfterLogin = '';
                        }else if($rootScope.timeOutPath && $location.search().error){
                            $location.search({'error':null});
                            $location.path($rootScope.timeOutPath);
                            $rootScope.timeOutPath = '';
                        }
                        else{

                            if(!$localStorage.dashboardPopUp)
                                $('#dashboard-modal').modal(); //added
                            
                            $location.path('home');
                        }
                        if (!$localStorage.pagingOptions) {

                            $localStorage.pagingOptions = {};
                            $localStorage.pagingOptions = $scope.constants.defaultPagin;
                        }

                    }else{
                        $rootScope.isLoggedIn = false;
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            $scope.loginMsgs = (errors)?errors.join(',').replace(',',' '):'';
                        } else {
                            $scope.loginMsgs = messages.invalidCredential;
                        }
                    }
                    
                }).fail(function (error) {
                    $rootScope.isLoggedIn = false;
                    $scope.loginMsgs = messages.invalidCredential;
                });
        };
        
        
        $scope.forgotPassword = function() {
            $scope.resetPassword = function(email) {
                var data = {email : email};
                $scope.isLinkExpired = false;
                $http({method: 'post', url: $constants.baseUrl + 'auth/forgot-password', params : null, data: data,  cache: false}).
                    success(function(data, status, headers, config) {
                        if (data.success.length) {
                            $scope.isResetSuccess = true;
                            $scope.resetForgotPWSuccess = data.success.join(', ');
                            $scope.resetForgotPWError   = null;
                            $scope.email = null;
                        } else {
                            $scope.resetForgotPWSuccess = null;
                            var errors = [];
                            _.forEach(data.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                $scope.resetForgotPWError = (errors)?errors.join(',').replace(',',' '):'';
                            } else {
                                $scope.resetForgotPWError = messages.resetPasswordError;
                            }
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.resetErrorResponse = messages.resetPasswordError;
                    });
            }
            
            $scope.changePassword = function(pw, retypePw) {
                var data = {
                    forgotPassCode  : $scope.forgotPassCode,
                    newPassword     : pw,
                    retypePassword  : retypePw
                };

                $http({method: 'post', url: $constants.baseUrl + 'auth/reset-password', params : null, data: data,  cache: false}).
                    success(function(data, status, headers, config) {
                        if (data.success.length) {
                            $rootScope.resetChangePWSuccess = data.success.join(', ');
                            $scope.resetChangePWError   = null;
                            $location.path('/login');
                        } else {
                            $rootScope.resetChangePWSuccess = null;
                            var errors = [];
                            _.forEach(data.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                $scope.resetChangePWError = (errors)?errors.join(',').replace(',',' '):'';
                            } else {
                                $scope.resetChangePWError = messages.resetChangePWErrorMsg;
                            }
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.resetChangePWError = messages.resetChangePWErrorMsg;
                    });
            }
            
        }
        
        $scope.resendVerificationSuccessResponse = "";
        $scope.resendVerificationErrorResponse = "";
        
        $scope.resendVerification = function() {
            $scope.resendVerificationResponse = "";
            $scope.resendVerificationErrorResponse = "";
            var data = {
                email : $scope.resendVerificationEmail
            };
            $http({method: 'post', url: $constants.baseUrl + 'auth/resend-verify-email', params : null, data: data,  cache: false}).
            success(function(data, status, headers, config) {
                if (data.success.length) {
                    $scope.resendVerificationSuccessResponse = messages.resendVerificationSuccess;
                } else {
                    var errors = [];
                        _.forEach(data.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            $scope.resendVerificationErrorResponse = (errors)?errors.join(',').replace(',',' '):'';
                        } else {
                            $scope.resendVerificationErrorResponse = messages.resendVerificationError;
                        }
                }
            }).
            error(function(data, status, headers, config) {
                $scope.resendVerificationErrorResponse = messages.resendVerificationError;
            });
        };

        $scope.activateMerchant = function () {

            var params = {id:$scope.verificationCode};
            $http({method: 'get', url: $constants.baseUrl + 'merchants/verify-email', params : params, data: null,  cache: false}).
                success(function(data, status, headers, config) {
                    if (data.data) $scope.merchantDetails = data.data;
                    if (data.success.length) {
                        $scope.activateMechSuccess = data.success.join(', ');
                        $scope.activateMechError = null;

                    } else {

                        $scope.activateMechSuccess = null;
                        var errors = [];
                        _.forEach(data.errors, function (error) {
                            errors.push(error)
                        });
                        if (errors.length) {
                            $scope.activateMechError = (errors)?errors.join(',').replace(',',' '):'';
                        } else {
                            $scope.activateMechError = messages.mechActivationError;
                        }
                        $scope.verificationFailedHdr    = messages.verificationFailedHdr;
                        $scope.verificationFailedBody   = messages.verificationFailedBody;
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.activateMechError = messages.mechActivationError;
                    $scope.verificationFailedHdr  = messages.verificationErrorHdr;
                    $scope.verificationFailedBody = messages.verificationErrorBody;
                });
        };

        $scope.$on('$routeChangeSuccess', function (event, currentRoute, previousRoute) {
            if (!!($rootScope.resetChangePWSuccess) && previousRoute.loadedTemplateUrl == "views/login/forgotPassword.html" && currentRoute.loadedTemplateUrl == "views/login/index.html") {
                $scope.isResetSuccess = true;
            }
            else if ($rootScope.resetChangePWSuccess) $rootScope.resetChangePWSuccess = null;
        });
        
        $rootScope.changePasswordEmail = "";
        
        $rootScope.getEmailByRouteKey = function(key) {
            $rootScope.changePasswordEmail = "";
            var params = {id:key};
            $http({method: 'get', url: $constants.baseUrl + 'auth/reset-password', params : params, data: null,  cache: false}).
                success(function(data, status, headers, config) {
                    if(data && data.data && data.data.email)
                        $rootScope.changePasswordEmail = data.data.email;
                    if(!$rootScope.changePasswordEmail) {
                        //$location.path('/forgotpassword').search('resetlinkexpired', 'true');
                        $scope.isLinkExpired=true;
                        $scope.step = 1;
                    }
                }).
                error(function(data, status, headers, config) {
                    //$location.path('/forgotpassword').search('resetlinkexpired', 'true');
                    $scope.isLinkExpired=true;
                    $scope.step = 1;
                });
        };

        $scope.init = function () {
            $scope.linkExpiredMessage=messages.resetLinkExpireMsg;
            $scope.isLinkExpired=false;
            $scope.loginMsgs = '';
            $scope.isResetSuccess = false;

            if(!_.isEmpty($scope.getLoginCookieInfo())) {

                $scope.email = $scope.aesDecrypt($scope.getLoginCookieInfo().loginRememberUserName)?$scope.aesDecrypt($scope.getLoginCookieInfo().loginRememberUserName):'';
                $scope.password = $scope.aesDecrypt($scope.getLoginCookieInfo().loginRememberPassword)?$scope.aesDecrypt($scope.getLoginCookieInfo().loginRememberPassword):'';
                $scope.loginRemember = $scope.getLoginCookieInfo().loginRemember?$scope.getLoginCookieInfo().loginRemember:false;
            }

            ngProgress.complete();

            if ($location.path() == '/forgotpassword') {
                $scope.step = 1;
                $scope.forgotPassword();
            }

            var path = $location.path().substring(0, $location.path().lastIndexOf("/"));
            if (path == '/resetpassword') {
                $scope.step = 3;
                $scope.forgotPassword();
                $scope.forgotPassCode = $location.path().substr($location.path().lastIndexOf('/') + 1);
                $scope.getEmailByRouteKey($scope.forgotPassCode);
            }

            if (path == '/activate') {
                $scope.verificationCode = $location.path().substr($location.path().lastIndexOf('/') + 1);
                $scope.activateMerchant();
            }

            if ($location.path() == '/logout') {

                $('#mainHeader').addClass('ezyHide');

                $bus.fetch({
                    name: 'logout.refresh',
                    api: 'logout',
                    params: null,
                    data: JSON.stringify({
                        body: 'logout'
                    })
                })
                    .done(function (success) {
                        $rootScope.isLoggedIn = false;
                        $rootScope.loggedInUser = '';
                        $cookieStore.put('loggedInUser','');
                        $cookieStore.put('loggedInContent','');
                        if (io && $rootScope.socket) {
                            $rootScope.socket.disconnect();
                        }
                        $('#mainHeader').removeClass('ezyHide');
                    }).fail(function (error) {
                        notify.message(messages.logoutError);
                        $scope.loginMsgs = messages.logoutError;
                        $('#mainHeader').removeClass('ezyHide');
                    });
            }
            if ($location.path() == '/login') {
                if (io && $rootScope.socket) {
                    $rootScope.socket.disconnect();
                }
            }
        };
        
    }]);
});