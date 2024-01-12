const moment = require('moment');

module.exports = function(activity) {
  const date = new Date(activity.start_date);
  const year = date.getFullYear();
  const month = date.getMonth();
  const week = moment(date).isoWeek();
  const weekYear = moment(date).isoWeekYear();

  return [
    /* year path */ `year.${year}.summary`,
    /* month path */ `year.${year}.month.${month}.summary`,
    /* week path */ `year.${weekYear}.week.${week}.summary`
  ];
};
