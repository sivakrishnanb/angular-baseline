define([], function () {
		return restapi  = {
			auth : {url:'auth.php', method:'get'},
			base : {url:'services/base.json', method:'get'},
			dashboard : {url:'services/dashboard.json', method:'get'},
			products : {url:'products', method:'get'},
			orders : {url:'services/orders.json', method:'get'}
		}
});