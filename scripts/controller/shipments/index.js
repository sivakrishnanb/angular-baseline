define(['app','model/orders/orders'], function (app, model) {
    app.controller('Shipments', function ($scope, $bus, $dal, ngProgress) {
    	//ngProgress.start();
        $scope.model = new model();

        $scope.init = function(){
        	//console.log(JSON.stringify($dal.collection.myorder));
        	$scope.model = new model({"orders":$dal.collection.myorder});
        	ngProgress.complete();
        }

    });
});