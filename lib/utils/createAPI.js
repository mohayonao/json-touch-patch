"use strict";

var get = require("../get");
var add = require("../add");
var remove = require("../remove");
var replace = require("../replace");
var move = require("../move");
var copy = require("../copy");
var test = require("../test");
var deepEqual = require("./deepEqual");
var shallowCopy = require("./shallowCopy");
var toKeys = require("./toKeys");

function createAPI(root, pluckFn) {
  return {
    get: function(path) {
      return get(root, path);
    },
    add: function(path, value) {
      return add(root, path, value, pluckFn);
    },
    remove: function(path) {
      return remove(root, path, pluckFn);
    },
    replace: function(path, value) {
      return replace(root, path, value, pluckFn);
    },
    move: function(from, path) {
      return move(root, from, path, pluckFn);
    },
    copy: function(from, path) {
      return copy(root, from, path, pluckFn);
    },
    test: function(path, expected) {
      return test(root, path, expected);
    },
    deepEqual: deepEqual,
    shallowCopy: shallowCopy,
    toKeys: toKeys,
  };
}

module.exports = createAPI;
