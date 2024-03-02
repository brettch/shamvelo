import { createLeaderboardPersist } from "../db/leaderboard.js";
import { createFirestore } from "../db/persist.js";
import { PeriodPoints, PeriodSummary, YearPoints, createPeriodContainer, createYearContainer, createYearContainerId } from "./summary.js";
import { addWeeks, format, isThisISOWeek, setISOWeek } from 'date-fns';

const firestore = createFirestore();
const leaderboardPersist = createLeaderboardPersist(firestore);

interface YearView {
  year: number;
  isActive: boolean;
  displayName: string;
  summary: PeriodSummary;
  points: YearPoints;
  next: number | undefined;
  previous: number | undefined;
}

export async function getLatestYearId(): Promise<number> {
  return (await leaderboardPersist.getLatest()).id.year;
}

export async function getYearView(leaderboardCode: string, year: number): Promise<YearView> {
  const yearContainer = (
    await leaderboardPersist.getIfExists(createYearContainerId(year, leaderboardCode))) ||
    createYearContainer(createYearContainerId(year, leaderboardCode));
  const now = new Date();
  const isActive = year === now.getFullYear();

  return {
    year,
    isActive,
    displayName: year.toString(),
    summary: yearContainer.summary,
    points: yearContainer.points,
    next: isActive ? undefined : year + 1,
    previous: year - 1,
  }
}

export async function getLatestMonthId(leaderboardCode: string, year: number): Promise<number> {
  const yearContainer = await leaderboardPersist.getIfExists(createYearContainerId(year, leaderboardCode));
  if (yearContainer) {
    const monthIds = Object
      .keys(yearContainer.month)
      .map(key => parseInt(key))
      .sort((a, b) => b - a);
    if (monthIds.length > 0) {
      return monthIds[0];
    }
  }
  return 0;
}

export interface PeriodView {
  year: number;
  periodIndex: number;
  isActive: boolean;
  displayName: string;
  summary: PeriodSummary;
  points: PeriodPoints;
  next: number | undefined;
  previous: number | undefined;
}

export async function getMonthView(leaderboardCode: string, year: number, month: number): Promise<PeriodView> {
  const yearContainer =
    await leaderboardPersist.getIfExists(createYearContainerId(year, leaderboardCode)) ||
    createYearContainer(createYearContainerId(year, leaderboardCode));

  const now = new Date();
  const isActive = now.getFullYear() === year && now.getMonth() === month;

  return {
    year,
    periodIndex: month,
    isActive,
    displayName: format(new Date(year, month, 15), "yyyy, MMMM"),
    summary: (yearContainer.month[month] || createPeriodContainer()).summary,
    points: yearContainer.points.month,
    next: (!isActive && month < 11) ? month + 1 : undefined,
    previous: (month > 0) ? month - 1 : undefined,
  };
}

export async function getLatestWeekId(leaderboardCode: string, year: number): Promise<number> {
  const yearContainer = await leaderboardPersist.getIfExists(createYearContainerId(year, leaderboardCode));
  if (yearContainer) {
    const weekIds = Object
      .keys(yearContainer.week)
      .map(key => parseInt(key))
      .sort((a, b) => b - a);
    if (weekIds.length > 0) {
      return weekIds[0];
    }
  }

  return 1;
}

export async function getWeekView(leaderboardCode: string, year: number, week: number): Promise<PeriodView> {
  const yearContainer =
    await leaderboardPersist.getIfExists(createYearContainerId(year, leaderboardCode)) ||
    createYearContainer(createYearContainerId(year, leaderboardCode));

  const startOfWeek = setISOWeek(new Date(year, 6, 1), week);
  const isActive = isThisISOWeek(startOfWeek);
  const moreWeeksAvailable = !isActive && addWeeks(startOfWeek, 1).getFullYear() === year;

  return {
    year,
    periodIndex: week,
    isActive,
    displayName: `${format(startOfWeek, 'yyyy')}, week of ${format(startOfWeek, "MMMM do")}`,
    summary: (yearContainer.week[week] || createPeriodContainer()).summary,
    points: yearContainer.points.week,
    next: (moreWeeksAvailable) ? week + 1 : undefined,
    previous: (week > 1) ? week - 1 : undefined,
  };
}
