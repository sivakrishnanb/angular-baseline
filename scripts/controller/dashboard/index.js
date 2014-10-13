define(['app', 'model/dashboard/dashboard', 'jquery'], function (app, model, $) {
  app.controller('Dashboard', function ($scope, $bus, $dal, $constants, $service1, ngProgress, toaster) {

        /*var data = {
                    "message" : "New Message",
                    "name" : "New Name",
                    "age" : 42,
                    "dob" : "12/12/2014",
                    "designation" : "Manager"
                  }*/

                  $scope.model = new model(); 
                   
                  
                  $scope.bar = {
                    options : {
                        chart: {
                          type: 'discreteBarChart',
                          margin : {
                            top: 20,
                            right: 20,
                            bottom: 60,
                            left: 50
                          },
                          x: function(d){return d.label;},
                          y: function(d){return d.value;},
                          showValues: true,
                          staggerLabels :true,   //Too many bars and not enough room? Try staggering labels.
                          tooltips :true,      //Don't show tooltips
                          showValues : true,       //...instead, show the bar value right on top of each bar.
                          transitionDuration : 350
                        }
                    },

                    data : [ 
                    {
                      key: "Cumulative Return",
                      values: [
                      { 
                        "label" : "A Label" ,
                        "value" : 29.765957771107
                      } , 
                      { 
                        "label" : "B Label" , 
                        "value" : 0
                      } , 
                      { 
                        "label" : "C Label" , 
                        "value" : 32.807804682612
                      } , 
                      { 
                        "label" : "D Label" , 
                        "value" : 196.45946739256
                      } , 
                      { 
                        "label" : "E Label" ,
                        "value" : 0.19434030906893
                      } , 
                      { 
                        "label" : "F Label" , 
                        "value" : 98.079782601442
                      } , 
                      { 
                        "label" : "G Label" , 
                        "value" : 13.925743130903
                      } , 
                      { 
                        "label" : "H Label" , 
                        "value" : 5.1387322875705
                      }
                      ]
                    }
                    ]
          };

          $scope.pie = {
                    options : {
                        chart: {
                          type: 'pieChart',
                          height: 300,
                          margin : {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                          },
                          x: function(d){return d.label;},
                          y: function(d){return d.value;},
                          showValues: true,
                          showLabels: true,
                          staggerLabels :true,   //Too many bars and not enough room? Try staggering labels.
                          tooltips :true,      //Don't show tooltips
                          showValues : true,       //...instead, show the bar value right on top of each bar.
                          transitionDuration : 350,
                          donut :true,          //Turn on Donut mode. Makes pie chart look tasty!
                          donutRatio : 0.15,    //Configure how big you want the donut hole size to be.
                          pie: {   
                            startAngle: function (d) { return d.startAngle/2 -Math.PI/2 },
                            endAngle:function (d) { return d.endAngle/2 -Math.PI/2 }
                          },
                          showLegend : false 
                        }
                    },

                    data : [
                            { 
                              "label": "One",
                              "value" : 29.765957771107
                            } , 
                            { 
                              "label": "Two",
                              "value" : 0
                            } , 
                            { 
                              "label": "Three",
                              "value" : 32.807804682612
                            } , 
                            { 
                              "label": "Four",
                              "value" : 196.45946739256
                            } , 
                            { 
                              "label": "Five",
                              "value" : 0.19434030906893
                            } , 
                            { 
                              "label": "Six",
                              "value" : 98.079782601442
                            } , 
                            { 
                              "label": "Seven",
                              "value" : 13.925743130903
                            } , 
                            { 
                              "label": "Eight",
                              "value" : 5.1387322875705
                            }
                    ]
          };

          $scope.init = function() {
            /*toaster.pop("success", "text");
            toaster.pop("info", "title", "text");
            toaster.pop("error", "title", "text");
            toaster.pop("wait", "title", "text");
            toaster.pop("warning", "title", "text");*/
            $bus.fetch({name:'dashboard', api:'dashboard', params: null, data: null})
            .done(function(success){
              $scope.model = new model(success.response); 
              $scope.model.message = $service1.message;
              ngProgress.complete();

                //console.log(JSON.stringify($scope.model));
              }).fail(function(error){
                $scope.model = new model(); 
                //console.log(JSON.stringify($scope.model));
              });
            };

            $scope.myData = [{name: "Moroni", age: 50, designation : "Manager", dob :"dd/mm/yyyy", country : 'india' },
            {name: "Tiancum", age: 43, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Jacob", age: 27, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Nephi", age: 29, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Enos", age: 34, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Moroni", age: 50, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Tiancum", age: 43, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Jacob", age: 27, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Nephi", age: 29, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Enos", age: 34, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Moroni", age: 50, designation : "Manager", dob :"dd/mm/yyyy", country : 'india' },
            {name: "Tiancum", age: 43, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Jacob", age: 27, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Nephi", age: 29, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Enos", age: 34, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Moroni", age: 50, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Tiancum", age: 43, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Jacob", age: 27, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Nephi", age: 29, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'},
            {name: "Enos", age: 34, designation : "Manager", dob :"dd/mm/yyyy", country : 'india'}];
            $scope.gridOptions = { 
              data: 'myData',
              showGroupPanel: true
            /*enablePaging: true,
        showFooter: true,
        totalServerItems: $scope.myData.length,
        pagingOptions: {
        pageSizes: [2, 4, 15],
        pageSize: 2,
        currentPage: 1
    },
        filterOptions: {
        filterText: "",
        useExternalFilter: true
      }*/
    };

  });
}); 