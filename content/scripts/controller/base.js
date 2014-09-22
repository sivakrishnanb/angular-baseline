define(['angularAMD', 'model/base'], function (angularAMD, model) {
    angularAMD.controller('Base', function ($scope, $bus, $location) {
        /*var data = {
			"message" : "New Message from base controller"
		}*/

		$scope.model = new model(); 
		
		$scope.isTabActive = function (tabName) {
            if ($location.path().indexOf('/' + tabName) != -1) {
                return "active";
            }
        };

		$scope.init = function() {
			$bus.fetch({name:'base', api:'base', params: null, data: null})
        	.done(function(success){
				$scope.model = new model(success.response); 
				console.log(JSON.stringify($scope.model));
			}).fail(function(error){
				$scope.model = new model(); 
				console.log(JSON.stringify($scope.model));
			});
			
		}

        

    });
}); 