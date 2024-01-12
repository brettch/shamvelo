// Create a map of items keyed by their id.
export default function (items: any) {
  return items.reduce(function(itemsById: any, item: any) {
    itemsById[item.id] = item;
    return itemsById;
  }, {});
}
