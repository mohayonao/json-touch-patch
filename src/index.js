"use strict";

const clone = require("lodash.clone");
const esc = { "~0": "~", "~1": "/" };

function patch(target, patches) {
  if (patches.length === 0) {
    return target;
  }

  const cache = new Map();

  function toKeys(path) {
    return path.split("/").map(key => key.replace(/~[01]/g, m => esc[m]));
  }

  function toArrayIndex(target, key) {
    if (key === "-") {
      return target.length;
    }
    if (/^\d+$/.test(key)) {
      return +key;
    }
    return NaN;
  }

  function fetch(target, key) {
    if (!cache.has(target)) {
      cache.set(target, { [key]: clone(target[key]) });
    }
    const map = cache.get(target);

    if (!map.hasOwnProperty(key)) {
      map[key] = clone(target[key]);
    }

    return map[key];
  }

  function exists(target, path, lastIndex = Infinity) {
    const keys = toKeys(path).slice(0, lastIndex);

    let memo = target;

    return keys.every((key) => {
      if (memo.hasOwnProperty(key)) {
        return ((memo = memo[key]) || true);
      }
    });
  }

  function walk(target, keys, at=fetch) {
    keys.forEach((key) => {
      target = target[key] = at(target, key);
    });
    return target;
  }

  function get(target, path) {
    const keys = toKeys(path);
    const lastKey = keys.pop();

    target = walk(target, keys, (target, key) => {
      if (!target.hasOwnProperty(key)) {
        throw new TypeError(`[op:get] path not found: ${ path }`);
      }
      return target[key];
    });

    return target[lastKey];
  }

  function test(target, path, expected) {
    const actual = get(target, path);
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);

    if (a !== b) {
      throw new TypeError(`[op:test] not matched: ${ a } ${ b }`);
    }
  }

  function add(target, path, value) {
    if (typeof value === "undefined") {
      throw new TypeError(`[op:add] require value, but got undefined`);
    }
    if (!exists(target, path, -1)) {
      throw new TypeError(`[op:add] path not found: ${ path }`);
    }
    const keys = toKeys(path);
    const lastKey = keys.pop();

    target = walk(target, keys);

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index <= target.length)) {
        throw new TypeError(`[op:add] invalid array index: ${ path }`);
      }
      target.splice(index, 0, value);
    } else {
      target[lastKey] = value;
    }
  }

  function remove(target, path) {
    if (!exists(target, path)) {
      throw new TypeError(`[op:remove] path not found: ${ path }`);
    }
    const keys = toKeys(path);
    const lastKey = keys.pop();

    target = walk(target, keys);

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index < target.length)) {
        throw new TypeError(`[op:remove] invalid array index: ${ path }`);
      }
      target.splice(index, 1);
    } else {
      delete target[lastKey];
    }
  }

  function replace(target, path, value) {
    if (typeof value === "undefined") {
      throw new TypeError(`[op:replace] require value, but got undefined`);
    }
    if (!exists(target, path)) {
      throw new TypeError(`[op:replace] path not found: ${ path }`);
    }
    const keys = toKeys(path);
    const lastKey = keys.pop();

    target = walk(target, keys);

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index < target.length)) {
        throw new TypeError(`[op:replace] invalid array index: ${ path }`);
      }
      target.splice(index, 1, value);
    } else {
      target[lastKey] = value;
    }
  }

  function move(target, path, value, from) {
    if (path !== from) {
      if (!exists(target, from)) {
        throw new TypeError(`[op:replace] path not found: ${ from }`);
      }
      value = get(target, from);
      remove(target, from);
      add(target, path, value);
    }
  }

  function copy(target, path, value, from) {
    if (path !== from) {
      if (!exists(target, from)) {
        throw new TypeError(`[op:replace] path not found: ${ from }`);
      }
      value = get(target, from);
      add(target, path, value);
    }
  }

  const result = { "": target };
  const funcs = { test, add, remove, replace, move, copy };

  patches.forEach(({ op, path, value, from }) => {
    const func = funcs[op];

    if (typeof func !== "function") {
      throw new TypeError(`[op:${ op }] unknown`);
    }

    func(result, path, value, from);
  });

  return result[""];
}

module.exports = patch;
