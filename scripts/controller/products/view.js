define(['app', 'model/products/productDetails'], function (app, model) {
    app.controller('ViewProducts', function ($scope, $bus, ngProgress, $constants, $routeParams, toaster) {
        
		//ngProgress.start();
        $scope.model = new model();
        $scope.constants = $constants;
        
        $scope.init = function() {
        	var params = {
        		id : $routeParams.sku || ''
        	}
        	$bus.fetch({name:'products', api:'products', params: params, data: null})
            .done(function(success){
            	var products = [];
            	var data = success.response.data;
            	if(!_.isArray(data.products)) {
                    _.forEach(data.products, function(product) { products.push(product) }); 
                } else {
                    products = data.products;
                } 
                $scope.model = new model(products[0]);
                toaster.pop("success", "Products Details", "Successfully Retrived");
                ngProgress.complete();
            }).fail(function(error){
            	$scope.model = new model();
                toaster.pop("error", "Error in fetching product details");
                ngProgress.complete(); 
            });
        };

       
        ngProgress.complete();
    });
});