import {
  create as createAthleteSummary,
  addActivity as addActivityToAthleteSummary,
  pruneSummary as pruneAthleteSummary,
  AthleteSummary
} from './athlete-summary.js';
import { YearContainer, addAthlete as addAthleteSummary, create as createLeaderboard } from './summary.js';
import filterActivities from './filter-activities.js';
import { mapById } from '../identified.js';
import { SlimAthlete } from '../strava.js';
import { createFirestore } from '../db/persist.js';
import { createActivityPersist } from '../db/activity.js';
import { createAthleteSummaryPersist } from '../db/athlete-summary.js';
import { createAthletePersist } from '../db/athlete.js';
import { createLeaderboardPersist } from '../db/leaderboard.js';

const firestore = createFirestore();
const activityPersist = createActivityPersist(firestore);
const athletePersist = createAthletePersist(firestore);
const athleteSummaryPersist = createAthleteSummaryPersist(firestore);
const leaderboardPersist = createLeaderboardPersist(firestore);

export interface LeaderboardInterval {
  year: number,
  month: number,
  week: number,
}

export async function refreshAthleteSummary(athleteId: number): Promise<void> {
  console.log(`refreshing summary for athlete ${athleteId}`);
  const activities = filterActivities(
    await activityPersist.getByAthlete(athleteId),
  );
  const summary = activities.reduce(addActivityToAthleteSummary, createAthleteSummary(athleteId));
  pruneAthleteSummary(summary);
  await athleteSummaryPersist.set(summary);
  console.log(`summary refreshed for athlete ${athleteId}`);
}

export async function refreshLeaderboard(): Promise<void> {
  console.log('refreshing leaderboard 2');

  const [athletes, athleteSummaries] = await Promise.all([
    athletePersist.getAll(),
    athleteSummaryPersist.getAll(),
  ]);
  const athletesById = mapById(athletes);

  const summary = athleteSummaries.reduce((previousSummary, athleteSummary) => {
    const athlete = athletesById.get(athleteSummary.id);
    if (!athlete) {
      return previousSummary;
    }
    return addAthleteSummary(previousSummary, athleteSummary, athlete);
  }, createLeaderboard());
  const yearlySummaries = Object.values(summary.year);
  await leaderboardPersist.setAll(yearlySummaries);

  console.log('leaderboard 2 refreshed');
}

export async function getLatestLeaderboardIds(): Promise<LeaderboardInterval> {
  const latestLeaderboardYear: YearContainer = await leaderboardPersist.getLatest();

  const year = latestLeaderboardYear.id;
  const month = Object
    .keys(latestLeaderboardYear.month)
    .map(monthString => parseInt(monthString))
    .sort((a, b) => b - a)
    [0];
  const week = Object
    .keys(latestLeaderboardYear.week)
    .map(weekString => parseInt(weekString))
    .sort((a, b) => b - a)
    [0];

  return { year, month, week };
}

export async function getLeaderboard(year: number, month: number, week: number) {
  const yearRecord = await leaderboardPersist.get(year);

  const points = yearRecord.points;
  const yearSummary = yearRecord.summary;
  const monthSummary = yearRecord.month[month].summary;
  const weekSummary = yearRecord.week[week].summary;

  return {
    points,
    year: yearSummary,
    month: monthSummary,
    week: weekSummary
  };
}
