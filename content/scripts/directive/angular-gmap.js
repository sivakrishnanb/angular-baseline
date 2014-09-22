define(['angularAMD','g-map'], function (angularAMD, google) {
	angularAMD.directive('gmap', [function () {
		return {
			restrict : 'EA',
			link:function(scope, el, attrs) {
				google.load('visualization', '1', {'packages': ['geochart'],callback: drawRegionsMap});
			   	//google.setOnLoadCallback(drawRegionsMap);
			   	function drawRegionsMap() {
			   		if(google.visualization) {
				   		var data = google.visualization.arrayToDataTable([
				   			['Latitude', 'Longitude','Description', 'value', {type: 'string', role: 'tooltip'}],
				   			[1.3667,103.8,'Description', 0, 'Contry name as tooltip'],
				   			[6, -58,'Description', 0, 'Contry name as tooltip'],
				   			[60,-95,'Description', 0, 'Contry name as tooltip'],
				   			[8, -66,'Description', 0, 'Contry name as tooltip'],
				   			[60, 100,'Description', 0, 'Contry name as tooltip']
				   			]);
				   		var options = { displayMode: 'markers', colorAxis: {minValue: 0, maxValue: 0,  colors: ['red']}, legend: 'none' };
				   		var chart = new google.visualization.GeoChart(el[0]);
				   		chart.draw(data, options);
				   	}
			   	}

		   		$( window ).on("resize.bnViewport",	function( event ) {
		   			scope.$apply(drawRegionsMap);
		   		});

                scope.$on("$destroy", function() {
                	$( window ).off("resize.bnViewport");
                });
            }
        };
    }]);
});