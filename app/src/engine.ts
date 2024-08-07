import './config.js';
import * as leaderboard from './leaderboard/index.js';
import { start as startStrava } from './strava.js';
import { stringify } from './util.js';
import { Token, start as startRegistration } from './registration.js';
import { createFirestore } from './db/persist.js';
import { createAthletePersist } from './db/athlete.js';
import { createTokenPersist } from './db/token.js';
import { createActivityPersist } from './db/activity.js';

// Start the database.
const firestore = createFirestore();
export const activityPersist = createActivityPersist(firestore);
export const athletePersist = createAthletePersist(firestore);
export const tokenPersist = createTokenPersist(firestore);

const { registration, tokenAccess } = startRegistration(
  tokenPersist.get,
  tokenPersist.set,
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
  await athletePersist.set(athlete);
}

// Refresh an athlete's activities in our database.
export async function refreshAthleteActivities(athleteId: number): Promise<void> {
  console.log('Refreshing athlete activities ' + athleteId);

  const activities = [];
  for await (const activity of strava.getActivities(athleteId)) {
    activities.push(activity);
  }

  await activityPersist.deleteByAthlete(athleteId);
  await activityPersist.setAll(activities);

  await leaderboard.refreshAthleteSummary(athleteId);
}

export async function refreshAllAthleteActivities(): Promise<void> {
  console.log('Refreshing all athlete activities');

  // Refresh all athletes in parallel.
  const refreshPromises = [];
  for (const athlete of await athletePersist.getAll()) {
    refreshPromises.push(refreshAthleteActivities(athlete.id));
  }

  // Wait for all refreshes to complete.
  for (const refreshPromise of refreshPromises) {
    await refreshPromise;
  }

  console.log('Completed refreshing all athlete activities');
}

export async function refreshActivity(activityId: number, athleteId: number): Promise<void> {
  console.log(`refreshing activity ${activityId} for athlete ${athleteId}`);
  const activity = await strava.getActivity(activityId, athleteId);
  console.log('activity:', activity);
  await activityPersist.set(activity);

  await leaderboard.refreshAthleteSummary(athleteId);
}

export async function deleteActivity(activityId: number): Promise<void> {
  console.log(`deleting activity ${activityId}`);
  const activity = await activityPersist.getIfExists(activityId);
  if (activity) {
    await activityPersist.deleteItem(activityId);
    await leaderboard.refreshAthleteSummary(activity.athlete.id);
  }
}
