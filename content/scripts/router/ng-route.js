var dep = [
            'angularAMD', 
            'angular-route',
            'controller/base', 
            'jquery', 
            'bootstrap',
            'ngAnimate',
            'ngProgress',
            'ngToaster',
            'ngGrid',
            'directive/ng-directive',
            'service/dal',
            'service/ng-service',
            'factory/bus', 
            'factory/ng-factory',
            'filter/ng-filter',
            'utility/constants',
            'angular-nvd3',
            'directive/angular-gmap'
          ];

define(dep, function (angularAMD) {
  
  //Define the app module
  var app = angular.module("Ez2Sell", ['ngRoute','ngProgress','toaster','ngGrid']);
  
  app.config(function ($routeProvider) {
    $routeProvider
    //Dashboard routing
    .when("/home", angularAMD.route({
        templateUrl: 'views/dashboard/index.html', controller: 'Dashboard', controllerUrl: 'controller/dashboard/index'
    }))
    //Products routing
    .when("/products", angularAMD.route({
        templateUrl: 'views/products/index.html', controller: 'Products', controllerUrl: 'controller/products/index'
    }))
    .when("/products/create", angularAMD.route({
        templateUrl: 'views/products/create.html', controller: 'CreateProducts', controllerUrl: 'controller/products/create'
    }))
    .when("/products/upload", angularAMD.route({
        templateUrl: 'views/products/upload.html', controller: 'UploadProducts', controllerUrl: 'controller/products/upload'
    }))
    //Shipments routing
    .when("/shipments", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/pending", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/intransit", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/received", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/cancelled", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/create", angularAMD.route({
        templateUrl: 'views/shipments/create.html', controller: 'CreateShipments', controllerUrl: 'controller/shipments/create'
    }))
    .when("/shipments/upload", angularAMD.route({
        templateUrl: 'views/shipments/upload.html', controller: 'UploadShipments', controllerUrl: 'controller/shipments/upload'
    }))
    //Orders routing
    .when("/orders", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/pending", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/intransit", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/received", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/cancelled", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/create", angularAMD.route({
        templateUrl: 'views/orders/create.html', controller: 'CreateOrders', controllerUrl: 'controller/orders/create'
    }))
    .when("/orders/upload", angularAMD.route({
        templateUrl: 'views/orders/upload.html', controller: 'UploadOrders', controllerUrl: 'controller/orders/upload'
    }))
    //Default routing
    .otherwise({redirectTo: "/home"});
  });
  
  return angularAMD.bootstrap(app);
});