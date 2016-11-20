'use strict';

module.exports = {
  getRegister,
  getRegisterCode,
  getRegisterToken,
  buildHomeView,
  getHomeView,
  buildAthleteView,
  getAthleteView,
  refreshAllActivities,
  hello
};

require('./src/config');
const activity = require('./src/activity');
const athlete = require('./src/athlete');
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
    .subscribe(createHttpRedirectSubscriber(callback, './'));

  function getToken(event) {
    const token = event.queryStringParameters.token;
    if (token == null) {
      throw new Error('Query parameter "token" is missing');
    }
    return token;
  }
}

function buildHomeView(event, context, callback) {
  initConfig(event);

  home
    .buildView()
    .subscribe(createBasicSubscriber(callback));
}

function getHomeView(event, context, callback) {
  initConfig(event);

  home
    .getView()
    .subscribe(createHtmlSubscriber(callback));
}

function buildAthleteView(event, context, callback) {
  initConfig(event);

  // Iterate over all records in the event.
  rxo.from(event.Records)
    // The record contains an SNS message as a JSON string
    .map(record => record.Sns.Message)
    .map(JSON.parse)
    // Iterate over all records in the SNS message
    .flatMap(snsMessage => rxo.from(snsMessage.Records))
    // Get the S3 event
    .map(record => record.s3)
    // The S3 object key is the athlete id
    .map(s3Message => s3Message.object.key)
    // Build the view for the newly added/modified athlete
    .flatMap(athlete.buildView)
    .subscribe(createBasicSubscriber(callback));
}

function getAthleteView(event, context, callback) {
  initConfig(event);

  athlete
    .getView(event.pathParameters.athleteId)
    .subscribe(createHtmlSubscriber(callback));
}

function refreshAllActivities(event, context, callback) {
  initConfig(event);

  activity
    .refreshAllActivities()
    .subscribe(createBasicSubscriber(callback));
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

function createBasicSubscriber(callback) {
  return Rx.Observer.create(
    () => callback(),
    callback,
    () => {}
  );
}

function createHtmlSubscriber(callback) {
  return Rx.Observer.create(
    content => callback(null, {
      headers: {
        'Content-Type': 'text/html'
      },
      body: content
    }),
    callback,
    () => {}
  );
}

function createHttpRedirectSubscriber(callback, location) {
  return Rx.Observer.create(
    () => callback(null, {
      statusCode: 302,
      headers: {
        location: location
      }
    }),
    callback,
    () => {}
  );
}

function initConfig(event) {
  if (event.headers && event.headers.Host) {
    process.env.STRAVA_REDIRECT_URI = `https://${event.headers.Host}/registercode`;
  }
}
