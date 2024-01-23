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

export function assertIdentified<T extends IdentifiedMaybe>(o: T): Identified {
  if (o.id) {
    return {
      ...o,
      id: o.id!,
    };
  }
  throw new Error("id is not available");
}
