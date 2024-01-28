import _ from 'lodash';
import athleteSummarize from './athlete-summary.js';
import leaderboardSummarize from './summary.js';
import { start as startDb } from '../db.js';
import filterActivities from './filter-activities.js';
import { mapById } from '../identified.js';

const db = startDb();

export async function refreshAthleteSummary(athleteId: number) {
  console.log(`refreshing summary for athlete ${athleteId}`);
  const activities = filterActivities(
    await db.getItemsWithFilter('activities', 'athlete.id', athleteId)
  );
  const summary = activities.reduce(athleteSummarize, {});
  await db.saveAthleteSummary({
    ...summary,
    athleteId
  });
  console.log(`summary refreshed for athlete ${athleteId}`);
}

export async function refreshLeaderboard() {
  console.log('refreshing leaderboard 2');

  const athleteSummariesPromise = db.getAllItems('athlete-summaries');
  const athletesPromise = db.getAllItems('athletes');
  const athleteSummaries = await athleteSummariesPromise;
  const athletes = await athletesPromise;
  const athletesById = mapById(athletes);

  const summary = athleteSummaries.reduce((previousSummary: any, athleteSummary: any) => {
    const athlete = athletesById.get(athleteSummary.athleteId);
    return leaderboardSummarize(previousSummary, athleteSummary, athlete);
  }, {});
  const yearlySummaries = _.values(summary.year);
  await db.saveLeaderboards(yearlySummaries);

  console.log('leaderboard 2 refreshed');
}

export async function getLatestLeaderboardIds() {
  const latestLeaderboardYear = await db.getFirstItem('leaderboards', 'year', true);

  const year = parseInt(latestLeaderboardYear.year);
  const months = Object
    .keys(latestLeaderboardYear.month)
    .map(monthString => parseInt(monthString));
  months.sort((a, b) => b - a);
  const month = months[0];
  const weeks = Object
    .keys(latestLeaderboardYear.week)
    .map(weekString => parseInt(weekString));
  weeks.sort((a, b) => b - a);
  const week = weeks[0];
  console.log('months:', months);
  console.log('weeks:', weeks);

  return { year, month, week };
}

export async function getLeaderboard(year: any, month: any, week: any) {
  const records = await db.getItemsWithFilter('leaderboards', 'year', year);
  const yearRecord = records.length > 0 ? records[0] : {};

  const points = yearRecord.points;
  const yearSummary = yearRecord.summary;
  const monthSummary = _.get(yearRecord, `month.${month}.summary`);
  const weekSummary = _.get(yearRecord, `week.${week}.summary`);

  return {
    points,
    year: yearSummary,
    month: monthSummary,
    week: weekSummary
  };
}
