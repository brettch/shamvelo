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
const s3 = require('./s3');
const strava = require('./strava');
const template = require('./template');

function refresh(athleteId) {
  console.log('Refreshing athlete ' + athleteId);
  return register.getTokenForAthlete(athleteId)
    .flatMap(strava.getAthlete)
    .map(JSON.stringify)
    .flatMap(athleteJson =>
      s3.uploadIfChanged(`shamvelo-${config.environment}-athlete`, athleteId, athleteJson)
    )
    .map(() => {});
}

function buildView(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-athlete`, athleteId)
    .map(JSON.parse)
    .flatMap(renderView)
    .flatMap(content =>
      s3.uploadIfChanged(`shamvelo-${config.environment}-view`, `athlete/${athleteId}`, content)
    )
    .map(() => {});
}

function renderView(athlete) {
  return template.render('athlete', { athlete });
}

function getView(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-view`, `athlete/${athleteId}`);
}

function getIds() {
  return s3.listObjects(`shamvelo-${config.environment}-athlete`);
}

function getAll() {
  return s3
    .loadObjects(`shamvelo-${config.environment}-athlete`)
    .map(JSON.parse);
}
