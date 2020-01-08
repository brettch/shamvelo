'use strict';

const summarize = require('./athlete-summary');
const db = require('../db').start();
const filterActivities = require('./filter-activities');

module.exports = {
  refreshAthleteSummary,
  getAthleteSummary
};

async function refreshAthleteSummary(athleteId) {
  console.log(`refreshing summary for athlete ${athleteId}`);
  const activities = filterActivities(
    await db.getItems('activities', {'athlete.id' : athleteId})
  );
  console.log('activities:', activities);
  const summary = activities.reduce(summarize, {});
  console.log('summary:', summary);
  await db.saveAthleteSummary({
    ...summary,
    athleteId
  });
}

async function getAthleteSummary(athleteId) {
  return db.getItems('athlete-summaries', {athleteId});
}
