import {
  create as createAthleteSummary,
  addActivity as addActivityToAthleteSummary,
  AthleteSummary
} from './athlete-summary.js';
import { YearContainer, addAthlete as addAthleteSummary, create as createLeaderboard } from './summary.js';
import { start as startDb } from '../db.js';
import filterActivities from './filter-activities.js';
import { mapById } from '../identified.js';
import { SlimAthlete } from '../strava.js';

const db = startDb();

export interface LeaderboardInterval {
  year: number,
  month: number,
  week: number,
}

export async function refreshAthleteSummary(athleteId: number): Promise<void> {
  console.log(`refreshing summary for athlete ${athleteId}`);
  const activities = filterActivities(
    await db.getItemsWithFilter('activities', 'athlete.id', athleteId)
  );
  const summary = activities.reduce(addActivityToAthleteSummary, createAthleteSummary(athleteId));
  await db.saveAthleteSummary(summary);
  console.log(`summary refreshed for athlete ${athleteId}`);
}

export async function refreshLeaderboard(): Promise<void> {
  console.log('refreshing leaderboard 2');

  const athleteSummariesPromise = db.getAllItems('athlete-summaries');
  const athletesPromise = db.getAllItems('athletes');
  const athleteSummaries: AthleteSummary[] = await athleteSummariesPromise;
  const athletes: SlimAthlete[] = await athletesPromise;
  const athletesById = mapById(athletes);

  const summary = athleteSummaries.reduce((previousSummary, athleteSummary) => {
    const athlete = athletesById.get(athleteSummary.id);
    if (!athlete) {
      return previousSummary;
    }
    return addAthleteSummary(previousSummary, athleteSummary, athlete);
  }, createLeaderboard());
  const yearlySummaries = Object.values(summary.year);
  await db.saveLeaderboards(yearlySummaries);

  console.log('leaderboard 2 refreshed');
}

export async function getLatestLeaderboardIds(): Promise<LeaderboardInterval> {
  const latestLeaderboardYear: YearContainer = await db.getFirstItem('leaderboards', 'id', true);

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
  const records: YearContainer[] = await db.getItemsWithFilter('leaderboards', 'id', year);
  if (records.length <= 0) {
    throw new Error(`Year ${year} could not be found.`);
  }
  const yearRecord = records[0];

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
