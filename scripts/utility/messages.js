define([], function () {
	return messages  = {
            //Common
            warnPageNavigation : "Are you sure you want to leave this page?",
            retrivedSuccess :"Data  retreived successfully",
            uploadSuccess : "File has been uploaded successfully. You will be notified when processing has been completed",
            uploadInvalidFiles : "File format is invalid. You can upload files with the extensions .xls, .xlsx and .csv only",
            uploadStopAnotherFile : "You cannot upload another file until your previously uploaded file processing has been completed",
            addActiveProducts : "Please add only Active Products.",
            addProducts : "At least one Product should be added to continue",
            addExpoProducts : "One or more products that you have added is not Exportable. For International Orders, add only Exportable products.",
            addProductError : "Oops..an error occurred when adding the product. Please try again.",
            labelInvalid : "Please select a valid label type from the available templates",
            labelDownloadSuccess : "Label downloaded successfully",
            labelDownloadError : "Oops..an error occurred when downloading the label. Please try again.",
            required : "This field is mandatory",
            invalidnumber : "This field should be a positive number",
            invalidweight : "Weight should be a positive number less than 30 Kg",
            invalidhscode : "HS Code should be at least 6 characters",
            invalidemail : "Email ID format is invalid",
            invalidphone : "Phone is invalid",
            countryFetchError : "Oops..an error occurred when downloading the country list. Please refresh the page to try again",
            currencyFetchError : "Oops..an error occurred when downloading the country list. Please refresh the page to try again",
            viewStatus : "View Status",
            fileProcessingCompleted : "File upload has been processed. Click here to view the status.",
            warnSessionExpire : "Your session will expire in a few seconds due to inactivity. Click continue to keep the session active.",
            continueBrowsing : "Continue..",
            logOut : "Logout",
            //login
            invalidCredential : "The Username or Password your entered is incorrect.",
            loginSuccess : "Login successful",
            logoutSuccess : "You have been logged out. Thank you.",
            logoutError : "Oops..an error occurred when logging out. Please try again.",
            resendVerificationSuccess : "Verification link has been sent to your email",
            resendVerificationError : "Oops..an error occurred when triggering the verification link, please try again later.",
            resetPasswordError : "Oops..an error occurred when resetting the password. Please try again.",
            resetChangePWErrorMsg: "Oops..an error occurred when changing the password. Please try again.",
            resetLinkExpireMsg: "Oops..your reset password link has expired. Please try again.",
            mechActivationError:"Oops..an error occurred when activating your account. Please try again or contact Client Service.",
            //Products
            productDetail : "Product Details",
            productList : "Product List",
            productListFetchError: "Oops..an error occurred when fetching Products list. Please try again by refreshing the page.",
                  warnInactiveProductCreation : "Are you sure you want to create this Product in Inactive status?",
                  productCreateSuccess : "Product created successfully.",
                  productCreateError : "Oops..an error occurred when creating the Product. Please try again by refreshing the page.",
            productFetchError : "Oops..an error occurred when fetching Product details. Please try again by refreshing the page.",
            productUpdateSucess : "Product details updated successfully.",
            productUpdateError : "Oops..an error occurred when updating the product. Please try again.",
            productArchiveConfirm : "Are you sure you want to Archive this Product?",
            productArchiveSuccess : "Product has been archived successfully.",
            productArchiveError : "Oops..an error occurred when archiving the Product, please try again.",
            productRestoreConfirm : "Are you sure you want to restore this Product?",
            productRestoreSuccess : "Product has been restored successfully.",
            productRestoreError : "Oops..an error occurred when restoring the product. Please try again.",
            productUploadError : "Oops..an error occurred when uploading Products. Please try again.",
            productCountFetchError: "Oops..an error occurred when fetching product count under each status. Please try again by refreshing the page.",
            productFileProcessingCompleted : "Product file upload has been processed. Click here to view the status.",
            //Shipments
            shipmentDetail : "Shipment Details",
            shipmentList : "Shipment List",
            shipmentListFetchError: "Oops..an error occurred when fetching the Inbound Shipments list. Please try again by refreshing the page.",
                  shipmentCreateSuccess : "Inbound Shipment created successfully.",
            shipmentCreateError : "Oops..an error occurred when creating the Inbound shipment. Please try again.",
            shipmentFetchError : "Oops..an error occurred when fetching Inbound Shipment details. Please try again by refreshing the page.",
            shipmentUpdateSucess : "Inbound Shipment updated successfully.",
            shipmentUpdateError : "Oops..an error occurred when updating the Inbound Shipment. Please try again.",
            shipmentCancelConfirm : "Are you sure you want to Cancel this Inbound Shipment?",
            shipmentCancelSuccess : "Inbound Shipment has been cancelled.",
            shipmentCancelError : "Oops. an error occurred when cancelling the  Inbound Shipment. Please try again.",
            shipmentRestoreConfirm : "Are you sure you want to Restore this Inbound Shipment?",
            shipmentRestoreSuccess : "Inbound Shipment restored successfully.",
            shipmentRestoreError : "Oops..an error occurred when restoring the shipment. Please try again.",
            shipmentUploadError : "Oops.. an error occurred when uploading the shipment. Please try again.",
            shipmentCountFetchError: "Oops.. an error occurred when fetching Inbound Shipment count under each status. Please try again by refreshing the page.",
            shipmentFileProcessingCompleted : "Shipment file upload has been processed. click here to view the status.",
            shipmentLeadTimeError : "Oops. an error occurred when fetching the lead time. Please try again.",
            //Orders
                  orderDetail : "Order Details",
            orderList : "Order List",
            orderListFetchError: "Oops..an error occurred when fetching the Orders list. Please try again by refreshing the page.",
                  orderCreateSuccess : "Order created successfully.",
            orderCreateError : "Oops.. an error occurred when creating the Order. Please try again.",
            orderDraftSuccess : "Order saved as Draft successfully.",
            orderDraftError : "Oops..an error occurred when saving the Order as draft. Please try again.",
            orderFetchError : "Oops.. an error occurred when fetching order details. Please try again by refreshing the page.",
            orderUpdateSucess : "Order has been updated successfully.",
            orderUpdateError : "Oops.. an error occurred when updating the Order. Please try again.",
            orderCancelConfirm : "Are you sure you want to Cancel this Order?",
            orderCancelSuccess : "Order has been Cancelled.",
            orderCancelError : "Oops..an error occurred when Cancelling the Order. Please try again or contact our Client Service.",
            orderRestoreConfirm : "Are you sure you want to Restore this Order?",
            orderRestoreSuccess : "Order has been restored successfully.",
            orderRestoreError : "Oops.. an error occurred when restoring the order. Please try again.",
            orderUploadError : "Oops.. an error occurred when uploading Orders. Please try again.",
            insuranceUpdateSuccess : "Enhanced Liability (EL) charges has been updated successfully",
            orderCountFetchError : "Oops.. an error occurred when fetching Orders count under each status. Please try again by refreshing the page.",
            orderFileProcessingCompleted : "Orders file upload has been processed. Click here to view the status.",
            orderCarrierServiceError : "Oops..an error occurred when fetching the Delivery options for this order. Please try again by refreshing the page.",
            orderApproveSuccess : "Order with ID: ## approved successfully.",
            orderApproveError : "Error in approving order, please try again later.",
            noCarrierAvailable : "Sorry. We could not find any suitable delivery option for your order. This can be due to weight limitations, destination Country or the combination of Products in your Order. If you think this is an error, please contact client Service.",
            
            
            //header Text - products
            headerProductActive:'Active Products can be used to create Shipments and Orders. Active Products cannot be made inactive if there is existing inventory in the warehouse, impending Shipment or open orders.',
            
            headerProductInActive:'Inactive products are not allowed for creating Shipments and Orders. Products can be made inactive because they are not sold anymore or temporarily discontinued or seasonal products etc. You can change a Product to active status at any time.',
            
            headerProductAll:'Create and manage your product catalog here. Add products one at a time by typing the product information or in bulk by uploading a file using our standard template. Once Products are created and activated, you can use them to create shipments, orders and do more',
            
            // Header - Title - Products

            headerTitleProductActive:'Products - Active',

            headerTitleProductInActive:'Products - Inactive',

            headerTitleProductAll:'Products - Catalog',


            noProductsHeaderTextActive:"You don't have any Active products in your catalog.",
            noProductsHeaderSubTextActive:"Start by adding products by filling out the product information manually or bulk upload products using a spreadsheet.",

            noProductsHeaderTextInactive:"You don't have any Inactive products in your catalog.",
            noProductsHeaderSubTextInactive:"You can move your discontinued or seasonal products to inactive status.",

            noProductsHeaderTextAll:"You don't have any products in your catalog.",
            noProductsHeaderSubTextAll:"Start by adding products by filling out the product information manually or bulk upload products using a spreadsheet.",
            
            noProductsHeaderTextFilter:"No Products matching filter criteria",
            noProductsHeaderSubTextFilter:"",


            
            //header Text - shipment
            headerShipPending:'Inbound Shipment consists of a list of active products and corresponding inventory (number of units) that you want to send to the warehouse. Your pending shipments are shown here. Click the Edit icon to modify the shipment details. Once you have prepared and labeled the shipment, you can update the shipment status to In Transit.',
            
            headerShipInTransit:'We are expecting to receive your shipment on the estimated arrival date. You can still print and paste labels if you have not sent your shipment. We will receive the inventory once the complete shipment has arrived and update the shipment status.',
            
            headerShipReceived:'We have received your shipment. You can view the shipment receipt which shows the number of units received against each product in the shipment. If we received any unidentified products in your shipment, our client service will contact you for further disposition.',
            

            // View Shipments - In Transit
            headerShipViewInTransit:'We are expecting to receive your shipment on the estimated arrival date. You can still print and paste labels if you have not sent your shipment. We will receive the inventory once the complete shipment has arrived and update the shipment and inventory status.',

            // View Shipments - Received
            headerShipViewReceived:'We have received your shipment. You can view the shipment receipt which shows the number of units received against each product in the shipment. If we received any unidentified products in your shipment, our client service will contact you for further disposition.',

            // View Shipments - Cancelled
            headerShipCancelled:'All cancelled inbound Shipments are listed here for your reference. Cancelled Shipments are shown only for your reference and cannot be restored.',



            noShipmentsHeaderTextPending:"You don't have any Shipment in Pending status.",
            noShipmentsHeaderSubTextPending:"Create a Shipment to send/replenish inventory. Read our Shipment guide on the best practices employed for labelling and packaging.",

            noShipmentsHeaderTextInTransit:"You don't have any Shipment in In transit.",
            noShipmentsHeaderSubTextInTransit:"Send your inventory to the warehouse by creating a Shipment.",

            noShipmentsHeaderTextReceived:"You don't have any Shipment in received status. Send one now!",
            noShipmentsHeaderSubTextReceived:"",

            noShipmentsHeaderTextCancelled:"You don't have any Shipment in Cancelled status.",
            noShipmentsHeaderSubTextCancelled:"",

            noShipmentsHeaderTextFilter:"No Shipments matching filter criteria",
            noShipmentsHeaderSubTextFilter:"",


            // Header - Title - Shipments

            headerTitleShipPending:'Shipments - Pending',
            headerTitleShipInTransit:'Shipments - In Transit',
            headerTitleShipReceived:'Shipments - Received',
            headerTitleShipCancelled:'Shipments - Cancelled',
            
            //header Text - orders
            headerOrdersAll:'All your orders from different channels and multiple statuses are shown here. Orders can be created one at a time or in bulk by uploading a file using our standard template. If you are connected to a sales channel, your orders will be automatically imported. Click on other views in the left to filter orders by specific statuses.',
            
            headerOrdersHasIssue:'Has Issues orders have one or more problems that need your attention before they can be approved. All issues pertaining to this order are listed below. This can be missing or invalid inputs, unidentified products or insufficient inventory for products in the order. Inventory will not be reserved for products inside these orders until they are approved.',
            
            headerOrdersUnapproved:'Unapproved orders are awaiting your approval before they can be processed and fulfilled. Inventory will not be reserved for products inside these orders until they are approved.',
            
            headerOrdersInprocess:'In Process orders have been approved by you earlier and can no longer be edited. These orders are being processed in our system and waiting for fulfillment.',
            
            headerOrdersUnderFull:'Fulfillment orders have been sent to the warehouse and are being picked and packed for your customers. A packing list will be enclosed in every order with the date, order id, header and footer message as provided. Refer to the order history at the bottom for detailed tracking milestones.',
            
            headerOrdersShipped:'Shipped orders have been dispatched from our warehouse using the delivery method selected by you. You can find the tracking number under the Order specification. Refer to the Order History for detailed tracking milestones. Some delivery methods may not provide detailed tracking information.',
            
            headerOrdersDelivered:'Delivered orders have been successfully received by your customers.',
            
            headerOrdersDraft:'Draft orders are orders saved by you earlier which are not yet validated. Click the Edit icon to continue to edit, create and approve the order. Inventory will not be reserved for products added inside draft orders.',
            
            headerOrdersCancelled:'All cancelled orders are listed here for your reference.',


            // Header - Title - Orders
            headerTitleOrdersHasIssue    :'Orders - Has Issues',
            headerTitleOrdersAll         :'Orders - All',
            headerTitleOrdersUnapproved  :'Orders - Unapproved',
            headerTitleOrdersInprocess   :'Orders - In Process',
            headerTitleOrdersUnderFull   :'Orders - Fulfillment',
            headerTitleOrdersShipped     :'Orders - Shipped',
            headerTitleOrdersDelivered   :'Orders - Delivered',
            headeTitlerOrdersDraft       :'Orders - Drafts',
            headerTitleOrdersCancelled   :'Orders - Cancelled',

            // View Orders - Has Issues
            headerOrderViewHasIssues:'Has Issues orders have one or more problems that need your attention before they can be approved. All issues pertaining to this order are listed below. This can be missing or invalid inputs, unidentified products or insufficient inventory for products in the order. Inventory will not be reserved for products inside these orders until they are approved.',

            // View Orders - Unapproved
            headerOrderViewUnapproved:'Unapproved orders are awaiting your approval before they can be processed and fulfilled. Inventory will not be reserved for products inside these orders until they are approved.',
          
            // View Orders - In Process
            headerOrderViewInProcess:'In Process orders have been approved by you earlier and can no longer be edited. These orders are being processed in our system and waiting for fulfillment. Refer to the order history at the bottom for detailed tracking milestones.',

            // View Orders - Fulfillment
            headerOrderViewUnderFulfilment:'Fulfillment orders have been sent to the warehouse and are being picked and packed for your customers. A packing list will be enclosed in every order with the date, order id, header and footer message as provided.',
          
            // View Orders - Shipped
            headerOrderViewShipped:'Shipped orders have been dispatched from our warehouse using the delivery method selected by you. You can find the tracking number under the Order specification. Refer to the Order History at the bottom for detailed tracking milestones. Some delivery methods may not provide detailed tracking information.',
           
            // View Orders - Delivered
            headerOrderViewDelivered:'Delivered orders have been successfully received by your customers. Refer to the order history at the bottom for detailed tracking milestones.',

            noOrdersHeaderTextAll:"You don't have any Orders.",
            noOrdersHeaderSubTextAll:"You can create orders manually through the user interface or by uploading a spreadsheet.",

            noOrdersHeaderTextHasIssues:"You don't have any Orders in Has Issues status. All Clear!",
            noOrdersHeaderSubTextHasIssues:"",

            noOrdersHeaderTextUnaproved:"You don't have any Orders under Unapproved.",
            noOrdersHeaderSubTextUnapproved:"You can create an order and leave it in unapproved to revisit it later.",

            noOrdersHeaderTextInProcess:"You don't have any Orders in In Process.",
            noOrdersHeaderSubTextInProcess:"We are super-fast in approving your orders.",

            noOrdersHeaderTextUnderFulfillment:"You don't have any orders in Fulfillment status.",
            noOrdersHeaderSubTextUnderFulfillment:"",

            noOrdersHeaderTextShipped:"You don't have any orders in Shipped status.",
            noOrdersHeaderSubTextShipped:"",

            noOrdersHeaderTextDelivered:"You don't have orders in Delivered Status.",
            noOrdersHeaderSubTextDelivered:"",


            noOrdersHeaderTextDrafts:"You don't have any orders in Drafts.",
            noOrdersHeaderSubTextDrafts:"Saving a draft allows you to save an order and revisit it later.",

            noOrdersHeaderTextCancelled:"You don't have any Orders in Cancelled status.",
            noOrdersHeaderSubTextCancelled:"",

            noOrdersHeaderTextFilter:"No orders matching filter criteria",
            noOrderssHeaderSubTextFilter:"",
            
           //accounts
            ebaySuccessTokenAdd:"Channel has been added successfully.",
            ebayChannelError:"Oops.. an error occurred when adding the Channel. We apologize for the inconvenience. Please try again.",
            ebayChannelListingError:"Oops.. an error occurred when fetching the list of available channels. Please try again by refreshing the page.",

            //accounts/users
            updateUserError:"Oops..an error occurred when updating user. Please try again or contact Client Service.",
            updateUserSuccess:"Sub-user updated successfully",
            createUserError:"Oops..an error occurred when creating new user. Please try again or contact Client Service.",

            //preferences
            emailFetchError :"Oops..an error occurred when fetching Email Preferences. Please try again by refreshing the page." ,
            emailSaveSuccess :"Email Preferences have been saved successfully",
            emailSaveError :"Oops..an error occurred when saving Email Preferences. Please try again.",
            
            othersFetchError :"Oops. an error occurred when fetching Other Preferences. Please try again by refreshing the page.",
            othersSaveSuccess :"Other preferences have been saved successfully",
            othersSaveError :"Oops.. an error occurred when saving Other Preferences. Please try again.",
            
            fulfillmentFetchError : "Oops.. an error occurred when fetching Order Preferences. Please try again by refreshing the page.",
            fulfillmentSaveError : "Oops.. an error occurred when saving Order Preferences. Please try again.",
            fulfillmentSaveSuccess : "Order preferences have been saved successfully",
            switchContextError  : "Oops..an error occurred when switching Merchant context. Please try again.",
            
            //Orders
            cancelOrderError: "Oops.. an error occurred when cancelling the order. Please try again by refreshing the page.",


            //merchant
            merchantListFetchError: "Oops.. an error occurred when fetching Merchants list. Please try again by refreshing the page.",
            orderMerchantIdNotAvailable : "Merchant Order ID entered is already in use.Please enter a different and unique Merchant Order ID.",
            orderMerchantIdServiceError : "Oops.. an error occurred when validating the Merchant Order ID. Please try again.",
            merchantActivateError       : "Oops.. an error occurred when Activating the Merchant. Please try again or contact technical support.",
            editMerchantError           : "Oops.. an error occurred when updating Merchant information. Please try again or contact technical support.",
            merchantFetchError          : "Oops..an error occurred when fetching Merchants list. Please try again by refreshing the page or contact technical support.",
            changePwError               : "Oops.. an error occurred when changing Password. Please try again or contact Client Service.",
            changePwEWrong              : "Incorrect current password.",
            paymentFetchError           : "Oops.. an error occurred when fetching Payments list for Merchant. Please try again by refreshing the page.",
            merchantAutoApproveError    : "Oops.. an error occurred when changing Automatic Order Approval. Please try again by refreshing the page.",
            merchantAutoApproveSuccess  : "Automatic Order Approval successfully changed.",
            merchantApplySmeSuccess     : "Merchant preferences successfully updated.",
            merchantApplySmeError       : "Oops.. an error occurred when changing the Merchant preferences. Please try again.",

            merchantSpringApproveSuccess: "Merchant preferences successfully updated.",
            merchantSpringApproveError  : "Oops.. an error occurred when changing the Application Outcome. Please try again.",
            merchantSpringDateError  : "Subsidy start date should be less than Subsidy end date.",

            //Billing
            errorBillingSummary         : "Error in fetching Billing Summary",
            errorInvoices               : "Error in fetching Merchant Invoices",

            //Activate Error
            verificationFailedHdr       : "Verification Failed",
            verificationFailedBody      : "Oops! The verification link has expired. Please initiate the resend verification email from the login page if you have not verified.",
            verificationErrorHdr        : "Error",
            verificationErrorBody       : "Oops! Something went wrong",

            //Dashboard Popup form 

            popUpEmptyFile  : "Please choose a file to upload",
            popUpWrongFileExtension  : "only .jpg .jpeg .png .bmp files allowed",
            popUpSubmitProcessing  : "Processing ...",
            popUpSubmitSuccess  : "Request Submitted Successfully",
            popUpSubmitError  : "Error in submitting Request"

            
      }
});