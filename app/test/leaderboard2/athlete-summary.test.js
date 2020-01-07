'use strict';

const summarize = require('../../src/leaderboard2/athlete-summary');

const activity = {
  id: 1,
  distance: 2,
  moving_time: 4,
  name: 'my activity',
  total_elevation_gain: 3,
  start_date: '2020-01-01:00:00:00',
  athlete: { id: 1234 },
};

test('athlete summary has all time period summaries populated', () => {
  const summary = summarize(null, activity);
  expect(summary.year['2020'].summary).toBeTruthy();
  expect(summary.year['2020'].month['0']).toBeTruthy();
  expect(summary.year['2020'].week['1']).toBeTruthy();
});
