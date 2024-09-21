import { Firestore } from "@google-cloud/firestore";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";
import { AthleteSummary, AthleteSummaryId } from "../leaderboard/athlete-summary.js";

type AthleteSummaryPersist = Persist<AthleteSummaryId, AthleteSummary>;

export function createAthleteSummaryPersist(fs: Firestore): AthleteSummaryPersist {
  const db: Db<AthleteSummaryId, AthleteSummary, AthleteSummary> =
    createDb(fs, 'athlete-summaries', createDirectConverter(), id => `${id.athleteId}-${id.leaderboardCode}`);

  return db;
}
