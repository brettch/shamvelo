'use strict';

module.exports = {
  getRegister,
  getRegisterCode,
  getRegisterToken,
  buildHomeView,
  getHomeView,
  buildAthleteView,
  getAthleteView,
  hello
};

const athlete = require('./src/athlete');
const config = require('./src/config');
const register = require('./src/register');
const home = require('./src/home');
const Rx = require('rx');

const rxo = Rx.Observable;

function getRegister(event, context, callback) {
  initConfig(event);

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
  initConfig(event);

  rxo.of(event)
    .map(getCode)
    .flatMap(register.registerAthleteWithCode)
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

function getRegisterToken(event, context, callback) {
  initConfig(event);

  rxo.of(event)
    .map(getToken)
    .flatMap(register.registerAthleteWithToken)
    .subscribe(
      success,
      callback,
      () => {}
    );

  function getToken(event) {
    const token = event.queryStringParameters.token;
    if (token == null) {
      throw new Error('Query parameter "token" is missing');
    }
    return token;
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

function buildHomeView(event, context, callback) {
  initConfig(event);

  home.buildView()
    .subscribe(
      () => callback(),
      callback,
      () => {}
    );
}

function getHomeView(event, context, callback) {
  initConfig(event);

  home.getView()
    .subscribe(
      success,
      callback,
      () => {}
    );

  function success(content) {
    callback(null, {
      headers: {
        'Content-Type': 'text/html'
      },
      body: content
    });
  }
}

function buildAthleteView(event, context, callback) {
  initConfig(event);

  const athleteId = event.s3.object.key;

  athlete.buildView(athleteId)
    .subscribe(
      () => callback(),
      callback,
      () => {}
    );
}

function getAthleteView(event, context, callback) {
  initConfig(event);

  athlete.getView(event.pathParameters.athleteId)
    .subscribe(
      success,
      callback,
      () => {}
    );

  function success(content) {
    callback(null, {
      headers: {
        'Content-Type': 'text/html'
      },
      body: content
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

function initConfig(event) {
  process.env.STRAVA_REDIRECT_URI = `https://${event.headers.Host}/registercode`;
  config.environment = event.requestContext.stage;
}
