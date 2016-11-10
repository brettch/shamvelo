'use strict';

module.exports = {
  getOAuthRequestAccessUrl,
  registerAthleteWithCode,
  registerAthleteWithToken
};

const AWS = require('aws-sdk');
const Rx = require('rx');
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
    .flatMap(athlete => saveAthleteAndTokenToS3(athlete, oauthToken));
}

function saveAthleteAndTokenToS3(athlete, oauthToken) {
  return rxo.concat(
    saveObjectToS3('shamvelo-prod-athlete', '' + athlete.id, JSON.stringify(athlete)),
    saveObjectToS3('shamvelo-prod-token', '' + athlete.id, oauthToken)
  ).last().map(() => {});
}

function saveObjectToS3(bucket, key, body) {
  console.log(`Saving object to S3. ${bucket}:${key}`);
  const params = {
    Bucket: bucket,
    Key: '' + key,
    Body: body
  };
  const s3 = new AWS.S3();
  const upload = s3.upload(params);
  return Rx.Observable.fromNodeCallback(upload.send, upload)();
}
