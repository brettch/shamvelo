'use strict';

module.exports = {
  getOAuthRequestAccessUrl,
  registerAthleteWithCode,
  registerAthleteWithToken,
  getTokenForAthlete,
};

const config = require('./config');
const Rx = require('rx');
const s3 = require('./s3');
const strava = require('./strava');

const rxo = Rx.Observable;

function getOAuthRequestAccessUrl() {
  return strava.getOAuthRequestAccessUrl();
}

function registerAthleteWithCode(stravaCode) {
  console.log(`Registering athlete with code ${stravaCode}`);
  return strava.getOAuthToken(stravaCode)
    .flatMap(payload => registerAthleteWithToken(payload.access_token));
}

function registerAthleteWithToken(oauthToken) {
  console.log(`Registering athlete with token ${oauthToken}`);
  return strava.getAthlete(oauthToken)
    .flatMap(athlete => saveToken(athlete, oauthToken));
}

function saveToken(athlete, oauthToken) {
  return s3.upload(`shamvelo-${config.environment}-token`, '' + athlete.id, oauthToken)
    .map(() => {});
}

function getTokenForAthlete(athleteId) {
  return s3.getObject(`shamvelo-${config.environment}-token`, athleteId)
    .map(buffer => buffer.toString());
}
