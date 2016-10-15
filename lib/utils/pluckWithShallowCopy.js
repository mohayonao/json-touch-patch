"use strict";

var shallowCopy = require("./shallowCopy");

function pluckWithShallowCopy(object, keys) {
  for (var i = 0, imax = keys.length; i < imax; i++) {
    object = object[keys[i]] = shallowCopy(object[keys[i]]);
  }
  return object;
}

module.exports = pluckWithShallowCopy;
