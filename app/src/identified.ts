export interface Identified<K> {
  id: K,
}

export interface Named<K> extends Identified<K> {
  name: string,
}

// Create a map of items keyed by their id.
export function mapById<K, T extends Identified<K>>(items: T[]): Map<K, T> {
  return items.reduce(function(itemsById, item) {
    itemsById.set(item.id, item);
    return itemsById;
  }, new Map());
}
