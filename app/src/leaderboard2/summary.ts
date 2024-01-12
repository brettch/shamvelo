const _ = require('lodash');

module.exports = function(_allSummary: any, athleteSummary: any, athlete: any) {
  const allSummary = _allSummary ? _allSummary : {};

  applyYears(allSummary, athleteSummary, athlete);

  return allSummary;
};

function applyYears(allSummary: any, athleteSummary: any, athlete: any) {
  const allYears = _.get(allSummary, 'year', {});
  _.set(allSummary, 'year', allYears);
  const athleteYears = _.get(athleteSummary, 'year', {});

  Object.keys(athleteYears).forEach(year => {
    applyYear(year, allYears, athleteYears, athlete);
  });
}

function applyYear(year: any, allYears: any, athleteYears: any, athlete: any) {
  const allYear = _.get(allYears, year, {year: parseInt(year)});
  _.set(allYears, year, allYear);
  const athleteYear = _.get(athleteYears, year, {});
  applyPeriod(allYear, athleteYear, athlete);
  applySubYears('month', allYear, athleteYear, athlete);
  applySubYears('week', allYear, athleteYear, athlete);
  calculatePoints('month', allYear);
  calculatePoints('week', allYear);
}

function applySubYears(periodType: any, allYear: any, athleteYear: any, athlete: any) {
  const allPeriods = _.get(allYear, periodType, {});
  _.set(allYear, periodType, allPeriods);
  const athletePeriods = _.get(athleteYear, periodType, {});

  Object.keys(athletePeriods).forEach(periodKey => {
    applySubYear(periodKey, allPeriods, athletePeriods, athlete);
  });
}

function applySubYear(periodKey: any, allPeriods: any, athletePeriods: any, athlete: any) {
  const allPeriod = _.get(allPeriods, periodKey, {});
  _.set(allPeriods, periodKey, allPeriod);
  const athletePeriod = _.get(athletePeriods, periodKey, {});

  applyPeriod(allPeriod, athletePeriod, athlete);
}

function applyPeriod(allPeriod: any, athletePeriod: any, athlete: any) {
  const allPeriodSummary = _.get(allPeriod, 'summary', {});
  _.set(allPeriod, 'summary', allPeriodSummary);
  const athletePeriodSummary = _.get(athletePeriod, 'summary', {});
  mergeNumericField('distance', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('elevation', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('movingTime', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('activityCount', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('activeDayCount', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('averageSpeed', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeRideField('longestRide', 'distance', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeRideField('fastestRide', 'averageSpeed', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
}

function sortDescending(a: any, b: any) {
  return b - a;
}

function mergeNumericField(fieldName: any, compareFn: any, allPeriod: any, athletePeriod: any, athlete: any) {
  const athleteField = {
    athleteId: athlete.id,
    athleteName: buildAthleteName(athlete),
    value: _.get(athletePeriod, fieldName)
  };

  const allField = _.get(allPeriod, fieldName, []);
  _.set(allPeriod, fieldName, allField);

  allField.push(athleteField);
  allField.sort((a: any, b: any) => compareFn(a.value, b.value));
}

function mergeRideField(fieldName: any, rideFieldName: any, compareFn: any, allPeriodSummary: any, athletePeriodSummary: any, athlete: any) {
  const athleteRideRecords = _
    .get(athletePeriodSummary, fieldName)
    .map((rideRecord: any) => ({
      id: rideRecord.id,
      name: rideRecord.name,
      value: _.get(rideRecord, rideFieldName),
      athleteId: athlete.id,
      athleteName: buildAthleteName(athlete)
    }));

  const allExistingRideRecords = _.get(allPeriodSummary, fieldName, []);

  const combinedRideRecords = _.concat(allExistingRideRecords, athleteRideRecords);
  combinedRideRecords.sort((a: any, b: any) => compareFn(a.value, b.value));

  _.set(allPeriodSummary, fieldName, combinedRideRecords.slice(0, 5));
}

function buildAthleteName(athlete: any) {
  return `${athlete.firstname} ${athlete.lastname}`;
}

function calculatePoints(periodKey: any, allYear: any) {
  const allPeriods = _.get(allYear, periodKey, {});
  const periodPoints = {};
  _.set(allYear, `points.${periodKey}`, periodPoints);

  const allPeriodSummaries = _
    .values(allPeriods)
    .map((allPeriod: any) => allPeriod.summary);

  [
    'distance',
    'elevation',
    'movingTime',
    'activityCount',
    'activeDayCount',
    'averageSpeed',
    'longestRide',
    'fastestRide'
  ].forEach(fieldName => {
    calculatePointsForField(periodPoints, allPeriodSummaries, fieldName);
  });

  tallyPointsForTotalField(periodPoints, [
    'distance',
    'elevation',
    'activeDayCount',
    'averageSpeed',
    'longestRide',
    'fastestRide'
  ]);
}

function calculatePointsForField(periodPoints: any, allPeriodSummaries: any, fieldName: any) {
  const athleteWins = allPeriodSummaries
    .map((allPeriodSummary: any) => _.get(allPeriodSummary, `${fieldName}[0]`))
    .filter((value: any) => value !== null);
  const athleteWinsGroupedByAthlete = _.values(
    _.groupBy(
      athleteWins,
      (record: any) => record.athleteId
    )
  );
  const athletePoints = athleteWinsGroupedByAthlete
    .map((athleteWins: any) => ({
      athleteId: athleteWins[0].athleteId,
      athleteName: athleteWins[0].athleteName,
      value: athleteWins.length
    })).sort((a: any, b: any) => b.value - a.value);
  _.set(periodPoints, fieldName, athletePoints);
}

function tallyPointsForTotalField(periodPoints: any, fieldNames: any) {
  const allFieldPoints = _.flatMap(fieldNames, (fieldName: any) => _.get(periodPoints, fieldName));
  const allPointsGroupedByAthlete = _.values(_.groupBy(allFieldPoints, (record: any) => record.athleteId));
  const totalPoints = allPointsGroupedByAthlete
    .map((athletePointsRecords: any) => athletePointsRecords.reduce((totalRecord: any, fieldRecord: any) => ({
      athleteId: totalRecord.athleteId,
      athleteName: totalRecord.athleteName,
      value: totalRecord.value + fieldRecord.value
    })))
    .sort((a: any, b: any) => b.value - a.value);
  _.set(periodPoints, 'total', totalPoints);
}
