import { create, addActivity, PeriodSummary } from './period-summary.js';

const activity = {
  id: 1,
  distance: 4000,
  movingTime: 400,
  name: 'my activity',
  startDate: new Date('2020-01-01:00:00:00'),
  totalElevationGain: 3
};

const singleSummary = addActivity(create(), activity);
const doubleSummary = addActivity(addActivity(create(), activity), activity);

test('new summary is initialized correctly', () => {
  expect(create()).toEqual({
    distance: 0,
    elevation: 0,
    movingTime: 0,
    activityCount: 0,
    averageSpeed: 0,
    activeDays: {},
    activeDayCount: 0,
    eddingtonNumber: 0,
    longestRide: [],
    fastestRide: []
  } as PeriodSummary);
});

test('single summary is initialized correctly', () => {
  expect(singleSummary.distance).toEqual(activity.distance);
  expect(singleSummary.elevation).toEqual(activity.totalElevationGain);
  expect(singleSummary.movingTime).toEqual(activity.movingTime);
  expect(singleSummary.activityCount).toEqual(1);
  expect(singleSummary.averageSpeed).toEqual(10);
  expect(Object.keys(singleSummary.activeDays).length).toEqual(1);
  expect(singleSummary.activeDays['20200101'].distance).toEqual(4000);
  expect(singleSummary.eddingtonNumber).toEqual(1),
  expect(singleSummary.longestRide.length).toEqual(1);
  expect(singleSummary.longestRide[0].id).toEqual(activity.id);
  expect(singleSummary.longestRide[0].name).toEqual(activity.name);
  expect(singleSummary.longestRide[0].value).toEqual(activity.distance);
  expect(singleSummary.fastestRide.length).toEqual(1);
  expect(singleSummary.fastestRide[0].id).toEqual(activity.id);
  expect(singleSummary.fastestRide[0].name).toEqual(activity.name);
  expect(singleSummary.fastestRide[0].value).toEqual(10);
});

test('distance is added', () => {
  expect(doubleSummary.distance).toEqual(2 * activity.distance);
});

test('elevation is added', () => {
  expect(doubleSummary.elevation).toEqual(2 * activity.totalElevationGain);
});

test('moving time is added', () => {
  expect(doubleSummary.movingTime).toEqual(2 * activity.movingTime);
});

test('activity count is tallied', () => {
  expect(doubleSummary.activityCount).toEqual(2);
});

test('average speed is averaged', () => {
  expect(doubleSummary.averageSpeed).toEqual(10);
});

test('unique days are identified', () => {
  // Only two unique dates in here (two are duplicated).
  const summary = [
    '2020-01-01:00:00:00',
    '2020-01-02:00:00:00',
    '2020-01-02:00:00:00'
  ]
    .map(dateS => new Date(dateS))
    .map(date => ({
      ...activity,
      startDate: date
    }))
    .reduce(addActivity, create());

  expect(Object.keys(summary.activeDays).length).toEqual(2);
  expect(summary.activeDayCount).toEqual(2);
});

test('eddington number is calculated', () => {
  expect(doubleSummary.eddingtonNumber).toEqual(1);
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
    .reduce(addActivity, create());
  expect(summary.longestRide.length).toEqual(5);
  expect(summary.longestRide.map(activity => activity.id)).toEqual([8, 7, 6, 5, 4]);
});

test('fastest rides are identified', () => {
  const summary = [
    {id: 1, movingTime: 1},
    {id: 3, movingTime: 3},
    {id: 5, movingTime: 5},
    {id: 7, movingTime: 7},
    {id: 2, movingTime: 2},
    {id: 4, movingTime: 4},
    {id: 6, movingTime: 6},
    {id: 8, movingTime: 8},
  ]
    .map(data => ({
      ...activity,
      ...data
    }))
    .reduce(addActivity, create());
  expect(summary.fastestRide.length).toEqual(5);
  expect(summary.fastestRide.map(activity => activity.id)).toEqual([1, 2, 3, 4, 5]);
});
