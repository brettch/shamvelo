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

function getActivities(token) {
  return getActivitiesFromPage(1);

  function getActivitiesFromPage(page) {
    return getActivitiesAtPage(page)
      .flatMap(activities => {
        const obsArrActivities = [];
        obsArrActivities.push(rxo.from(activities));
        if (activities.length > 0) {
          obsArrActivities.push(getActivitiesFromPage(page + 1));
        }
        return rxo.concat(obsArrActivities);
      });
  }

  function getActivitiesAtPage(page) {
    console.log('Getting athlete activities page', page);

    return rxo.create(observer => {
      strava.athlete.listActivities({
        'access_token': token,
        'page': page,
        'per_page': 100
      }, function(err, activities) {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(activities);
          observer.onCompleted();
        }
      });
    });
  }
}
