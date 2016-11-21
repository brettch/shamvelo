'use strict';

module.exports = {
  refresh,
  buildView,
  getView,
  getIds,
  getAll
};

const config = require('./config');
const register = require('./register');
const Rx = require('rx');
const s3 = require('./s3');
const strava = require('./strava');
const template = require('./template');

const rxo = Rx.Observable;

function refresh(athleteId) {
  console.log('Refreshing athlete ' + athleteId);
  return register.getTokenForAthlete(athleteId)
    .flatMap(strava.getAthlete)
    .map(JSON.stringify)
    // Load existing athlete from S3 and check if it has changed
    .flatMap(athleteJson =>
      s3
        .getObject(`shamvelo-${config.environment}-athlete`, athleteId)
        .map(buffer => buffer.toString())
        .map(s3AthleteJson => ({
          athleteJson,
          changed: athleteJson != s3AthleteJson
        }))
    )
    // Only upload athlete to S3 if it has changed
    .flatMap(athleteObj => {
      if (athleteObj.changed) {
        return s3.upload(
          `shamvelo-${config.environment}-athlete`,
          athleteId,
          athleteObj.athleteJson
        );
      } else {
        return rxo.return();
      }
    })
    .map(() => {});
}

function buildView(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-athlete`, athleteId)
    .map(object => JSON.parse(object.toString()))
    .flatMap(renderView)
    .flatMap(content => s3.upload(`shamvelo-${config.environment}-view`, `athlete/${athleteId}`, content))
    .map(() => {});
}

function renderView(athlete) {
  return template.render('athlete', { athlete });
}

function getView(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-view`, `athlete/${athleteId}`)
    .map(buffer => buffer.toString());
}

function getIds() {
  return s3.listObjects(`shamvelo-${config.environment}-athlete`);
}

function getAll() {
  return s3
    .loadObjects(`shamvelo-${config.environment}-athlete`)
    .map(JSON.parse);
}
