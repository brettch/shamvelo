'use strict';

module.exports = function(allActivities) {
  const blockedRideList = [];
  // Only include bike rides.
  const bikeActivities = allActivities.filter(function (activity) { return activity.type == 'Ride'; });
  // Block Frankenstein rides.
  const activities = bikeActivities.filter(function (activity) { return blockedRideList.indexOf(activity.id) < 0; });

  return activities;
};
