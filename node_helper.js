/* Magic Mirror
 * Module: MMM-socialbicycles
 *
 * By 0lek
 * based on MMM-nextbike
 * MIT Licensed.
 */

var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

	
	/* getParams
	 * Generates an url with api parameters based on the config.
	 *
	 * return String - URL params.
	 */
	
	getParams: function() {
			var params = "hubs/";
			params += this.config.stationID;
			return params;
	},
	
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'CONFIG'){
        	this.config = payload;
			var socialbike_url = this.config.apiBase + this.getParams();
			console.log("Getting data: " + this.name);
			
			var options = {
				url: socialbike_url,
				auth: {
    				'user': null,
    				'pass': null,
    				'sendImmediately': true,
    				'bearer': this.config.sobiAccessToken
  				}
			};
			
			this.getData(options, this.config.stationID);
        }
    },

	parseData: function(input) {
		var socialBikeData = "";
		socialBikeData = JSON.parse(JSON.stringify(input));
		return socialBikeData;
	},
	
	sendData: function(sobi_data) {
		var sobi_json = JSON.parse(sobi_data)
		this.sendSocketNotification("BIKES" + stationID, sobi_json)
	},
	
	getData: function(options, stationID) {
		request(options, (error, response, body) => {
	        if (response.statusCode === 200) {
				this.sendSocketNotification("BIKES" + stationID, this.parseData(body));
			}
			else {
                console.log("Error getting social bicycles data " + response.statusCode);
            }
        });
    }
});