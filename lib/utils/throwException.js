"use strict";

function throwException(message) {
  if (message) {
    throw new TypeError(message);
  }
}

module.exports = throwException;
