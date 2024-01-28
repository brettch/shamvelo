import moment from 'moment';
import { SlimActivity } from '../strava.js';

export default function(activity: Pick<SlimActivity, 'startDate'>): string[] {
  const date = activity.startDate;
  const year = date.getFullYear();
  const month = date.getMonth();
  const week = moment(date).isoWeek();
  const weekYear = moment(date).isoWeekYear();

  return [
    /* year path */ `year.${year}.summary`,
    /* month path */ `year.${year}.month.${month}.summary`,
    /* week path */ `year.${weekYear}.week.${week}.summary`
  ];
}
