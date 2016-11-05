'use strict';

module.exports = {
  getOAuthRequestAccessUrl
};

const strava = require('./strava');

function getOAuthRequestAccessUrl() {
    return strava.getOAuthRequestAccessUrl();
}
