"use strict";

var pluck = require("./utils/pluck");
var toKeys = require("./utils/toKeys");
var add = require("./add");

function copy(object, from, path, pluckWithShallowCopy) {
  var keys = toKeys(from);
  var lastKey = keys[keys.length - 1];
  var target = pluck(object, keys);

  if (target === null) {
    return "[op:copy] path not found: " + from;
  }

  return add(object, path, target[lastKey], pluckWithShallowCopy);
}

module.exports = copy;
