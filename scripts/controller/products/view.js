define(['app', 'model/products/productDetails'], function (app, model) {
    app.controller('ViewProducts', function ($scope, $bus, $dal, $location, ngProgress, $constants) {
        
		//ngProgress.start();
        $scope.model = new model();
        $scope.constants = $constants;
        
        $scope.init = function() {
        	
        };

       
        ngProgress.complete();
    });
});