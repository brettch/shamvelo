import { Firestore } from "@google-cloud/firestore";
import { SlimAthlete } from "../strava.js";
import { Db, Persist, createDb, createDirectConverter } from "./persist.js";

type AthletePersist = Persist<number, SlimAthlete>;

export function createAthletePersist(fs: Firestore): AthletePersist {
  const db: Db<number, SlimAthlete, SlimAthlete> =
    createDb(fs, 'athletes', createDirectConverter(), id => id.toString());

  return db;
}
