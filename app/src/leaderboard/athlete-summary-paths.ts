import moment from 'moment';

export interface ActivityPeriods {
  year: number,
  month: number,
  week: {
    year: number,
    week: number,
  }
}

export function getPeriods(date: Date) {
  const momentDate = moment(date);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    week: {
      year: momentDate.isoWeekYear(),
      week: momentDate.isoWeek(),
    }
  }
}
