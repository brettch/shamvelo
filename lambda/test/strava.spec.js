'use strict';

const expect = require('chai').expect;
const strava = require('../src/strava');

describe('Strava', () => {
  describe('getOAuthRequestAccessUrl', () => {
    it('should generate a valid redirect URL', () => {
      const expectedUrl = `https://www.strava.com/oauth/authorize?client_id=${encodeURIComponent(process.env.STRAVA_CLIENT_ID)}&redirect_uri=${encodeURIComponent(process.env.STRAVA_REDIRECT_URI)}&response_type=code`;
      expect(strava.getOAuthRequestAccessUrl()).to.equal(expectedUrl);
    });
  });
});
