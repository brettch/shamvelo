const _ = require('lodash');
const getSummaryPaths = require('./athlete-summary-paths');
const summarize = require('./period-summary');

module.exports = function(_summary: any, activity: any) {
  const summary = _summary ? _summary : {};
  const summaryPaths = getSummaryPaths(activity);
  return summaryPaths.reduce(applyActivity, summary);

  function applyActivity(summary: any, path: any) {
    const existingPeriodSummary = _.get(summary, path);
    const updatedPeriodSummary = summarize(existingPeriodSummary, activity);
    _.setWith(summary, path, updatedPeriodSummary, Object);
    return summary;
  }
};
