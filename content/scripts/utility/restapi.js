define([], function () {
		return restapi  = {
			base : {url:'services/base.json', method:'get'},
			dashboard : {url:'services/dashboard.json', method:'get'},
			products : {url:'services/products.json', method:'get'},
			orders : {url:'services/orders.json', method:'get'}
		}
});