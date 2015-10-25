define(['app', 'model/products/details', 'utility/messages'], function (app, model, messages) {
    app.controller('ViewProducts', ['$scope', '$bus', 'ngProgress', '$constants', '$routeParams', 'toaster', '$rootScope','notify',
        function ($scope, $bus, ngProgress, $constants, $routeParams, toaster, $rootScope, notify) {

            //ngProgress.start();
            $scope.model = new model();
            $scope.constants = $constants;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            }

            $scope.init = function () {
                $rootScope.getProductsCount();
                var params = {
                    id: $routeParams.sku || ''
                }
                $bus.fetch({
                    name: 'products',
                    api: 'products',
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        var products = [];
                        var data = success.response.data;
                        if (!_.isArray(data.products)) {
                            _.forEach(data.products, function (product) {
                                products.push(product)
                            });
                        } else {
                            products = data.products;
                        }
                        $scope.model = new model(products[0]);
                        if ($scope.model.isExportable) $scope.model.isExportable = true;
                        //toaster.pop("success", messages.productDetail, messages.retrivedSuccess);
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        //toaster.pop("error", messages.productFetchError);
                        notify.message(messages.productFetchError);
                        ngProgress.complete();
                    });
            };
    }]);
});