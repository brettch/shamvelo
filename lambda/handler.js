'use strict';

module.exports = {
  getRegister,
  getRegisterCode,
  hello
};

const register = require('./src/register');
const Rx = require('rx');

const rxo = Rx.Observable;

function getRegister(event, context, callback) {
  configureStravaApi(event);

  const accessUrl = register.getOAuthRequestAccessUrl();

  const response = {
    statusCode: 302,
    headers: {
      location: accessUrl
    }
  };

  callback(null, response);
}

function getRegisterCode(event, context, callback) {
  configureStravaApi(event);

  rxo.of(event)
    .map(getCode)
    .flatMap(register.registerAthlete)
    .subscribe(
      success,
      callback,
      () => {}
    );

  function getCode(event) {
    const code = event.queryStringParameters.code;
    if (code == null) {
      throw new Error('Query parameter "code" is missing');
    }
    return code;
  }

  function success() {
    callback(null, {
      statusCode: 302,
      headers: {
        location: './'
      }
    });
  }
}

function hello(event, context, callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}

function configureStravaApi(event) {
  // Dynamically determine the endpoint based on the current request.
  process.env.STRAVA_REDIRECT_URI = `https://${event.headers.Host}/registercode`;
}
