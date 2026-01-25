import { ActivitiesApi, AthletesApi, Configuration, DetailedAthlete, SummaryActivity } from './strava/index.js';
import { Token, TokenAccess, TokenWithId } from './registration.js';

// See https://developers.strava.com/docs/webhooks/ for details
export interface StravaWebhookBody {
  object_type: 'activity' | 'athlete',
  object_id: number,
  aspect_type: 'create' | 'update' | 'delete',
  updates?: {
    title?: string,
    type?: string,
    private?: 'true' | 'false',
    authorized?: 'true' | 'false',
  },
  owner_id: number,
  subscription_id: number,
  event_time: number,
}


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
    const api = new AthletesApi(buildApiConfiguration(token));
    const athlete = (await api.getLoggedInAthlete());
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
    async function getActivityImpl(token: Token) {
      const api = new ActivitiesApi(buildApiConfiguration(token));
      const activity = (await api.getActivityById({id: activityId}));
      const slimActivity = pickActivityFields(activity);
      return slimActivity;
    }
  }

  async function* getActivities(athleteId: number): AsyncGenerator<SlimActivity> {
    console.log(`Getting athlete ${athleteId} activities`);

    async function getActivitiesPage(token: Token, page: number): Promise<SlimActivity[]> {
      console.log(`Getting athlete ${athleteId} activities page ${page}`);
      const api = new ActivitiesApi(buildApiConfiguration(token));
      const activities = (await api.getLoggedInAthleteActivities({page, perPage: 100}));
      // Some dodgy activities may not have a moving time field. Drop them.
      const activitiesWithMovingTime = activities.filter(activity => activity.movingTime)
      const slimActivities = activitiesWithMovingTime.map(pickActivityFields);
      return slimActivities;
    }

    async function getActivitiesPagesFrom(token: Token, pageFrom: number, pageCount: number): Promise<SlimActivity[]> {
      const requests = Array
        .from(Array(pageCount).keys()) // number range from 0
        .map(pageOffset => pageFrom + pageOffset) // add page offset
        .map(page => getActivitiesPage(token, page)); // request the page from strava

      const results = await Promise.all(requests);
      const mergedResults = results
        .reduce((a, b) => a.concat(b));

      return mergedResults;
    }

    const concurrency = 10;
    for (let page = 1; true; page += concurrency) {
      const activities = await invokeActionWithTokenRefresh(
        token => getActivitiesPagesFrom(token, page, concurrency),
        athleteId,
      );

      if (activities.length <= 0) {
        console.log(`Activities page is empty, retrieval is complete`);
        break;
      }

      for (const activity of activities) {
        yield activity;
      }
    }
  }

  async function invokeActionWithTokenRefresh<T>(action: (token: Token) => Promise<T>, athleteId: number) {
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

  function buildApiConfiguration(token: Token): Configuration {
    return new Configuration({
      accessToken: `Bearer ${token.access_token}`,
    });
  }
}
