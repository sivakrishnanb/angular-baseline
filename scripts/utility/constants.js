define(['angularAMD'], function (angularAMD, restapi) {
		angularAMD.factory('$constants', function() {
			var constants = {};

			constants.baseUrl = "ezf/";
		    
		    constants.message = "Constant Message";

		    constants.notAvailable = "---";

		    constants.validationMessages = {
		    	required : "This field is required",
		    	invalidnumber : "Numbers Only",
		    	invalidemail : "Invalid Email",
		    }

		    constants.productFilterOptions = [{name:"All", value:"all", ticked: true },{name:"FBSP-SKU", value:"fbspsku"},{name:"Merchant SKU", value:"mercsku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"}];

		    constants.productStatus = [{name:"all", value:"-1"},{name:"active", value:"1"},{name:"inactive", value:"2"},{name:"archived", value:"3"}];

		    constants.dateOptions = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"1d"},{name:"Yesterday", value:"-1d"},{name:"Last 7 Days", value:"-7d"}, {name:"Last 30 Days", value:"-30d"}, {name: "This Month", value:"1m"}, {name: "Last Month", value:"-1m"}, {name: "Custom Range", value:"custom"}]; 

	        constants.inventoryOptions = [{name:"Inventory", value:"none", label:true},{name:"All", value:"all"},{name:"Out of Stock", value:"1"},{name:"Below Alert Level", value:"2"},{name:"Damaged", value:"3"}]; 

	        constants.categoryOptions = [{name:"Electronics", value:"electronics" },{name:"Apparel", value:"apparel"},{name:"Baby", value:"baby"},{name:"Toys", value:"toys"},{name:"Home and Life Style", value:"homeandlifestyle" },{name:"Kitchen", value:"kitchen"},{name:"Sports", value:"sports"},{name:"Fashion", value:"fashion"},{name:"Shoes", value:"shoes"},{name:"Footwear", value:"footwear"},{name:"Beauty and health", value:"beautyandhealth" },{name:"Travel", value:"travel"},{name:"Accessories", value:"accessories"},{name:"Others", value:"others"}]; 

		    return constants;
		});
});