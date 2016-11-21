'use strict';

module.exports = {
  getActivitiesForAthlete,
  refreshAllActivities,
  refreshActivitiesForAthlete,
  getAll
};

const athlete = require('./athlete');
const config = require('./config');
const register = require('./register');
const Rx = require('rx');
const s3 = require('./s3');
const strava = require('./strava');

const rxo = Rx.Observable;

function refreshAllActivities() {
  return athlete.getIds()
    .flatMap(refreshActivitiesForAthlete);
}

function refreshActivitiesForAthlete(athleteId) {
  console.log('Refreshing athlete activities ' + athleteId);
  return register.getTokenForAthlete(athleteId)
    .flatMap(strava.getActivities)
    .toArray()
    .map(JSON.stringify)
    .flatMap(activitiesJson =>
      s3.uploadIfChanged(`shamvelo-${config.environment}-activity`, athleteId, activitiesJson)
    )
    .map(() => {});
}

function getActivitiesForAthlete(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-activity`, athleteId)
    .map(JSON.parse);
}

function getAll() {
  return s3.loadObjects(`shamvelo-${config.environment}-activity`)
    .map(JSON.parse)
    .flatMap(activities => rxo.from(activities));
}
