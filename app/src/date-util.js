'use strict';

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
  // Clone the date so that we don't affect the provided date
  var tmpDate = new Date(+date);
  // Zero out time portion of the date.
  tmpDate.setHours(0, 0, 0);
  // Set the date to the nearest Thursday: current date + 4 - current day number
  // Make Sunday day 7 instead of 0.
  tmpDate.setDate(tmpDate.getDate() + 4 - (tmpDate.getDay() || 7));
  // Get the first day of the same year.
  var yearStart = new Date(tmpDate.getFullYear(),0,1);
  // Calculate the number of weeks between the start of the year and the nearest Thursday.
  var week = Math.ceil(( ( (tmpDate - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  // Return integer in format yyyyww.
  return tmpDate.getFullYear() * 100 + week;
}

// Get the year portion of an integer date in format yyyyww.
function yearFromWeek(week) {
  return Math.floor(week / 100);
}
