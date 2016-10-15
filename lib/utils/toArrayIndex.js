"use strict";

function toArrayIndex(array, str) {
  if (str === "-") {
    return array.length;
  }
  for (var i = 0, imax = str.length; i < imax; i++) {
    var ch = str.charCodeAt(i);
    if (57 < ch || ch < 48) {
      return Infinity;
    }
  }
  return +str;
}

module.exports = toArrayIndex;
