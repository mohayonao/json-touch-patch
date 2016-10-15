"use strict";

var shallowCopy = require("./shallowCopy");

function fetch(object, key, path, cache) {
  if (!cache[path]) {
    cache[path] = {};
    return cache[path][key] = shallowCopy(object[key]);
  }
  return cache[path][key] || (cache[path][key] = shallowCopy(object[key]));
}

function pluckWithCachedShallowCopy(object, keys, cache) {
  var path = "";
  for (var i = 0, imax = keys.length - 1; i < imax; i++) {
    object = object[keys[i]] = fetch(object, keys[i], path, cache);
    path = path + "/" + keys[i];
  }
  return object;
}

module.exports = pluckWithCachedShallowCopy;
