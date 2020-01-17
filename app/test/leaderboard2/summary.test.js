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
    }],
    fastestRide: [{
      ...allAthleteRecord,
      id: athletePeriod.summary.fastestRide[0].id,
      name: athletePeriod.summary.fastestRide[0].name,
      value: athletePeriod.summary.fastestRide[0].averageSpeed
    }],
    longestRide: [{
      ...allAthleteRecord,
      id: athletePeriod.summary.longestRide[0].id,
      name: athletePeriod.summary.longestRide[0].name,
      value: athletePeriod.summary.longestRide[0].distance
    }]
  };
  const expectedAllYearFieldPoints = [{
    ...allAthleteRecord,
    value: 2
  }];
  const expectedAllYearPoints = {
    distance: expectedAllYearFieldPoints,
    elevation: expectedAllYearFieldPoints,
    movingTime: expectedAllYearFieldPoints,
    activityCount: expectedAllYearFieldPoints,
    activeDayCount: expectedAllYearFieldPoints,
    averageSpeed: expectedAllYearFieldPoints,
    fastestRide: expectedAllYearFieldPoints,
    longestRide: expectedAllYearFieldPoints,
    total: [{
      ...allAthleteRecord,
      value: 12
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
    },
    points: {
      month: expectedAllYearPoints,
      week: expectedAllYearPoints
    }
  };
  const expectedSummary = {
    year: {
      '2019': {
        ...expectedAllYear,
        year: 2019
      },
      '2020': {
        ...expectedAllYear,
        year: 2020
      }
    }
  };

  expect(summary).toEqual(expectedSummary);
});

test('merge two year summaries', () => {
  const athlete1Data = {
    athlete: {
      id: 1,
      firstname: 'A',
      lastname: 'AA'
    },
    summary: {
      year: {
        '2020': {
          summary: {
            distance: 1000,
            elevation: 100,
            movingTime: 300,
            activityCount: 1,
            activeDayCount: 1,
            averageSpeed: 25,
            fastestRide: [{
              id: 11,
              name: 'a1ride1',
              averageSpeed: 24
            }],
            longestRide: [{
              id: 12,
              name:'a1ride2',
              distance: 100
            }]
          }
        }
      }
    }
  };
  const athlete2Data = {
    athlete: {
      id: 2,
      firstname: 'B',
      lastname: 'BB'
    },
    summary: {
      year: {
        '2020': {
          summary: {
            distance: 2000,
            elevation: 50,
            movingTime: 600,
            activityCount: 2,
            activeDayCount: 2,
            averageSpeed: 24,
            fastestRide: [{
              id: 21,
              name: 'a2ride1',
              averageSpeed: 23
            }],
            longestRide: [{
              id: 22,
              name:'a2ride2',
              distance: 200
            }]
          }
        }
      }
    }
  };

  const expectedSummary = {
    distance: [
      {
        athleteId: 2,
        athleteName: 'B BB',
        value: 2000
      },
      {
        athleteId: 1,
        athleteName: 'A AA',
        value: 1000
      }
    ],
    elevation: [
      {
        athleteId: 1,
        athleteName: 'A AA',
        value: 100
      },
      {
        athleteId: 2,
        athleteName: 'B BB',
        value: 50
      }
    ],
    movingTime: [
      {
        athleteId: 2,
        athleteName: 'B BB',
        value: 600
      },
      {
        athleteId: 1,
        athleteName: 'A AA',
        value: 300
      }
    ],
    activityCount: [
      {
        athleteId: 2,
        athleteName: 'B BB',
        value: 2
      },
      {
        athleteId: 1,
        athleteName: 'A AA',
        value: 1
      }
    ],
    activeDayCount: [
      {
        athleteId: 2,
        athleteName: 'B BB',
        value: 2
      },
      {
        athleteId: 1,
        athleteName: 'A AA',
        value: 1
      }
    ],
    averageSpeed: [
      {
        athleteId: 1,
        athleteName: 'A AA',
        value: 25
      },
      {
        athleteId: 2,
        athleteName: 'B BB',
        value: 24
      }
    ],
    fastestRide: [
      {
        id: 11,
        name: 'a1ride1',
        athleteId: 1,
        athleteName: 'A AA',
        value: 24
      },
      {
        id: 21,
        name: 'a2ride1',
        athleteId: 2,
        athleteName: 'B BB',
        value: 23
      }
    ],
    longestRide: [
      {
        id: 22,
        name: 'a2ride2',
        athleteId: 2,
        athleteName: 'B BB',
        value: 200
      },
      {
        id: 12,
        name: 'a1ride2',
        athleteId: 1,
        athleteName: 'A AA',
        value: 100
      }
    ]
  };

  const actualSummary = [
    athlete1Data,
    athlete2Data
  ].reduce(
    (previousSummary, athleteData) => summarize(previousSummary, athleteData.summary, athleteData.athlete),
    {}
  );

  expect(actualSummary.year['2020'].summary).toEqual(expectedSummary);
});
