"use strict";

var shallowCopy = require("./shallowCopy");

function fetch(object, key, cache) {
  var value = object[key];
  if (!cache.has(value)) {
    value = shallowCopy(value);
    cache.add(value);
  }
  return value;
}

function pluckWithCachedShallowCopy(object, keys, cache) {
  for (var i = 0, imax = keys.length - 1; i < imax; i++) {
    object = object[keys[i]] = fetch(object, keys[i], cache);
  }
  return object;
}

module.exports = pluckWithCachedShallowCopy;
