'use strict';

module.exports = {
  getOAuthRequestAccessUrl,
  registerAthleteWithCode,
  registerAthleteWithToken
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
    .flatMap(athlete => saveAthleteAndToken(athlete, oauthToken));
}

function saveAthleteAndToken(athlete, oauthToken) {
  return rxo.concat(
    s3.upload(`shamvelo-${config.environment}-athlete`, '' + athlete.id, JSON.stringify(athlete)),
    s3.upload(`shamvelo-${config.environment}-token`, '' + athlete.id, oauthToken)
  ).last().map(() => {});
}
