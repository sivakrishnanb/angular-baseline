require.config({
    baseUrl: "scripts",
    
    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min',
        'angular-route': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.min',
        'angularAMD': '../lib/angular/angularAMD.min',
        'angular-cookies': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-cookies.min',
        'angular-sanitize': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-sanitize.min',
        'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
        'downloader': '../lib/downloader/jquery.fileDownload.min',
        'underscore': '../lib/underscore/underscore.min',
        'socketio': 'https://cdn.socket.io/socket.io-1.3.5',
        'ngProgress': '../lib/angular/ngProgress.min',
        'ngAnimate': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-animate.min',

        'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min',
        'datepicker': '../lib/datepicker/bootstrap-datepicker',
        'datetimepicker': '../lib/datepicker/bootstrap-datetimepicker.min',
        'moment':'../lib/moment/moment.min',
        'momentTimezone':'../lib/moment/moment-timezone.min',
        'angular-validator': '../lib/angular/angular-validator.min',
        'ng-multiselect' : '../lib/angular/ng-multiselect.min',
        'g-map':'../lib/gmap/gmap',
        'nanoScroller': '../lib/nanoscroller/nanoscroller.min',
        'timeAgo': '../lib/timeago/timeago.min',
        'jquery-ui': '../lib/jquery/jquery-ui.min',
        'aes' : '../lib/crypto/aes',
        'map' : 'utility/map',
        'ngStorage':'../lib/angular/ngStorage.min',
        'highcharts':'../lib/highcharts/highcharts.min',
        'tabslideout':'../lib/tabslideout/tabSlideOut.min',
        'html2canvas':'../lib/html2canvas/html2canvas',
	'app': 'router/ng-route'
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
        'ng-multiselect':['angular'],
        'angular-validator':['angular'],
        'bootstrap':['jquery'],
        'downloader':['jquery'],
        'nanoScroller':['jquery'],
        'timeAgo':['jquery'],
        'highcharts':['jquery'],
        'tabslideout':['jquery'],
        'html2canvas':['jquery'],
        'g-map':{
          exports: 'google'
        },
        'datepicker':{
            deps: ['jquery', 'bootstrap'],
            exports: '$.fn.datepicker'
        },
        'datetimepicker':{
            deps: ['jquery', 'bootstrap'],
            exports: '$.fn.datepicker'
        },
        'underscore': {
          exports: 'window._'
        }
    },

    urlArgs : "v=1.0",
       
    // kick start application
    deps: ['app']
});
define(['datepicker','moment'], function(datepicker,moment) {
      window.datepicker = datepicker;
      window.moment = moment;
});
(function() {
    return (window)?window.htmlVersion="1.0":"";
})();