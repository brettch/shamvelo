'use strict';

module.exports = {
  getOAuthRequestAccessUrl,
  registerAthlete
};

const AWS = require('aws-sdk');
const Rx = require('rx');
const strava = require('./strava');

const rxo = Rx.Observable;

function getOAuthRequestAccessUrl() {
  return strava.getOAuthRequestAccessUrl();
}

function registerAthlete(stravaCode) {
  console.log(`Registering athlete with code ${stravaCode}`);
  return strava.getOAuthToken(stravaCode)
    .flatMap(saveRegistrationPayloadToS3);
}

function saveRegistrationPayloadToS3(payload) {
  return rxo.concat(
    saveObjectToS3('shamvelo-prod-athlete', '' + payload.athlete.id, JSON.stringify(payload.athlete)),
    saveObjectToS3('shamvelo-prod-token', '' + payload.athlete.id, payload.access_token)
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
