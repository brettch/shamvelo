import { Firestore } from "@google-cloud/firestore";
import { SlimAthlete } from "../strava.js";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";

export interface AthletePersist extends Persist<SlimAthlete> {
}

export function createAthletePersist(fs: Firestore): AthletePersist {
  const db: Db<SlimAthlete, SlimAthlete> = createDb(fs, 'athletes', createDirectConverter());

  return db;
}
