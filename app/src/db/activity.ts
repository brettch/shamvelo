import { Firestore, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp, WithFieldValue } from "@google-cloud/firestore";
import { SlimActivity } from "../strava.js";
import { Db, Persist, createDb } from "./persist.js";

export interface ActivityPersist extends Persist<number, SlimActivity> {
  getByAthlete(athleteId: number): Promise<SlimActivity[]>;
  deleteByAthlete(athleteId: number): Promise<void>;
  deleteStaleByAthlete(athleteId: number, excludeBatchId: string): Promise<void>;
}

export function createActivityPersist(fs: Firestore): ActivityPersist {
  const db: Db<number, SlimActivity, SlimActivity> =
    createDb(fs, 'activities', dataConverter, id => id.toString());

  function queryByAthlete(athleteId: number) {
    return db.collection
      .where('athlete.id', '==', athleteId);
  }

  function deleteByAthlete(athleteId: number): Promise<void> {
    console.log(`Deleting activities for athlete ${athleteId}`);

    return db.deleteByQuery(
      queryByAthlete(athleteId),
    );
  }

  function getByAthlete(athleteId: number): Promise<SlimActivity[]> {
    console.log(`Getting activities for athlete ${athleteId}`);

    return db.runQuery(
      queryByAthlete(athleteId),
    )
  }

  async function deleteStaleByAthlete(athleteId: number, excludeBatchId: string): Promise<void> {
    console.log(`Deleting stale activities for athlete ${athleteId}, excluding batch ${excludeBatchId}`);

    const allActivities = await getByAthlete(athleteId);
    const staleIds = allActivities
      .filter(a => a.refreshBatchId !== excludeBatchId)
      .map(a => a.id);

    const batchSize = 100;
    const collection = fs.collection('activities');
    for (let i = 0; i < staleIds.length; i += batchSize) {
      const deleteBatch = fs.batch();
      for (const id of staleIds.slice(i, i + batchSize)) {
        deleteBatch.delete(collection.doc(id.toString()));
      }
      await deleteBatch.commit();
    }
  }

  return {
    ...db,
    deleteByAthlete,
    getByAthlete,
    deleteStaleByAthlete,
  };
}

const dataConverter: FirestoreDataConverter<SlimActivity, SlimActivity> = {
  toFirestore: (modelObject: WithFieldValue<SlimActivity>) => modelObject,
  fromFirestore: (snapshot: QueryDocumentSnapshot<SlimActivity, SlimActivity>) => {
    const dbActivity = snapshot.data();
    // Firestore silently converts Date to Timestamp on save so we have to manually
    // convert it back on retrieval.
    const startDate = (dbActivity.startDate as unknown) as Timestamp;
    return {
      ...dbActivity,
      startDate: startDate.toDate(),
    };
  }
};
