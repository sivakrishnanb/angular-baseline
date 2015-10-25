define(['angularAMD','g-map'], function (angularAMD, google) {
	angularAMD.directive('gmap', [function () {
		return {
			restrict : 'EA',
			scope: {
				geoLoactions: '='
				/**
				 * geoLocations Array format:
					1) ['Latitude', 'Longitude','Description', 'value', {type: 'string', role: 'tooltip'}],
				 	   [20.593684, 78.96288,'Description', 0, 'Country name as tooltip'],

				 	2) ['Country', 'Count'],
				 		['DZ', 700]);
				**/
			},

			link:function(scope, el, attrs) {
				google.load('visualization', '1', {'packages': ['geochart'],callback: drawRegionsMap});
			   	//google.setOnLoadCallback(drawRegionsMap);
			   	function drawRegionsMap() {
			   		if(google.visualization && google.visualization.arrayToDataTable && scope.geoLoactions) {
				   		var data 	= google.visualization.arrayToDataTable(scope.geoLoactions);
				   		var options = {displayMode: 'markers', datalessRegionColor: 'f1f1f1', colorAxis: {minValue: 1, maxValue:1, colors: ['#4C87B9']}, legend: 'none'};
				   		var chart 	= new google.visualization.GeoChart(el[0]);
				   		chart.draw(data, options);
				   	}
			   	}

		   		$( window ).on("resize.bnViewport",	function( event ) {
		   			scope.$apply(drawRegionsMap);
		   		});

                scope.$on("$destroy", function() {
                	$( window ).off("resize.bnViewport");
                });
				scope.$watch('geoLoactions', function () {
					drawRegionsMap();
				},true);
            }
        };
    }]);
});