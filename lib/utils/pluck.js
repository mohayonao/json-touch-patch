"use strict";

function pluck(object, keys) {
  for (var i = 0, imax = keys.length; i < imax; i++) {
    if (!object[keys[i]]) {
      return null;
    }
    object = object[keys[i]];
  }
  return object;
}

module.exports = pluck;
