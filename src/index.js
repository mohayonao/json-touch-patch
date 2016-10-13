"use strict";

const clone = require("lodash.clone");
const esc = { "~0": "~", "~1": "/" };

function patch(object, patches, opts = {}) {
  if (patches.length === 0) {
    return object;
  }

  const strict = !!opts.strict;
  const cache = {};

  function halt(message) {
    if (strict) {
      throw new TypeError(message);
    }
    return false;
  }

  function fetch(object, key, path) {
    if (!cache[path]) {
      cache[path] = { [ key ]: clone(object[key]) };
    }
    const map = cache[path];

    if (!map.hasOwnProperty(key)) {
      map[key] = clone(object[key]);
    }

    return map[key];
  }

  function toKeys(path) {
    return path.split("/").map(key => key.replace(/~[01]/g, m => esc[m]));
  }

  function toArrayIndex(array, index) {
    if (index === "-") {
      return array.length;
    }
    if (/^\d+$/.test(index)) {
      return +index;
    }
    return NaN;
  }

  function pluck(object, keys) {
    return keys.reduce((target, key) => {
      if (target === null || !target.hasOwnProperty(key)) {
        return null;
      }
      return target[key];
    }, object);
  }

  function pluckWithClone(object, keys) {
    return keys.reduce((target, key, i) => {
      return (target[key] = fetch(target, key, keys.slice(0, i + 1).join("/")));
    }, object);
  }

  function get(object, path) {
    const keys = toKeys(path);
    const lastKey = keys.pop();
    const target = pluck(object, keys);

    if (target === null) {
      return [ `path not found: ${ path }`, null ];
    }

    return [ null, target[lastKey] ];
  }

  function test(object, path, expected) {
    const [ err, actual ] = get(object, path);

    if (err) {
      return halt(`[op:test] ${ err }`);
    }

    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);

    if (a !== b) {
      return halt(`[op:test] not matched: ${ a } ${ b }`);
    }

    return true;
  }

  function add(object, path, value) {
    if (typeof value === "undefined") {
      return halt(`[op:add] require value, but got undefined`);
    }
    const keys = toKeys(path);
    const lastKey = keys.pop();
    const target = pluck(object, keys);

    if (target === null) {
      return halt(`[op:add] path not found: ${ path }`);
    }

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index <= target.length)) {
        return halt(`[op:add] invalid array index: ${ path }`);
      }
      pluckWithClone(object, keys).splice(index, 0, value);
    } else {
      pluckWithClone(object, keys)[lastKey] = value;
    }

    return true;
  }

  function remove(object, path) {
    const keys = toKeys(path);
    const lastKey = keys.pop();
    const target = pluck(object, keys);

    if (target === null) {
      return halt(`[op:remove] path not found: ${ path }`);
    }

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index < target.length)) {
        return halt(`[op:remove] invalid array index: ${ path }`);
      }
      pluckWithClone(object, keys).splice(index, 1);
    } else {
      delete pluckWithClone(object, keys)[lastKey];
    }

    return true;
  }

  function replace(object, path, value) {
    if (typeof value === "undefined") {
      return halt(`[op:replace] require value, but got undefined`);
    }
    const keys = toKeys(path);
    const lastKey = keys.pop();
    const target = pluck(object, keys);

    if (target === null) {
      return halt(`[op:replace] path not found: ${ path }`);
    }

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index < target.length)) {
        return halt(`[op:replace] invalid array index: ${ path }`);
      }
      if (target[index] === value) {
        return false;
      }
      pluckWithClone(object, keys).splice(index, 1, value);
    } else {
      if (target[lastKey] === value) {
        return false;
      }
      pluckWithClone(object, keys)[lastKey] = value;
    }

    return true;
  }

  function move(object, path, _, from) {
    if (path !== from) {
      const [ err, value ] = get(object, from);

      if (err) {
        return halt(`[op:move] ${ err }`);
      }

      return remove(object, from) && add(object, path, value);
    }
    return true;
  }

  function copy(object, path, _, from) {
    if (path !== from) {
      const [ err, value ] = get(object, from);

      if (err) {
        return halt(`[op:copy] ${ err }`);
      }

      return add(object, path, value);
    }
    return true;
  }

  const root = { "": object };
  const funcs = { test, add, remove, replace, move, copy };

  patches.forEach(({ op, path, value, from }) => {
    const func = funcs[op];
    if (typeof func === "function") {
      func(root, `${ path }`, value, `${ from }`);
    } else {
      return halt(`[op:${ op }] unknown`);
    }
  });

  return root[""];
}

module.exports = patch;
