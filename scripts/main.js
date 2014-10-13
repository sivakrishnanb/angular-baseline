require.config({
    baseUrl: "scripts",
    
    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': '../lib/angular/angular.min',
        'angular-route': '../lib/angular/angular-route.min',
        'angularAMD': '../lib/angular/angularAMD.min',
        'jquery': '../lib/jquery/jquery.min',
        'underscore': '../lib/underscore/underscore-min',
        'ngProgress': '../lib/angular/ngProgress.min',
        'ngAnimate': '../lib/angular/angular-animate.min',
        'ngToaster': '../lib/angular/ngToaster.min',
        'ngGrid': '../lib/angular/ngGrid.min',
        'bootstrap': '../lib/bootstrap/js/bootstrap.min',
        'd3': '../lib/nvd3/d3.min',
        'nvd3': '../lib/nvd3/nv.d3.min',
        'angular-nvd3': '../lib/nvd3/angular-nvd3',
        'angular-validator': '../lib/angular/angular-validator.min',
        'ng-multiselect' : '../lib/angular/ng-multiselect',
        'g-map':'../lib/gmap/gmap',
        'app': 'router/ng-route'
    },
    
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'ngProgress':['angular'],
        'ngAnimate':['angular'],
        'ngToaster':['angular'],
        'ngGrid':['angular'],
        'ng-multiselect':['angular'],
        'angular-validator':['angular'],
        'bootstrap':['jquery'],
        'g-map':{
          exports: 'google'
        },
        'nvd3':{
          exports: 'nv',
          deps: ['global']
        },
        'underscore': {
          exports: '_'
        },
    },

    //urlArgs: "version=1.0",
    //urlArgs: "version=1.0" + (+new Date),
    
    // kick start application
    deps: ['app']
});
define("global", ["d3", 'underscore'], function(d3, _) {
      window.d3 = d3;
      window._ = _;
    });