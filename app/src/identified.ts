export interface Identified {
  id: number,
}

export interface IdentifiedMaybe {
  id?: number,
}

// Create a map of items keyed by their id.
export function mapById<T extends Identified>(items: T[]): Map<string, T> {
  return items.reduce(function(itemsById, item) {
    itemsById.set(item.id, item);
    return itemsById;
  }, new Map());
}
