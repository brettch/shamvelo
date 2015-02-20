'use strict';

// Strava API.
var strava = require('strava-v3');

// Util module.
var util = require('./util');

function getOAuthRequestAccessUrl() {
	var accessUrl = strava.oauth.getRequestAccessURL({});
	console.log("Access URL: " + accessUrl);
	return accessUrl;
}

function getOAuthToken(code, callback) {
	strava.oauth.getToken(code, function(err, payload) {
		if (err) {
			console.log("Received error from getToken service:\n" + util.stringify(err));
			callback(err);
		} else {
			console.log("Received oauth payload:\n" + util.stringify(payload));
			callback(null, payload);
		}
	});
}

module.exports = {
	getOAuthRequestAccessUrl: getOAuthRequestAccessUrl,
	getOAuthToken: getOAuthToken
};

