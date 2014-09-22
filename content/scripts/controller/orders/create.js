define(['app', 'model/products/products'], function (app, model) {
    app.controller('CreateOrders', function ($scope, $bus, $dal, $location, ngProgress) {
        
		ngProgress.start();
        $scope.model = new model();

        
        $scope.init = function() {
        	
        };

       
        ngProgress.complete();
    });
});