import moment from 'moment';

// Get the year portion of the date as an integer.
export function yearFromDate(date: any) {
  return date.getFullYear();
}

// Get the month of the date as an integer in format yyyymm.
export function monthFromDate(date: any) {
  return date.getFullYear() * 100 + (date.getMonth() + 1);
}

// Get the year portion of an integer date in format yyyymm.
export function yearFromMonth(month: any) {
  return Math.floor(month / 100);
}

// Get the week of the date as an integer in format yyyyww.
export function weekFromDate(date: any) {
  const momentDate = moment(date);
  return momentDate.isoWeekYear() * 100 + momentDate.isoWeek();
}

// Get the year portion of an integer date in format yyyyww.
export function yearFromWeek(week: any) {
  return Math.floor(week / 100);
}
