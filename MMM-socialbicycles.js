/* Magic Mirror
 * Module: MMM-socialbicycles
 *
 * By 0lek
 * MIT Licensed.
 */

Module.register("MMM-socialbicycles", {

    defaults: {
		apiBase: 'https://app.socialbicycles.com/api/',
		stationID: 2039,
		showBikes: false,
		nob: '',
        reload: 1 * 60 * 1000       // every minute
    },

    getTranslations: function () {
        return {
        	pl: "translations/pl.json",
            en: "translations/en.json",
            de: "translations/de.json",
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
			 Log.info("SoBi conf reloaded");
    },
		
    socketNotificationReceived: function (notification, payload) {
		if (notification === "BIKES" + this.config.stationID) {
			this.socialBikeData = JSON.parse(payload);
			this.config.stationName = this.socialBikeData.name;
			this.updateDom();			
	    }
	},

    getDom: function () {
					
		// Auto-create MagicMirror header

		var wrapper = document.createElement("div");
        var header = document.createElement("header");
        header.innerHTML = '<i class="fa fa-bicycle" aria-hidden="true"></i>';
        header.innerHTML += " ";
        header.innerHTML += this.config.stationName;
        wrapper.appendChild(header);
	
		// Loading data notification
		
	    if (!this.socialBikeData) {
			var text = document.createElement("div");
            text.innerHTML = this.translate("LOADING");
            text.className = "small dimmed";
            wrapper.appendChild(text);
        
		}
		else 
		{
			
		// Create bike table once data is received
			
			var table = document.createElement("table");
			table.classList.add("small", "table");
			table.border='0';
			table.appendChild(this.createSpacerRow());
			table.appendChild(this.createAmountRow());
			table.appendChild(this.createSpacerRow());
						
			
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
		if (!this.socialBikeData.available_bikes){
			amount.innerHTML = this.translate("NO-BIKES-AVAILABLE");
		} else {
			amount.innerHTML = this.translate("BIKES-AVAILABLE") + " " + this.socialBikeData.available_bikes;
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