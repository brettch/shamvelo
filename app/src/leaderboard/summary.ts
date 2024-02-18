import { Identified, Named } from '../identified.js';
import { AthleteSummary, YearContainer as AthleteYearContainer, PeriodContainer as AthletePeriodContainer } from './athlete-summary.js';
import { PeriodSummary as AthletePeriodSummary } from './period-summary.js'
import { SlimAthlete } from '../strava.js';

export interface Leaderboard {
  year: Record<number, YearContainer>,
}

export function create(): Leaderboard {
  return {
    year: {},
  };
}

export interface YearContainer extends Identified, PeriodContainer {
  month: Record<number, PeriodContainer>,
  week: Record<number, PeriodContainer>,
  points: {
    month: PeriodPoints,
    week: PeriodPoints,
  },
}

function createYearContainer(year: number): YearContainer {
  return {
    ...createPeriodContainer(),
    id: year,
    month: {},
    week: {},
    points: {
      month: createPeriodPoints(),
      week: createPeriodPoints(),
    },
  };
}

export interface PeriodContainer {
  summary: PeriodSummary,
}

function createPeriodContainer(): PeriodContainer {
  return {
    summary: {
      activityCount: [],
      activeDayCount: [],
      averageSpeed: [],
      distance: [],
      elevation: [],
      fastestRide: [],
      longestRide: [],
      movingTime: [],
    },
  };
}

export interface PeriodSummary {
  activityCount: AthleteScore[],
  activeDayCount: AthleteScore[],
  averageSpeed: AthleteScore[],
  distance: AthleteScore[],
  elevation: AthleteScore[],
  fastestRide: RideScore[],
  longestRide: RideScore[],
  movingTime: AthleteScore[],
}

// Build types representing the sets of keys in PeriodSummary
type KeysMatching<T, V> = NonNullable<
  { [K in keyof T]: T[K] extends V ? K : never }[keyof T]
>;
type PeriodSummaryRideScoreField = KeysMatching<PeriodSummary, RideScore[]>;
type PeriodSummaryAthleteScoreField = Exclude<KeysMatching<PeriodSummary, AthleteScore[]>, PeriodSummaryRideScoreField>;

export interface AthleteScore {
  value: number,
  athlete: Named,
}

export interface RideScore extends AthleteScore {
  ride: Named,
}

export interface PeriodPoints {
  activeDayCount: AthleteScore[],
  activityCount: AthleteScore[],
  averageSpeed: AthleteScore[],
  distance: AthleteScore[],
  elevation: AthleteScore[],
  fastestRide: AthleteScore[],
  longestRide: AthleteScore[],
  movingTime: AthleteScore[],
  total: AthleteScore[];
}

function createPeriodPoints(): PeriodPoints {
  return {
    activeDayCount: [],
    activityCount: [],
    averageSpeed: [],
    distance: [],
    elevation: [],
    fastestRide: [],
    longestRide: [],
    movingTime: [],
    total: [],
  };
}

export function addAthlete(leaderboard: Leaderboard, athleteSummary: AthleteSummary, athlete: SlimAthlete): Leaderboard {
  applyYears(leaderboard, athleteSummary, athlete);

  return leaderboard;
};

function applyYears(leaderboard: Leaderboard, athleteSummary: AthleteSummary, athlete: SlimAthlete) {
  const leaderboardYears = leaderboard.year;
  const athleteYears = athleteSummary.year;
  Object.keys(athleteYears).forEach(year => {
    applyYear(+year, leaderboardYears, athleteYears, athlete);
  });
}

function applyYear(year: number, leaderboardYears: Record<number, YearContainer>, athleteYears: Record<number, AthleteYearContainer>, athlete: SlimAthlete) {
  if (!leaderboardYears[year]) {
    leaderboardYears[year] = createYearContainer(year);
  }
  const leaderboardYear = leaderboardYears[year];
  const athleteYear = athleteYears[year];

  applyPeriod(leaderboardYear, athleteYear, athlete);
  applySubYears(leaderboardYear.month, athleteYear.month, athlete);
  applySubYears(leaderboardYear.week, athleteYear.week, athlete);
  calculatePoints(leaderboardYear.month, leaderboardYear.points.month);
  calculatePoints(leaderboardYear.week, leaderboardYear.points.week);
}

function applySubYears(leaderboardPeriods: Record<number, PeriodContainer>, athletePeriods: Record<number, AthletePeriodContainer>, athlete: SlimAthlete) {
  Object.keys(athletePeriods).forEach(periodId => {
    applySubYear(+periodId, leaderboardPeriods, athletePeriods, athlete);
  });
}

function applySubYear(periodId: number, leaderboardPeriods: Record<number, PeriodContainer>, athletePeriods: Record<number, AthletePeriodContainer>, athlete: SlimAthlete) {
  if (!leaderboardPeriods[periodId]) {
    leaderboardPeriods[periodId] = createPeriodContainer();
  }
  const leaderboardPeriod = leaderboardPeriods[periodId];
  const athletePeriod = athletePeriods[periodId];

  applyPeriod(leaderboardPeriod, athletePeriod, athlete);
}

function applyPeriod(leaderboardPeriod: PeriodContainer, athletePeriod: AthletePeriodContainer, athlete: SlimAthlete) {
  const numericFieldNames = [
    'distance',
    'elevation',
    'movingTime',
    'activityCount',
    'activeDayCount',
    'averageSpeed',
  ] as const;

  const rideFieldNames = [
    'longestRide',
    'fastestRide',
  ] as const;

  const leaderboardSummary = leaderboardPeriod.summary;
  const athleteSummary = athletePeriod.summary;

  numericFieldNames.forEach(fieldName =>
    mergeNumericField(fieldName, leaderboardSummary, athleteSummary, athlete)
  );

  rideFieldNames.forEach(fieldName =>
    mergeRideField(fieldName, leaderboardSummary, athleteSummary, athlete)
  );
}

function mergeNumericField(fieldName: PeriodSummaryAthleteScoreField, leaderboardSummary: PeriodSummary, athleteSummary: AthletePeriodSummary, athlete: SlimAthlete) {
  const leaderboardField = leaderboardSummary[fieldName];
  const athleteValue = athleteSummary[fieldName];
  const athleteScore: AthleteScore = {
    value: athleteValue,
    athlete: {
      id: athlete.id,
      name: buildAthleteName(athlete),
    },
  }
  leaderboardField.push(athleteScore);
  leaderboardField.sort(compareScoreDescending);
  const maxResultsLength = 10;
  if (leaderboardField.length > maxResultsLength) {
    leaderboardField.length = maxResultsLength;
  }
}

function compareScoreDescending(a: AthleteScore, b: AthleteScore): number {
  return b.value - a.value;
}

function mergeRideField(fieldName: PeriodSummaryRideScoreField, leaderboardSummary: PeriodSummary, athleteSummary: AthletePeriodSummary, athlete: SlimAthlete) {
  const leaderboardRecords = leaderboardSummary[fieldName];
  const athleteRides = athleteSummary[fieldName];

  const athleteRideScores: RideScore[] = athleteRides.map(rideRecord => ({
    value: rideRecord.value,
    athlete: {
      id: athlete.id,
      name: buildAthleteName(athlete),
    },
    ride: {
      id: rideRecord.id,
      name: rideRecord.name,
    },
  }));

  leaderboardRecords.push(...athleteRideScores);
  leaderboardRecords.sort(compareScoreDescending);
  const maxResultsLength = 10;
  if (leaderboardRecords.length > maxResultsLength) {
    leaderboardRecords.length = maxResultsLength;
  }
}

function buildAthleteName(athlete: SlimAthlete) {
  return `${athlete.firstname} ${athlete.lastname}`;
}

function calculatePoints(periods: Record<number, PeriodContainer>, points: PeriodPoints) {
  const periodSummaries = Object
    .keys(periods)
    .map(periodKey => +periodKey)
    .map(periodKey => periods[periodKey])
    .map(period => period.summary);

  ([
    'distance',
    'elevation',
    'movingTime',
    'activityCount',
    'activeDayCount',
    'averageSpeed',
    'longestRide',
    'fastestRide'
  ] as const).forEach(fieldName => {
    calculatePointsForField(fieldName, periodSummaries, points);
  });

  // We leave out moving time (too similar to distance) and activity count (too similar to active day count).
  tallyPointsForTotalField(points, ([
    'distance',
    'elevation',
    'activeDayCount',
    'averageSpeed',
    'longestRide',
    'fastestRide'
  ]) as const);
}

function calculatePointsForField(fieldName: keyof PeriodSummary, periodSummaries: PeriodSummary[], points: PeriodPoints) {
  const fieldPoints = points[fieldName];

  // Take the field results for each period and take the top score/athlete from each one.
  const allAthleteWins = periodSummaries
    .map(periodSummary => periodSummary[fieldName])
    .filter(fieldScores => fieldScores.length > 0)
    .map(fieldScores => fieldScores[0]);

  // Group wins by athlete.
  const athleteWinsByAthlete = groupBy(allAthleteWins, (athleteWin) => athleteWin.athlete.id);

  // Score each athlete by number of wins and sort.
  points[fieldName] =
    Array
      .from(athleteWinsByAthlete.values())
      .map(singleAthleteWins => ({
        value: singleAthleteWins.length,
        athlete: singleAthleteWins[0].athlete,
      }))
      .sort(compareScoreDescending);
}

function tallyPointsForTotalField(points: PeriodPoints, fieldNames: (keyof PeriodPoints)[]) {
  const allPoints = fieldNames
    .flatMap(fieldName => points[fieldName]);

  const allPointsByAthlete = groupBy(allPoints, (athletePoints) => athletePoints.athlete.id);
  points.total =
    Array
      .from(allPointsByAthlete.values())
      .map(singleAthletePoints => singleAthletePoints.reduce((totalRecord, nextRecord) => ({
        athlete: totalRecord.athlete,
        value: totalRecord.value + nextRecord.value,
      })))
      .sort(compareScoreDescending);
}

function groupBy<K, V>(values: V[], toKey: (value: V) => K): Map<K, V[]> {
  const groups = new Map<K, V[]>();
  for (const value of values) {
    const key = toKey(value);
    const groupValues = groups.get(key) || [];
    groupValues.push(value);
    groups.set(key, groupValues);
  }

  return groups;
}
