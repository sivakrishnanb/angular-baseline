define(['angularAMD', 'utility/restapi'], function (angularAMD, restapi) {
		angularAMD.factory('$bus', ['$http', '$dal', '$templateCache', '$constants', '$exceptionManager', function($http, $dal, $templateCache, $constants, $exceptionManager) {
			var _bus = {};
		    var base = $constants.baseUrl;
		    _bus.args = function(args, name) {
		    	args.api = args.api || ($dal.collection[name] ? $dal.collection[name].api : null);
    			args.params = args.params || ($dal.collection[name] ? $dal.collection[name].params : null);
    			args.data = args.data || ($dal.collection[name] ? $dal.collection[name].data : null);
    			return args;
		    }
		    _bus.static = function(name, args, deferred) {
		    	if($dal.collection[name] && ($dal.collection[name].api == args.api) && ($dal.collection[name].params == args.params) && ($dal.collection[name].data == args.data)) {
					deferred.resolve($dal.collection[name]);
		    	} else {
					_bus.refresh(name, args, deferred);
				}
		    }
		    _bus.refresh = function(name, args, deferred) {
                if(args.resturl) {
                    var resturl = base + restapi[args.api].url + '/' + _.values(args.params).join('/');
                    $http({method: restapi[args.api].method, url: resturl, params : null, data: args.data,  cache: false}).
                      success(function(data, status) {
                        args.response = data;
                        args.status = status;
                        $exceptionManager.init(args.status)
                        .done(function(){
                            $dal.collection[name] = args;
                            deferred.resolve($dal.collection[name]);
                        }).fail(function(){
                            deferred.reject(args);
                        });
                      }).
                      error(function(data, status) {
                        args.response = data;
                        args.status = status;
                        $exceptionManager.init(args.status)
                        .done(function(){
                            deferred.reject(args);
                        }).fail(function(){
                            deferred.reject(args);
                        });

                      });
                } else {
                       
				    $http({method: restapi[args.api].method, url: base + restapi[args.api].url, params : args.params, data: args.data,  cache: false}).
                      success(function(data, status) {
                       
                        args.response = data;
                        args.status = status;
                        $exceptionManager.init(args.status)
                        .done(function(){
                            $dal.collection[name] = args;
                            deferred.resolve($dal.collection[name]);
                        }).fail(function(){
                            deferred.reject(args);
                        });
                      }).
                      error(function(data, status) {
                        args.response = data;
                        args.status = status;
                        $exceptionManager.init(args.status)
                        .done(function(){
                            deferred.reject(args);
                        }).fail(function(){
                            deferred.reject(args);
                        });

                      });
                }
		    }
		    _bus.delete = function(name, args, deferred) {
				if($dal.collection[name] && ($dal.collection[name].api == args.api) && ($dal.collection[name].params == args.params) && ($dal.collection[name].data == args.data)) {
					delete $dal.collection[name];
					deferred.resolve({response:'success'});
		    	} else {
		    		deferred.reject({response:'failed'});
		    	}
		    }
		    
		    return {
		    	fetch : function() {
			    	var name = arguments[0].name.split('.')[0];
			    	var mode = arguments[0].name.split('.')[1] || '';
			    	var args = arguments[0];
			    	delete args.name;
			    	var deferred = $.Deferred();
			    	switch(mode){
			    		case 'static':
			    			_bus.static(name,_bus.args(args, name),deferred);
			    			break;
			    		case 'refresh':
			    			_bus.refresh(name,_bus.args(args, name),deferred);
			    			break;
			    		case 'delete':
			    			_bus.delete(name,_bus.args(args, name),deferred);
			    			break;
			    		default:
			    			_bus.refresh(name,_bus.args(args, name),deferred);
			    	}
				    return deferred.promise();
			    },
			    clearDal : function(){
			    	$dal.collection = {};
			    }
		    };
		}]);
});