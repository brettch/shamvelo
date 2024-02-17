import { SlimAthlete } from '../strava.js';
import { AthleteSummary, PeriodContainer, YearContainer as AthleteYearContainer } from './athlete-summary.js';
import { AthleteScore, Leaderboard, PeriodPoints, PeriodSummary, YearContainer as LeaderboardYearContainer, addAthlete, create } from './summary.js';

const athletePeriod: PeriodContainer = {
  summary: {
    distance: 10000,
    elevation: 1000,
    movingTime: 3600,
    activityCount: 2,
    activeDays: ['20190101', '20190102'],
    activeDayCount: 2,
    averageSpeed: 25.7,
    longestRide: [
      {
        id: 1001,
        name: 'morning ride',
        value: 5000
      }
    ],
    fastestRide: [
      {
        id: 1002,
        name: 'afternoon ride',
        value: 25
      }
    ]
  }
};

const athleteYear: AthleteYearContainer = {
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

const athleteSummary: AthleteSummary = {
  id: 1,
  year: {
    '2019': athleteYear,
    '2020': athleteYear
  }
};

const athlete: SlimAthlete = {
  id: 1,
  firstname: 'Alice',
  lastname: 'Smith'
};

const allAthleteRecord: AthleteScore = {
  athlete: {
    id: athlete.id,
    name: `${athlete.firstname} ${athlete.lastname}`,
  },
  value: 0,
};

test('merge of single athlete', () => {
  const summary = addAthlete(create(), athleteSummary, athlete);
  const expectedAllPeriodSummary: PeriodSummary = {
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
      ride: {
        id: athletePeriod.summary.fastestRide[0].id,
        name: athletePeriod.summary.fastestRide[0].name,
      },
      value: athletePeriod.summary.fastestRide[0].value
    }],
    longestRide: [{
      ...allAthleteRecord,
      ride: {
        id: athletePeriod.summary.longestRide[0].id,
        name: athletePeriod.summary.longestRide[0].name,
      },
      value: athletePeriod.summary.longestRide[0].value
    }]
  };
  const expectedAllYearFieldPoints: AthleteScore[] = [{
    ...allAthleteRecord,
    value: 2
  }];
  const expectedAllYearPoints: PeriodPoints = {
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
  const expectedAllYear: LeaderboardYearContainer = {
    id: 0,
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
  const expectedSummary: Leaderboard = {
    year: {
      '2019': {
        ...expectedAllYear,
        id: 2019
      },
      '2020': {
        ...expectedAllYear,
        id: 2020
      }
    }
  };

  expect(summary).toEqual(expectedSummary);
});

test('merge two year summaries', () => {
  interface AthleteTestData {
    athlete: SlimAthlete,
    summary: AthleteSummary,
  }
  const athlete1Data: AthleteTestData = {
    athlete: {
      id: 1,
      firstname: 'A',
      lastname: 'AA'
    },
    summary: {
      id: 2020,
      year: {
        '2020': {
          summary: {
            activeDays: [],
            distance: 1000,
            elevation: 100,
            movingTime: 300,
            activityCount: 1,
            activeDayCount: 1,
            averageSpeed: 25,
            fastestRide: [{
              id: 11,
              name: 'a1ride1',
              value: 24
            }],
            longestRide: [{
              id: 12,
              name:'a1ride2',
              value: 100
            }]
          },
          month: {},
          week: {},
        }
      },
    }
  };
  const athlete2Data: AthleteTestData = {
    athlete: {
      id: 2,
      firstname: 'B',
      lastname: 'BB'
    },
    summary: {
      id: 2020,
      year: {
        '2020': {
          summary: {
            activeDays: [],
            distance: 2000,
            elevation: 50,
            movingTime: 600,
            activityCount: 2,
            activeDayCount: 2,
            averageSpeed: 24,
            fastestRide: [{
              id: 21,
              name: 'a2ride1',
              value: 23
            }],
            longestRide: [{
              id: 22,
              name:'a2ride2',
              value: 200
            }]
          },
          month: {},
          week: {},
        }
      }
    }
  };

  const expectedSummary: PeriodSummary = {
    distance: [
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        value: 2000
      },
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        value: 1000
      }
    ],
    elevation: [
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        value: 100
      },
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        value: 50
      }
    ],
    movingTime: [
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        value: 600
      },
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        value: 300
      }
    ],
    activityCount: [
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        value: 2
      },
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        value: 1
      }
    ],
    activeDayCount: [
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        value: 2
      },
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        value: 1
      }
    ],
    averageSpeed: [
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        value: 25
      },
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        value: 24
      }
    ],
    fastestRide: [
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        ride: {
          id: 11,
          name: 'a1ride1',
        },
        value: 24
      },
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        ride: {
          id: 21,
          name: 'a2ride1',
        },
        value: 23
      }
    ],
    longestRide: [
      {
        athlete: {
          id: 2,
          name: 'B BB',
        },
        ride: {
          id: 22,
          name: 'a2ride2',
        },
        value: 200
      },
      {
        athlete: {
          id: 1,
          name: 'A AA',
        },
        ride: {
          id: 12,
          name: 'a1ride2',
        },
        value: 100
      }
    ]
  };

  const actualSummary = [
    athlete1Data,
    athlete2Data
  ].reduce(
    (previousSummary, athleteData) => addAthlete(previousSummary, athleteData.summary, athleteData.athlete),
    create(),
  );

  expect(actualSummary.year['2020'].summary).toEqual(expectedSummary);
});
