import { of, from, merge, EMPTY, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ActivitiesApi, AthletesApi, DetailedAthlete, SummaryActivity } from './strava/api.js';
import { Token, TokenAccess, TokenWithId } from './registration.js';

export type SlimAthlete = Required<Pick<DetailedAthlete, "id" | "firstname" | "lastname" >>;

function pickAthleteFields(athlete: DetailedAthlete): SlimAthlete {
  function missingField<T>(fieldName: string): T {
    throw new Error(`Athlete ${athlete.id} is missing field ${fieldName}`);
  }

  return {
    id: athlete.id ? athlete.id : missingField('id'),
    firstname: athlete.firstname ? athlete.firstname : missingField('firstname'),
    lastname: athlete.lastname ? athlete.lastname : missingField('lastname'),
  };
}

type SlimActivityPicked = Required<Pick<SummaryActivity, "id" | "distance" | "movingTime" | "name" | "startDate" | "totalElevationGain" | "type">>;
export interface SlimActivity extends SlimActivityPicked {
  athlete: {
    id: number,
  }
}

function pickActivityFields(activity: SummaryActivity): SlimActivity {
  function missingField<T>(fieldName: string): T {
    throw new Error(`Activity ${activity.id} is missing field ${fieldName}`);
  }

  return {
    id: activity.id || missingField('id'),
    athlete: {
      id: activity?.athlete?.id || missingField('athlete.id'),
    },
    distance: activity.distance || 0,
    movingTime: activity.movingTime || missingField('movingTime'),
    name: activity.name || missingField('name'),
    startDate: activity.startDate || missingField('startDate'),
    totalElevationGain: activity.totalElevationGain || 0,
    type: activity.type || missingField('type'),
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
