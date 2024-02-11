import { Firestore, Query } from '@google-cloud/firestore';
import { appConfig } from './config.js'
import { Identified } from './identified.js';
import { stringify } from './util.js';

export function start() {
  const fs = new Firestore({
    databaseId: appConfig.databaseId,
  });

  async function runQuery(query: Query<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>): Promise<FirebaseFirestore.DocumentData[]> {
    const querySnapshot = await query.get();
    const records =
      querySnapshot.docs
      .map(value => value.data());

    return records;
  }

  async function setItems<T extends FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>>(items: T[], collectionPath: string, toDocId: (item: T) => string): Promise<void> {
    const batchSize = 100;
    const collection = fs.collection(collectionPath);

    function* chunkItems() {
      for (let i = 0; i < items.length; i += batchSize) {
        yield items.slice(i, i + batchSize);
      }
    }

    function* runSaveBatches() {
      for (const itemsChunk of chunkItems()) {
        const fsBatch = fs.batch();

        for (const item of itemsChunk) {
          fsBatch.set(collection.doc(toDocId(item)), item);
        }

        yield fsBatch.commit();
      }
    }

    await Promise.all(
      runSaveBatches()
    );
  }

  // Return accessor methods.
  return {

    // Get specific items by key.
    getItemByKey: async function(collection: string, id: string | number): Promise<any> {
      console.log(`Retrieving ${collection} with id ${id}`);

      const path = `${collection}/${id}`;
      const document = await fs.doc(path).get();
      const data = document.data();
      if (!data) {
        throw new Error(`Document ${path} could not be found`);
      }
      return data;
    },

    // Search for items in the specified collection.
    getItemsWithFilter: async function(collection: string, property: string, value: unknown): Promise<any[]> {
      console.log(`Searching ${collection} with ${property}=${stringify(value)}`);

      return runQuery(
        fs.collection(collection)
          .where(property, '==', value),
      );
    },

    // Search for items in the specified collection.
    getAllItems: async function(collection: string): Promise<any[]> {
      console.log(`Searching ${collection}`);
      
      return runQuery(
        fs.collection(collection),
      );
    },

    getFirstItem: async function(collection: string, sortField: string, descending = false): Promise<any> {
      console.log(`Searching for first record in ${collection} based on field ${sortField}`);

      const records = await runQuery(
        fs
          .collection(collection)
          .orderBy(sortField, descending ? 'desc' : 'asc')
          .limit(1)
      );

      if (records.length <= 0) {
        throw new Error(`No records found in collection ${collection}`);
      }

      // In this case we're only interested in the first result.
      return records[0];
    },

    saveItem: async function(collection: string, item: Identified): Promise<void> {
      console.log(`Saving ${collection} with id ${item.id}`);

      await fs
        .collection(collection)
        .doc(item.id.toString())
        .set(item);
    },

    deleteItem: async function(collection: string, id: number): Promise<void> {
      console.log(`Deleting ${collection} with id ${id}`);

      await fs
        .collection(collection)
        .doc(id.toString())
        .delete();
    },

    deleteActivities: async function(athleteId: any) {
      console.log(`Deleting activities for athlete ${athleteId}`);

      // Delete in batches of 100.
      const activityQuery = fs
        .collection('activities')
        .where('athlete.id', '==', athleteId)
        .limit(100);

      while (true) {
        const activitySnapshot = await activityQuery.get();

        if (activitySnapshot.size <= 0) {
          break;
        }

        const deleteBatch = fs.batch();

        activitySnapshot.docs.forEach(doc =>
          deleteBatch.delete(doc.ref)
        );

        await deleteBatch.commit();
      }
    },

    // Save or refresh a list of activities.
    saveActivities: async function(activities: any[]) {
      console.log(`Saving ${activities.length} activities`);

      await setItems(activities, 'activities', (item) => item.id.toString());
    },

    // Save or refresh an athlete summary.
    saveAthleteSummary: async function(athleteSummary: any) {
      console.log(`Saving summary for athlete ${athleteSummary.athleteId}`);

      await fs
        .collection('athlete-summaries')
        .doc(athleteSummary.athleteId)
        .set(athleteSummary);
    },

    // Save or refresh a leaderboard.
    saveLeaderboard: async function(leaderboard: any) {
      console.log(`Saving leaderboard ${leaderboard.id}`);

      await fs
        .collection('leaderboards')
        .doc(leaderboard.id)
        .set(leaderboard);
    },

    // Save or refresh a list of yearly leaderboards.
    saveLeaderboards: async function(leaderboards: any[]) {
      console.log(`Saving ${leaderboards.length} leaderboards`);

      await setItems(leaderboards, 'leaderboards', (item) => item.id.toString());
    }
  };
}
