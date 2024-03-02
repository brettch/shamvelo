import { CollectionReference, DocumentData, Firestore, FirestoreDataConverter, Query, QueryDocumentSnapshot, WithFieldValue } from '@google-cloud/firestore';
import { appConfig } from '../config.js'
import { Identified } from '../identified.js';

export interface Persist<K, T> {
  get(id: K): Promise<T>;
  getIfExists(id: K): Promise<T | undefined>
  getAll(): Promise<T[]>;
  set(item: T): Promise<void>;
  setAll(items: T[]): Promise<void>;
  deleteItem(id: K): Promise<void>;
}

export interface Db<K, AppT extends Identified<K>, DbT extends DocumentData> extends Persist<K, AppT> {
  collection: CollectionReference<AppT, DbT>,

  runQuery(query: Query<AppT, DbT>): Promise<AppT[]>;
  deleteByQuery(query: Query<AppT, DbT>): Promise<void>;
}

export function createFirestore() {
  return new Firestore({
    databaseId: appConfig.databaseId,
  });
}

export function createDb<K, AppT extends Identified<K>, DbT extends DocumentData>(
  fs: Firestore,
  collectionPath: string,
  dataConverter: FirestoreDataConverter<AppT, DbT>,
  mapIdToKey: (id: K) => string,
): Db<K, AppT, DbT> {
  const collection =
    fs.collection(collectionPath)
      .withConverter(dataConverter);

  async function runQuery(query: Query<AppT, DbT>): Promise<AppT[]> {
    const querySnapshot = await query.get();
    const records =
      querySnapshot.docs
      .map(value => value.data());

    return records;
  }

  async function get(id: K): Promise<AppT> {
    const item = await getIfExists(id);

    if (!item) {
      throw new Error(`Document ${JSON.stringify(id)} from ${collectionPath} does not exist`);
    }

    return item;
  }

  async function getIfExists(id: K): Promise<AppT | undefined> {
    console.log(`Getting ${collectionPath} with id ${JSON.stringify(id)}`);
    const doc = await collection
      .doc(mapIdToKey(id))
      .get();
    const item = doc.data();

    return item;
  }

  function getAll(): Promise<AppT[]> {
    console.log(`Getting ${collectionPath}`);
    return runQuery(collection);
  }

  async function set(item: AppT): Promise<void> {
    console.log(`Setting ${collectionPath} with id ${JSON.stringify(item.id)}`);
    await collection
        .doc(mapIdToKey(item.id))
        .set(item);
  }

  async function setAll(items: AppT[]): Promise<void> {
    console.log(`Saving ${items.length} ${collectionPath}`);
    const batchSize = 100;

    function* chunkItems() {
      for (let i = 0; i < items.length; i += batchSize) {
        yield items.slice(i, Math.min(items.length, i + batchSize));
      }
    }

    function* runSaveBatches() {
      for (const itemsChunk of chunkItems()) {
        const fsBatch = fs.batch();

        for (const item of itemsChunk) {
          fsBatch.set(collection.doc(mapIdToKey(item.id)), item);
        }

        yield fsBatch.commit();
      }
    }

    await Promise.all(
      runSaveBatches()
    );
  }

  async function deleteItem(id: K): Promise<void> {
    console.log(`Deleting ${collectionPath} with id ${JSON.stringify(id)}`);

    await collection
      .doc(mapIdToKey(id))
      .delete();
  }

  async function deleteByQuery(query: Query<AppT, DbT>): Promise<void> {
    // Delete in batches of 100.
    const batchQuery = query.limit(100);

    while (true) {
      const querySnapshot = await batchQuery.get();

      if (querySnapshot.size <= 0) {
        break;
      }

      const deleteBatch = fs.batch();

      querySnapshot.docs.forEach(doc =>
        deleteBatch.delete(doc.ref)
      );

      await deleteBatch.commit();
    }
  }

  return {
    get,
    getIfExists,
    getAll,
    set,
    setAll,
    deleteItem,
    collection,
    runQuery,
    deleteByQuery,
  }
}

export function createDirectConverter<T extends DocumentData>(): FirestoreDataConverter<T, T> {
  return {
    toFirestore: (modelObject: WithFieldValue<T>) => modelObject,
    fromFirestore: (snapshot: QueryDocumentSnapshot<T, T>) => snapshot.data(),
  };
}
