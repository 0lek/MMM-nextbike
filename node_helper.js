/* Magic Mirror
 * Module: MMM-socialbicycles
 *
 * By 0lek
 * based on MMM-nextbike
 * MIT Licensed.
 */

const request = require('request');
const NodeHelper = require("node_helper");



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
			this.getData(socialbike_url, this.config.stationID);
        }
    },

	parseData: function(input) {
				var socialBikeData = "";
				socialBikeData = JSON.parse(JSON.stringify(input));
				return socialBikeData;
	},
	
	
    getData: function(options, stationID) {
		request(options, (error, response, body) => {
	        if (response.statusCode === 200) {
				this.sendSocketNotification("BIKES" + stationID, this.parseData(body));
				} else {
                console.log("Error getting social bicycles data " + response.statusCode);
            }
        });
    }
});