"use strict";

function esc(m) {
  return m === "~0" ? "~" : "/";
}

function toKeys(path) {
  var keys = path.split("/");

  if (path.indexOf("~") === -1) {
    return keys;
  }

  for (var i = 0, imax = keys.length; i < imax; i++) {
    if (keys[i].indexOf("~") !== -1) {
      keys[i] = keys[i].replace(/~[01]/g, esc);
    }
  }

  return keys;
}

module.exports = toKeys;
