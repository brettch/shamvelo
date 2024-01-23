import { of, from, merge, EMPTY, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ActivitiesApi, AthletesApi, DetailedAthlete, SummaryActivity } from './strava/api.js';
import { Token, TokenAccess, TokenWithId } from './registration.js';

export type SlimAthlete = Pick<DetailedAthlete, "id" | "firstname" | "lastname" >;

function pickAthleteFields(athlete: DetailedAthlete): SlimAthlete {
  return {
    id: athlete.id,
    firstname: athlete.firstname,
    lastname: athlete.lastname,
  };
}

export type SlimActivity = Pick<SummaryActivity, "id" | "athlete" | "distance" | "movingTime" | "name" | "startDate" | "totalElevationGain" | "type">;

function pickActivityFields(activity: SummaryActivity): SlimActivity {
  return {
    id: activity.id,
    athlete: {
      id: activity?.athlete?.id,
    },
    distance: activity.distance,
    movingTime: activity.movingTime,
    name: activity.name,
    startDate: activity.startDate,
    totalElevationGain: activity.totalElevationGain,
    type: activity.type,
  }
}

export function start(tokenAccess: TokenAccess) {
  return {
    getAthleteWithToken,
    getAthlete,
    getActivity,
    getActivities
  };

  async function getAthleteWithToken(token: Token): Promise<SlimAthlete> {
    console.log(`Getting athlete with token`)
    return getAthleteImpl(token);
  }

  async function getAthlete(athleteId: number): Promise<SlimAthlete> {
    console.log(`Getting athlete ${athleteId}`);
    return invokeActionWithTokenRefresh(
      getAthleteImpl,
      athleteId
    );
  }

  async function getAthleteImpl(token: Token): Promise<SlimAthlete> {
    const api = new AthletesApi();
    api.accessToken = token.access_token;
    const athlete = (await api.getLoggedInAthlete()).body;
    console.log(`athlete: ${JSON.stringify(athlete, null, 2)}`);
    const slimAthlete = pickAthleteFields(athlete);
    console.log(`slimAthlete: ${JSON.stringify(slimAthlete, null, 2)}`);
    return slimAthlete;
  }

  async function getActivity(activityId: number, athleteId: number) {
    console.log(`Getting activity ${activityId} for athlete ${athleteId}`);
    return invokeActionWithTokenRefresh(
      getActivityImpl,
      athleteId
    );
    async function getActivityImpl(token: TokenWithId) {
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
    function getActivityPage(page: number): Observable<SlimActivity> {
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
            return EMPTY;
          }
        })
      );

      async function getActivitiesPageImpl(token: TokenWithId): Promise<SlimActivity[]> {
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

  async function invokeActionWithTokenRefresh<T>(action: (token: TokenWithId) => Promise<T>, athleteId: number) {
    const existingToken = await tokenAccess.get(athleteId);

    try {
      return await action(existingToken);
    } catch(err) {
      console.log('strava api failed, will refresh token:', err);
    }

    // Refresh token and try again.
    const refreshedToken = await tokenAccess.refresh(existingToken);
    return await action(refreshedToken);
  }
}
