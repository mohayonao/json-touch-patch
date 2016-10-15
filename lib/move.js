"use strict";

var add = require("./add");
var pluck = require("./utils/pluck");
var toArrayIndex = require("./utils/toArrayIndex");
var toKeys = require("./utils/toKeys");

function move(object, from, path, pluckWithShallowCopy) {
  if (path !== from) {
    var keys = toKeys(from);
    var lastKey = keys.pop();
    var target = pluck(object, keys);

    if (target === null) {
      return "[op:move] path not found: " + from;
    }

    var value = void 0;

    if (Array.isArray(target)) {
      var index = toArrayIndex(target, lastKey);
      if (target.length <= index) {
        return "[op:move] invalid array index: " + path;
      }
      value = target[index];
      pluckWithShallowCopy(object, keys).splice(index, 1);
    } else {
      value = target[lastKey];
      delete pluckWithShallowCopy(object, keys)[lastKey];
    }

    return add(object, path, value, pluckWithShallowCopy);
  }
}

module.exports = move;
