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
    // Load existing activities from S3 and check if they've changed
    .flatMap(activitiesJson =>
      s3
        .getObject(`shamvelo-${config.environment}-activity`, athleteId)
        .map(buffer => buffer.toString())
        .map(s3ActivitiesJson => ({
          activitiesJson: activitiesJson,
          changed: activitiesJson != s3ActivitiesJson
        }))
    )
    // Only upload activities to S3 if they've changed
    .flatMap(activitiesObj => {
      if (activitiesObj.changed) {
        return s3.upload(
          `shamvelo-${config.environment}-activity`,
          athleteId,
          activitiesObj.activitiesJson
        );
      } else {
        return rxo.return();
      }
    })
    .map(() => {});
}

function getActivitiesForAthlete(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-activity`, athleteId)
    .map(object => JSON.parse(object.toString()));
}

function getAll() {
  return s3.loadObjects(`shamvelo-${config.environment}-activity`)
    .map(JSON.parse)
    .flatMap(activities => rxo.from(activities));
}
