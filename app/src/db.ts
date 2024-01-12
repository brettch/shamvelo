import { Datastore } from '@google-cloud/datastore';
import { from } from 'rxjs';
import { map, toArray, mergeMap, bufferCount } from 'rxjs/operators';
import { stringify } from './util.js';

export function start() {
  const ds = new Datastore();

  // Return accessor methods.
  return {

    // Get specific items by key.
    getItemsByKey: async function(collection: any, keys: any) {
      console.log('Retrieving ' + collection + ' with keys ' + stringify(keys));

      const dsKeys = Array.isArray(keys) ?
        keys.map(key => ds.key([collection, key])) :
        ds.key([collection, keys]);

      const items = await ds.get(dsKeys);

      return items;
    },

    // Search for items in the specified collection.
    getItems: async function(collection: any, criteria: any) {
      console.log('Searching ' + collection + ' with criteria ' + stringify(criteria));

      const allItemsQuery = ds.createQuery(collection);
      const filteringQuery = Object.keys(criteria)
        .reduce(
          (currentQuery, key) => currentQuery.filter(key, criteria[key]),
          allItemsQuery
        );

      const items = await filteringQuery.run();

      // Result is a two part array, first element is the results, second is query info.
      return items[0];
    },

    getFirstItem: async function(collection: any, sortField: any, descending = false) {
      console.log(`Searching for first record in ${collection} based on field ${sortField}`);
      const items = await ds
        .createQuery(collection)
        .order(sortField, {descending})
        .limit(1)
        .run();

      // Result is a two part array, first element is the results, second is query info.
      // In this case we're only interested in the first record of the results.
      return items[0][0];
    },

    // Save or refresh an athlete.
    saveAthlete: async function(athlete: any) {
      console.log(`Saving athlete ${athlete.id}`);
      await ds.upsert({
        key: ds.key(['athletes', athlete.id]),
        data: athlete
      });
    },

    // Save or refresh an athlete's token.
    saveAthleteToken: async function(id: any, token: any) {
      console.log(`Saving token for athlete ${id}`);
      await ds.upsert({
        key: ds.key(['tokens', id]),
        data: token
      });
    },

    deleteActivity: async function(activityId: any) {
      console.log(`Deleting activity ${activityId}`);
      const key = ds.key(['activities', activityId]);
      await ds.delete(key);
    },

    deleteActivities: async function(athleteId: any) {
      console.log(`Deleting activities for athlete ${athleteId}`);
      const activities = await this.getItems('activities', { 'athlete.id': athleteId });
      await from(activities)
        .pipe(
          map((activity: any) => ds.key(['activities', activity.id])),
          bufferCount(100),
          mergeMap((keys: any) => from(ds.delete(keys)))
        )
        .toPromise();
    },

    // Save or refresh a list of activities.
    saveActivities: async function(activities: any) {
      console.log(`Saving ${activities.length} activities`);
      await from(activities)
        .pipe(
          map((activity: any) => ({
            key: ds.key(['activities', activity.id]),
            data: activity
          })),
          toArray(),
          mergeMap((entities: any) => ds.upsert(entities))
        )
        .toPromise();
    },

    // Save or refresh an athlete summary.
    saveAthleteSummary: async function(athleteSummary: any) {
      console.log(`Saving summary for athlete ${athleteSummary.athleteId}`);
      await ds.upsert({
        key: ds.key(['athlete-summaries', athleteSummary.athleteId]),
        excludeFromIndexes: ['year'],
        data: athleteSummary
      });
    },

    // Save or fresh a leaderboard.
    saveLeaderboard: async function(leaderboard: any) {
      console.log(`Saving leaderboard ${leaderboard.id}`);
      await ds.upsert({
        key: ds.key(['leaderboards', leaderboard.id]),
        excludeFromIndexes: ['year'],
        data: leaderboard
      });
    },

    // Save or refresh a list of yearly leaderboards.
    saveLeaderboards: async function(leaderboards: any) {
      console.log('saving leaderboards');
      await from(leaderboards)
        .pipe(
          map((leaderboard: any) => ({
            key: ds.key(['leaderboards', leaderboard.year]),
            data: leaderboard
          })),
          toArray(),
          mergeMap((entities: any) => ds.upsert(entities))
        )
        .toPromise();
    }
  };
};
