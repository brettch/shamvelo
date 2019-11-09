'use strict';

const { of, from, empty, merge } = require('rxjs');
const { map, mergeMap, tap } = require('rxjs/operators');
const strava = require('strava-v3');

function getOAuthRequestAccessUrl() {
  console.log('Generating OAuth request access URL');
  var accessUrl = strava.oauth.getRequestAccessURL({
    scope : ['read', 'activity:read']
  });
  console.log('Access URL: ' + accessUrl);
  return accessUrl;
}

async function getOAuthToken(code) {
  console.log('Getting OAuth token based on temporary code ' + code);
  return strava.oauth.getToken(code);
}

async function getAthlete(token) {
  console.log('Getting athlete with token ' + token);
  return strava.athlete.get({ 'access_token': token });
}

function getActivities(token) {
  console.log('Getting athlete activities with token ' + token);

  // Create recursive function to retrieve all activity pages.
  function getActivityPage(page) {
    return of(page).pipe(
      tap(page => console.log(`Getting athlete activities page ${page}`)),
      map(page => ({
        'access_token': token,
        'page': page,
        'per_page': 100
      })),
      mergeMap(parameters => from(strava.athlete.listActivities(parameters))),
      mergeMap(activities => {
        if (activities.length > 0) {
          return merge(
            activities,
            getActivityPage(page + 1)
          );
        } else {
          return empty();
        }
      })
    );
  }

  // Begin retrieving pages from page 1.
  return getActivityPage(1);
}

module.exports = {
  getOAuthRequestAccessUrl: getOAuthRequestAccessUrl,
  getOAuthToken: getOAuthToken,
  getAthlete: getAthlete,
  getActivities: getActivities
};
