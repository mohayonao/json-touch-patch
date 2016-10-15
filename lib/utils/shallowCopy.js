"use strict";

function shallowCopy(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    var len = obj.length;
    var ary = new Array(len);

    for (var i = 0; i < len; i++) {
      ary[i] = obj[i];
    }

    return ary;
  }

  var keys = Object.keys(obj);
  var copy = {};

  for (var j = 0, jmax = keys.length; j < jmax; j++) {
    var key = keys[j];
    copy[key] = obj[key];
  }

  return copy;
}

module.exports = shallowCopy;
