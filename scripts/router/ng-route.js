define(['angularAMD','utility/constants','angular-route','angular-cookies','angular-sanitize','controller/base', 'jquery', 'underscore','bootstrap','ngAnimate','ngProgress','ngToaster','directive/ng-directive','service/dal','service/exception','service/ng-service','factory/bus', 'factory/ng-factory','filter/ng-filter','angular-nvd3','angular-validator','directive/angular-gmap','ng-multiselect','nanoScroller','timeAgo','angular-nvd3','aes','map', 'ngStorage', 'highcharts', 'tabslideout', 'no-data','angular-translate'], function (angularAMD) {
  //Define the app module
  var app = angular.module("ezyCommerce", ['ngRoute','ngCookies','ngSanitize','ngProgress','toaster', 'multi-select', 'angularValidator', 'nvd3', 'ngStorage', 'pascalprecht.translate']);
  
  app.config(['$routeProvider', '$translateProvider',function ($routeProvider, $translateProvider) {
    
    var roleMapping = {
                    admin:{name:'admin',value:'1'},
                    csr:{name:'csr',value:'2'},
                    finance:{name:'finance',value:'3'},
                    accountowner:{name:'MERC_SU',value:'4'}, //account owner
                    productmgr:{name:'MERC_CATALOG_MGR',value:'5'}, //prd mgr
                    ordermgr:{name:'MERC_ORDER_MGR',value:'6'}, //ord mgr
                    configmgr:{name:'MERC_CONFIG_MGR',value:'7'}, //config mgr
                    accountadmin:{name:'MERC_ADMIN',value:'8'}, //account admin
                    vendor:{name:'vendor',value:'9'}
    };
    
    var routeObject = [
        {urlPath:'', templateUrl: 'views/login/index.html',controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},
        
        {urlPath:"/login", templateUrl:'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},
        
        {urlPath:"/", templateUrl: 'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},
        
        {urlPath:"/home", templateUrl: 'views/dashboard/index.html', controller: 'Dashboard', controllerUrl: 'controller/dashboard/index', role:'*'},

        {urlPath:"/home/:viewall", templateUrl: 'views/dashboard/index.html', controller: 'Dashboard', controllerUrl: 'controller/dashboard/index', role:'*'},
        
        {urlPath:"/verify", templateUrl: 'views/login/verify.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},
        
        {urlPath:"/forgotpassword", templateUrl: 'views/login/forgotPassword.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},

        {urlPath:"/resetpassword/:id", templateUrl: 'views/login/forgotPassword.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},

        {urlPath:"/activate/:id", templateUrl: 'views/login/activate.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},

        {urlPath:"/logout", templateUrl: 'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index', role:'*'},
        
        {urlPath:"/404", templateUrl: 'views/shared/404.html', controller: 'Base', controllerUrl: 'controller/base', role:'*'},
        
        {urlPath:"/403", templateUrl: 'views/shared/403.html', controller: 'Base', controllerUrl: 'controller/base', role:'*'},
        
        /************************************************************************************************************************************************************/
        {urlPath:"/products", templateUrl: 'views/products/index.html', controller: 'Products', controllerUrl: 'controller/products/index', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/products/create", templateUrl: 'views/products/create.html', controller: 'CreateProducts', controllerUrl: 'controller/products/create', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},

        {urlPath:"/products/create/:sku", templateUrl: 'views/products/create.html', controller: 'CreateProducts', controllerUrl: 'controller/products/create', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/products/upload", templateUrl: 'views/products/upload.html', controller: 'UploadProducts', controllerUrl: 'controller/products/upload', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},

        {urlPath:"/products/upload/:highlight", templateUrl: 'views/products/upload.html', controller: 'UploadProducts', controllerUrl: 'controller/products/upload', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/products/:status", templateUrl: 'views/products/index.html', controller: 'Products', controllerUrl: 'controller/products/index', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/products/view/:sku", templateUrl: 'views/products/view.html', controller: 'ViewProducts', controllerUrl: 'controller/products/view', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/products/edit/:sku", templateUrl: 'views/products/edit.html', controller: 'EditProducts', controllerUrl: 'controller/products/edit', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        /************************************************************************************************************************************************************/
        {urlPath:"/shipments", templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/create", templateUrl: 'views/shipments/create.html', controller: 'CreateShipments', controllerUrl: 'controller/shipments/create', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/create/:frmpage", templateUrl: 'views/shipments/create.html', controller: 'CreateShipments', controllerUrl: 'controller/shipments/create', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/send/:sku", templateUrl: 'views/shipments/send.html', controller: 'SendShipments', controllerUrl: 'controller/shipments/send', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/upload", templateUrl: 'views/shipments/upload.html', controller: 'UploadShipments', controllerUrl: 'controller/shipments/upload', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},

        {urlPath:"/shipments/upload/:highlight", templateUrl: 'views/shipments/upload.html', controller: 'UploadShipments', controllerUrl: 'controller/shipments/upload', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/:status", templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/view/:sku", templateUrl: 'views/shipments/view.html', controller: 'ViewShipments', controllerUrl: 'controller/shipments/view', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/shipments/edit/:sku", templateUrl: 'views/shipments/edit.html', controller: 'EditShipments', controllerUrl: 'controller/shipments/edit', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        
        /************************************************************************************************************************************************************/

        {urlPath:"/orders", templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/create", templateUrl: 'views/orders/create.html', controller: 'CreateOrders', controllerUrl: 'controller/orders/create', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/create/:frmpage", templateUrl: 'views/orders/create.html', controller: 'CreateOrders', controllerUrl: 'controller/orders/create', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/send/:sku", templateUrl: 'views/orders/review.html', controller: 'ReviewOrders', controllerUrl: 'controller/orders/review', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/upload", templateUrl: 'views/orders/upload.html', controller: 'UploadOrders', controllerUrl: 'controller/orders/upload', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},

        {urlPath:"/orders/upload/:highlight", templateUrl: 'views/orders/upload.html', controller: 'UploadOrders', controllerUrl: 'controller/orders/upload', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/:status", templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/view/:sku", templateUrl: 'views/orders/view.html', controller: 'ViewOrders', controllerUrl: 'controller/orders/view', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        {urlPath:"/orders/edit/:sku", templateUrl: 'views/orders/edit.html', controller: 'EditOrders', controllerUrl: 'controller/orders/edit', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value]},
        
        /************************************************************************************************************************************************************/
        
        
        {urlPath:"/accounts", templateUrl: 'views/accounts/editProfileIndividual.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.finance.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/profile", templateUrl: 'views/accounts/editProfileIndividual.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.finance.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/editProfileBusiness", templateUrl: 'views/accounts/editProfileBusiness.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/connections", templateUrl: 'views/accounts/connections.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.productmgr.value,roleMapping.ordermgr.value]},
        
        {urlPath:"/accounts/connections/addNewChannel", templateUrl: 'views/accounts/addNewChannel.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/connections/integrateEbay", templateUrl: 'views/accounts/integrateEbay.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/connections/integrateShopify", templateUrl: 'views/accounts/integrateShopify.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/connections/edit/:id", templateUrl: 'views/accounts/editEbay.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/connections/:channel/:status", templateUrl: 'views/accounts/addNewChannel.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/addressBook", templateUrl: 'views/accounts/addressBook.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/noCreditCard", templateUrl: 'views/accounts/noCreditCard.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/showCreditCard", templateUrl: 'views/accounts/showCreditCard.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/users", templateUrl: 'views/accounts/userAccounts.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.csr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/newSubAccount", templateUrl: 'views/accounts/newSubAccount.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/editUser/:id", templateUrl: 'views/accounts/newSubAccount.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/editSubAccount", templateUrl: 'views/accounts/editSubAccount.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/billingSummary", templateUrl: 'views/accounts/billingSummary.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/changePlan", templateUrl: 'views/accounts/changePlan.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/fulfillmentCost", templateUrl: 'views/accounts/fulfillmentCost.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.productmgr.value]},
        
        {urlPath:"/accounts/preferences/fulfillment", templateUrl: 'views/accounts/orderFulfillment.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value]},
        
        {urlPath:"/accounts/printSetup", templateUrl: 'views/accounts/printSetup.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value]},
        
        {urlPath:"/accounts/preferences/email", templateUrl: 'views/accounts/email.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value]},
        
        {urlPath:"/accounts/preferences/others", templateUrl: 'views/accounts/others.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value]},
        
        {urlPath:"/accounts/reports/products", templateUrl: 'views/accounts/productsReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value]},
        
        {urlPath:"/accounts/reports/shipments", templateUrl: 'views/accounts/shipmentsReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value]},
        
        {urlPath:"/accounts/reports/orders", templateUrl: 'views/accounts/ordersReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value]},
        
        {urlPath:"/accounts/reports/payments", templateUrl: 'views/accounts/paymentsReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts', role:[roleMapping.admin.value,roleMapping.vendor.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value]},
        
        /************************************************************************************************************************************************************/
        
        {urlPath:"/merchant", templateUrl: 'views/merchant/index.html', controller: 'Merchant', controllerUrl: 'controller/merchant/index', role:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value]},
        
        {urlPath:"/merchant/payments", templateUrl: 'views/merchant/payments.html', controller: 'Merchant', controllerUrl: 'controller/merchant/index', role:[roleMapping.admin.value,roleMapping.finance.value]},

        {urlPath:"/merchant/showProfile/:merchantCode", templateUrl: 'views/merchant/showProfile.html', controller: 'Merchant', controllerUrl: 'controller/merchant/index', role:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value]},
        
        {urlPath:"/merchant/:status", templateUrl: 'views/merchant/index.html', controller: 'Merchant', controllerUrl: 'controller/merchant/index', role:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value]},

        /************************************************************************************************************************************************************/
        
        {urlPath:"/acl", templateUrl: 'views/shared/404.html', controller: 'Login', controllerUrl: 'controller/login/index',
          role:{
            merchantTab : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value],
            
            financeText : [roleMapping.admin.value,roleMapping.finance.value,roleMapping.accountowner.value],
            financePayments : [roleMapping.admin.value,roleMapping.finance.value,roleMapping.accountowner.value],
            
            merchantTypeHead : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value],
            
            headerDashBoard : [roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.configmgr.value,roleMapping.accountowner.value],
            headerProducts : [roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value],
            headerShipments : [roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value],
            headerOrders : [roleMapping.admin.value,roleMapping.vendor.value,roleMapping.accountadmin.value,roleMapping.csr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.accountowner.value,roleMapping.configmgr.value],
            
            merchantActionsCol : [roleMapping.admin.value,roleMapping.csr.value],
            
            editContact : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value],
            
            closeAccount : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value],
            requestCloseAccount : [roleMapping.accountowner.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.configmgr.value,roleMapping.accountadmin.value],
            
            accountSettingsText : [roleMapping.admin.value,roleMapping.vendor.value,roleMapping.csr.value,roleMapping.accountadmin.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.finance.value],
            editProfile:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.finance.value,roleMapping.accountadmin.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.configmgr.value,roleMapping.accountowner.value],
            connections:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.productmgr.value,roleMapping.ordermgr.value],
            userAccounts : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value],
            changePassword : [roleMapping.admin.value,roleMapping.finance.value,roleMapping.accountowner.value,roleMapping.productmgr.value,roleMapping.ordermgr.value,roleMapping.configmgr.value,roleMapping.accountadmin.value,roleMapping.vendor.value],
            
            billingText:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.productmgr.value],
            summary:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.accountowner.value],
            fulfillmentCost:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.productmgr.value],
            
            createProduct : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.productmgr.value],
            uploadProduct : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.productmgr.value],
            archiveProduct : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.productmgr.value],
            editProductSave : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.productmgr.value],
              
            createShipment : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            uploadShipment : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            editShipmentSave : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            sendShipment : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            shipmentCancel : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value],
            
            draftOrder : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            createOrder : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            editOrderSave : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            uploadOrder : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            approveOrder : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.ordermgr.value],
            
            managerApproveOrder : [roleMapping.admin.value,roleMapping.csr.value],
            
            preferencesText:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value,roleMapping.productmgr.value,roleMapping.ordermgr.value],
            order:'*',
            email:'*',
            other:'*',
            
            reportsText:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value],
            productsReports:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value],
            shipmentReports:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value],
            ordersReports:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value],
            transReports:[roleMapping.admin.value,roleMapping.csr.value,roleMapping.configmgr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value],
            
            productAction : [roleMapping.admin.value,roleMapping.accountadmin.value,roleMapping.vendor.value,roleMapping.ordermgr.value,roleMapping.csr.value,roleMapping.accountowner.value],
            productActionStatus : [roleMapping.admin.value,roleMapping.accountadmin.value,roleMapping.vendor.value,roleMapping.productmgr.value,roleMapping.csr.value,roleMapping.accountowner.value],
            
            
            prefOrderSave : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value],
            prefEmailSave : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value],
            prefOthersSave : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value],
            
            ebayConnectButton : [roleMapping.admin.value,roleMapping.csr.value,roleMapping.accountowner.value,roleMapping.accountadmin.value,roleMapping.configmgr.value]
            
          }
        }
        
    ];
    
    var showHtmlVersion = (window && window.htmlVersion)?'?='+window.htmlVersion:'';
    
    //Default routing
    _.each(routeObject,function(val){
        $routeProvider.when(val.urlPath, angularAMD.route({
          templateUrl: val.templateUrl+showHtmlVersion, controller: val.controller, controllerUrl: val.controllerUrl, role:val.role,roleMapping:roleMapping
        }));
    });
    $routeProvider.otherwise({redirectTo: "/404"});

      $translateProvider.useStaticFilesLoader({
          prefix: 'content/locale-',
          suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en-US', 'de', 'jp'], {
          'en_US': 'en-US',
          'en_UK': 'en-US',
          'en'   : 'en-US',
          'de_DE': 'de',
          'de_CH': 'de'
      });
      $translateProvider.determinePreferredLanguage();
      $translateProvider.useLocalStorage();


  }]);
  app.run(['$rootScope', 'ngProgress', '$location', '$window', '$cookieStore','role','$route','$routeParams', '$translate', '$localStorage', function($rootScope, ngProgress, $location, $window, $cookieStore,role,$route,$routeParams, $translate, $localStorage) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
          

          if ($rootScope.hideErrMsg) { $rootScope.removeNotificationMsgs(); }

            if(!($.isEmptyObject($cookieStore.get('loggedInUser')))  && $rootScope.constantsBase.cookieRedirectRoutes.indexOf('/'+$location.path().split('/')[1])!=-1)    
                $location.path('/home');


            var lastPathCompRmvd = $location.path().substring(0, $location.path().lastIndexOf("/"));
            if($.isEmptyObject($cookieStore.get('loggedInUser')) && $location.path()!='/verify' && $location.path()!='/forgotpassword' && lastPathCompRmvd != '/resetpassword' && lastPathCompRmvd != '/activate'){


            if($rootScope.constantsBase.loginRedirectRoutes.indexOf('/'+$location.path().split('/')[1])==-1)
                $rootScope.getLoginRedirectUrl($location.path());

              $location.path('/login');
              $cookieStore.put('loggedInUser','');
            }
            if($location.path().indexOf('acl')!=-1) {
              $location.path('/404');
            }

            if(['/','/login', '/verify', '/forgotpassword', '/resetpassword', '/activate', '/logout'].indexOf('/'+$location.path().split('/')[1])==-1){
                $rootScope.getNotificationsCount();
            }

            if(role.check($route,next,$cookieStore.get('loggedInUser'))){
              
              if(($location.path() == '/' || $location.path() == '/login') && !$.isEmptyObject($cookieStore.get('loggedInUser')))
                  $cookieStore.put('loggedInUser','');
              else
              if($location.path() == '/404')
                  $rootScope.noPage = true;
              else if($location.path() == '/403')
                  $rootScope.unAuthorized = true;
              else if($location.path() == '/login')
                  $rootScope.isLoggedIn = false;
              ngProgress.start();
            }else{
                  $location.path('/403');
            }
          
            
      });

      $rootScope.$on('$routeChangeSuccess', function(event, next) {
        ngProgress.complete();
        $window.scrollTo(0,0);
    	$rootScope.removeHighlightChange();
        $('a#noti-button').popover('destroy');
        $rootScope.popupShown = false;
	  });
      
      $rootScope.$on('$routeChangeError', function() {
        ngProgress.complete();
      });
      
    }]);
  return angularAMD.bootstrap(app);
});

