'use strict';

const _ = require('lodash');
const moment = require('moment');

const emptySummary = {
  distance: 0,
  elevation: 0,
  movingTime: 0,
  activityCount: 0,
  averageSpeed: 0,
  activeDays: [],
  longestRide: [],
  fastestRide: []
};

module.exports = function(_summary, activity) {
  const summary = defaultIfNull(_summary);

  // Update top level counters.
  summary.distance += activity.distance;
  summary.elevation += activity.total_elevation_gain;
  summary.movingTime += activity.moving_time;
  summary.activityCount++;
  summary.averageSpeed = toAverageSpeed(summary.distance, summary.movingTime);

  // Update the unique list of days that have been ridden.  The size of the list is what matters, the values less so.
  const dayCode = toDayCode(activity);
  if (!summary.activeDays.includes(dayCode)) {
    summary.activeDays.push(dayCode);
  }

  // Create a sorted list of the longest rides.
  updatePodium(
    summary.longestRide,
    5,
    {
      id: activity.id,
      name: activity.name,
      distance: activity.distance
    },
    (a, b) => a.distance - b.distance
  );

  // Create a sorted list of the fastest rides.
  updatePodium(
    summary.fastestRide,
    5,
    {
      id: activity.id,
      name: activity.name,
      averageSpeed: toAverageSpeed(activity.distance, activity.moving_time)
    },
    (a, b) => b.averageSpeed - a.averageSpeed
  );

  return summary;
};

function defaultIfNull(summary) {
  return summary ? summary : _.cloneDeep(emptySummary);
}

function toDayCode(activity) {
  const date = new Date(activity.start_date);
  const momentDate = moment(date);
  return momentDate.format('YYYYMMDD');
}

function toAverageSpeed(distance, movingTime) {
  return Math.round(distance * 36 / movingTime) / 10;
}

function updatePodium(podium, maxPodiumSize, item, sortBy) {
  podium.push(item);
  podium.sort(sortBy);
  while(podium.length > maxPodiumSize) {
    podium.pop();
  }
}
