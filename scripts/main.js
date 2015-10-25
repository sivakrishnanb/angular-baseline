require.config({
    baseUrl: "scripts",
    
    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': '../lib/angular/angular.min',
        'angular-route': '../lib/angular/angular-route.min',
        'angularAMD': '../lib/angular/angularAMD.min',
        'angular-cookies': '../lib/angular/angular-cookies.min',
        'angular-sanitize': '../lib/angular/angular-sanitize.min',
        'jquery': '../lib/jquery/jquery.min',
        'downloader': '../lib/downloader/jquery.fileDownload.min',
        'underscore': '../lib/underscore/underscore-min',
        'socketio': '../lib/socketio/socket.io',
        'ngProgress': '../lib/angular/ngProgress.min',
        'ngAnimate': '../lib/angular/angular-animate.min',
        'ngToaster': '../lib/angular/ngToaster.min',
        'bootstrap': '../lib/bootstrap/js/bootstrap.min',
        'datepicker': '../lib/datepicker/bootstrap-datepicker',
        'd3': '../lib/nvd3/d3.min',
        'nvd3': '../lib/nvd3/nv.d3.min',
        'angular-nvd3': '../lib/nvd3/angular-nvd3.min',
        'angular-validator': '../lib/angular/angular-validator.min',
        'ng-multiselect' : '../lib/angular/ng-multiselect.min',
        'g-map':'../lib/gmap/gmap',
        'app': 'router/ng-route',
        'nanoScroller': '../lib/nanoscroller/nanoscroller.min',
        'timeAgo': '../lib/timeago/timeago',
        'jquery-ui': '../lib/jquery/jquery-ui.min',
        'aes' : '../lib/crypto/aes',
        'map' : 'utility/map',
        'ngStorage':'../lib/angular/ngStorage.min',
        'highcharts':'../lib/highcharts/highcharts',
        'no-data':'../lib/highcharts/no-data-to-display',
        'tabslideout':'../lib/tabslideout/tabSlideOut',
	'angular-translate':'../lib/angular/angular-translate'
    },
    
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'ngStorage': ['angular'],
        'socketio':{exports:'io'},
        'ngProgress':['angular'],
        'ngAnimate':['angular'],
        'ngToaster':['angular'],
        'ng-multiselect':['angular'],
        'angular-validator':['angular'],
        'angular-translate':['angular'],
        'bootstrap':['jquery'],
        'downloader':['jquery'],
        'nanoScroller':['jquery'],
        'timeAgo':['jquery'],
        'highcharts':['jquery'],
        'no-data':['jquery', 'highcharts'],
        'tabslideout':['jquery'],
        'g-map':{
          exports: 'google'
        },
        'datepicker':{
            deps: ['jquery', 'bootstrap'],
            exports: '$.fn.datepicker'
        },
        'nvd3':{
          exports: 'nv',
          deps: ['global']
        },
        'angular-nvd3': ['angular','global','nvd3'],
        'underscore': {
          exports: '_'
        }
    },

    urlArgs : "v=1.0",
       
    // kick start application
    deps: ['app']
});
(function() {
    return (window)?window.htmlVersion="1.0":"";
})();