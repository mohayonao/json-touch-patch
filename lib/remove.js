"use strict";

var pluck = require("./utils/pluck");
var toArrayIndex = require("./utils/toArrayIndex");
var toKeys = require("./utils/toKeys");

function remove(object, path, pluckWithShallowCopy) {
  var keys = toKeys(path);
  var lastKey = keys.pop();
  var target = pluck(object, keys);

  if (target === null) {
    return "[op:remove] path not found: " + path;
  }

  if (Array.isArray(target)) {
    var index = toArrayIndex(target, lastKey);
    if (target.length <= index) {
      return "[op:remove] invalid array index: " + path;
    }
    pluckWithShallowCopy(object, keys).splice(index, 1);
  } else {
    delete pluckWithShallowCopy(object, keys)[lastKey];
  }
}

module.exports = remove;
