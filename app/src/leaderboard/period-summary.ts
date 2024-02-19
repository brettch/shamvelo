import _ from 'lodash';
import moment from 'moment';
import { SlimActivity } from '../strava.js';

export interface PeriodSummary {
  distance: number,
  elevation: number,
  movingTime: number,
  activityCount: number,
  averageSpeed: number,
  activeDays: Record<string, DaySummary>,
  activeDayCount: number,
  eddingtonNumber: number,
  longestRide: RideSummary[],
  fastestRide: RideSummary[],
}

interface DaySummary {
  distance: number,
}

interface RideSummary {
  id: number,
  name: string,
  value: number,
}

export type SummarisableActivity = Pick<SlimActivity,
  'id' |
  'name' |
  'distance' |
  'totalElevationGain' |
  'movingTime' |
  'startDate'
>;

export function create(): PeriodSummary {
  return {
    distance: 0,
    elevation: 0,
    movingTime: 0,
    activityCount: 0,
    averageSpeed: 0,
    activeDays: {},
    activeDayCount: 0,
    eddingtonNumber: 0,
    longestRide: [],
    fastestRide: []
  };
}

export function addActivity(summary: PeriodSummary, activity: SummarisableActivity): PeriodSummary {
  // Update top level counters.
  if (activity.distance) summary.distance += activity.distance;
  if (activity.totalElevationGain) summary.elevation += activity.totalElevationGain;
  if (activity.movingTime) summary.movingTime += activity.movingTime;
  summary.activityCount++;
  summary.averageSpeed = toAverageSpeed(summary.distance, summary.movingTime);

  const dayCode = toDayCode(activity.startDate);
  const activeDay = summary.activeDays[dayCode] || {
    distance: 0
  };
  summary.activeDays[dayCode] = activeDay;
  activeDay.distance += activity.distance;
  summary.activeDayCount = Object.keys(summary.activeDays).length;
  summary.eddingtonNumber = calculateEddingtonNumber(Object.values(summary.activeDays));

  // Create a sorted list of the longest rides.
  updatePodium(
    summary.longestRide,
    5,
    {
      id: activity.id,
      name: activity.name,
      value: activity.distance
    }
  );

  // Create a sorted list of the fastest rides.
  updatePodium(
    summary.fastestRide,
    5,
    {
      id: activity.id,
      name: activity.name,
      value: toAverageSpeed(activity.distance, activity.movingTime)
    }
  );

  return summary;
};

export function pruneSummary(summary: PeriodSummary): void {
  // We don't need active days after derived fields are calculated.
  summary.activeDays = {};
}

function toDayCode(date: Date) {
  const momentDate = moment(date);
  return momentDate.format('YYYYMMDD');
}

function toAverageSpeed(distance: number, movingTime: number) {
  return distance / movingTime;
}

function updatePodium(podium: RideSummary[], maxPodiumSize: number, item: RideSummary) {
  podium.push(item);
  podium.sort((a, b) => b.value - a.value);
  while(podium.length > maxPodiumSize) {
    podium.pop();
  }
}

function calculateEddingtonNumber(days: DaySummary[]): number {
  const sortedMiles = days
    .map(day => day.distance)
    // distance in miles
    .map(distance => distance * 0.621371 * 0.001)
    .sort((a, b) => b - a);

  let eddingtonNumber = 0;
  for (const [idx, miles] of sortedMiles.entries()) {
    const dayNum = idx + 1;
    if (miles < dayNum)
      break;
    eddingtonNumber = dayNum;
  }

  return eddingtonNumber;
}
