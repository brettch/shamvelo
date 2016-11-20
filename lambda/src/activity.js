'use strict';

module.exports = {
  getActivitiesForAthlete,
  refreshActivitiesForAthlete
};

const config = require('./config');
const register = require('./register');
const s3 = require('./s3');
const strava = require('./strava');

function refreshActivitiesForAthlete(athleteId) {
  console.log('Refreshing athlete activities ' + athleteId);
  return register.getTokenForAthlete(athleteId)
    .flatMap(strava.getActivities)
    .toArray()
    .flatMap(activities =>
      s3.upload(`shamvelo-${config.environment}-activity`, athleteId, JSON.stringify(activities))
    )
    .map(() => {});
}

function getActivitiesForAthlete(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-activity`, athleteId)
    .map(object => JSON.parse(object.toString()));
}
