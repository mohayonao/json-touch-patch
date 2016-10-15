"use strict";

var deepEqual = require("./utils/deepEqual");
var pluck = require("./utils/pluck");
var toArrayIndex = require("./utils/toArrayIndex");
var toKeys = require("./utils/toKeys");

function add(object, path, value, pluckWithShallowCopy) {
  if (typeof value === "undefined") {
    return "[op:add] require value, but got undefined";
  }
  var keys = toKeys(path);
  var lastKey = keys.pop();
  var target = pluck(object, keys);

  if (target === null) {
    return "[op:add] path not found: " + path;
  }

  if (Array.isArray(target)) {
    var index = toArrayIndex(target, lastKey);
    if (target.length < index) {
      return "[op:add] invalid array index: " + path;
    }
    pluckWithShallowCopy(object, keys).splice(index, 0, value);
  } else {
    if (!deepEqual(target[lastKey], value)) {
      pluckWithShallowCopy(object, keys)[lastKey] = value;
    }
  }
}

module.exports = add;
