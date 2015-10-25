define([], function () {
        
         /* UNITQUE short naming conventions
         *
         *  #FN# - FILE NAME - NOT IN USE
         *  #CC# - CREATED COUNT
         *  #RC# - REJECTED COUNT
         *  #FS# - FILE STATUS (processing or success or error or partial success or rejected)
         *  #INBR# - SHIPMNET RECEIVED
         *  #CHNL# - SHIPMNET RECEIVED
         *  #CHNLSTAT# - SHIPMNET RECEIVED
         **************************/
        
		return templates  = [
        
           {eventName:'dataImportDone', eventType:1, headerText:'Product Upload completed', bodyText:'Product upload #FS#. #CC#  #RC#', linkText:'Summary', link:'#/products/upload', cssClass:'glyphicon productUploadIcon'},
           
           {eventName:'dataImportDone', eventType:2, headerText:'Shipment Upload completed', bodyText:'Shipment upload #FS#. #CC#  #RC#', linkText:'Summary', link:'#/shipments/upload', cssClass:'glyphicon shipmentUploadIcon',viewLink:'#/shipments/view/'},
           
           {eventName:'dataImportDone', eventType:3, headerText:'Order Upload completed', bodyText:'Order upload #FS#. #CC#  #RC#', linkText:'Summary', link:'#/orders/upload', cssClass:'glyphicon orderUploadIcon'},
           
           {eventName:'inboundReceiptUpdateInventory', eventType:null, headerText:'Shipment Received', bodyText:'Shipment ##INBR# received.', linkText:'Summary', link:'#/shipments/view/', cssClass:'glyphicon shipmentUploadIcon'},

           {eventName:'merchantAddChannel', eventType:null, headerText:'Add Channels', bodyText:'#CHNL# channel #CHNLSTAT#.', linkText:'Summary', link:'#/accounts/connections/', cssClass:'glyphicon addChannelIcon'},
                
        ];
});