define(['app'], function (app) {
  app.controller('Login', function ($scope, $bus, ngProgress, $location, $http, toaster) {
          $scope.init = function() {
            ngProgress.complete();
          };
          $scope.submit = function() {
            $bus.fetch({name:'auth', api:'auth', params: null, data: null})
            .done(function(success){
                $location.path('home');
            }).fail(function(error){
                toaster.pop("error", "Error in login");
            });
          };
  });
}); 