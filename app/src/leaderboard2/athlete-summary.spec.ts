import { create, addActivity } from './athlete-summary.js';

const activity = {
  id: 1,
  distance: 2,
  movingTime: 4,
  name: 'my activity',
  totalElevationGain: 3,
  startDate: new Date('2020-01-01:00:00:00'),
  athlete: { id: 1234 },
};

test('athlete summary has all time period summaries populated', () => {
  const id = 1;
  const summary = addActivity(create(id), activity);
  expect(summary.id).toEqual(id);
  expect(summary.year['2020'].summary).toBeTruthy();
  expect(summary.year['2020'].month['0']).toBeTruthy();
  expect(summary.year['2020'].week['1']).toBeTruthy();
});
