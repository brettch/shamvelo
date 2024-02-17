import { getPeriods } from './athlete-summary-paths.js';

const date = new Date('2020-01-01T00:00:00Z');

const dateWithWeekInNextYear = new Date('2019-12-31T00:00:00Z');

test('athlete summary paths', () => {
  expect(getPeriods(date)).toEqual({
    year: 2020,
    month: 0,
    week: {
      year: 2020,
      week: 1,
    }
  });
});

test('athlete summary paths with overlapping year', () => {
  expect(getPeriods(dateWithWeekInNextYear)).toEqual({
    year: 2019,
    month: 11,
    week: {
      year: 2020,
      week: 1,
    }
  });
});
