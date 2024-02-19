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

  const dayCode = toDayCode(activity.startDate);
  const activeDay = summary.activeDays[dayCode] || {
    distance: 0
  };
  summary.activeDays[dayCode] = activeDay;
  activeDay.distance += activity.distance;
  summary.activeDayCount = Object.keys(summary.activeDays).length;

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
