// Create a map of items keyed by their id.
module.exports = function (items) {
  return items.reduce(function(itemsById, item) {
    itemsById[item.id] = item;
    return itemsById;
  }, {});
};
