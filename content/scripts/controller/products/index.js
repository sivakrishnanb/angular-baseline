define(['app', 'model/products/products'], function (app, model) {
    app.controller('Products', function ($scope, $bus, $dal, $location, ngProgress) {
        
        /*var data = {"products":[
						{
							"name" : "product 1",
							"description" : "description 1"
						},
						{
							"name" : "product 2",
							"description" : "description 2"
						},
						{
							"name" : "product 3",
							"description" : "description 3"
						},
						{
							"name" : "product 4",
							"description" : "description 4"
						},
						{
							"name" : "product 5",
							"description" : "description 5"
						}

					]};*/
		ngProgress.start();
        $scope.model = new model();

        
        $scope.init = function() {
        	$bus.fetch({name:'products', api:'products', params: null, data: null})
            .done(function(success){
                $scope.model = new model(success.response); 
                //console.log(JSON.stringify($scope.model));
            }).fail(function(error){
                $scope.model = new model(); 
                //console.log(JSON.stringify($scope.model));
            });
        	$dal.collection.myorder = [];
        };

        $scope.purchase = function() {
        	$dal.collection.myorder = $scope.model.products;
        	$location.path("/orders")
        	//console.log(JSON.stringify($dal.collection.myorder));
        };
        ngProgress.complete();
    });
});