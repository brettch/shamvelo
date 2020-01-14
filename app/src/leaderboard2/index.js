'use strict';

const _ = require('lodash');
const athleteSummarize = require('./athlete-summary');
const leaderboardSummarize = require('./summary');
const db = require('../db').start();
const filterActivities = require('./filter-activities');
const mapById = require('./map-by-id');

module.exports = {
  refreshAthleteSummary,
  refreshLeaderboard,
  getLatestLeaderboardIds,
  getLeaderboard
};

async function refreshAthleteSummary(athleteId) {
  console.log(`refreshing summary for athlete ${athleteId}`);
  const activities = filterActivities(
    await db.getItems('activities', {'athlete.id' : athleteId})
  );
  const summary = activities.reduce(athleteSummarize, {});
  await db.saveAthleteSummary({
    ...summary,
    athleteId
  });
  console.log(`summary refreshed for athlete ${athleteId}`);
}

async function refreshLeaderboard() {
  console.log('refreshing leaderboard 2');

  const athleteSummariesPromise = db.getItems('athlete-summaries', {});
  const athletesPromise = db.getItems('athletes', {});
  const athleteSummaries = await athleteSummariesPromise;
  const athletes = await athletesPromise;
  const athletesById = mapById(athletes);

  const summary = athleteSummaries.reduce((previousSummary, athleteSummary) => {
    const athlete = athletesById[athleteSummary.athleteId];
    return leaderboardSummarize(previousSummary, athleteSummary, athlete);
  }, {});
  const yearlySummaries = _.values(summary.year);
  await db.saveLeaderboards(yearlySummaries);

  console.log('leaderboard 2 refreshed');
}

async function getLatestLeaderboardIds() {
  const latestLeaderboardYear = await db.getFirstItem('leaderboards', 'year', true);
  console.log('latestLeaderboardYear:', latestLeaderboardYear);

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

async function getLeaderboard(year, month, week) {
  const records = await db.getItems('leaderboards', {year});
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
