define(['app', 'model/products/productDetails'], function (app, model) {
    app.controller('CreateProducts', function ($scope, $bus, $dal, $location, ngProgress, $constants) {
        
		//ngProgress.start();
        $scope.model = new model();

        $scope.validationMessages = $constants.validationMessages;

        $scope.isExportSelected = function() {
            if($scope.model.isExportable)
                return false;
            else 
                return true;
        }

        $scope.createProduct = function(){
		    $location.path('products');
        }
        
        $scope.init = function() {
        	
        };

       
        ngProgress.complete();
    });
});