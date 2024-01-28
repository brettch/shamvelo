import _ from 'lodash';
import getSummaryPaths from './athlete-summary-paths.js';
import { create as createSummary, addActivity as addActivityToSummary, PeriodSummary, SummarisableActivity } from './period-summary.js';

export default function(_summary: any, activity: SummarisableActivity) {
  const summary = _summary ? _summary : {};
  const summaryPaths = getSummaryPaths(activity);
  return summaryPaths.reduce(applyActivity, summary);

  function applyActivity(summary: any, path: any) {
    const existingPeriodSummary: PeriodSummary = _.get(summary, path) || createSummary();
    const updatedPeriodSummary = addActivityToSummary(existingPeriodSummary, activity);
    _.setWith(summary, path, updatedPeriodSummary, Object);
    return summary;
  }
};
