'use strict';

const { of, from, empty, merge } = require('rxjs');
const { map, mergeMap, tap } = require('rxjs/operators');
const strava = require('strava-v3');

module.exports.start = start;

function start(getTokenById, saveTokenById) {
  return {
    getOAuthRequestAccessUrl,
    getOAuthToken,
    getAthlete,
    getActivities
  };

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

  async function refreshToken(athleteId) {
    const existingToken = await getTokenById(athleteId);
    const updatedToken = await strava.oauth.refreshToken(existingToken.refresh_token);
    const updatedTokenWithId = {
      id: athleteId,
      ... updatedToken
    };
    await saveTokenById(athleteId, updatedTokenWithId);
  }

  async function invokeActionWithTokenRefresh(action, athleteId) {
    try {
      return await action();

    } catch(err) {
      console.log('strava api failed, will refresh token:', err);
    }

    // Refresh token and try again.
    await refreshToken(athleteId);
    return await action();
  }

  async function getAthlete(athleteId) {
    console.log(`Getting athlete ${athleteId}`);
    return invokeActionWithTokenRefresh(
      getAthleteImpl,
      athleteId
    );

    async function getAthleteImpl() {
      const token = await getTokenById(athleteId);
      const athlete = await strava.athlete.get({ 'access_token': token.access_token });
      return athlete;
    }
  }
  
  function getActivities(athleteId) {
    console.log(`Getting athlete ${athleteId} activities`);

    // Create recursive function to retrieve all activity pages.
    function getActivityPage(page) {
      return of({}).pipe(
        tap(() => console.log(`Getting athlete activities page ${page}`)),
        mergeMap(() => from(invokeActionWithTokenRefresh(
          getActivitiesPageImpl,
          athleteId
        ))),
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

      async function getActivitiesPageImpl() {
        const token = await getTokenById(athleteId);
        const parameters = {
          'access_token': token.access_token,
          'page': page,
          'per_page': 100
        };
        return await strava.athlete.listActivities(parameters);
      }
    }
  
    // Begin retrieving pages from page 1.
    return getActivityPage(1);
  }
}
