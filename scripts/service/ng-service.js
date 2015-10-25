define(['angularAMD'], function (angularAMD) {
		angularAMD
        .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
                var fd = new FormData();
                var deferred = $.Deferred();
                fd.append('uploadFile', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(data, status){
                    deferred.resolve(data, status);
                })
                .error(function(data, status){
                    deferred.reject(data, status);
                });
                return deferred.promise();
            }
        }])
        .service('notify',['$rootScope',function($rootScope){
                
                this.message = function(msg,clear,succ,scrollFlag){
                    var sucFlag = (succ)?'~':'';
                    var noScroll = (scrollFlag)?'@':'';
                    if (msg && !clear) {
                        $rootScope.notificationMessages = [];
                        $rootScope.notificationMessages.push(msg+''+sucFlag+''+noScroll);
                    }else if (msg && clear) {
                        $rootScope.notificationMessages.push(msg+''+sucFlag+''+noScroll);
                    }
                }
               
        }]).service('highlight',['$rootScope',function($rootScope){
                
                this.added = function(val){
                   
                    if (val) {
                        $rootScope.highlightCreated = [];
                        $rootScope.highlightCreated.push(val);
                    }
                }
               
        }]).service('role',['$location','$routeParams',function($location,$routeParams){
                
                this.check = function(route,nextRoute,userCookie){
                   
                   var locationPath = '';
                   
                   if (!$.isEmptyObject(nextRoute.params)) {
                        locationPath = nextRoute.$$route.originalPath;
                   }else{
                        locationPath = $location.path();
                   }
                   
                   var role = (route.routes[locationPath])?route.routes[locationPath].role:'';
                   var userCookieValue =  (userCookie && userCookie.userRole)?userCookie.userRole.split(','):'';
                   
                   var userCookieMap = _.map(userCookieValue,function(val){
                        
                        return (_.where(route.routes[locationPath].roleMapping,{name:val}))[0]?_.where(route.routes[locationPath].roleMapping,{name:val})[0].value:'';
                   });
                   
                   if ((!_.isArray(role) && role=='*')||(typeof(role)=='undefined')||(!role)) {
                        return true;
                   }else if (_.isArray(role) && _.intersection(role,userCookieMap).length) {
                        return true;
                   }else{
                        return false;
                   }
                   
                }
                
                this.checkSection = function(route,value,userCookie){
                   
                   var role = route.routes['/acl'].role;
                   var roleMapp = route.routes['/acl'].roleMapping;
                   
                   var userCookieValue =  (userCookie && userCookie.userRole)?userCookie.userRole.split(','):'';
                   
                   var userCookieMap = _.map(userCookieValue,function(val){

                        return (_.where(roleMapp,{name:val}))[0]?_.where(roleMapp,{name:val})[0].value:'';
                   });
                   
                   if ((role && !_.isArray(role[value]) && role[value]=='*')||(typeof(role)=='undefined')||(!role)) {
                        return true;
                   }else if (role && _.isArray(role[value]) && _.intersection(role[value],userCookieMap).length) {
                        return true;
                   }else{
                        return false;
                   }
                   
                }
                
               
        }]);
});