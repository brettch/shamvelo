import _ from 'lodash';
import { of, from, empty, merge } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import stravaLib from 'strava-v3';

const { default: strava } = stravaLib;

export function start(getTokenById: any, saveTokenById: any) {
  return {
    getOAuthRequestAccessUrl,
    getOAuthToken,
    getAthlete,
    getActivity,
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
  
  async function getOAuthToken(code: any) {
    console.log('Getting OAuth token based on temporary code ' + code);
    return strava.oauth.getToken(code);
  }

  async function refreshToken(athleteId: any) {
    const existingToken = await getTokenById(athleteId);
    const updatedToken = await strava.oauth.refreshToken(existingToken.refresh_token);
    const updatedTokenWithId = {
      id: athleteId,
      ... updatedToken
    };
    await saveTokenById(athleteId, updatedTokenWithId);
  }

  async function invokeActionWithTokenRefresh(action: any, athleteId: any) {
    try {
      return await action();

    } catch(err) {
      console.log('strava api failed, will refresh token:', err);
    }

    // Refresh token and try again.
    await refreshToken(athleteId);
    return await action();
  }

  async function getAthlete(athleteId: any) {
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

  async function getActivity(activityId: any, athleteId: any) {
    console.log(`Getting activity ${activityId} for athlete ${athleteId}`);
    return invokeActionWithTokenRefresh(
      getActivityImpl,
      athleteId
    );
    async function getActivityImpl() {
      const token = await getTokenById(athleteId);
      const parameters = {
        'access_token': token.access_token,
        'id': activityId
      };
      const activity = await strava.activities.get(parameters);
      const slimActivity = pickActivityFields(activity);
      return slimActivity;
    }
  }
  
  function getActivities(athleteId: any) {
    console.log(`Getting athlete ${athleteId} activities`);

    // Create recursive function to retrieve all activity pages.
    function getActivityPage(page: any): any {
      return of({}).pipe(
        tap(() => console.log(`Getting athlete activities page ${page}`)),
        mergeMap(() => from(invokeActionWithTokenRefresh(
          getActivitiesPageImpl,
          athleteId
        ))),
        mergeMap((activities: any) => {
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
        const activities = await strava.athlete.listActivities(parameters);
        const slimActivities = activities.map(pickActivityFields);
        return slimActivities;
      }
    }
  
    // Begin retrieving pages from page 1.
    return getActivityPage(1);
  }

  function pickActivityFields(activity: any) {
    return _.pick(activity, [
      'id',
      'athlete.id',
      'distance',
      'moving_time',
      'name',
      'start_date',
      'total_elevation_gain',
      'type'
    ]);
  }
}
