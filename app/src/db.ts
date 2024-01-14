import { Datastore, PathType, Query } from '@google-cloud/datastore';
import { from } from 'rxjs';
import { map, toArray, mergeMap, bufferCount } from 'rxjs/operators';
import { stringify } from './util.js';
import { GetResponse } from '@google-cloud/datastore/build/src/request.js';

export function start() {
  const ds = new Datastore();

  async function runQuery(query: Query): Promise<any[]> {
    const response = await query.run();
    // Result is a two part array, first element is the results, second is query info.
    return response[0];
  }

  // Return accessor methods.
  return {

    // Get specific items by key.
    getItemsByKey: async function(collection: string, keys: PathType | PathType[]): Promise<GetResponse> {
      console.log('Retrieving ' + collection + ' with keys ' + stringify(keys));

      const dsKeys = Array.isArray(keys) ?
        keys.map(key => ds.key([collection, key])) :
        ds.key([collection, keys]);

      const items = await ds.get(dsKeys);

      return items;
    },

    // Search for items in the specified collection.
    getItemsWithFilter: async function(collection: string, property: string, value: unknown): Promise<any[]> {
      console.log(`Searching ${collection} with ${property}=${stringify(value)}`);

      const allItemsQuery = ds.createQuery(collection);
      const filteringQuery = allItemsQuery.filter(property, value);

      return runQuery(filteringQuery);
    },

    // Search for items in the specified collection.
    getAllItems: async function(collection: string): Promise<any[]> {
      console.log(`Searching ${collection}`);

      const allItemsQuery = ds.createQuery(collection);

      return runQuery(allItemsQuery);
    },

    getFirstItem: async function(collection: string, sortField: string, descending = false) {
      console.log(`Searching for first record in ${collection} based on field ${sortField}`);

      const allItemsQuery = ds.createQuery(collection);
      const sortingQuery = allItemsQuery
        .order(sortField, {descending})
        .limit(1);

      const items = await runQuery(sortingQuery);

      // In this case we're only interested in the first result.
      return items[0];
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
      const activities = await this.getItemsWithFilter('activities', 'athlete.id', athleteId);
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

    // Save or refresh a leaderboard.
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
}
