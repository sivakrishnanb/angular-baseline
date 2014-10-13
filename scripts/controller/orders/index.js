define(['app','model/orders/orders'], function (app, model) {
    app.controller('Orders', function ($scope, $bus, $dal, ngProgress) {
    	
        $scope.model = new model();
		//ngProgress.start();
        $scope.init = function(){
        	//console.log(JSON.stringify($dal.collection.myorder));
        	$scope.model = new model({"orders":$dal.collection.myorder});
        	ngProgress.complete();
        }

    });
});