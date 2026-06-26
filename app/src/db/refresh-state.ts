import { Firestore } from "@google-cloud/firestore";
import { Identified } from "../identified.js";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";

export interface RefreshState extends Identified<number> {
  batchId: string;
}

type RefreshStatePersist = Persist<number, RefreshState>;

export function createRefreshStatePersist(fs: Firestore): RefreshStatePersist {
  const db: Db<number, RefreshState, RefreshState> =
    createDb(fs, 'refresh-state', createDirectConverter(), id => id.toString());

  return db;
}
