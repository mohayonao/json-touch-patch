"use strict";

var pluck = require("./utils/pluck");
var toKeys = require("./utils/toKeys");

function get(object, path) {
  var keys = toKeys(path);
  var lastKey = keys[keys.length - 1];
  var target = pluck(object, keys);

  return target ? target[lastKey] : undefined;
}

module.exports = get;
