define(['angularAMD', 'model/base'], function (angularAMD, model) {
    angularAMD.controller('Base', function ($scope, $bus, $location, ngProgress, $rootScope) {

		$scope.model = new model();

		$scope.isTabActive = function (tabName) {
            if ($location.path().indexOf('/' + tabName) != -1) {
                return "active";
            }
        };

        $scope.isNavActive = function (tabName, navName, initial) {
    		if (($location.path()=== '/' + tabName + (navName ? '/' + navName : '')) || (initial=='default' && $location.path()=== '/' + tabName)){
                return "active";
            }
        }

        $scope.toggleLeftNav = function() {
        	/*if($('aside').hasClass('full')) {
        		$('aside').removeClass('full').addClass('short');
        	} else {
        		$('aside').removeClass('short').addClass('full');	
        	}
        	if($('aside .expOrCol').hasClass('full')) {
        		$('aside .expOrCol').removeClass('full').addClass('short');
        	} else {
        		$('aside .expOrCol').removeClass('short').addClass('full');	
        	}
        	if($('section.content').hasClass('full')) {
        		$('section.content').removeClass('full').addClass('short');
        	} else {
        		$('section.content').removeClass('short').addClass('full');	
        	}*/
        }

		$scope.init = function() {
			$bus.fetch({name:'base', api:'base', params: null, data: null})
        	.done(function(success){
				$scope.model = new model(success.response); 
			}).fail(function(error){
				$scope.model = new model(); 
			});
			
			$('body').on('click','.panel-heading input[type="checkbox"]',function(e){
					e.stopPropagation();
			});
		}
    });
}); 