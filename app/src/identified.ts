export interface Identified {
  id: number,
}

export interface Named extends Identified {
  name: String,
}

export interface IdentifiedMaybe {
  id?: number,
}

// Create a map of items keyed by their id.
export function mapById<T extends Identified>(items: T[]): Map<number, T> {
  return items.reduce(function(itemsById, item) {
    itemsById.set(item.id, item);
    return itemsById;
  }, new Map());
}
