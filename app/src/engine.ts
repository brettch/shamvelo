import './config.js';
import * as leaderboard from './leaderboard/index.js';
import { start as startStrava, SlimActivity } from './strava.js';
import { stringify } from './util.js';
import { Token, start as startRegistration } from './registration.js';
import { createFirestore } from './db/persist.js';
import { createAthletePersist } from './db/athlete.js';
import { createTokenPersist } from './db/token.js';
import { createActivityPersist } from './db/activity.js';
import { createRefreshStatePersist } from './db/refresh-state.js';

// Start the database.
const firestore = createFirestore();
export const activityPersist = createActivityPersist(firestore);
export const athletePersist = createAthletePersist(firestore);
export const tokenPersist = createTokenPersist(firestore);
export const refreshStatePersist = createRefreshStatePersist(firestore);

const { registration, tokenAccess } = startRegistration(
  tokenPersist.get,
  tokenPersist.set,
  getIdForToken,
);
export { registration };

// Start the Strava client.
const strava = startStrava(tokenAccess);
export { strava };

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

export async function processActivityRefreshChunk(
  athleteId: number,
  batchStart: number,
  pageConcurrency: number,
  batchId: string,
  writeBatchSize: number,
): Promise<SlimActivity[]> {
  const activities = await strava.getActivitiesPageRange(athleteId, batchStart, pageConcurrency);

  if (activities.length > 0) {
    const tagged = activities.map(a => ({ ...a, refreshBatchId: batchId }));
    await activityPersist.setAll(tagged, writeBatchSize);
  }

  return activities;
}

export async function sweepStaleActivities(athleteId: number, batchId: string): Promise<void> {
  await activityPersist.deleteStaleByAthlete(athleteId, batchId);
}

export async function finalizeActivityRefresh(athleteId: number, batchId: string): Promise<void> {
  await sweepStaleActivities(athleteId, batchId);
  await leaderboard.refreshAthleteSummary(athleteId);
  await leaderboard.refreshLeaderboard();
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
