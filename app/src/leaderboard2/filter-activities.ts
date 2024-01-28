import { SlimActivity } from "../strava.js";
import { ActivityType } from "../strava/api.js";

export default function(allActivities: SlimActivity[]) {
  const blockedRideList: any = [];
  // Only include bike rides.
  const bikeActivities = allActivities.filter(function (activity) { return activity.type == ActivityType.Ride; });
  // Block Frankenstein rides.
  const activities = bikeActivities.filter(function (activity) { return blockedRideList.indexOf(activity.id) < 0; });

  return activities;
}
