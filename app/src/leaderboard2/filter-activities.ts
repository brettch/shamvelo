export default function(allActivities: any) {
  const blockedRideList: any = [];
  // Only include bike rides.
  const bikeActivities = allActivities.filter(function (activity: any) { return activity.type == 'Ride'; });
  // Block Frankenstein rides.
  const activities = bikeActivities.filter(function (activity: any) { return blockedRideList.indexOf(activity.id) < 0; });

  return activities;
}
