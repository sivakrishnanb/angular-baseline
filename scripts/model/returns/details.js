define(['map'], function (map) {

	var model = function () {

		var self = this;
        var arg = arguments[0];

        this.returns = function() {
			this.merchantId = "";
			this.merchantOrderId = "";
			this.noOfBoxes = "";
			this.returnsTo = "";
			this.displayableReturnDate = "";
			this.labelRecipient = "";
			this.labelRecipientEmail = "";
			this.reason = "";
			this.fromName = "";
			this.fromAddressLine1 = "";
			this.fromAddressLine2 = "";
			this.fromCity = "";
			this.fromState = "";
			this.fromCountry = "";
			this.fromZipCode = "";
			this.fromPhone = "";
			this.fromEmail = "";
			this.toName = "";
			this.toAddressLine1 = "";
			this.toAddressLine2 = "";
			this.toCity = "";
			this.toState = "";
			this.toCountry = "";
			this.toZipCode = "";
			this.toPhone = "";
			this.toEmail = "";
			this.status = "";
			this.totalWeight = "";
			this.trackingNo = null;
			map.apply(this, arguments);
		}

		this.lineItems = function() {
			this.returnsBoxId=null;
			this.returnsId=null;
			this.weight=null;
			this.createdBy=null;
			this.createdDate=null;
			map.apply(this, arguments);
		}

		this.history = null;
		this.lineItems = arg ? _.map(arg.lineItems, function(item){ return new self.lineItems(item) }) : [];
		this.returns = arg ? new self.returns(arg.returns || null) : new self.returns();

		map.apply(this, arguments);

	};

	return model;
});