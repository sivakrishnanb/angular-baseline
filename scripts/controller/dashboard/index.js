define(['app', 'jquery', 'jquery-ui'], function (app, $) {
    app.controller('Dashboard',['$rootScope','$scope', '$bus', '$dal', '$constants', 'ngProgress','notify', '$http','$timeout','$routeParams', function ($rootScope,$scope, $bus, $dal, $constants, ngProgress,notify, $http,$timeout,$routeParams) {


        $scope.constants = $constants;
        $scope.dashBoardDateOptions = $constants.dashBoardDateOptions;

        $scope.dateOptionChanged = function(selectedOption) {

            // if($scope.selectedDateOption != selectedOption)
            //     firstTime = [];

            $scope.selectedDateOption = selectedOption;
            angular.forEach($scope.dashBoardDateOptions, function(option) {
                if (option.name == selectedOption.name) option.selected = true;
                else option.selected = false;
            });
            if ($scope.inboundRcvd)$scope.getQuickLook();
        };

        $scope.getMaxOrders = function(orders) {
            if(!orders) return $scope.maxOrders = 0;
            var maxCount = 0;
            angular.forEach(orders, function(order, $index){
                maxCount = (order[1] > maxCount) ? order[1]:maxCount;
            });
            $scope.maxOrders = maxCount;
        };

        $scope.getTopSellingClass = function(param){
            if(param && param < 6){
                return 'topsellunitsold-'+param;
            }else{
                return 'topsellunitsold-all';
            }
        }
        $scope.getAvgOrders = function() {

            if (!$scope.inboundRcvd) {
                return ($scope.qlOrdersCount / 30);
            }
            if ($scope.startDate && $scope.endDate){
                var daysDiff = ((new Date($scope.endDate)) - (new Date($scope.startDate))) / (1000*60*60*24);
                return (!$scope.qlOrdersCount || !daysDiff) ? 0 : ($scope.qlOrdersCount / daysDiff).toFixed(2);
            }
            else return 0;
        };

        $scope.formatStringDate = function (date) {
            var month_names     = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var dd = date.getDate();
            var mmm = month_names[date.getMonth() + 1]; //January is 0!
            var yyyy = date.getFullYear();
            return dd + ' ' + mmm + ' ' + yyyy;
        };
        $scope.setSalesBetween = function() {
            //18 July 2014 to 19 July 2014

            var sDate = new Date($scope.startDate);
            var eDate = new Date($scope.endDate);
            eDate.setDate(eDate.getDate()-1);
            if ($scope.selectedDateOption.value == '1d' || $scope.selectedDateOption.value == '-1d') {
                $scope.salesBetween = $scope.formatStringDate(sDate);
            }
            else $scope.salesBetween = $scope.formatStringDate(sDate) + ' to '+$scope.formatStringDate(eDate);

        };

        $scope.getAveOrderValue = function (retailValue, ordersCount) {
            if (retailValue == 0 || retailValue == "0" || ordersCount == 0 || ordersCount == '0') return 0;
            return (retailValue/ordersCount).toFixed(2);
        }

        $scope.getMaxIndexLine = function(series){
            var maxVal = 0, indexVal = 0;
            angular.forEach(series, function(data, index){
                if(maxVal < data.y) {
                    maxVal = data.y;
                    indexVal = index;
                }
            });
            return indexVal;
        };
        $scope.getMinIndexLine= function(series){
            var minVal, indexVal = 0;
            angular.forEach(series, function(data, index){
                if (index == 0) minVal = data.y;
                if(minVal > data.y) {
                    minVal = data.y;
                    indexVal = index;
                }
            });
            return indexVal;
        };

        $scope.populateProdLineChart= function() {

            //$scope.prodAggrData = [];
            var prodData = [];

            if (!$scope.inboundRcvd) {
                angular.forEach($scope.barSampleData, function(prod, $index){
                    

                    prodData.push({x: Date.UTC( new Date(prod[0]).getFullYear() , (new Date(prod[0]).getMonth()), new Date(prod[0]).getDate()   )           , y:prod[1]});
                });
            }
            else {
                if (!$scope.prodAggrData){
                    $scope.prodAggrData = [];
                    return;
                }
                angular.forEach($scope.prodAggrData, function(prod, $index){


                    prodData.push({x: Date.UTC( new Date(prod[0]).getFullYear() , (new Date(prod[0]).getMonth()), new Date(prod[0]).getDate()   ), y:prod[1]});
                });
            }
            //$scope.lineChartHC.series[0].setData(prodData);

            if (prodData.length >= 2) {
                var maxIndx = $scope.getMaxIndexLine(prodData);
                var minIndx = $scope.getMinIndexLine(prodData);

                prodData[maxIndx] = {x:prodData[maxIndx].x, y:prodData[maxIndx].y, color:'#ff6c60'};
                prodData[minIndx] = {x:prodData[minIndx].x, y:prodData[minIndx].y, color:'#F8D347'};
            }

            $scope.prodLineProdData = prodData;
            $scope.lineChartHC.series[0].remove();
            $scope.lineChartHC.addSeries({ lineWidth: 1,color: '#fff',data:prodData});
            //Line chart data should be sent as an array of series objects.
            /*$scope.prodAggrData = [
             {
             values: prodData,
             key: '',
             color: '#fff',
             width: '10px'
             }
             ];*/
        };



        $scope.populateProdLineChartScrollIn = function() {
            
            if(!_.isEmpty($scope.prodLineProdData)) {
                $scope.lineChartHC.series[0].remove();
                $scope.lineChartHC.addSeries({ lineWidth: 1,color: '#fff',data:$scope.prodLineProdData});    
            }else{
                $scope.populateProdLineChart('$');
            }
            
           
        };

        Highcharts.setOptions({
            colors: ['#F8D347', '#EF6F66', '#41CAC0', '#A8D76F', '#8075C4']
        });

        $scope.lineChartHC =  new Highcharts.Chart({
            chart: {
                zoomType: 'x',
                resetZoomButton: {
                    theme: {
                        fill: '#455a64',
                        stroke: 'silver',
                        style: {
                            color: 'white'
                        },
                        r: 0,
                        states: {
                            hover: {
                                fill: '#455a64',
                                style: {
                                    color: 'white'
                                }
                            }
                        }
                    },
                    position: {
                        x: -10,
                        y: -10
                    }
                },
                renderTo: 'line-chart',
                height: 220,
                backgroundColor: '#41cac0',
                type: 'line'
            },
            credits: {
                enabled: false
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'normal',
                    fontSize: '17px',
                    'font-family': 'open_sansregular',
                    'color': '#797979'
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            tooltip: {


                formatter: function () {
                      return this.y + ' <b>Products Sold</b><br/>' + 'On ' +  Highcharts.dateFormat('%e - %b',new Date(this.x));
                },
                shared: true,
                crosshairs: true,
                crosshairs: {
                    width: 0.5,
                    color: '#fff'
                },
                borderColor:'#fff',
                borderWidth:1,
                backgroundColor:'#333',
                shape:'square',
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px',
                    opacity:.9
                }
            },
            plotOptions: {
                line: {
                    showInLegend: false
                },
                series: {
                    animation: {
                        duration: 2000
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    //
                    marker: {
                        radius: 3,
                        symbol: 'circle'
                    }
                }
            },
            xAxis: {
                tickWidth:0,
                lineWidth: 0,
                gridLineWidth: .4,
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e-%b',
                    week: '%e-%b',
                    month: '%b-%y',
                    year: '%Y'
                }
            },
            yAxis: {
                gridLineWidth: 0,
                tickInterval:1,
                min:1,
                title: {
                    text: 'Units'
                }

            },
            series: [{
                data: [],
                lineWidth: 1,
                color: '#fff'
            }]
        });

        $scope.areaChartHC = new Highcharts.Chart({

            chart: {
                zoomType: 'x',
                resetZoomButton: {
                    theme: {
                        fill: '#455a64',
                        stroke: 'silver',
                        style: {
                            color: 'white'
                        },
                        r: 0,
                        states: {
                            hover: {
                                fill: '#455a64',
                                style: {
                                    color: 'white'
                                }
                            }
                        }
                    },
                    position: {
                        x: -10,
                        y: -10
                    }
                },
                renderTo:'area-chart',
                backgroundColor:null,
                height:330,
                type: 'area'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
     

            xAxis: {
                allowDecimals: false,
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    day: '%e-%b',
                    week: '%e-%b',
                    month: '%b-%y',
                    year: '%Y'
                },
                tickWidth:0
                //tickInterval:24 * 3600 * 1000 * 12
                //tickInterval:3600 * 1000 * 6


/*                labels: {
                     dateTimeLabelFormat : '%e-%b',
                    formatter: function () {
                        
                       console.log(this);
                      return this.value; // clean, unformatted number for year
                        
                    }
                }*/
            },
            yAxis: {
                title: {
                    text: 'Cubic Meters (cbm)'
                },
                min:0,
                tickInterval:10
            },
            tooltip: {
                 formatter: function() {
                      return  (this.y).toFixed(2) + ' <b>(cbm) Used</b><br/>' + 'On ' +  Highcharts.dateFormat('%e - %b',new Date(this.x)) + '<br/>';
                },
                borderColor:'#fff',
                borderWidth:1,
                backgroundColor:'#333',
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px',
                    opacity:.9
                }
            },
            plotOptions: {
                area: {

                    states: {
                        hover: {
                            enabled: false
                        }
                    },

                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius:3,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    },
                    showInLegend: false
                },
                series: {
                    fillOpacity: 0.2,
                    animation: {
                        duration: 2000
                    }
                }
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'normal',
                    fontSize: '17px',
                    'font-family': 'open_sansregular',
                    'color': '#797979'
                }
            },
            series: [{
                name: '',
                color:'#9ACAE6',
                lineWidth: 2,
                data: []
            }]
        });

        $scope.populateStorageUsed = function(type) {

            $scope.storageSortByDollar = (type == '$');
            $scope.stackAreaData = [];
            var values = [];

            if (!$scope.inboundRcvd) {
                angular.forEach($scope.barSampleData, function(prod, $index){
                    values.push([ Date.UTC( new Date(prod[0]).getFullYear() , (new Date(prod[0]).getMonth()), new Date(prod[0]).getDate()   )  , prod[1] ]);
                });
            }
            else {
                if (!$scope.areaChartData) {
                    $scope.stackAreaData = [];
                    return;
                }
                angular.forEach($scope.areaChartData, function(doc){
                    //values.push([new Date(doc.createdDate), (type == '$') ? doc.totalStorageVol : doc.totalInventory]);
                    values.push([ Date.UTC( new Date(doc.createdDate).getFullYear() , (new Date(doc.createdDate).getMonth()), new Date(doc.createdDate).getDate()   )  , (type == '$') ? doc.totalStorageVol : doc.totalInventory ]);
                });
            }
            //$scope.areaChartHC.series[0].setData(values);
            var avgLine = $scope.getAvgLine(values);

            $scope.populateStorageUsedData = values;
            $scope.areaChartHC.series[0].remove();
            $scope.areaChartHC.yAxis[0].removePlotLine();
            $scope.areaChartHC.addSeries({ name: '',color:'#9ACAE6',lineWidth: 2,data:values});
            if (values && values[0] && values[0][0] && values[values.length-1] && values[values.length-1][0]) {

                $scope.areaChartHC.yAxis[0].addPlotLine({
                        color: 'red',
                        value:avgLine,
                        width: '1',
                        zIndex: 3,

                    tooltipText: 'Average : ' + avgLine.toFixed(2) + ' Between '+ Highcharts.dateFormat('%e - %b',new Date(values[0][0])) + ' to ' + Highcharts.dateFormat('%e - %b',new Date(values[values.length-1][0])),
                    dashStyle: 'solid',
                    events: {
                        mouseover: function (e) {
                            $scope.areaChartHC.tooltip.hide();
                            $scope.displayTooltip('area', this.options.tooltipText, e.layerX, e.layerY);
                        },
                        mouseout: function(e) {
                            $scope.hideTooltip();
                        }
                    },
                });
            }
            /*$scope.stackAreaData = [{
             key:"Storage",
             values:values,
             color:'#f5f5f5'
             }];*/
        };


        $scope.populateStorageUsedScrollIn = function() {

           if(!_.isEmpty($scope.populateStorageUsedData)) {
                $scope.areaChartHC.series[0].remove();
                $scope.areaChartHC.addSeries({ name: '',color:'#9ACAE6',lineWidth: 2,data:$scope.populateStorageUsedData});
           }else{
                $scope.populateStorageUsed('$');
           }
            
        };

        $scope.populateDeliveryMethod = function (type) {
            $scope.delMethSortByDollar = (type == '$');
            $scope.deliveryMethodsChart = [];

            if (!$scope.inboundRcvd) {
                var sampleData = $rootScope.isCountriesOptionsVisible('pieChart') ? $scope.deliverySampleDataAU : $scope.deliverySampleData;
                angular.forEach(sampleData, function(value, key){
                    var data = {
                        name: key,
                        y: (type == '#') ? value.count : value.sum
                    };
                    $scope.deliveryMethodsChart.push(data);
                });
            }
            else {
                angular.forEach($scope.deliveryMethods, function(value, key){
                    if (key) {
                        var data = {
                            name: key[0].toUpperCase() + key.slice(1),
                            y: (type == '#') ? value.count : value.sum
                        };
                        $scope.deliveryMethodsChart.push(data);
                    }
                });
            }
            //$scope.pieDeliveryHC.series[0].setData($scope.deliveryMethodsChart);
            $scope.pieDeliveryHC.series[0].remove();
            $scope.pieDeliveryHC.addSeries({type:'pie',data:$scope.deliveryMethodsChart});
        };

        $scope.populateDeliveryMethodScrollIn = function (type) {
            
            if(!_.isEmpty($scope.deliveryMethodsChart)) {
                $scope.pieDeliveryHC.series[0].remove();
                $scope.pieDeliveryHC.addSeries({type:'pie',data:$scope.deliveryMethodsChart});    
            }else{
                $scope.populateDeliveryMethod('$');
            }
            
        };



        $scope.barChartHC = new Highcharts.Chart({
            chart: {
                renderTo: 'bar-chart',
                backgroundColor:'#f1f2f7',
                height:300,
                type: 'column',
                events: {
                    load: function () {
                        var MaximumBarWidth = 60;
                        var series          = this.series[0];
                        if (series.data.length) {
                            if (series.data[0].barX  >  MaximumBarWidth) {
                                series.options.pointWidth = MaximumBarWidth;
                                this.setSize ();
                            }
                        }
                    }
                }
            },
	    lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'normal',
                    fontSize: '17px',
                    'font-family': 'open_sansregular',
                    'color': '#797979'
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                tickWidth: 0,
                dateTimeLabelFormats: { // don't display the dummy year
                    day: '%e-%b',
                    week: '%e-%b',
                    month: '%b-%y',
                    year: '%Y'
                }
            },
            yAxis: {
                min: 0,
                tickInterval:10,
                gridLineDashStyle: 'Dash',
                title: {
                    text: 'Units'
                }
            },
            tooltip: {
                formatter: function() {
                      return  this.y + ' <b>Orders</b><br/>' +  'On ' + Highcharts.dateFormat('%e - %b',new Date(this.x));
                },
                borderColor:'#fff',
                borderWidth:1,
                backgroundColor:'#333',
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px',
                    opacity:.9
                }
            },

            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    showInLegend: false,
                    borderRadius: 5,
                    states: {
                        hover: {
                            color: '#FF6C60'
                        }
                    }
                },
                series: {
                    animation: {
                        duration: 2000,
                        easing: 'easeOutBounce'
                    }
                }
            },
            series: [{
                color: '#bfc2cd',
                data: []

            }]
        });


        $scope.getAvgLine = function(series) {
            var total = 0, count = 0;
            angular.forEach(series, function(data){
                total += data[1];
                count ++;
            })
            return total/count;
        };

        $scope.getMaxYindex = function(series){
            var maxVal = 0, indexVal = 0;
            angular.forEach(series, function(data, index){
                if(maxVal < data[1]) {
                    maxVal = data[1];
                    indexVal = index;
                }
            });
            return indexVal;
        };
        $scope.getMinYindex = function(series){
            var minVal, indexVal = 0;
            angular.forEach(series, function(data, index){
                if (index == 0) minVal = data[1];
                if(minVal > data[1]) {
                    minVal = data[1];
                    indexVal = index;
                }
            });
            return indexVal;
        };

        var $avgTooltiBbar = $('#tooltip-bar');
        var $avgTooltipArea = $('#tooltip-area');
        $avgTooltiBbar.hide();
        $avgTooltipArea.hide();

        $scope.displayTooltip = function (chartType, text, left, top) {
            var $text;
            $scope.isAvgLineTooltipVisible = true;
            if (chartType == 'bar') {
                $text = $('#tooltiptext-bar');
                $text.text(text);
                $avgTooltiBbar.show();
                var x = (($('#bar-chart').width() - 300) > parseInt(left)) ? parseInt(left) : $('#bar-chart').width() - 300;
                $avgTooltiBbar.css('left', x + 24 + 'px');
                $avgTooltiBbar.css('top', parseInt(top) + 27 + 'px');
            }
            else {
                $text = $('#tooltiptext-area');
                $text.text(text);
                $avgTooltipArea.show();
                $avgTooltipArea.css('left', x + 24 + 'px');
                var x = (($('#area-chart').width() - 300) > parseInt(left)) ? parseInt(left) : $('#area-chart').width() - 300;
                $avgTooltipArea.css('left', x + 24 + 'px');
                $avgTooltipArea.css('top', parseInt(top) + 32 + 'px');
            }
            $scope.$apply();
        };
        var timer;
        $scope.hideTooltip = function (e) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                $avgTooltiBbar.fadeOut();
                $avgTooltipArea.fadeOut();
                $scope.isAvgLineTooltipVisible = false;
            }, 400);
        };

        $scope.populateBarChart = function() {
            $scope.orderAggrDataChart = [];
            var orderData = [];

            if (!$scope.inboundRcvd) {
                angular.forEach($scope.barSampleData, function(order, $index){
                     var dt = Date.UTC( new Date(order[0]).getFullYear() , (new Date(order[0]).getMonth()), new Date(order[0]).getDate()   )

                    //var dateString = dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();
                    temp = [];
                    temp.push(dt);
                    temp.push(order[1]);

                    orderData.push(temp);
                });
            }
            else {
                if(!$scope.orderAggrData){
                    $scope.orderAggrDataChart = [];
                    return;
                }

                angular.forEach($scope.orderAggrData, function(order, $index) {
                    var dt = Date.UTC( new Date(order[0]).getFullYear() , (new Date(order[0]).getMonth()), new Date(order[0]).getDate());
                    //var dateString = dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();
                    temp = [];
                    temp.push(dt);
                    temp.push(order[1]);

                    orderData.push(temp);
                });

            }

            var avgLine = $scope.getAvgLine(orderData);
            if (orderData.length >= 2) {
                var maxIndx = $scope.getMaxYindex(orderData);
                var minIndx = $scope.getMinYindex(orderData);

                orderData[maxIndx] = {x:orderData[maxIndx][0], y:orderData[maxIndx][1], color:'#41CAC0', hover:'#fff'};
                orderData[minIndx] = {x:orderData[minIndx][0], y:orderData[minIndx][1], color:'#F8D347'};
            }

            $scope.orderDataScrollIn = orderData;

            $scope.barChartHC.series[0].remove();
            $scope.barChartHC.yAxis[0].removePlotLine();
            $scope.barChartHC.addSeries({color: '#bfc2cd',data:orderData, hover:'#FF6C60'});

            if (orderData && orderData[0] && orderData[orderData.length-1] && orderData[orderData.length-1][0]) {

                $scope.barChartHC.yAxis[0].addPlotLine(
                    {
                        color: 'red',
                        value: avgLine,
                        width: '1',
                        zIndex: 3,

                    tooltipText: 'Average : ' + avgLine.toFixed(2) + ' Between '+ Highcharts.dateFormat('%e - %b',new Date(orderData[1][0])) + ' to ' + Highcharts.dateFormat('%e - %b',new Date(orderData[orderData.length-1][0])),
                    dashStyle: 'solid',
                    events: {
                        mouseover: function (e) {
                            $scope.barChartHC.tooltip.hide();
                            $scope.displayTooltip('bar', this.options.tooltipText, e.layerX, e.layerY);
                        },
                        mouseout: function(e) {
                            $scope.hideTooltip();
                        }

                    }

                    });
            }
        };



        $scope.populateBarChartScrollIn = function() {
           
            if(!_.isEmpty($scope.orderDataScrollIn)){
                $scope.barChartHC.series[0].remove();
                $scope.barChartHC.addSeries({color: '#bfc2cd',data:$scope.orderDataScrollIn});    
            }else{
                $scope.populateBarChart('$');
            }

        };

        $scope.pieChannelHC = new Highcharts.Chart({
            chart: {
                renderTo: 'pie-chart-channel',
                backgroundColor: null,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'normal',
                    fontSize: '17px',
                    'font-family': 'open_sansregular',
                    'color': '#797979'
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip :{
                formatter: function () {
                    var text = '';
                    if($scope.pieSortByDollar == true) {
                        text = '<b>' +  this.key +'</b><br/>' + "$ " + this.y
                    } else {
                        text = '<b>' +  this.key +'</b><br/>' + this.y
                    }
                    return text;
                },
                useHTML: true,
                borderColor:'#fff',
                borderWidth:1,
                backgroundColor:'#333',
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px',
                    opacity:.9
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false,
                    states: {
                        hover: {
                            brightness:.2
                        }
                    },
                    colors: ['#F8D347', '#8075C4', '#A8D76F', '#EF6F66', '#41CAC0']
                },
                series: {
                    animation: {
                        duration: 2000,
                        easing: 'easeOutBounce'
                    }
                }
            },
            series: [{
                type: 'pie',
                data: []
            }]
        });

        $scope.pieShipmentHC = new Highcharts.Chart({
            chart: {
                renderTo: 'pie-chart-shipment',
                backgroundColor: null,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'normal',
                    fontSize: '17px',
                    'font-family': 'open_sansregular',
                    'color': '#797979'
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip :{
                formatter: function () {
                    var text = '';
                    if($scope.pieSortByDollar == true) {
                        text = '<b>' +  this.key +'</b><br/>' + "$ " + this.y
                    } else{
                        text = '<b>' +  this.key +'</b><br/>' + this.y
                    }
                    return text;
                },
                pointFormat: '{this.y:,.1f}',
                useHTML: true,
                borderColor:'#fff',
                borderWidth:1,
                backgroundColor:'#333',
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px',
                    opacity:.9
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false,
                    states: {
                        hover: {
                            brightness:.2
                        }
                    },
                    colors: ['#A8D76F', '#8075C4', '#F8D347', '#EF6F66', '#41CAC0']
                },
                series: {
                    animation: {
                        duration: 2000,
                        easing: 'easeOutBounce'
                    }
                }
            },
            series: [{
                type: 'pie',
                data: []
            }]
        });

        $scope.pieDeliveryHC = new Highcharts.Chart({
            chart: {
                type: 'pie',
                renderTo: 'pie-chart-delivery',
                marginTop: 10,
                height:340,
                backgroundColor: null,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'normal',
                    fontSize: '17px',
                    'font-family': 'open_sansregular',
                    'color': '#797979'
                }
            },
             credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip :{
                formatter: function () {
                    var text = '';
                    if($scope.delMethSortByDollar == true) {
                        text = '<b>' +  this.key +'</b><br/>' + "$ " + this.y
                    } else {
                        text = '<b>' +  this.key +'</b><br/>' + this.y
                    }
                    return text;
                },
                useHTML: true,
                borderColor:'#fff',
                borderWidth:1,
                backgroundColor:'#333',
                style: {
                    color: '#fff',
                    fontSize: '12px',
                    padding: '8px',
                    opacity:.9
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    innerSize: 100,
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: false,
                    states: {
                        hover: {
                            brightness:.2
                        }
                    },
                    colors: ['#EF6F66', '#F8D347', '#41CAC0', '#A8D76F', '#8075C4']
                },
                series: {
                    animation: {
                        duration: 2000,
                        easing: 'easeOutBounce'
                    }
                }
            },
            series: [{
                type: 'pie',
                data: []
            }]
        });

        $scope.togglePieChart = function (val) {

            $scope.pieSortByDollar = (val == '$');
            $scope.pieShipmentData = [];
            $scope.pieChannelData  = [];

            if (!$scope.inboundRcvd) {
                angular.forEach($scope.channelSampleData, function(value, key){
                    var data = {
                        name: key,
                        y: (val == '#') ? value.count : value.sum
                    };
                    $scope.pieChannelData.push(data);

                });

                var shipSampleData = $rootScope.isCountriesOptionsVisible('pieChart') ? $scope.shipmentSampleDataAU : $scope.shipmentSampleData;
                angular.forEach(shipSampleData, function(value, key){
                    var data = {
                        name: key,
                        y: (val == '#') ? value.count : value.sum
                    };
                    $scope.pieShipmentData.push(data);
                });
            }
            else {
                if (!$scope.d3ShipmentType) $scope.pieShipmentData = [];
                if (!$scope.d3Channel)       $scope.pieChannelData = [];


                //shipment type
                angular.forEach($scope.d3ShipmentType, function(value, key){
                    var data = {
                        name: (key == 'd') ? 'Domestic' : 'International',
                        y: (val == '#') ? value.count : value.sum
                    };
                    $scope.pieShipmentData.push(data);
                });

                //Channel
                angular.forEach($scope.d3Channel, function(value, key){
                    var data = {
                        name: key[0].toUpperCase() + key.slice(1),
                        y: (val == '#') ? value.count :     value.sum
                    };
                    $scope.pieChannelData.push(data);
                });
            }
            /*$scope.pieChannelHC.series[0].setData($scope.pieChannelData);
            $scope.pieShipmentHC.series[0].setData($scope.pieShipmentData);*/
            $scope.pieChannelHC.series[0].remove();
            $scope.pieChannelHC.addSeries({type:'pie',data:$scope.pieChannelData});
            $scope.pieShipmentHC.series[0].remove();
            $scope.pieShipmentHC.addSeries({type:'pie',data:$scope.pieShipmentData});

        };

        $scope.togglePieChartScrollIn = function () {
            
            if(!_.isEmpty($scope.pieChannelData) && !_.isEmpty($scope.pieShipmentData)){
                $scope.pieChannelHC.series[0].remove();
                $scope.pieChannelHC.addSeries({type:'pie',data:$scope.pieChannelData});
                $scope.pieShipmentHC.series[0].remove();
                $scope.pieShipmentHC.addSeries({type:'pie',data:$scope.pieShipmentData});
            }else{
                $scope.togglePieChart('$');
            }

        };

        $scope.getTopCountries = function(list, val) {

            var topCountries = [], count = 0;
            var tempList = angular.copy(list);
            while (!jQuery.isEmptyObject(tempList) && count < 3) {
                var max = 0, indexVal = 0;
                angular.forEach(tempList, function(item, index) {
                    if (item.count > max) {
                        max = item.count;
                        indexVal = index;
                    }
                });
                topCountries.push([$scope.parseCountryName(indexVal), (val == '$')? tempList[indexVal].sum : tempList[indexVal].count]);
                delete tempList[indexVal];
                count++;
            }
            $scope.topCountries = topCountries;
        };

        $scope.populateGeoChart = function(val) {
            $scope.geoSortByDollar = (val == '$');
            $scope.geoLocations = [];
            $scope.geoLocations.push(['Country', '']);

            if (!$scope.inboundRcvd) {
                angular.forEach($scope.geoSampleData, function(value, key){
                    $scope.geoLocations.push([$scope.parseCountryName(key),(val=='#') ? value.count : value.sum]);

                });
                $scope.getTopCountries($scope.geoSampleData, val);
            }
            else {
                if ($scope.geoChartData) {
                    angular.forEach($scope.geoChartData, function(value, key){
                        $scope.geoLocations.push([$scope.parseCountryName(key),(val=='#') ? value.count : value.sum]);

                    });
                    $scope.getTopCountries($scope.geoChartData, val);
                }
            }
        };

        $scope.getQuickLook = function() {
            ngProgress.start();

            //fetch d1
            $bus.fetch({
                name: 'quicklook',
                api: 'quicklook',
                params: {path:'d1', period:$scope.selectedDateOption.value},
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {
                        $scope.qlProductsSold = (success.response.data.response) ? success.response.data.response.numFound : '0';
                        $scope.qlUnitsSold    = (success.response.data && success.response.data.stats &&
                        success.response.data.stats.stats_fields &&
                        success.response.data.stats.stats_fields.quantity &&
                        success.response.data.stats.stats_fields.quantity.sum) ? success.response.data.stats.stats_fields.quantity.sum : '0';

                    } else {

                        $scope.qlProductsSold = '0';
                        $scope.qlUnitsSold    = '0';

                        var errors = [];
                        _.forEach(success.response.errors, function (error) {errors.push(error)});
                        if (errors.length) {
                            //notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            //notify.message(messages.productListFetchError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    //notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });

            //fetch d2- Top selling products
            $bus.fetch({
                name: 'quicklook',
                api: 'quicklook',
                params: {path:'d2', period:$scope.selectedDateOption.value},
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {
                        var d2Response = success.response.data;
                        $scope.topSellingProds = [];
                        if (d2Response && d2Response.grouped && d2Response.grouped.ezcSku && d2Response.grouped.ezcSku.groups) {
                            angular.forEach(d2Response.grouped.ezcSku.groups, function(group){
                                var prodName = '', sku = '', sold = '';

                                if (d2Response.grouped.ezcSku.groups[0] && d2Response.grouped.ezcSku.groups[0].doclist) {

                                    sold = group.doclist.numFound;
                                }

                                if (d2Response.grouped.ezcSku.groups[0] && d2Response.grouped.ezcSku.groups[0].doclist &&
                                    d2Response.grouped.ezcSku.groups[0].doclist.docs && d2Response.grouped.ezcSku.groups[0].doclist.docs[0]) {
                                    prodName = group.doclist.docs[0].productName;
                                    sku      = group.doclist.docs[0].ezcSku;
                                }
                                var tempModel = {
                                    prodName:prodName,
                                    SKU:sku,
                                    sold:sold
                                };
                                $scope.topSellingProds.push(tempModel);
                            });
                        }

                    } else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {errors.push(error)});
                        if (errors.length) {
                            //notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            //notify.message(messages.productListFetchError);
                        }
                    }
                    ngProgress.complete();

                }).fail(function (error) {
                    //notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });

            //fetch d3
            $bus.fetch({
                name: 'quicklook',
                api: 'quicklook',
                params: {path:'d3', period:$scope.selectedDateOption.value},
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length) {

                        var d3Response = success.response.data;

                        if (d3Response && d3Response.stats && d3Response.stats.stats_fields && d3Response.stats.stats_fields.retailLineTotal) {
                            $scope.qlOrdersCount = d3Response.stats.stats_fields.retailLineTotal.count;
                            $scope.qlRetailValue = d3Response.stats.stats_fields.retailLineTotal.sum;

                            if (d3Response.stats.stats_fields.retailLineTotal.facets && d3Response.stats.stats_fields.retailLineTotal.facets.shipmentType) {
                                $scope.d3ShipmentType = d3Response.stats.stats_fields.retailLineTotal.facets.shipmentType;
                            }

                            if (d3Response.stats.stats_fields.retailLineTotal.facets && d3Response.stats.stats_fields.retailLineTotal.facets.channel) {
                                $scope.d3Channel = d3Response.stats.stats_fields.retailLineTotal.facets.channel;
                            }

                            if (d3Response.stats.stats_fields.retailLineTotal.facets && d3Response.stats.stats_fields.retailLineTotal.facets.carrierMethodName) {
                                $scope.deliveryMethods = d3Response.stats.stats_fields.retailLineTotal.facets.carrierMethodName;
                            }
                        }
                        else {
                            $scope.qlOrdersCount = 0;
                            $scope.qlRetailValue = 0;
                            $scope.d3ShipmentType = [];
                            $scope.d3Channel = [];
                            $scope.deliveryMethods = [];
                        }
                    } else {
                        $scope.qlOrdersCount = 0;
                        $scope.qlRetailValue = 0;
                        $scope.d3ShipmentType = [];
                        $scope.d3Channel = [];
                        $scope.deliveryMethods = [];

                        var errors = [];
                        _.forEach(success.response.errors, function (error) {errors.push(error)});
                        if (errors.length) {
                            //notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            //notify.message(messages.productListFetchError);
                        }
                    }
                    //populate Pie Chart
                    $scope.togglePieChart('$');

                    //Populate carrier method bar chart
                    $scope.populateDeliveryMethod('$')
                    ngProgress.complete();

                }).fail(function (error) {
                    $scope.togglePieChart('$');
                    $scope.populateDeliveryMethod('$')

                    //notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });

            //fetch d4
            $bus.fetch({
                name: 'quicklook',
                api: 'quicklook',
                params: {path:'d4', period:$scope.selectedDateOption.value},
                data: null
            })
                .done(function (success) {
                    if (success.response && success.response.success.length) {
                        if (success.response.data) {
                            var d4Response = success.response.data;
                            if (d4Response && d4Response.facetCounts && d4Response.facetCounts.facet_ranges &&
                                d4Response.facetCounts.facet_ranges.createdDate && d4Response.facetCounts.facet_ranges.createdDate.counts) {
                                $scope.prodAggrData = d4Response.facetCounts.facet_ranges.createdDate.counts;
                            }
                        }

                    }
                    else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {errors.push(error)});
                        if (errors.length) {
                            //notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            //notify.message(messages.productListFetchError);
                        }
                    }
                    ngProgress.complete();
                    $scope.populateProdLineChart();

                    })
                .fail(function (error) {
                        //notify.message(messages.productListFetchError);
                        ngProgress.complete();
                        $scope.populateProdLineChart();
                });

            //fetch d5
            $bus.fetch({
                name: 'quicklook',
                api: 'quicklook',
                params: {path:'d5', period:$scope.selectedDateOption.value},
                data: null
            })
                .done(function (success) {
                    if (success.response && success.response.success.length) {

                        $scope.startDate = '';
                        $scope.endDate = '';

                        if (success.response.data) {
                            var d5Response = success.response.data;
                            if (d5Response && d5Response.facetCounts && d5Response.facetCounts.facet_ranges && d5Response.facetCounts.facet_ranges.createdDate &&
                                d5Response.facetCounts.facet_ranges.createdDate.counts){
                                $scope.orderAggrData = d5Response.facetCounts.facet_ranges.createdDate.counts;
                                $scope.startDate = d5Response.facetCounts.facet_ranges.createdDate.start;
                                $scope.endDate = d5Response.facetCounts.facet_ranges.createdDate.end;
                            }
                        }
                        $scope.getMaxOrders($scope.orderAggrData);
                        $scope.setSalesBetween();


                    }
                    else {
                        $scope.startDate = '';
                        $scope.endDate = '';

                        var errors = [];
                        _.forEach(success.response.errors, function (error) {errors.push(error)});
                        if (errors.length) {
                            //notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            //notify.message(messages.productListFetchError);
                        }
                    }
                    $scope.populateBarChart();
                    ngProgress.complete();

                })
                .fail(function (error) {
                    //notify.message(messages.productListFetchError);
                    $scope.startDate = '';
                    $scope.endDate = '';
                    $scope.populateBarChart();
                    ngProgress.complete();
                });

        //fetch d6 - GEO Chart
        $bus.fetch({
            name: 'quicklook',
            api: 'quicklook',
            params: {path:'d6', period:$scope.selectedDateOption.value},
            data: null
        })
            .done(function (success) {

                if (success.response && success.response.success.length) {

                    var d6Response = success.response.data;
                    if (d6Response && d6Response.stats && d6Response.stats.stats_fields && d6Response.stats.stats_fields.retailLineTotal &&
                        d6Response.stats.stats_fields.retailLineTotal.facets && d6Response.stats.stats_fields.retailLineTotal.facets.shipCountry) {
                        $scope.geoChartData = d6Response.stats.stats_fields.retailLineTotal.facets.shipCountry;
                    }
                }
                else {
                    $scope.geoChartData = [];
                    var errors = [];
                    _.forEach(success.response.errors, function (error) {errors.push(error)});
                    if (errors.length) {
                        //notify.message($rootScope.pushJoinedMessages(errors));
                    } else {
                        //notify.message(messages.productListFetchError);
                    }
                }
                $scope.populateGeoChart('$');
                ngProgress.complete();

            }).fail(function (error) {
                $scope.populateGeoChart('$');
                //notify.message(messages.productListFetchError);
                ngProgress.complete();
            });

            //fetch 7 - Area Chart (Storage Used)
            $bus.fetch({
                name: 'quicklook',
                api: 'quicklook',
                params: {path:'d7', period:$scope.selectedDateOption.value},
                data: null
            })
                .done(function (success) {

                    if (success.response && success.response.success.length && success.response.data.response && success.response.data.response.docs) {

                        $scope.areaChartData = success.response.data.response.docs;
                        /*var d7Response = success.response.data;
                        if (d7Response && d7Response.stats && d7Response.stats.stats_fields && d7Response.stats.stats_fields.totalCbm &&
                            d7Response.stats.stats_fields.totalCbm.facets && d7Response.stats.stats_fields.totalCbm.facets.dateTime) {
                            $scope.areaChartData = d7Response.stats.stats_fields.totalCbm.facets.dateTime;
                        }*/
                    }
                    else {
                        var errors = [];
                        _.forEach(success.response.errors, function (error) {errors.push(error)});
                        if (errors.length) {
                            //notify.message($rootScope.pushJoinedMessages(errors));
                        } else {
                            //notify.message(messages.productListFetchError);
                        }
                    }
                    $scope.populateStorageUsed('$');
                    ngProgress.complete();

                }).fail(function (error) {
                    $scope.populateStorageUsed('$');
                    //notify.message(messages.productListFetchError);
                    ngProgress.complete();
                });
        };


        $scope.getCountryList = function () {
            $scope.countryList = [];
            var url = $constants.baseUrl + "/content/country.json";
            $http({method: 'get', url: url, params : null, data: null,  cache: false}).
                success(function(data, status, headers, config) {
                    angular.forEach(data, function(item){
                        $scope.countryList.push(item);
                    }) ;
                }).
                error(function(data, status, headers, config) {

                });
        };

        $scope.parseCountryName = function (countryCode) {
            if (!countryCode) return "";
            for (var index = 0; index < $scope.countryList.length; index++) {
                if ($scope.countryList[index].countryCode.toUpperCase() == countryCode.toUpperCase()) return $scope.countryList[index].countryName;
            }
        };

        $scope.toggleDatePicker = function() {
            $scope.rangepicker;
            $scope.isRangepickerShowing = !$scope.isRangepickerShowing;
            if (!$scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.hide();
            else if ($scope.isRangepickerShowing && $scope.rangepicker) $scope.rangepicker.show();

            $scope.rangepicker =  $('.input-daterange').datepicker({
                todayHighlight: true,
                endDate:new Date()
            }).on('changeDate', function (ev) {
                $scope.startDate = $('#date-range-from').datepicker('getDate');
                $scope.endDate   = $('#date-range-to').datepicker('getDate');
                if ($scope.endDate == "Invalid Date") $scope.endDate = $scope.startDate;
                $scope.setSalesBetween();
                $scope.$apply();

            });

        };

        $scope.getAnnouncements = function() {
          
          var deferred = $.Deferred();

            $bus.fetch({
                name: 'announcements',
                api: 'announcements',
                params : null
            })
            .done(function (success) {

                var announcements = [];

                if (success.response) {
                    if (!_.isArray(success.response)) {
                        _.forEach(success.response, function (country) {
                            announcements.push(country);
                        });
                    } else {
                        announcements = success.response;
                    }
                } else {
                        announcements = [];
                }
                
                deferred.resolve(announcements);

            }).fail(function (error) {
                var announcements = [];
                deferred.resolve(announcements);
            });

            return deferred.promise();

        };
        $scope.setShipmentReceived = function () {
            var deferred = $.Deferred();
            var count = 0;
            $bus.fetch({
                name: 'shipmentscount.refresh',
                api: 'shipmentscount',
                params: null,
                data: null
            })
                .done(function (success) {
                    if (success.response && success.response.data && success.response.data.inboundCount)
                        count = success.response.data.inboundCount[3];
                    deferred.resolve(count);
                }).fail(function (error) {
                    deferred.reject(count);
                });
            return deferred.promise();
        };

        $scope.initSamplData = function () {

            $scope.channelSampleData = {
                "Manual": {"count": 400,"sum": 40000},
                "File Upload": {"count": 300,"sum": 30000},
                "eBay": {"count":200,"sum": 20000},
                "Webstore": {"count": 100,"sum": 10000}
            };
            $scope.shipmentSampleData = {
                "Domestic": {"count": 300,"sum": 30000},
                "International": {"count": 700,"sum": 70000}
            };
            $scope.shipmentSampleDataAU = {
                "Sydney":   {"count": 250,"sum": 26000},
                "Melbourne":{"count": 300,"sum": 30000},
                "Brisbane": {"count": 700,"sum": 21000},
                "Perth":    {"count": 680,"sum": 88000},
                "Adelaide": {"count": 100,"sum": 10000},
                "Others":   {"count": 540,"sum": 45000}
            };

            $scope.deliverySampleData = {
                "Domestic Saver": {"count": 20,"sum": 200},
                "Domestic Standard": {"count": 35,"sum": 200},
                "Domestic Economy": {"count": 50,"sum": 1000},
                "International Priority": {"count": 65,"sum": 2000},
                "International Standard": {"count": 45,"sum": 1000},
                "International Economy": {"count": 65,"sum": 6000}
            };
            $scope.deliverySampleDataAU = {
                "Domestic Standard": {"count": 36,"sum": 600},
                "Domestic Expedited": {"count": 50,"sum": 1000},
            };

            $scope.topSellingProds = [
                {prodName: 'The Fry Chronicles',             SKU : 'ZA000009KR', sold :108 },
                {prodName: 'EP SYO EBUSINESS 2ED',           SKU : 'ZA000001IS', sold : 96 },
                {prodName: 'ON MIDNIGHT WINGS',              SKU : 'ZA000001HN', sold : 92 },
                {prodName: 'PRO TAO OF COACHING PB',         SKU : 'ZA000001AK', sold : 84 },
                {prodName: 'SHOPAHOLIC TAKES MANHATTAN',     SKU : 'ZA000009UM', sold : 76 },
                {prodName: 'WHEN THE DUCHESS SAYS YES',      SKU : 'ZA000008AR', sold : 63 },
                {prodName: 'WHEN THE DUCHESS SAYS YES',      SKU : 'ZA000005NA', sold : 61 },
                {prodName: 'ART OF TALKING SO THAT PEOPLE',  SKU : 'ZA000001TA', sold : 59 },
                {prodName: 'YORKSHIRE TERRIER HANDBOOK THE', SKU : 'ZA000001RA', sold : 35 }
            ];


            $scope.barSampleData =  [
                ["2015-03-01T00:00:00Z",51], ["2015-03-02T00:00:00Z",40], ["2015-03-03T00:00:00Z",27],
                ["2015-03-04T00:00:00Z",49], ["2015-03-05T00:00:00Z",37], ["2015-03-06T00:00:00Z",27],
                ["2015-03-07T00:00:00Z",47], ["2015-03-08T00:00:00Z",59], ["2015-03-09T00:00:00Z",60],
                ["2015-03-10T00:00:00Z",56], ["2015-03-11T00:00:00Z",43], ["2015-03-12T00:00:00Z",46],
                ["2015-03-13T00:00:00Z",43], ["2015-03-14T00:00:00Z",27], ["2015-03-15T00:00:00Z",50]
            ];


            $scope.geoSampleData = {
                "de": {"count": 50,"sum": 5000},
                "sg": {"count": 75,"sum": 7500},
                "th": {"count": 30,"sum": 3000},
                "us": {"count": 120,"sum": 12000},
                "IN": {"count": 100,"sum": 10000},
                "BR": {"count": 100,"sum": 10000},
                "BE": {"count": 50,"sum": 5000},
                "CA": {"count": 150,"sum": 15000},
                "CN": {"count": 20,"sum": 2000},
                "JP": {"count": 10,"sum": 1000},
                "HK": {"count": 100,"sum": 10000},
                "IT": {"count": 100,"sum": 10000},
                "AE": {"count": 100,"sum": 10000}
            };

            //Quick look data
            $scope.qlOrdersCount   = 1109;
            $scope.topSellingCount = 211;
            $scope.qlUnitsSold     = 1985;
            $scope.qlRetailValue   = 91185;
            var maxValue = 0;
            angular.forEach($scope.barSampleData, function(prod, $index){
                maxValue = (maxValue < prod[1]) ? prod[1]: maxValue;
            });
            $scope.maxOrders = maxValue;
        };

        $scope.initSampleCharts = function () {
            $scope.togglePieChart('$');
            $scope.populateDeliveryMethod('$');
            $scope.populateProdLineChart('$');
            $scope.populateBarChart('$');
            $scope.populateGeoChart('$');
            $scope.populateStorageUsed('$');
        };

        $scope.animateQL = function() {
            var tempQlOrdersCount = parseInt(angular.copy($scope.qlOrdersCount));

            var tempQlUnitsSold = parseInt(angular.copy($scope.qlUnitsSold));
            var tempQlRetailValue= parseInt(angular.copy($scope.qlRetailValue));
            var tempMaxOrders = parseInt(angular.copy($scope.maxOrders));

            var tempTopSellingProd;
            if (!$scope.inboundRcvd) tempTopSellingProd = $scope.topSellingCount;
            else tempTopSellingProd = ($scope.topSellingProds) ? $scope.topSellingProds : [];

            $timeout(function() {
                $scope.qlOrdersCount   = $scope.qlOrdersCount - $scope.qlOrdersCount;
                $scope.qlUnitsSold     = $scope.qlUnitsSold   - $scope.qlUnitsSold;
                $scope.qlRetailValue   = $scope.qlRetailValue - $scope.qlRetailValue;
                $scope.maxOrders   = $scope.maxOrders - $scope.maxOrders;
                if (!$scope.inboundRcvd) $scope.topSellingCount = 0;
                //else $scope.topSellingProds = [];
            },10);

            $timeout(function() {
                $scope.qlOrdersCount   = $scope.qlOrdersCount + tempQlOrdersCount ;
                $scope.qlUnitsSold     = $scope.qlUnitsSold + tempQlUnitsSold ;
                $scope.qlRetailValue   = $scope.qlRetailValue + tempQlRetailValue ;
                $scope.maxOrders   = $scope.maxOrders + tempMaxOrders;
                if (!$scope.inboundRcvd) $scope.topSellingCount = $scope.topSellingCount + tempTopSellingProd;
                //else $scope.topSellingProds = [];
            },50);
        };

        $scope.getDashboardScrollClassTop = function(){
            if(Number($(document).width() >= 992))
                return '';
            else
                return 'dashboardPageScroll nano';
        }
        $scope.getDashboardScrollClassBot = function(){
            if(Number($(document).width() >= 992))
                return '';
            else
                return 'nano-content';
        }

        $scope.init = function () {

            $timeout(function() {
                $(".dashboardPageScroll.nano").nanoScroller({ flash: true,preventPageScrolling: true,iOSNativeScrolling: true});
            }, 2000);

            (function ($) {

                var $window = $(window),
                _watch = [],
                _buffer;

                function test($el) {
                    var docViewTop = $window.scrollTop(),
                    docViewBottom = docViewTop + $window.height(),
                    elemTop = $el.offset().top,
                    elemBottom = elemTop + $el.height();

                    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
                        && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
                }

                $window.on('scroll', function ( e ) {

                    if ( !_buffer ) {

                        _buffer = setTimeout(function () {

                            checkInView( e );

                            _buffer = null;

                        }, 300);
                    }

                });

                function checkInView( e ) {

                    $.each(_watch, function () {

                        if ( test( this.element ) ) {
                            if ( !this.invp ) {
                                this.invp = true;
                                if ( this.options.scrolledin ) 
                                    this.options.scrolledin.call( this.element, e );

                                this.element.trigger( 'scrolledin', e );
                            }
                        } else if ( this.invp ) {
                            this.invp = false;
                            if ( this.options.scrolledout ) 
                                this.options.scrolledout.call( this.element, e );

                            this.element.trigger( 'scrolledout', e );
                        }
                    });
                }

                function monitor( element, options ) {
                    var item = { element: element, options: options, invp: false };
                    _watch.push(item);
                    return item;
                }

                function unmonitor( item ) {
                    for ( var i=0;i<_watch.length;i++ ) {
                        if ( _watch[i] === item ) {
                            _watch.splice( i, 1 );
                            item.element = null;
                            break;
                        }
                    }
                }

                var pluginName = 'scrolledIntoView',
                settings = {
                    scrolledin: null,
                    scrolledout: null
                }


                $.fn[pluginName] = function( options ) {

                    var options = $.extend({}, settings, options);

                    this.each( function () {

                        var $el = $(this),
                        instance = $.data( this, pluginName );

                        if ( instance ) {
                            instance.options = options;
                        } else {
                            $.data( this, pluginName, monitor( $el, options ) );
                            $el.on( 'remove', $.proxy( function () {

                                $.removeData(this, pluginName);
                                unmonitor( instance );

                            }, this ) );
                        }
                    });

                    return this;
                }


            })(jQuery);

            var firstTime=[];

            $('div.piechartheader').scrolledIntoView().on('scrolledin', function () {

                if(!firstTime['piechart']) {
                     firstTime['piechart'] = true;
                    $scope.togglePieChartScrollIn();
                }
            });
            $('p.delivery-chart').scrolledIntoView().on('scrolledin', function () {
                
                if(!firstTime['delivery-chart']) {
                     firstTime['delivery-chart'] = true;
                    $scope.populateDeliveryMethodScrollIn();
                }
            });
            $('.productsoldpanel').scrolledIntoView().on('scrolledin', function () {
                 
                 if(!firstTime['productsoldpanel']) {
                     firstTime['productsoldpanel'] = true;
                       $scope.populateProdLineChartScrollIn();
                }
            });
            $('.orderschart').scrolledIntoView().on('scrolledin', function () {
                
                if(!firstTime['orderschart']) {
                     firstTime['orderschart'] = true;
                     $scope.populateBarChartScrollIn();
                }
            });
            $('.orderbygeo').scrolledIntoView().on('scrolledin', function () {
                
                if(!firstTime['orderbygeo']) {
                    firstTime['orderbygeo'] = true;
                    $scope.populateGeoChart('$');
                }
            });
            $('.storageused').scrolledIntoView().on('scrolledin', function () {

                if(!firstTime['storageused']) {
                    firstTime['storageused'] = true;
                    $scope.populateStorageUsedScrollIn();
                }
            });
            
            /*$('#quicklook-top').scrolledIntoView().on('scrolledin', function () {
                
                if(!firstTime['quicklook-top']) {
                    firstTime['quicklook-top'] = true;
                    $scope.animateQL();
                }
            }); */


            $('#quicklook-bottom').scrolledIntoView().on('scrolledin', function () {

                if(!firstTime['quicklook-bottom']) {
                    firstTime['quicklook-bottom'] = true;
                    $scope.animateQL();
                }

            });


            $('#dashboard-modal').keypress(function(e){
                    if(e.keyCode == 13 || e.keyCode == 20){
                        $('#dashboard-modalClose').click();
                    }
            });

            $('html').click(function (e) {
                if ($scope.rangepicker && !($(e.target).closest("#datetimepicker7").length ||
                    $(e.target).hasClass('day') || $(e.target).hasClass('month') || $(e.target).hasClass('year'))) {
                    $scope.rangepicker.hide();
                    $scope.isRangepickerShowing = false;
                }
            });



            $timeout(function() {
                $(".topSellingProds.nano").nanoScroller({ flash: true,preventPageScrolling: true});
            },2000);

            $scope.myNotificationsDashboard = [];
            $scope.getHeaderNotifications().done(function(data){

                $timeout(function() {
                    $scope.currentNotificationPageDashboard = 1;
                    $scope.myNotificationsDashboard = data;                    
                    $('.widgetnotify .nano-content div span.internalControl').removeAttr('data');
                }, 100);

                $timeout(function() {
                    $(".widgetnotify .popover-content .nano").nanoScroller({ flash: true,preventPageScrolling: true});
                    $(".widgetnotify .notiticationTimeAgo").timeago();
                }, 1000);

            });

            $(".widgetnotify .nano").bind("scrollend", function(e){
                e.stopImmediatePropagation();

                if(++$scope.currentNotificationPageDashboard <= $rootScope.headerNotificationTotalPages) {

                    $scope.getHeaderNotifications($scope.currentNotificationPageDashboard).done(function(data){
                        _.each(data,function(val) { 
                            $scope.myNotificationsDashboard.push(val);
                        });
                        $timeout(function() {
                            $(".widgetnotify .popover-content .nano").nanoScroller({ scrollTop: '350' });
                            $(".widgetnotify .notiticationTimeAgo").timeago();
                            $('.widgetnotify .nano-content div span.internalControl').removeAttr('data');
                        },100);

                    });

                }

            });

            if($routeParams && $routeParams.viewall=='viewall') {
                $timeout(function() {
                    if($('.widgetnotify').length) {
                        $('html, body').animate({
                            scrollTop: ($(".widgetnotify").offset().top)-120
                        }, 2000);
                    }
               },1000);
            }

            $scope.announcements = [];

            $scope.getAnnouncements().done(function(data){
                $scope.announcements = data;
                $timeout(function() {
                    $(".announcementsTimeAgo").timeago();
                    $(".announce .nano").nanoScroller({ flash: true,preventPageScrolling: true,scroll: 'top'});
                },100);
            });

            $scope.getCountryList();

            $scope.dateOptionChanged($scope.dashBoardDateOptions[3]); //default date selection
            $scope.selectedDateOption = $scope.dashBoardDateOptions[3]; //default date selection
            $scope.maxOrders = 0;

            $scope.startDate = '';
            $scope.endDate = '';
            $scope.salesBetween = '';
            $scope.avgOrders = 0;

            $scope.qlOrdersCount = 0;
            $scope.qlRetailValue = 0;

            $scope.topSellingProds = [];
            $scope.geoChartData = [];
            $scope.prodAggrData = [];
            $scope.orderAggrDataChart = [];
            $scope.pieChannelData = [];
            $scope.pieShipmentData = [];
            $scope.deliveryMethodsChart = [];
            $scope.stackAreaData = [];
            $scope.geoLocations = [];


            $scope.setShipmentReceived()
                .done(function(data){

                    if (data){
                        $scope.inboundRcvd = data;
                        $scope.getQuickLook();
                    }
                    else {
                        $scope.inboundRcvd = 0;
                        $scope.initSamplData();
                        $scope.initSampleCharts();
                    }

                }).fail(function(){
                    $scope.inboundRcvd = 0;
                    $scope.initSamplData();
                    $scope.initSampleCharts();
                })
        };
    }]);
});