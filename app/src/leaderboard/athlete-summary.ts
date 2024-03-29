import { getPeriods } from './athlete-summary-paths.js';
import { create as createSummary, addActivity as addActivityToSummary, pruneSummary as prunePeriodSummary, PeriodSummary, SummarisableActivity } from './period-summary.js';
import { Identified } from '../identified.js';

export interface AthleteSummaryId {
  athleteId: number,
  leaderboardCode: string,
}

export function createAthleteSummaryId(athleteId: number, leaderboardCode: string): AthleteSummaryId {
  return {
    athleteId,
    leaderboardCode,
  };
}

export interface AthleteSummary extends Identified<AthleteSummaryId> {
  year: Record<string, YearContainer>,
}

export interface PeriodContainer {
  summary: PeriodSummary,
}

export interface YearContainer extends PeriodContainer {
  month: Record<number, PeriodContainer>,
  week: Record<number, PeriodContainer>,
}

export function create(id: AthleteSummaryId): AthleteSummary {
  return {
    id,
    year: {}
  };
}

export function addActivity(summary: AthleteSummary, activity: SummarisableActivity): AthleteSummary {
  const periods = getPeriods(activity.startDate);

  // Add activity to year summary.
  if (!summary.year[periods.year]) {
    summary.year[periods.year] = {
      ... createSummaryContainer(),
      month: {},
      week: {},
    };
  }
  const yearContainer = summary.year[periods.year];
  addActivityToSummary(yearContainer.summary, activity);

  // Add activity to month summary.
  if (!yearContainer.month[periods.month]) {
    yearContainer.month[periods.month] = createSummaryContainer();
  }
  const monthContainer = yearContainer.month[periods.month];
  addActivityToSummary(monthContainer.summary, activity);

  // Add activity to week summary.
  // Note that the week may not be in the year of the startDate (https://en.wikipedia.org/wiki/ISO_week_date)
  if (!summary.year[periods.week.year]) {
    summary.year[periods.week.year] = {
      ... createSummaryContainer(),
      month: {},
      week: {},
    };
  }
  const weekYearContainer = summary.year[periods.week.year];
  if (!weekYearContainer.week[periods.week.week]) {
    weekYearContainer.week[periods.week.week] = createSummaryContainer();
  }
  const weekContainer = weekYearContainer.week[periods.week.week];
  addActivityToSummary(weekContainer.summary, activity);

  return summary;
}

export function pruneSummary(summary: AthleteSummary): void {
  Object
    .values(summary.year)
    .forEach(year => {
      prunePeriodSummary(year.summary);

      [year.month, year.week]
        .flatMap(periods => Object.values(periods))
        .forEach(period => prunePeriodSummary(period.summary));
    });
}

function createSummaryContainer(): PeriodContainer {
  return {
    summary: createSummary(),
  };
}
