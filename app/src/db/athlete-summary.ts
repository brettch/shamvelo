import { Firestore } from "@google-cloud/firestore";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";
import { AthleteSummary } from "../leaderboard/athlete-summary.js";

export interface AthleteSummaryPersist extends Persist<AthleteSummary> {
}

export function createAthleteSummaryPersist(fs: Firestore): AthleteSummaryPersist {
  const db: Db<AthleteSummary, AthleteSummary> = createDb(fs, 'athlete-summaries', createDirectConverter());

  return db;
}
