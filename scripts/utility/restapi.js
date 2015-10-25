define([], function () {
		return restapi  = {
            //Common
            login : {url:'auth/login', method:'post'},
            logout : {url:'auth/logout', method:'post'},
            country : {url:'content/country.json', method:'get'},
            aupostalcodes : {url:'content/au-postal-codes.json', method:'get'},
            cases : {url:'content/cases.json', method:'get'},
			currency : {url:'content/currency.json', method:'get'},
            sourcefiledownload : {url:'downloader', method:'get'},

            //Dashboard
                  announcements : {url:'content/announcements.json', method:'get'},
            //Products
			products : {url:'products', method:'get'},
			productscount : {url:'products/status', method:'get'},
			createproducts : {url:'products', method:'post'},
			editproducts : {url:'products', method:'put'},
			importproducts : {url:'products/data-import', method:'get'},
			uploadproducts : {url:'products/data-import', method:'post'},
            suggestproducts : {url:'products/suggest', method:'get'},
	     updateProductStatus: {url:'products/update-product-status', method:'get'},
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
            shipDeliveryReceipt: {url:'inbounds/shipment-delivery-receipt', method:'get'},

            //Orders
			orders : {url:'orders', method:'get'},
			orderscount : {url:'orders/counts', method:'get'},
            createorders : {url:'orders', method:'post'},
			editorders : {url:'orders', method:'put'},
			importorders : {url:'orders/data-import', method:'get'},
			uploadorders : {url:'orders/data-import', method:'post'},
            suggestorders : {url:'orders/suggest', method:'get'},
            suggestordersreturns : {url:'orders/suggestreturns', method:'get'},
            orderexists : {url:'orders/exists', method:'get'},
            ordercarriers : {url:'trans/estimate', method:'post'},
            productlabelorder: {url:'orders/print-product-label', method:'get'},
            boxlabelorder: {url:'orders/print-box-label', method:'get'},
            ordersUpdate : {url:'orders/update', method:'put'},
            ordersReturn : {url:'orders/returns', method:'get'},
            ordersCreateReturns : {url:'orders/returns', method:'post'},
            returnsUpdateStatus : {url:'orders/returns', method:'put'},
            returnsUpdateTrackNumber : {url:'orders/returns', method:'put'},
            ordersReturnsEstimateCost : {url:'orders/estimatereturns', method:'post'},
            
            ordersRemovals : {url:'removals', method:'get'},
            viewRemovals : {url:'removals', method:'get'},
            getRemovalFee : {url:'trans/removal', method:'post'},
            createRemovals: {url:'removals', method:'post'},
            updateRemovals: {url:'removals', method:'put'},
            cancelRemovals: {url:'removals/update', method:'put'},

            deleteOrders : {url:'orders/delete', method:'put'},

            
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
            merchantShipments    : {url:'merchants/shipments',          method:'get'},
            

            //admin
            generateinvoice : {url:'finance/generateinvoice',method:'get'},
            generatebulkinvoice : {url:'finance/generateinvoice',method:'post'},


            //switch-merchant-context
            switchmerccontext: {url:'auth/switch-merchant-context',method:'get'},

            //accounts
            forcepullorders : {url:'merchants/channels-pull-order', method:'post'},

            getebaysession   : {url:'merchants/channels',        method:'post'},
            getebaychannels  : {url:'merchants/channels',        method:'get'},
            getebaytoken     : {url:'merchants/channels',        method:'post'},
	      getshopifytoken   : {url:'merchants/channels',        method:'post'},
            removechannel     : {url:'merchants/channels-status', method:'post'},
            activateDeactivateChannels : {url:'merchants/channels-status', method:'put'},
            deleteSalesChannels : {url:'merchants/channels', method:'delete'},
            updateOrderStatusChannels : {url:'merchants/channel-preference', method:'put'},
            getamazontoken   : {url:'merchants/channels',        method:'post'},
            getrakutentoken   : {url:'merchants/channels',        method:'post'},
            addamazonchannel   : {url:'merchants/channels',        method:'post'},

            getPreferences   : {url:'merchants/preferences',     method:'get'},
            savePreferences  : {url:'merchants/preferences',     method:'put'},
            
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
            remarks        : {url:'merchants/remarks',       method:'put'},


            //dashboard
            quicklook        : {url:'dashboard/quick-look',      method:'get'}
		}
});