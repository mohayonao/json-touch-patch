"use strict";

var deepEqual = require("./utils/deepEqual");
var pluck = require("./utils/pluck");
var toKeys = require("./utils/toKeys");

function test(object, path, expected) {
  var keys = toKeys(path);
  var lastKey = keys.pop();
  var target = pluck(object, keys);

  if (target === null) {
    return "[op:test] path not found: " + path;
  }

  if (!deepEqual(target[lastKey], expected)) {
    var a = JSON.stringify(target[lastKey]);
    var b = JSON.stringify(expected);

    return "[op:test] not matched: " + a + " " + b;
  }
}

module.exports = test;
