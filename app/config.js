'use strict';

function getVariable(envVar) {
  var result = process.env[envVar];
  if (!result) {
    throw new Error('Environment variable ' + envVar + ' must be set');
  }
  return result;
}

function getVariableWithDefault(envVar, defaultValue) {
  if (process.env[envVar])
    return process.env[envVar];
  else
    return defaultValue;
}

module.exports = {
  express : {
    port : getVariableWithDefault('SHAMVELO_EXPRESS_PORT', 8080)
  },
  mongo : {
    url : getVariableWithDefault('SHAMVELO_MONGO_URL', 'mongodb://localhost:27017/shamvelo')
  },
  strava : {
    access_token : getVariable('SHAMVELO_STRAVA_ACCESS_TOKEN'),
    client_id : getVariable('SHAMVELO_STRAVA_CLIENT_ID'),
    client_secret : getVariable('SHAMVELO_STRAVA_CLIENT_SECRET'),
    redirect_uri : getVariableWithDefault('SHAMVELO_URL_BASE', 'http://localhost:8080') + '/registercode'
  }
};
