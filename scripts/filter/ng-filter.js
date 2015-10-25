define(['angularAMD'], function (angularAMD) {
		angularAMD
		.filter('addEllipse', function() {
            return function (input, scope,noDot) {
                if (input && input.length >scope) {
                    return (!noDot)?input.substring(0, scope) + ' ...':input.substring(0, scope);  
                }else{
                    return input;   
                }
            }
		});
});