define(['angularAMD'], function (angularAMD, restapi) {
		angularAMD.factory('$constants', function() {
			var constants = {};
		    
		    constants.message = "Constant Message";

		    return constants;
		});
});