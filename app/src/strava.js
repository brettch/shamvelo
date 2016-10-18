'use strict';

// Strava API.
var strava = require('strava-v3');

// Util module.
var util = require('./util');

function getOAuthRequestAccessUrl() {
  console.log('Generating OAuth request access URL');
  var accessUrl = strava.oauth.getRequestAccessURL({});
  console.log('Access URL: ' + accessUrl);
  return accessUrl;
}

function getOAuthToken(code, callback) {
  console.log('Getting OAuth token based on temporary code ' + code);
  strava.oauth.getToken(code, function(err, payload) {
    if (err) {
      console.log('Received error from getToken service:\n' + util.stringify(err));
      callback(err);
    } else {
      //console.log("Received oauth payload:\n" + util.stringify(payload));
      callback(null, payload);
    }
  });
}

function getAthlete(token, callback) {
  console.log('Getting athlete with token ' + token);
  strava.athlete.get({ 'access_token': token }, function(err, payload) {
    if (err) {
      console.log('Received error from athlete.get service:\n' + util.stringify(err));
      callback(err);
    } else {
      //console.log("Received athlete payload:\n" + util.stringify(payload));
      callback(null, payload);
    }
  });
}

function getActivities(token, pageCallback, callback) {
  console.log('Getting athlete activities with token ' + token);
  // Create recursive function to retrieve all activity pages.
  var getActivityPage = function(page) {
    console.log('Getting athlete activities page ' + page);
    strava.athlete.listActivities(
      {
        'access_token': token,
        'page': page,
        'per_page': 100
      },
      function(err, payload) {
        if (err) {
          console.log('Received error from athlete.listActivities service:\n' + util.stringify(err));
          callback(err);
        } else {
          //console.log("Received activities payload:\n" + util.stringify(payload));
          if (payload.length > 0) {
            pageCallback(payload, function(err) {
              if (err) callback(err);
              else getActivityPage(page + 1);
            });
          } else callback(null);
        }
      }
    );
  };

  // Begin retrieving pages from page 1.
  getActivityPage(1);
}

module.exports = {
  getOAuthRequestAccessUrl: getOAuthRequestAccessUrl,
  getOAuthToken: getOAuthToken,
  getAthlete: getAthlete,
  getActivities: getActivities
};
