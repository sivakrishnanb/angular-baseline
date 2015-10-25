define([], function () {
		return restapi  = {
            //Common
            login : {url:'auth/login', method:'post'},
            logout : {url:'auth/logout', method:'post'},
            country : {url:'content/country.json', method:'get'},
			currency : {url:'content/currency.json', method:'get'},
            //Dashboard
			dashboard : {url:'content/dashboard.json', method:'get'},
                  announcements : {url:'content/announcements.json', method:'get'},
            //Products
			products : {url:'products', method:'get'},
			productscount : {url:'products/status', method:'get'},
			createproducts : {url:'products', method:'post'},
			editproducts : {url:'products', method:'put'},
			importproducts : {url:'products/data-import', method:'get'},
			uploadproducts : {url:'products/data-import', method:'post'},
            suggestproducts : {url:'products/suggest', method:'get'},
            //Shipments
            shipments : {url:'inbounds', method:'get'},
			shipmentscount : {url:'inbounds/status', method:'get'},
            createshipments : {url:'inbounds', method:'post'},
			editshipments : {url:'inbounds', method:'put'},
			importshipments : {url:'inbounds/data-import', method:'get'},
			uploadshipments : {url:'inbounds/data-import', method:'post'},
            suggestshipments : {url:'inbounds/suggest', method:'get'},
            productlabelshipment: {url:'inbounds/print-product-label', method:'get'},
            boxlabelshipment: {url:'inbounds/print-box-label', method:'get'},
            warehouseleadtime: {url:'inbounds/warehouse-lead-time', method:'get'},



            //Orders
			orders : {url:'orders', method:'get'},
			orderscount : {url:'orders/counts', method:'get'},
            createorders : {url:'orders', method:'post'},
			editorders : {url:'orders', method:'put'},
			importorders : {url:'orders/data-import', method:'get'},
			uploadorders : {url:'orders/data-import', method:'post'},
            suggestorders : {url:'orders/suggest', method:'get'},
            orderexists : {url:'orders/exists', method:'get'},
            ordercarriers : {url:'trans/estimate', method:'post'},
            productlabelorder: {url:'orders/print-product-label', method:'get'},
            boxlabelorder: {url:'orders/print-box-label', method:'get'},
            ordersUpdate : {url:'orders/update', method:'put'},
            
            
            //header notifications
            notifications        : {url:'notifications',        method:'get'},
            notificationscount   : {url:'notifications/count',  method:'get'},
            notificationsreset   : {url:'notifications',        method:'put'},
            
            //merchant
            merchants        : {url:'merchants',                        method:'get'},
            updatemerchant   : {url:'merchants',                        method:'put'},
            getpayments      : {url:'merchants/payments',               method:'get'},
            approvalcount    : {url:'orders/status',                    method:'get'},
            autoapproval     : {url:'merchants/manager-order-approve',  method:'post'},
            suggestmerchants : {url:'merchants/suggest',                method:'get'},
            applysme         : {url:'merchants/spring',                 method:'post'},
            approveSpring    : {url:'merchants/spring',                 method:'put'},

            //switch-merchant-context
            switchmerccontext: {url:'auth/switch-merchant-context',method:'get'},

            //accounts
            getebaysession   : {url:'merchants/channels',        method:'post'},
            getebaychannels  : {url:'merchants/channels',        method:'get'},
            getebaytoken     : {url:'merchants/channels-status', method:'post'},
            removechannel     : {url:'merchants/channels-status', method:'post'},
            
            getPreferences   : {url:'merchants/preferences',     method:'get'},
            savePreferences  : {url:'merchants/preferences',     method:'post'},
            
            activatemerchant : {url:'merchants/activate',        method:'get'},
            addnewpayment    : {url:'merchants/payments',        method:'post'},
            addnewadjustments: {url:'merchants/adjustments',     method:'post'},
            changePassword   : {url:'merchants/change-password', method:'post'},

            //user
            getusers         : {url:'merchants/users',           method:'get'},
            edituser         : {url:'merchants/users',           method:'put'},
            createuser       : {url:'merchants/users',           method:'post'},
            removeuser       : {url:'merchants/users',           method:'delete'},

            //Billing
            balancesummary   : {url:'merchants/invoice-summary', method:'get'},
            invoices         : {url:'merchants/invoices',        method:'get'},

            //reports
            reports          : {url:'merchants/reports',         method:'get'},

            // merchants - exports
            exports          : {url:'merchants/export',         method:'get'},


            // merchants - block
            block          : {url:'merchants/block',         method:'post'},
            unblock        : {url:'merchants/unblock',       method:'post'},


            //dashboard
            quicklook        : {url:'dashboard/quick-look',      method:'get'}
		}
});