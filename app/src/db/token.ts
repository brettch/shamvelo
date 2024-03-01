import { Firestore } from "@google-cloud/firestore";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";
import { TokenWithId } from "../registration.js";

export interface TokenPersist extends Persist<number, TokenWithId> {
}

export function createTokenPersist(fs: Firestore): TokenPersist {
  const db: Db<number, TokenWithId, TokenWithId> =
    createDb(fs, 'tokens', createDirectConverter(), id => id.toString());

  return db;
}
