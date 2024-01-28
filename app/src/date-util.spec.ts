import { monthFromDate, weekFromDate, yearFromDate, yearFromMonth, yearFromWeek } from './date-util.js';

test('should be able to derive the year from a date', () => {
  expect(yearFromDate(new Date('2016-02-03 04:05:06'))).toBe(2016);
});

test('should be able to derive the month from a date', () => {
  expect(monthFromDate(new Date('2016-02-03 04:05:06'))).toBe(201602);
});

test('should be able to derive the year from a month', () => {
  expect(yearFromMonth(201602)).toBe(2016);
});

test('should be able to derive the week from a date around year boundary', () => {
  // Week is centred on Thursday.  31st December 2015 was a Thursday so three days
  // either side should be treated as last week of 2015.
  expect(weekFromDate(new Date('2015-12-28 00:00:00'))).toBe(201553);
  expect(weekFromDate(new Date('2016-01-03 23:59:59'))).toBe(201553);
  // Next week beyond that should be the first week of 2016.
  expect(weekFromDate(new Date('2016-01-04 00:00:00'))).toBe(201601);
  expect(weekFromDate(new Date('2016-01-10 23:59:59'))).toBe(201601);
});

test('should be able to derive the week from a date around DST boundary', () => {
  expect(weekFromDate(new Date('2016-09-26 00:00:00'))).toBe(201639);
  expect(weekFromDate(new Date('2016-10-02 23:59:59'))).toBe(201639);
  expect(weekFromDate(new Date('2016-10-03 00:00:00'))).toBe(201640);
  expect(weekFromDate(new Date('2016-10-09 23:59:59'))).toBe(201640);
});

test('should be able to derive the year from a week', () => {
  expect(yearFromMonth(201623)).toBe(2016);
});
