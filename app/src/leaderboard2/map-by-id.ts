// Create a map of items keyed by their id.
module.exports = function (items: any) {
  return items.reduce(function(itemsById: any, item: any) {
    itemsById[item.id] = item;
    return itemsById;
  }, {});
};
