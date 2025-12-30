import {
  create as createAthleteSummary,
  addActivity as addActivityToAthleteSummary,
  pruneSummary as pruneAthleteSummary,
  createAthleteSummaryId
} from './athlete-summary.js';
import { addAthlete as addAthleteSummary, create as createLeaderboard, createYearContainerId } from './summary.js';
import { mapById } from '../identified.js';
import { createFirestore } from '../db/persist.js';
import { createActivityPersist } from '../db/activity.js';
import { createAthleteSummaryPersist } from '../db/athlete-summary.js';
import { createAthletePersist } from '../db/athlete.js';
import { createLeaderboardPersist } from '../db/leaderboard.js';
import { SlimActivity, SlimAthlete } from '../strava.js';
import { ActivityType } from '../strava/index.js';

const firestore = createFirestore();
const activityPersist = createActivityPersist(firestore);
const athletePersist = createAthletePersist(firestore);
const athleteSummaryPersist = createAthleteSummaryPersist(firestore);
const leaderboardPersist = createLeaderboardPersist(firestore);

interface LeaderboardConfig {
  code: string,
  name: string,
  isActivityIncluded: (activity: SlimActivity) => boolean,
}

export const leaderboardConfigs: LeaderboardConfig[] = [
  {
    code: 'reality',
    name: 'Keeping It Real',
    isActivityIncluded: activity => activity.type === ActivityType.Ride,
  },
  {
    code: 'virtual',
    name: 'Virtual Insanity',
    isActivityIncluded: activity => activity.type === ActivityType.VirtualRide,
  },
];

export async function refreshAthleteSummary(athleteId: number): Promise<void> {
  console.log(`refreshing summaries for athlete ${athleteId}`);
  const activities = await activityPersist.getByAthlete(athleteId);

  const summaries = leaderboardConfigs
    .map(leaderboardConfig =>
      activities
        .filter(leaderboardConfig.isActivityIncluded)
        .reduce(addActivityToAthleteSummary, createAthleteSummary(createAthleteSummaryId(athleteId, leaderboardConfig.code)))
    );
  summaries.forEach(pruneAthleteSummary);

  await Promise.all(summaries.map(athleteSummaryPersist.set));

  console.log(`summaries refreshed for athlete ${athleteId}`);
}

export async function refreshLeaderboard(): Promise<void> {
  console.log('refreshing leaderboard');

  const [athletes, athleteSummaries] = await Promise.all([
    athletePersist.getAll(),
    athleteSummaryPersist.getAll(),
  ]);
  const athletesById: Map<number, SlimAthlete> = mapById(athletes);

  const yearlySummaries = leaderboardConfigs
    .map(leaderboardConfig =>
      athleteSummaries
        .filter(summary => summary.id.leaderboardCode === leaderboardConfig.code)
        .reduce((previousSummary, athleteSummary) => {
          const athlete = athletesById.get(athleteSummary.id.athleteId);
          if (!athlete) {
            return previousSummary;
          }
          return addAthleteSummary(previousSummary, athleteSummary, athlete);
        }, createLeaderboard(leaderboardConfig.code))
    )
    .flatMap(leaderboard => Object.values(leaderboard.year));

  await leaderboardPersist.setAll(yearlySummaries);

  console.log('leaderboard refreshed');
}

export async function getLeaderboard(year: number, leaderboardCode: string, month: number, week: number) {
  const yearRecord = await leaderboardPersist.get(createYearContainerId(year, leaderboardCode));

  const points = yearRecord.points;
  const yearSummary = yearRecord.summary;
  const monthSummary = yearRecord.month[month].summary;
  const weekSummary = yearRecord.week[week].summary;

  return {
    points,
    year: yearSummary,
    month: monthSummary,
    week: weekSummary
  };
}
