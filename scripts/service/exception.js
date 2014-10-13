define(['angularAMD'], function (angularAMD) {
		angularAMD.service('$exceptionsqds', function($location) {
	    	this.init = function(status) {
		    	var deferred = $.Deferred();
		    	switch(status){
		    		case 200:
		    			deferred.resolve({response:'success'});
		    			break;
		    		case 404:
		    			deferred.reject({response:'fail'});
		    			$location.path("home");
		    			break;
		    		default:
		    			deferred.reject({response:'fail'});
		    			$location.path("login");
		    	}
				return deferred.promise();
			}
		});
});