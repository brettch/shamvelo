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

async function getLeaderboard() {
  return db.getItems('leaderboards', {id: 2})[0];
}
