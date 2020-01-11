'use strict';

const _ = require('lodash');

module.exports = function(_allSummary, athleteSummary, athlete) {
  const allSummary = _allSummary ? _allSummary : {};

  applyYears(allSummary, athleteSummary, athlete);

  return allSummary;
};

function applyYears(allSummary, athleteSummary, athlete) {
  const allYears = _.get(allSummary, 'year', {});
  _.set(allSummary, 'year', allYears);
  const athleteYears = _.get(athleteSummary, 'year', {});

  Object.keys(athleteYears).forEach(year => {
    applyYear(year, allYears, athleteYears, athlete);
  });
}

function applyYear(year, allYears, athleteYears, athlete) {
  const allYear = _.get(allYears, year, {});
  _.set(allYears, year, allYear);
  const athleteYear = _.get(athleteYears, year, {});
  applyPeriod(allYear, athleteYear, athlete);
  applySubYears('month', allYear, athleteYear, athlete);
  applySubYears('week', allYear, athleteYear, athlete);
  calculatePoints('month', allYear);
  calculatePoints('week', allYear);
}

function applySubYears(periodType, allYear, athleteYear, athlete) {
  const allPeriods = _.get(allYear, periodType, {});
  _.set(allYear, periodType, allPeriods);
  const athletePeriods = _.get(athleteYear, periodType, {});

  Object.keys(athletePeriods).forEach(periodKey => {
    applySubYear(periodKey, allPeriods, athletePeriods, athlete);
  });
}

function applySubYear(periodKey, allPeriods, athletePeriods, athlete) {
  const allPeriod = _.get(allPeriods, periodKey, {});
  _.set(allPeriods, periodKey, allPeriod);
  const athletePeriod = _.get(athletePeriods, periodKey, {});

  applyPeriod(allPeriod, athletePeriod, athlete);
}

function applyPeriod(allPeriod, athletePeriod, athlete) {
  const allPeriodSummary = _.get(allPeriod, allPeriod, {});
  _.set(allPeriod, 'summary', allPeriodSummary);
  const athletePeriodSummary = _.get(athletePeriod, 'summary', {});
  mergeNumericField('distance', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('elevation', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('movingTime', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('activityCount', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('activeDayCount', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeNumericField('averageSpeed', sortAscending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeRideField('longestRide', 'distance', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
  mergeRideField('fastestRide', 'averageSpeed', sortDescending, allPeriodSummary, athletePeriodSummary, athlete);
}

function sortAscending(a, b) {
  return a - b;
}

function sortDescending(b, a) {
  return b - a;
}

function mergeNumericField(fieldName, compareFn, allPeriod, athletePeriod, athlete) {
  const athleteField = {
    athleteId: athlete.id,
    athleteName: buildAthleteName(athlete),
    value: _.get(athletePeriod, fieldName)
  };

  const allField = _.get(allPeriod, fieldName, []);
  _.set(allPeriod, fieldName, allField);

  allField.push(athleteField);
  allField.sort((a, b) => compareFn(a.value, b.value));
}

function mergeRideField(fieldName, rideFieldName, compareFn, allPeriodSummary, athletePeriodSummary, athlete) {
  const athleteRideRecords = _
    .get(athletePeriodSummary, fieldName)
    .map(rideRecord => ({
      id: rideRecord.id,
      name: rideRecord.name,
      value: _.get(rideRecord, rideFieldName),
      athleteId: athlete.id,
      athleteName: buildAthleteName(athlete)
    }));

  const allRideRecords = _.get(allPeriodSummary, fieldName, []);
  _.set(allPeriodSummary, fieldName, allRideRecords);

  const combinedRideRecords = _.concat(allRideRecords, athleteRideRecords);
  combinedRideRecords.sort((a, b) => compareFn(a.value, b.value));

  _.set(allPeriodSummary, fieldName, combinedRideRecords.slice(0, 5));
}

function buildAthleteName(athlete) {
  return `${athlete.firstname} ${athlete.lastname}`;
}

function calculatePoints(periodKey, allYear) {
  const allPeriods = _.get(allYear, periodKey, {});
  const periodPoints = {};
  _.set(allYear, `points.${periodKey}`, periodPoints);

  const allPeriodSummaries = _
    .values(allPeriods)
    .map(allPeriod => allPeriod.summary);

  [
    'distance',
    'elevation',
    'movingTime',
    'activityCount',
    'activeDayCount',
    'averageSpeed',
    // 'longestRide',
    // 'fastestRide'
  ].forEach(fieldName => {
    calculatePointsForField(periodPoints, allPeriodSummaries, fieldName);
  });
}

function calculatePointsForField(periodPoints, allPeriodSummaries, fieldName) {
  const athleteWins = allPeriodSummaries
    .map(allPeriodSummary => _.get(allPeriodSummary, `${fieldName}[0]`))
    .filter(value => value !== null);
  const athleteWinsGroupedByAthlete = _.values(
    _.groupBy(
      athleteWins,
      record => record.athleteId
    )
  );
  const athletePoints = athleteWinsGroupedByAthlete
    .map(athleteWins => ({
      athleteId: athleteWins[0].athleteId,
      athleteName: athleteWins[0].athleteName,
      value: athleteWins.length
    })).sort((a, b) => b.points - a.points);
  _.set(periodPoints, fieldName, athletePoints);
}
