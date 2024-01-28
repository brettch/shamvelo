import summaryPaths from './athlete-summary-paths.js';

const activity = {
  startDate: new Date('2020-01-01T00:00:00Z'),
};

const activityWithWeekInNextYear = {
  startDate: new Date('2019-12-31T00:00:00Z'),
};

test('athlete summary paths', () => {
  expect(summaryPaths(activity)).toEqual([
    'year.2020.summary',
    'year.2020.month.0.summary',
    'year.2020.week.1.summary'
  ]);
});

test('athlete summary paths with overlapping year', () => {
  expect(summaryPaths(activityWithWeekInNextYear)).toEqual([
    'year.2019.summary',
    'year.2019.month.11.summary',
    'year.2020.week.1.summary'
  ]);
});
