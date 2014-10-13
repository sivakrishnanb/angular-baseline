define(['angularAMD'], function (angularAMD) {
		angularAMD
		.directive('directiveSyntax', function() {
		    return {
		      template: 'Dummy Directives'
		    };
		})
		.directive('showEmptyMsg', function ($compile, $timeout) {
		    return {
		        restrict: 'A',
		        link: function (scope, element, attrs) {
		            var msg = (attrs.showEmptyMsg) ? attrs.showEmptyMsg : 'Nothing to display';
		            var template = "<p ng-hide='myData.length'>" + msg + "</p>";
		            var tmpl = angular.element(template);
		            $compile(tmpl)(scope);
		            $timeout(function () {
		                element.find('.ngViewport').append(tmpl);
		            }, 0);
		        }
		    };
		});
});