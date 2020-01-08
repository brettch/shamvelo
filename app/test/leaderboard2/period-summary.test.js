'use strict';

const summarize = require('../../src/leaderboard2/period-summary');

const activity = {
  id: 1,
  distance: 2,
  moving_time: 4,
  name: 'my activity',
  start_date: '2020-01-01:00:00:00',
  total_elevation_gain: 3
};

const singleSummary = summarize(null, activity);
const doubleSummary = summarize(summarize(null, activity), activity);

test('single summary is initialized correctly', () => {
  expect(singleSummary.distance).toEqual(activity.distance);
  expect(singleSummary.elevation).toEqual(activity.total_elevation_gain);
  expect(singleSummary.movingTime).toEqual(activity.moving_time);
  expect(singleSummary.activityCount).toEqual(1);
  expect(singleSummary.averageSpeed).toEqual(1.8);
  expect(singleSummary.activeDays.length).toEqual(1);
  expect(singleSummary.longestRide.length).toEqual(1);
  expect(singleSummary.longestRide[0].id).toEqual(activity.id);
  expect(singleSummary.longestRide[0].name).toEqual(activity.name);
  expect(singleSummary.longestRide[0].distance).toEqual(activity.distance);
  expect(singleSummary.fastestRide.length).toEqual(1);
  expect(singleSummary.fastestRide[0].id).toEqual(activity.id);
  expect(singleSummary.fastestRide[0].name).toEqual(activity.name);
  expect(singleSummary.fastestRide[0].averageSpeed).toEqual(1.8);
});

test('distance is added', () => {
  expect(doubleSummary.distance).toEqual(2 * activity.distance);
});

test('elevation is added', () => {
  expect(doubleSummary.elevation).toEqual(2 * activity.total_elevation_gain);
});

test('moving time is added', () => {
  expect(doubleSummary.movingTime).toEqual(2 * activity.moving_time);
});

test('activity count is tallied', () => {
  expect(doubleSummary.activityCount).toEqual(2);
});

test('average speed is averaged', () => {
  expect(doubleSummary.averageSpeed).toEqual(1.8);
});

test('unique days are identified', () => {
  // Only two unique dates in here (two are duplicated).
  const summary = [
    '2020-01-01:00:00:00',
    '2020-01-02:00:00:00',
    '2020-01-02:00:00:00'
  ]
    .map(date => ({
      ...activity,
      start_date: date
    }))
    .reduce(summarize, null);

  expect(summary.activeDays.length).toEqual(2);
  expect(summary.activeDayCount).toEqual(2);
});

test('longest rides are identified', () => {
  const summary = [
    {id: 1, distance: 1},
    {id: 3, distance: 3},
    {id: 5, distance: 5},
    {id: 7, distance: 7},
    {id: 2, distance: 2},
    {id: 4, distance: 4},
    {id: 6, distance: 6},
    {id: 8, distance: 8},
  ]
    .map(data => ({
      ...activity,
      ...data
    }))
    .reduce(summarize, null);
  expect(summary.longestRide.length).toEqual(5);
  expect(summary.longestRide.map(activity => activity.id)).toEqual([1, 2, 3, 4, 5]);
});

test('fastest rides are identified', () => {
  const summary = [
    {id: 1, moving_time: 1},
    {id: 3, moving_time: 3},
    {id: 5, moving_time: 5},
    {id: 7, moving_time: 7},
    {id: 2, moving_time: 2},
    {id: 4, moving_time: 4},
    {id: 6, moving_time: 6},
    {id: 8, moving_time: 8},
  ]
    .map(data => ({
      ...activity,
      ...data
    }))
    .reduce(summarize, null);
  expect(summary.fastestRide.length).toEqual(5);
  expect(summary.fastestRide.map(activity => activity.id)).toEqual([1, 2, 3, 4, 5]);
});
