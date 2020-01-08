'use strict';

const summarize = require('../../src/leaderboard2/summary');

const athletePeriod = {
  summary: {
    distance: 10000,
    elevation: 1000,
    movingTime: 3600,
    activityCount: 2,
    activeDays: [20190101, 20190102],
    activeDayCount: 2,
    averageSpeed: 25.7,
    longestRide: [
      {
        id: 1001,
        name: 'morning ride',
        distance: 5000
      }
    ],
    fastestRide: [
      {
        id: 1002,
        name: 'afternoon ride',
        averageSpeed: 25
      }
    ]
  }
};

const athleteYear = {
  ...athletePeriod,
  month: {
    '1': athletePeriod,
    '2': athletePeriod
  },
  week: {
    '1': athletePeriod,
    '2': athletePeriod
  }
};

const athleteSummary = {
  year: {
    '2019': athleteYear,
    '2020': athleteYear
  }
};

const athlete = {
  id: 1,
  firstname: 'Alice',
  lastname: 'Smith'
};

const allAthleteRecord = {
  athleteId: athlete.id,
  athleteName: `${athlete.firstname} ${athlete.lastname}`,
  value: 0
};

test('merge of single athlete', () => {
  const summary = summarize(null, athleteSummary, athlete);
  const expectedAllPeriodSummary = {
    distance: [{
      ...allAthleteRecord,
      value: athletePeriod.summary.distance
    }],
    elevation: [{
      ...allAthleteRecord,
      value: athletePeriod.summary.elevation
    }],
    movingTime: [{
      ...allAthleteRecord,
      value: athletePeriod.summary.movingTime
    }],
    activityCount: [{
      ...allAthleteRecord,
      value: athletePeriod.summary.activityCount
    }],
    activeDayCount: [{
      ...allAthleteRecord,
      value: athletePeriod.summary.activeDayCount
    }],
    averageSpeed: [{
      ...allAthleteRecord,
      value: athletePeriod.summary.averageSpeed
    }]
  };
  const expectedAllYear = {
    summary: expectedAllPeriodSummary,
    month: {
      '1': {
        summary: expectedAllPeriodSummary
      },
      '2': {
        summary: expectedAllPeriodSummary
      }
    },
    week: {
      '1': {
        summary: expectedAllPeriodSummary
      },
      '2': {
        summary: expectedAllPeriodSummary
      }
    }
  };
  const expectedSummary = {
    year: {
      '2019': expectedAllYear,
      '2020': expectedAllYear
    }
  };

  expect(summary).toEqual(expectedSummary);
});
