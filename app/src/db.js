'use strict';

const { Datastore } = require('@google-cloud/datastore');
const { from } = require('rxjs');
const { map, toArray, mergeMap, bufferCount } = require('rxjs/operators');
const util = require('./util');

module.exports.start = function() {
  const ds = new Datastore();

  // Return accessor methods.
  return {

    // Get specific items by key.
    getItemsByKey: async function(collection, keys) {
      console.log('Retrieving ' + collection + ' with keys ' + util.stringify(keys));

      const dsKeys = Array.isArray(keys) ?
        keys.map(key => ds.key([collection, key])) :
        ds.key([collection, keys]);

      const items = await ds.get(dsKeys);

      return items;
    },

    // Search for items in the specified collection.
    getItems: async function(collection, criteria) {
      console.log('Searching ' + collection + ' with criteria ' + util.stringify(criteria));

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

    // Save or refresh an athlete.
    saveAthlete: async function(athlete) {
      console.log(`Saving athlete ${athlete.id}`);
      await ds.upsert({
        key: ds.key(['athletes', athlete.id]),
        data: athlete
      });
    },

    // Save or refresh an athlete's token.
    saveAthleteToken: async function(id, token) {
      console.log(`Saving token for athlete ${id}`);
      await ds.upsert({
        key: ds.key(['tokens', id]),
        data: token
      });
    },

    deleteActivity: async function(activityId) {
      console.log(`Deleting activity ${activityId}`);
      const key = ds.key(['activities', activityId]);
      await ds.delete(key);
    },

    deleteActivities: async function(athleteId) {
      console.log(`Deleting activities for athlete ${athleteId}`);
      const activities = await this.getItems('activities', { 'athlete.id': athleteId });
      await from(activities)
        .pipe(
          map(activity => ds.key(['activities', activity.id])),
          bufferCount(100),
          mergeMap(keys => from(ds.delete(keys)))
        )
        .toPromise();
    },

    // Save or refresh a list of activities.
    saveActivities: async function(activities) {
      console.log(`Saving ${activities.length} activities`);
      await from(activities)
        .pipe(
          map(activity => ({
            key: ds.key(['activities', activity.id]),
            data: activity
          })),
          toArray(),
          mergeMap(entities => ds.upsert(entities))
        )
        .toPromise();
    },

    // Save or refresh an athlete summary.
    saveAthleteSummary: async function(athleteSummary) {
      console.log(`Saving summary for athlete ${athleteSummary.athleteId}`);
      await ds.upsert({
        key: ds.key(['athlete-summaries', athleteSummary.athleteId]),
        data: athleteSummary
      });
    },

    // Save or fresh a leaderboard.
    saveLeaderboard: async function(leaderboard) {
      console.log(`Saving leaderboard ${leaderboard.id}`);
      console.log('leaderboard:', JSON.stringify(leaderboard));
      await ds.upsert({
        key: ds.key(['leaderboards', leaderboard.id]),
        data: leaderboard
      });
    }
  };
};
