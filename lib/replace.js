"use strict";

var deepEqual = require("./utils/deepEqual");
var pluck = require("./utils/pluck");
var toArrayIndex = require("./utils/toArrayIndex");
var toKeys = require("./utils/toKeys");

function replace(object, path, value, pluckWithShallowCopy) {
  if (typeof value === "undefined") {
    return "[op:replace] require value, but got undefined";
  }
  var keys = toKeys(path);
  var lastKey = keys[keys.length - 1];
  var target = pluck(object, keys);

  if (target === null) {
    return "[op:replace] path not found: " + path;
  }

  if (Array.isArray(target)) {
    var index = toArrayIndex(target, lastKey);
    if (target.length <= index) {
      return "[op:replace] invalid array index: " + path;
    }
    if (!deepEqual(target[index], value)) {
      pluckWithShallowCopy(object, keys).splice(index, 1, value);
    }
  } else {
    if (!deepEqual(target[lastKey], value)) {
      pluckWithShallowCopy(object, keys)[lastKey] = value;
    }
  }
}

module.exports = replace;
