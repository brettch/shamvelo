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
    athleteName: `${athlete.firstname} ${athlete.lastname}`,
    value: _.get(athletePeriod, fieldName)
  };

  const allField = _.get(allPeriod, fieldName, []);
  _.set(allPeriod, fieldName, allField);

  allField.push(athleteField);
  allField.sort((a, b) => compareFn(a.value, b.value));
}
