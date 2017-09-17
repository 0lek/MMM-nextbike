/* Magic Mirror
 * Module: MMM-nextbike
 *
 * By yo-less
 * MIT Licensed.
 */

Module.register("MMM-socialbicycles", {

    defaults: {
		apiBase: 'https://app.socialbicycles.com/api/',
		stationID: 2039,
		stationName: 'socialbike',
		showBikes: true,
		nob: '',
        reload: 1 * 60 * 1000       // every minute
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
        };
    },

    getStyles: function () {
        return ["MMM-socialbicycles.css", "font-awesome.css"];
    },

    start: function () {
		var self = this;
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("CONFIG", this.config);
        Log.info("Sent CONFIG");
		setInterval(
			function()
			{self.sendSocketNotification("CONFIG", self.config);}
			,this.config.reload);
    },

		
    socketNotificationReceived: function (notification, payload) {
		if (notification === "BIKES" + this.config.stationID) {
			this.socialBikeData = payload.$;
			this.config.stationName = this.socialBikeData.name;
			this.updateDom();			
	    }
	},

    getDom: function () {
					
		// Auto-create MagicMirror header

		var wrapper = document.createElement("div");
        var header = document.createElement("header");
		if (this.config.stationName !== "socialbike") { 
        header.innerHTML = this.config.stationName;
		} else {
		header.innerHTML = this.config.stationName;
		}
        wrapper.appendChild(header);
	
		// Loading data notification
		
	    if (!this.socialBikeData) {
			var text = document.createElement("div");
            text.innerHTML = this.translate("LOADING");
            text.className = "small dimmed";
            wrapper.appendChild(text);
        
		} else {
			
		// Create bike table once data is received
			
			var table = document.createElement("table");
			table.classList.add("small", "table");
			table.border='0';
			table.appendChild(this.createSpacerRow());
			table.appendChild(this.createAmountRow());
			table.appendChild(this.createSpacerRow());
						
		// List available bikes via a bike array
		
		if (this.config.showBikes)	{	// Make sure user wants to see the bikes
		
			if (!this.socialBikeData.bike_numbers){
				this.hide(10000);						
			} else {
				
				if (this.hidden) {
					this.show(5000);
				} 
				
				var bikeArray = this.socialBikeData.bike_numbers.split(",");
				if (!this.config.nob) {this.config.nob = 100;}
				for (var i=0; (i<bikeArray.length) && (i<this.config.nob);i++){
					var bikeNumber = bikeArray[i];
					table.appendChild(this.createDataRow(bikeNumber));	
				}
			}
			
		}
			
		wrapper.appendChild(table);
				
		}
		
		return wrapper; 
		
	},
	
	createSpacerRow: function () {
        var spacerRow = document.createElement("tr");
		
		var spacerHeader = document.createElement("td");
		spacerHeader.className = "spacerRow";
		spacerHeader.setAttribute("colSpan", "2");
		spacerHeader.innerHTML = "";
		spacerRow.appendChild(spacerHeader); 
      	
		return spacerRow;
    },
	
		createAmountRow: function () {
        var amountRow = document.createElement("tr");
		
		var amount = document.createElement("td");
		amount.className = "amountRow";
		amount.setAttribute("colSpan", "2");
		if (!this.socialBikeData.bike_numbers){
			amount.innerHTML = this.translate("NO-BIKES-AVAILABLE");
		} else {
			amount.innerHTML = this.translate("BIKES-AVAILABLE") + " " + this.socialBikeData.bikes;
		}
		amountRow.appendChild(amount); 
      	
		return amountRow;
    },

    createDataRow: function (data) {
        var row = document.createElement("tr");
		
		var symbol =  document.createElement("td");
		symbol.setAttribute("width","8px");
		symbol.className = "fa fa-bicycle";
		row.appendChild(symbol);
				
		var bikeNo = document.createElement("td");
		bikeNo.className = "bikeNo";
        bikeNo.innerHTML = data;
		
        row.appendChild(bikeNo);
		
        return row;
    }

});