import { Firestore } from "@google-cloud/firestore";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";
import { YearContainer } from "../leaderboard/summary.js";

export interface LeaderboardPersist extends Persist<YearContainer> {
  getLatest(): Promise<YearContainer>;
}

export function createLeaderboardPersist(fs: Firestore): LeaderboardPersist {
  const db: Db<YearContainer, YearContainer> = createDb(fs, 'leaderboards', createDirectConverter());

  async function getLatest(): Promise<YearContainer> {
    const records = await db.runQuery(
      db
        .collection
        .orderBy('id', 'desc')
        .limit(1),
    )
    if (records.length <= 0) {
      throw new Error(`No leaderboards found `);
    }

    return records[0];
  }

  return {
    ...db,
    getLatest,
  };
}
