module.exports = {
  stringify: function (obj: any) {
    return JSON.stringify(obj, null, 2);
  },

  csvString: function (string: any) {
    var escapedString = string.replace(/\"/g, '""');
    var quotedString = '"' + escapedString + '"';
    return quotedString;
  }
};
