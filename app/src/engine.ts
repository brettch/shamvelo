import './config.js';
import { start as startDb } from './db.js';
import * as leaderboard from './leaderboard/index.js';
import { from, lastValueFrom } from 'rxjs';
import { bufferCount, mergeMap } from 'rxjs/operators';
import { SlimActivity, SlimAthlete, start as startStrava } from './strava.js';
import { stringify } from './util.js';
import { Token, start as startRegistration } from './registration.js';

// Start the database.
export const db = startDb();

const { registration, tokenAccess } = startRegistration(
  (id) => db.getItemByKey('tokens', id),
  (token) => db.saveItem('tokens', token),
  getIdForToken,
);
export { registration };

// Start the Strava client.
const strava = startStrava(tokenAccess);

async function getIdForToken(token: Token): Promise<number> {
  const athlete = await strava.getAthleteWithToken(token);
  return athlete.id;
}

export async function registerAthlete(stravaCode: string): Promise<void> {
  console.log('Registering athlete with code ' + stravaCode);
  const athleteId = await registration.registerUser(stravaCode);
  await refreshAthlete(athleteId);
}

// Refresh athlete details in our database.
export async function refreshAthlete(athleteId: number): Promise<void> {
  console.log('Refreshing athlete ' + athleteId);
  const athlete = await strava.getAthlete(athleteId);
  console.log(`athlete: ${stringify(athlete)}`);
  await db.saveItem('athletes', athlete);
}

// Refresh an athlete's activities in our database.
export async function refreshAthleteActivities(athleteId: number): Promise<void> {
  console.log('Refreshing athlete activities ' + athleteId);

  await db.deleteActivities(athleteId);
  const o = await strava.getActivities(athleteId)
    .pipe(
      bufferCount(100),
      mergeMap((activities) => from(db.saveActivities(activities)))
    );
  await lastValueFrom(o);

  await leaderboard.refreshAthleteSummary(athleteId);
}

export async function refreshAllAthleteActivities(): Promise<void> {
  console.log('Refreshing all athlete activities');

  const athletes = await db.getAllItems('athletes');
  await from(athletes)
    .pipe(
      mergeMap((athlete) => from(refreshAthleteActivities(athlete.id)))
    )
    .toPromise();

  console.log('Completed refreshing all athlete activities');
}

export async function refreshActivity(activityId: number, athleteId: number): Promise<void> {
  console.log(`refreshing activity ${activityId} for athlete ${athleteId}`);
  const activity = await strava.getActivity(activityId, athleteId);
  console.log('activity:', activity);
  await db.saveActivities([activity]);

  await leaderboard.refreshAthleteSummary(athleteId);
}

export async function deleteActivity(activityId: number): Promise<void> {
  console.log(`deleting activity ${activityId}`);
  const activity: SlimActivity | undefined = await db.getItemByKey('activities', activityId);
  await db.deleteItem('activities', activityId);

  const athleteId = activity?.athlete?.id;
  if (athleteId) {
    await leaderboard.refreshAthleteSummary(athleteId);
  }
}

export interface AthleteAndActivities {
  athlete: SlimAthlete,
  activities: SlimActivity[],
}

export async function getAthleteAndActivities(athleteId: number): Promise<AthleteAndActivities> {
  const athletePromise = db.getItemByKey('athletes', athleteId);
  const activitiesPromise = db.getItemsWithFilter('activities', 'athleteId', athleteId);

  const athlete: SlimAthlete = await athletePromise;
  const activities: SlimActivity[] = await activitiesPromise;

  return {
    athlete: athlete,
    activities: activities
  };
}

export interface AthletesAndActivities {
  athletes: SlimAthlete[],
  activities: SlimActivity[],
}

export async function getAthletesAndActivities(): Promise<AthletesAndActivities> {
  const athletesPromise = db.getAllItems('athletes');
  const activitiesPromise = db.getAllItems('activities');

  const athletes: SlimAthlete[] = await athletesPromise;
  const activities: SlimActivity[] = await activitiesPromise;

  return {
    athletes: athletes,
    activities: activities
  };
}
