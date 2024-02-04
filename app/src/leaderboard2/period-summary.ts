import _ from 'lodash';
import moment from 'moment';
import { SlimActivity } from '../strava.js';

export interface PeriodSummary {
  distance: number,
  elevation: number,
  movingTime: number,
  activityCount: number,
  averageSpeed: number,
  activeDays: string[],
  activeDayCount: number,
  longestRide: DistanceRideSummary[],
  fastestRide: SpeedRideSummary[],
}

interface RideSummary {
  id: number,
  name: string,
}

interface DistanceRideSummary extends RideSummary {
  distance: number,
}

interface SpeedRideSummary extends RideSummary {
  averageSpeed: number,
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
    activeDays: [],
    activeDayCount: 0,
    longestRide: [],
    fastestRide: []
  };
}

export function addActivity(summary: PeriodSummary, activity: SummarisableActivity) {
  // Update top level counters.
  if (activity.distance) summary.distance += activity.distance;
  if (activity.totalElevationGain) summary.elevation += activity.totalElevationGain;
  if (activity.movingTime) summary.movingTime += activity.movingTime;
  summary.activityCount++;
  summary.averageSpeed = toAverageSpeed(summary.distance, summary.movingTime);

  // Update the unique list of days that have been ridden.  The size of the list is what matters, the values less so.
  const dayCode = toDayCode(activity.startDate);
  if (!summary.activeDays.includes(dayCode)) {
    summary.activeDays.push(dayCode);
  }
  summary.activeDayCount = summary.activeDays.length;

  // Create a sorted list of the longest rides.
  updatePodium(
    summary.longestRide,
    5,
    {
      id: activity.id,
      name: activity.name,
      distance: activity.distance
    },
    (a: any, b: any) => b.distance - a.distance
  );

  // Create a sorted list of the fastest rides.
  updatePodium(
    summary.fastestRide,
    5,
    {
      id: activity.id,
      name: activity.name,
      averageSpeed: toAverageSpeed(activity.distance, activity.movingTime)
    },
    (a: any, b: any) => b.averageSpeed - a.averageSpeed
  );

  return summary;
};

function toDayCode(date: Date) {
  const momentDate = moment(date);
  return momentDate.format('YYYYMMDD');
}

function toAverageSpeed(distance: number, movingTime: number) {
  return distance / movingTime;
}

function updatePodium<T extends RideSummary>(podium: T[], maxPodiumSize: number, item: T, sortBy: (a: T, b: T) => number) {
  podium.push(item);
  podium.sort(sortBy);
  while(podium.length > maxPodiumSize) {
    podium.pop();
  }
}
