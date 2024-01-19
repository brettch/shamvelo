export interface Identified {
  id: string,
}

// Create a map of items keyed by their id.
export function mapById<T extends Identified>(items: T[]): Map<string, T> {
  return items.reduce(function(itemsById, item) {
    itemsById.set(item.id, item);
    return itemsById;
  }, new Map());
}
