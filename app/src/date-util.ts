const moment = require('moment');

module.exports = {
  yearFromDate,
  monthFromDate,
  yearFromMonth,
  weekFromDate,
  yearFromWeek
};

// Get the year portion of the date as an integer.
function yearFromDate(date) {
  return date.getFullYear();
}

// Get the month of the date as an integer in format yyyymm.
function monthFromDate(date) {
  return date.getFullYear() * 100 + (date.getMonth() + 1);
}

// Get the year portion of an integer date in format yyyymm.
function yearFromMonth(month) {
  return Math.floor(month / 100);
}

// Get the week of the date as an integer in format yyyyww.
function weekFromDate(date) {
  const momentDate = moment(date);
  return momentDate.isoWeekYear() * 100 + momentDate.isoWeek();
}

// Get the year portion of an integer date in format yyyyww.
function yearFromWeek(week) {
  return Math.floor(week / 100);
}
