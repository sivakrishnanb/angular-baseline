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
        })
        .filter('camelCase', function() {
            return function(input) {
                input = input || '';
                return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            }
		})
        .filter('toTrusted', ['$sce',function ($sce) {
            return function (value) {
                return $sce.trustAsHtml(value);
            };
        }]);
});