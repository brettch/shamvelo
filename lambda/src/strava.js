'use strict';

module.exports = {
  getOAuthRequestAccessUrl,
  getOAuthToken,
  getAthlete,
  getActivities
};

require('./config');

const Rx = require('rx');
const strava = require('strava-v3');
const util = require('./util');

const rxo = Rx.Observable;

function getOAuthRequestAccessUrl() {
  return strava.oauth.getRequestAccessURL({});
}

function getOAuthToken(code) {
  return rxo.create(observer => {
    strava.oauth.getToken(code, function(err, payload) {
      if (err) {
        observer.onError(err);
      } else {
        observer.onNext(payload);
        observer.onCompleted();
      }
    });
  });
}

function getAthlete(token) {
  return rxo.create(observer => {
    strava.athlete.get({ 'access_token': token }, function(err, payload) {
      if (err) {
        observer.onError(err);
      } else {
        observer.onNext(payload);
        observer.onCompleted();
      }
    });
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
