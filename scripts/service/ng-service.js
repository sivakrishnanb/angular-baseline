define(['angularAMD'], function (angularAMD) {
		angularAMD
		.service('$service1', function() {
		    this.message = "Message from service 1";
		})
		.service('$service2', function() {
		    this.message = "Message from service 2";
		});
});