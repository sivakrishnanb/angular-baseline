define(['angularAMD','utility/config'], function (angularAMD, config) {
		angularAMD.factory('$constants', function() {
			var constants = {};

			constants.baseUrl = config.baseUrl; 

			constants.productTemplateXlsx = config.productTemplateXlsx; 
		    
		    constants.productTemplateCsv = config.productTemplateCsv; 
            
            constants.shipmentTemplateXlsx = config.shipmentTemplateXlsx; 
		    
		    constants.shipmentTemplateCsv = config.shipmentTemplateCsv; 
            
            constants.orderTemplateXlsx = config.orderTemplateXlsx; 
		    
		    constants.orderTemplateCsv = config.orderTemplateCsv; 

		    constants.idleTimeout = config.idleTimeout; 
            
            constants.developerMode = config.developerMode; 

            constants.notAvailable = "---";
            
            constants.notAvailableText = "NA"; 
            
            constants.skuNotAvailableText = "SKU not found";
            
            constants.unidentified = "Unidentified";
            
            constants.uploadproductsocket = config.uploadproductsocket; 

            constants.uploadproductsocketUrl = config.uploadproductsocketUrl; 
            
            constants.internationalInsuranceCost = 7.50;
            
            constants.domesticInsuranceCost = 5.00;
            
            constants.uploadproductsocketkey = config.uploadproductsocketkey; 
            
            constants.currentLocation = config.currentLocation; 
            
            constants.validationMessages = {
                required : "This field is required",
                invalidnumber : "This field requires number",
                invalidweight : "Weight should be less than 30 kg with maximum of 2 decimals",
                invalidhscode : "Minimum 6 characters required",
                invalidhscodemin : "Min 6 characters",
                invalidemail : "Invalid Email",
                invalidphone : "Invalid Phone Number",
                invalidphonedomestic : "Max limit is 8 characters. Do not include country code",
                EAN : "8 or 13 digits required",
                JAN : "7 or 9 digits required",
                UPC : "12 digits required",
                ISBN : "13 digits required",
                orderMerchantIdError : "Only alphanumeric values and hyphens are accepted.",
                orderELValueError : "Invalid Enhanced Liability Value",
                invalidDeclaredValue : "Invalid Declared Value",
                pwmissmatch: "Passwords entered does not match",
                enhancedLiabilityError : "At least one option must be selected",
                curencyValError : "This field requires number with 2 decimals",
                permissionError: "Select minimum one role",
                labelQuantityError : "Label quantity should be less than 1000.",
                numberUnitsError : "Number of units should be less than 1000.",
                noRoleSelected: "No role selected, Please select any role",
                invalidPasswordLength : "Minimum 8 characters required",
                invalidPasswordFormat : "At least 1 number, 1 upper case alphabet and 1 special character required",
                displayableOrderIdError : "Displayable Order ID cannot exceed 20 chars",
                invalidLength : "Length should be less than 105 cm and maximum of 2 decimals",
                invalidWidth  : "Width should be less than 150 cm and maximum of 2 decimals",
                invalidHeight : "Height should be less than 150 cm and maximum of 2 decimals",
                invalidDimensiontotal : "Max. Length 105 cm. L + 2W + 2H should not exceed 200 cm."

		    };
            
            constants.timeAgoRestrict = {
                days : 10 //show time ago within days to current time..
            };
            
            constants.notifications = {
                fileStatus : [{name:'processing',value:"0"},{name:'success',value:"1"},{name:'has errors',value:"2"},{name:'partially successful',value:"3"},{name:'rejected',value:"4"}],
                intialRecords : 10 //initial records to display..
            };
            
            constants.loginRedirectRoutes = ['/','/403','/404','/login', '/verify', '/forgotpassword', '/resetpassword', '/activate', '/logout'];

            constants.cookieRedirectRoutes = ['/','/login', '/verify', '/forgotpassword', '/resetpassword', '/activate'];

		    constants.productFilterOptions = [{name:"All", value:"all", ticked: true },{name:"EZY-SKU", value:"fbspsku"},{name:"Merchant SKU", value:"mercsku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"}];
            
            constants.productSortingOptions = [{name:"EZY-SKU", value:"fbspSkuId" },{name:"Created Date", value:"createdDate"},{name:"Merchant SKU", value:"sku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"},{name: "Alert Level", value:"inventoryAlertLevel"},{name: "Inbound", value:"qtyInShipment"},{name: "Damaged", value:"qtyDamaged"},{name: "Fulfillable", value:"qtyFulfillable"},{name: "Date Since Inactive", value:"dateInActive"},{name: "Product Name", value:"productName"},{name: "Category", value:"mainProductCategory"},{name: "Modified Date", value:"modifiedDate"}];

            constants.merchantSortingOptions = [{name:"Created Date", value:"createdDate"}, {name: "Modified Date", value:"modifiedDate"}];

            constants.shipmentSortingOptions = [{name:"Date Created", value:"createdDate" },{name:"Shipment ID", value:"inboundCode"},{name:"Plan Name", value:"planName"}, {name:"Who Labels?", value:"labelBy"}, {name: "Remarks", value:"remarks"}];

            //constants.ordersSortingOptions = [{name:"EZY-Sku", value:"fbspSkuId" },{name:"Created Date", value:"createdDate"},{name:"Merchant SKU", value:"sku"}, {name:"Product ID", value:"productid"}, {name: "Product Name", value:"productname"},{name: "Alert Level", value:"inventoryAlertLevel"},{name: "Inbound", value:"qtyInShipment"},{name: "Damaged", value:"qtyDamaged"},{name: "Fulfillable", value:"qtyFulfillable"},{name: "Date Since Inactive", value:"dateInActive"},{name: "Product Name", value:"productName"},{name: "Category", value:"mainProductCategory"}];
            
            constants.ordersSortingOptions = [{name:"Modified Date",value:"modifiedDate"},{name:"Created Date",value:"createdDate"},{name:"Merchant Order Id",value:"merchOrderId"},{name:"EZY Order ID",value:"ezcOrderId"}]
            
            constants.shipmentFilterOptions = [{name:"All", value:"all", ticked: true },{name:"Shipment ID", value:"inbound_code"},{name:"Plan Name", value:"plan_name"},{name:"EZY-SKU", value:"sku"},{name:"Merchant SKU", value:"merchant_sku"}, {name:"Product ID", value:"product_id"}];
            
            constants.orderFilterOptions = [{name:"All", value:"all", ticked: true },{name:"EZY Order ID", value:"ezcOrderId"},{name:"Merchant Order ID", value:"merchOrderId"},{name:"Customer Name", value:"custName"}, {name:"Merchant SKU", value:"merchSku"},{name:"EZY SKU", value:"ezcSku"}, {name:"Product ID", value:"prodCode"}];

            //constants.orderFilterOptions = [{name:"All", value:"all", ticked: true },{name:"EZY Order ID", value:"ezcOrderId"},{name:"Merchant Order ID", value:"merchOrderId"},{name:"Customer Name", value:"custName"}, {name:"Merchant SKU", value:"merchSku"},{name:"EZY SKU", value:"ezcSku"}, {name:"Product ID", value:"prodCode"}];
            
		    constants.productStatus = [{name:"all", value:"-1"},{name:"active", value:"1"},{name:"inactive", value:"2"},{name:"archived", value:"3"}];

            constants.merchantSearchOptions = [{name:"All", value:"all", ticked: true },{name:"Merchant ID", value:"merchantCode"},{name:"Name", value:"merchantName"},{name:"Company Name", value:"companyName"},{name:"Email", value:"email"},{name:"UEN/GSTN (number)", value:"compRegNo"}];

            constants.merchantStatus = [{name:"all", value:0}, {name:"pending", value:0}, {name:"existing", value:1}, {name:"blocked", value:0}];

            constants.merchantFilterStatus = [
                {name:"Active",                key:"status", value:1},
                {name:"Blocked",               key:"blocked", value:1},
                {name:"Verification Pending",  key:"verificationPending", value:1},
                {name:"Activation Pending",    key:"activationPending", value:1}];

            constants.shipmentStatus = [{name:"all", value:"-1", display:"All"},{name:"pending", value:"1", display:"Pending"},{name:"intransit", value:"2", display:"In Transit"},{name:"received", value:"3", display:"Received"},{name:"closed", value:"4", display:"Closed"},{name:"cancelled", value:"5", display:"Cancelled"}];
            
            constants.orderStatus = [{name:"all", value:"ALL", display:"All", suggestionclass:"ordSuggestAll"},{name:"returns", value:"RETURN", display:"Order Return", suggestionclass:"ordSuggestReturn"},{name:"removal", value:"REMOVAL", display:"Removal Order", suggestionclass:"ordSuggestRemoval"},{name:"pending", value:"PENDING", display:"Pending", suggestionclass:"ordSuggestPending"},{name:"hasissues", value:"HAS_ISSUES", display:"Has Issues", suggestionclass:"ordSuggestHasIssues"},{name:"unapproved", value:"UNAPPROVED", display:"Unapproved", suggestionclass:"ordSuggestUnapproved"},{name:"inprocess", value:"IN_PROCESS", display:"In Process",suggestionclass:"ordSuggestInprocess"},{name:"processmgr", value:"PROCESS_MGR", display:"In Process", suggestionclass:"ordSuggestProcessMgr"},{name:"fulfillment", value:"FULFILLMENT", display:"Fulfillment", suggestionclass:"ordSuggestFullfillment"},{name:"shipped", value:"SHIPPED", display:"Shipped", suggestionclass:"ordSuggestShipped"},{name:"delivered", value:"DELIVERED", display:"Delivered", suggestionclass:"ordSuggestDelivered"},{name:"drafts", value:"DRAFT", display:"Drafts", suggestionclass:"ordSuggestDrafts"},{name:"cancelled", value:"CANCELLED", display:"Cancelled", suggestionclass:"ordSuggestCancelled"}];
            
            constants.orderTypeOptions = [{name:"Order Type", value:"none", label:true},{name:"All", value:"all"},{name:"Domestic", value:"1"},{name:"International", value:"0"}];
            
            constants.orderSortingMapping = [{name:"merchantId", value:"merchId"},{name:"ezcOrderNumber", value:"ezcOrderId"},{name:"merchantOrderId", value:"merchOrderId"},{name:"displayableDate", value:"displayableDate"},{name:"processOrderDate", value:"processOrderDate"},{name:"shipping.methodName", value:"deliveryOption"},{name:"channel", value:"channel"},{name:"customerFirstname", value:"custName"},{name:"modifiedDate", value:"modifiedDate"},{name:"createdDate", value:"createdDate"},{name:"customer.shippingAddress.address1", value:"address"},{name:"remark", value:"remark"},{name:"lineItems", value:"lineCount"},{name:"lineItemsUnits", value:"itemCount"},{name:"cancelledDate", value:"cancelledDate"},{name:"merchSku", value:"merchSku"},{name:"ezcSku", value:"ezcSku"},{name:"prodCode", value:"prodCode"}, {name:"shipping.methodCode", value:"methodCode"}];
            
            constants.orderInventoryOptions = [{name:"Inventory status", value:"none", label:true},{name:"All", value:"all"},{name:"Has Inventory", value:"1"},{name:"Out of Stock", value:"0"}];
            
            constants.orderChannelOptions = [{name:"Order Channel", value:"none", label:true},{name:"All", value:"ALL"},{name:"File", value:"FILE"},{name:"Manual", value:"GUI"},{name:"EBAY", value:"EBAY"}];
            
            constants.domesticShippingOptions = [{name:"Domestic Standard", value:"IWPPSD", leadTime:"1-2 Days", cost: "7.50", currency: "$", ticked: true, carrier : "EZY2SHIP" ,channelval:"Standard", elMax: "20,000", elAvailable:true},{name:"Domestic Economy", value:"IWPPSD", leadTime:"3-4 Days", cost: "4.50", currency: "$", ticked: false, carrier : "EZY2SHIP" ,channelval:"Economy", elMax: "0", elAvailable:false }];
            
            constants.internationalShippingOptions = [{name:"International Standard", value:"IWPPSD", leadTime:"5-7 Days", cost: "35.00", currency: "$", ticked: true, carrier : "EZY2SHIP" ,channelval:"Standard", elMax: "20,000", elAvailable:false},{name:"International Priority", value:"IWPPSD", leadTime:"1-2 Days", cost: "89.50", currency: "$", ticked: false, carrier : "EZY2SHIP" ,channelval:"Priority", elMax: "99,999", elAvailable:true},{name:"International Economy", value:"IWPPSD", leadTime:"3-4 Days", cost: "60.50", currency: "$", ticked: false, carrier : "EZY2SHIP" ,channelval:"Economy", elMax: "0", elAvailable:false}];
            
            constants.orderShipCategory = [{name:"Merchandise", value:"M"},{name:"Sample", value:"S"},{name:"Other", value:"O"}];
            
            constants.autoNotify = [{name:"email",value:"email"},{name:"none",value:"none"}];
            
            constants.orderDeliveryInstruction = [{name:"Treat as Abandoned", value:"T"},{name:"Return to Sender", value:"R"}];
            
            constants.fileStatus = [{name:"Processing", value:"0"},{name:"Success", value:"1"},{name:"Error", value:"2"}];
            
		    constants.codeType = [{name:"EAN", value:"EAN",validationlength:[8,13]},{name:"JAN", value:"JAN",validationlength:[7,9]},{name:"UPC", value:"UPC",validationlength:[12]},{name:"ISBN", value:"ISBN",validationlength:[13]}];

		    constants.dateOptions = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"1d"},{name:"Yesterday", value:"-1d"},{name:"Last 7 Days", value:"-7d"}, {name:"Last 30 Days", value:"-30d"}, {name: "This Month", value:"1m"}, {name: "Last Month", value:"-1m"}, {name: "Custom Range", value:"custom"}];
            
            constants.dateOptionsReports = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"1d"},{name:"Yesterday", value:"-1d"},{name:"Last 7 Days", value:"-7d"}, {name:"Last 30 Days", value:"-30d"}, {name: "This Month", value:"1m"}, {name: "Last Month", value:"-1m"}, {name: "Custom Date Range", value:"custom"}];
            
            constants.dateOptionsReportsOrders = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"0d"},{name:"Yesterday", value:"1d"},{name:"Last 7 Days", value:"7d"}, {name:"Last 30 Days", value:"30d"}, {name: "This Month", value:"0m"}, {name: "Last Month", value:"1m"}, {name: "Custom Date Range", value:"custom"}];

            constants.orderDateOptions = [{name:"Created Date Range", value:"none", label:true},{name:"All", value:"all"},{name:"Today", value:"0d"},{name:"Yesterday", value:"1d"},{name:"Last 7 Days", value:"7d"}, {name:"Last 30 Days", value:"30d"}, {name: "This Month", value:"0m"}, {name: "Last Month", value:"1m"}, {name: "Custom Range", value:"custom"}]; 

            constants.dashBoardDateOptions = [{name:"Today", value:"1d", selected:true},{name:"Yesterday", value:"-1d", selected:false},{name:"Last 7 Days", value:"-7d", selected:false}, {name:"Last 30 Days", value:"-30d", selected:false}, {name: "This Month", value:"1m", selected:false}, {name: "Last Month", value:"-1m", selected:false}, {name: "This quarter", value:"1q", selected:false}];


	        constants.inventoryOptions = [{name:"Inventory", value:"none", label:true},{name:"Out of Stock", value:"1"},{name:"Below Alert Level", value:"3"},{name:"Damaged", value:"2"}]; 

	        constants.categoryOptions = [{name:"Electronics", value:"A" },{name:"Apparel", value:"B"},{name:"Baby", value:"C"},{name:"Toys", value:"D"},{name:"Home and Life Style", value:"E" },{name:"Kitchen", value:"F"},{name:"Sports", value:"G"},{name:"Fashion", value:"H"},{name:"Shoes", value:"I"},{name:"Footwear", value:"J"},{name:"Beauty and health", value:"K" },{name:"Travel", value:"L"},{name:"Accessories", value:"M"},{name:"Others", value:"N"}]; 
            
            constants.labelList = [{name:"Merchant", value:"M" },{name:"Warehouse", value:"W"}];
            
            constants.productLabelList = [{name:"21.2mm x 45.7mm, 48 labels/sheet on A4, Avery®6102", value:"6102"},{name:"25.4mm x 66.6mm, 30 labels/sheet on US Letter, Avery®5160", value:"5160"},{name:"29.6mm x 63.5mm, 27 labels/sheet on A4, Avery®6104", value:"6104"},{name:"38.1mm x 63.5mm, 21 labels/sheet on A4, Avery®J8160", value:"J8160"},{name:"21.2mm x 45.7mm, 1 label/sheet on Plain paper", value:"1"}];
            
            constants.boxLabelList = [{name:"3.33” x 4”, 6 labels/sheet on US Letter, Avery®5164", value:"5164"},{name:"3.66” x 3.9”, 6 labels/sheet on A4, Avery®J8166", value:"J8166"},{name:"6” x 4”, 1 label/sheet on Plain paper", value:"2"}];
            
            constants.ebaySiteIds = [{name:"United States", value:"US" },{name:"Canada", value:"CANADA"},{name:"Australia", value:"AUSTRALIA"},{name:"France", value:"FRANCE"},{name:"Germany", value:"GERMANY"},{name:"EBay Motors", value:"E_BAY_MOTORS"},{name:"Italy", value:"ITALY"},{name:"Spain", value:"SPAIN"},{name:"China", value:"CHINA"},{name:"Canada French", value:"CANADA_FRENCH"},{name:"Belgium French", value:"BELGIUM_FRENCH"},{name:"Hong Kong", value:"HONG_KONG"},{name:"India", value:"INDIA"},{name:"Ireland", value:"IRELAND"},{name:"Malaysia", value:"MALAYSIA"},{name:"Netherlands", value:"NETHERLANDS"},{name:"Belgium Dutch", value:"BELGIUM_DUTCH"},{name:"Philippines", value:"PHILIPPINES"},{name:"Poland", value:"POLAND"},{name:"Singapore", value:"SINGAPORE"}];

            constants.userRoles = [{name:'admin',value:constants.notAvailableText,userInfo:'Admin'},{name:'csr',value:constants.notAvailableText,userInfo:'CSR'},{name:'finance',value:constants.notAvailableText,userInfo:'Finance'},{name:'MERC_SU',value:'Account Owner',userInfo:'Account Owner'},{name:'MERC_CATALOG_MGR',value:'Sub User',userInfo:'Product Management'},{name:'MERC_ORDER_MGR',value:'Sub User',userInfo:'Order Management'},{name:'MERC_CONFIG_MGR',value:'Sub User',userInfo:'Config Management'},{name:'MERC_ADMIN',value:'Admin',userInfo:'Account Admin'},{name:'vendor',value:'Sub User',userInfo:'Vendor'}];

            constants.transReportRange = [{name:"Created Date Range", value:"none", label:true}, {name:'Current Month',value:'1m', type:'custom'},{name:'Current & Last Month',value:'-1m', type:'custom'},{name:'Current & Last 2 Month',value:'-2m', type:'custom'},{name:'Custom Range',value:'custom', type:'custom'}];
            constants.defaultPagin = {"products": {"pageSize": 10, "sortDir": 'desc', "sortingOption":"createdDate"},"shipments": {"pageSize": 10, "sortDir": 'desc', "sortingOption":"createdDate"},"orders":   {"pageSize": 10, "sortDir": 'desc', "sortingOption":"createdDate"},"merchant": {"pageSize": 10, "sortDir": 'desc', "sortingOption":"createdDate"}};
            return constants;
		});
});