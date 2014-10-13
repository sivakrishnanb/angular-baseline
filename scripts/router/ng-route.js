var dep = [
            'angularAMD', 
            'angular-route',
            'controller/base', 
            'jquery', 
            'underscore',
            'bootstrap',
            'ngAnimate',
            'ngProgress',
            'ngToaster',
            'ngGrid',
            'directive/ng-directive',
            'service/dal',
            'service/exception',
            'service/ng-service',
            'factory/bus', 
            'factory/ng-factory',
            'filter/ng-filter',
            'utility/constants',
            'angular-nvd3',
            'angular-validator',
            'directive/angular-gmap',
            'ng-multiselect'
          ];

define(dep, function (angularAMD) {
  
  //Define the app module
  var app = angular.module("EzyCommerce", ['ngRoute','ngProgress','toaster','ngGrid', 'multi-select', 'angularValidator']);
  
  app.config(function ($routeProvider) {
    $routeProvider
    //Dashboard routing
    .when("/login", angularAMD.route({
        templateUrl: 'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index'
    }))
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
    .when("/products/:status", angularAMD.route({
        templateUrl: 'views/products/index.html', controller: 'Products', controllerUrl: 'controller/products/index'
    }))
    .when("/products/view/:sku", angularAMD.route({
        templateUrl: 'views/products/view.html', controller: 'ViewProducts', controllerUrl: 'controller/products/view'
    }))
    .when("/products/edit/:sku", angularAMD.route({
        templateUrl: 'views/products/edit.html', controller: 'EditProducts', controllerUrl: 'controller/products/edit'
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
    .otherwise({redirectTo: "/login"});
  });
  app.run(function($rootScope, ngProgress, $location, $window) {
      $rootScope.$on('$routeChangeStart', function() {
        ngProgress.start();
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        ngProgress.complete();
        if ($location.path().indexOf('/login') != -1) {
            $rootScope.isLoggedIn = false;
        } else  {
            $rootScope.isLoggedIn = true;
        }
        $window.scrollTo(0,0);
      });
      $rootScope.$on('$routeChangeError', function() {
        ngProgress.complete();
      });
    });
  return angularAMD.bootstrap(app);
});

