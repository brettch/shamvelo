import _ from 'lodash';
import { of, from, empty, merge } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Strava, default as strava1 } from 'strava-v3';
import { ActivitiesApi, AthletesApi, SummaryActivity } from './strava/api.js';

// Work around a problem with TypeScript types. The default export implements the Strava
// interface but the types say it only has a 'default' attribute which in turn implements
// the Strava interface.
const strava2: any = strava1;
const strava: Strava = strava2;

export function start(getTokenById: any, saveTokenById: any) {
  return {
    getOAuthRequestAccessUrl,
    getOAuthToken,
    getAthlete,
    getActivity,
    getActivities
  };

  function getOAuthRequestAccessUrl(): string {
    console.log('Generating OAuth request access URL');
    // Force the type to any and then string. The types say the method returns a Promise which is incorrect.
    const accessUrl: any = strava.oauth.getRequestAccessURL({
      scope : ['read', 'activity:read']
    });
    console.log('Access URL: ' + accessUrl);
    return accessUrl;
  }

  async function getOAuthToken(code: string) {
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

  async function invokeActionWithTokenRefresh<T>(action: () => Promise<T>, athleteId: number) {
    try {
      return await action();

    } catch(err) {
      console.log('strava api failed, will refresh token:', err);
    }

    // Refresh token and try again.
    await refreshToken(athleteId);
    return await action();
  }

  async function getAthlete(athleteId: number) {
    console.log(`Getting athlete ${athleteId}`);
    return invokeActionWithTokenRefresh(
      getAthleteImpl,
      athleteId
    );

    async function getAthleteImpl() {
      const token = await getTokenById(athleteId);
      console.log(`token: ${JSON.stringify(token, null, 2)}`);
      const api = new AthletesApi();
      api.accessToken = token.access_token;
      const athlete = (await api.getLoggedInAthlete()).body;
      console.log(`athlete: ${JSON.stringify(athlete, null, 2)}`);
      process.exit(1);
      return athlete;
    }
  }

  async function getActivity(activityId: number, athleteId: number) {
    console.log(`Getting activity ${activityId} for athlete ${athleteId}`);
    return invokeActionWithTokenRefresh(
      getActivityImpl,
      athleteId
    );
    async function getActivityImpl() {
      const token = await getTokenById(athleteId);
      const api = new ActivitiesApi();
      api.accessToken = token.access_token;
      const activity = (await api.getActivityById(activityId)).body;
      const slimActivity = pickActivityFields(activity);
      return slimActivity;
    }
  }
  
  function getActivities(athleteId: number) {
    console.log(`Getting athlete ${athleteId} activities`);

    // Create recursive function to retrieve all activity pages.
    function getActivityPage(page: number): any {
      return of({}).pipe(
        tap(() => console.log(`Getting athlete activities page ${page}`)),
        mergeMap(() => from(invokeActionWithTokenRefresh(
          getActivitiesPageImpl,
          athleteId
        ))),
        mergeMap((activities) => {
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
        const api = new ActivitiesApi();
        api.accessToken = token.access_token;
        const activities = (await api.getLoggedInAthleteActivities(undefined, undefined, page, 100)).body;
        const slimActivities = activities.map(pickActivityFields);
        return slimActivities;
      }
    }
  
    // Begin retrieving pages from page 1.
    return getActivityPage(1);
  }

  function pickActivityFields(activity: SummaryActivity) {
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
