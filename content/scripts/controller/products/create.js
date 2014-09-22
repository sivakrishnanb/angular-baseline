define(['app', 'model/products/products'], function (app, model) {
    app.controller('CreateProducts', function ($scope, $bus, $dal, $location, ngProgress) {
        
		ngProgress.start();
        $scope.model = new model();

        
        $scope.init = function() {
        	
        };

       
        ngProgress.complete();
    });
});