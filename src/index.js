"use strict";

const shallowCopy = require("shallow-copy");
const deepEqual = require("deep-equal");

function noop() {}

function throwException(message) {
  if (message) {
    throw new TypeError(message);
  }
}

function esc(m) {
  return m === "~0" ? "~" : "/";
}

function toKeys(path) {
  const keys = path.split("/");

  for (let i = 0, imax = keys.length; i < imax; i++) {
    keys[i] = keys[i].replace(/~[01]/g, esc);
  }

  return keys;
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

function fetch(object, key, path, cache) {
  if (!cache[path]) {
    cache[path] = {};
    return (cache[path][key] = shallowCopy(object[key]));
  }
  return cache[path][key] || (cache[path][key] = shallowCopy(object[key]));
}

function pluck(object, keys) {
  for (let i = 0, imax = keys.length; i < imax; i++) {
    if (!object[keys[i]]) {
      return null;
    }
    object = object[keys[i]];
  }
  return object;
}

function pluckWithShallowCopy(object, keys) {
  for (let i = 0, imax = keys.length; i < imax; i++) {
    object = object[keys[i]] = shallowCopy(object[keys[i]]);
  }
  return object;
}

function pluckWithCachedShallowCopy(object, keys, cache) {
  let path = "";
  for (let i = 0, imax = keys.length; i < imax; i++) {
    object = object[keys[i]] = fetch(object, keys[i], path, cache);
    path = `${ path }/${ keys[i] }`;
  }
  return object;
}

function add(object, path, value, patchWithShallowCopy) {
  if (typeof value === "undefined") {
    return `[op:add] require value, but got undefined`;
  }
  const keys = toKeys(path);
  const lastKey = keys.pop();
  const target = pluck(object, keys);

  if (target === null) {
    return `[op:add] path not found: ${ path }`;
  }

  if (Array.isArray(target)) {
    const index = toArrayIndex(target, lastKey);
    if (!(0 <= index && index <= target.length)) {
      return `[op:add] invalid array index: ${ path }`;
    }
    patchWithShallowCopy(object, keys).splice(index, 0, value);
  } else {
    patchWithShallowCopy(object, keys)[lastKey] = value;
  }
}

function remove(object, path, patchWithShallowCopy) {
  const keys = toKeys(path);
  const lastKey = keys.pop();
  const target = pluck(object, keys);

  if (target === null) {
    return `[op:remove] path not found: ${ path }`;
  }

  if (Array.isArray(target)) {
    const index = toArrayIndex(target, lastKey);
    if (!(0 <= index && index < target.length)) {
      return `[op:remove] invalid array index: ${ path }`;
    }
    patchWithShallowCopy(object, keys).splice(index, 1);
  } else {
    delete patchWithShallowCopy(object, keys)[lastKey];
  }
}

function replace(object, path, value, patchWithShallowCopy) {
  if (typeof value === "undefined") {
    return `[op:replace] require value, but got undefined`;
  }
  const keys = toKeys(path);
  const lastKey = keys.pop();
  const target = pluck(object, keys);

  if (target === null) {
    return `[op:replace] path not found: ${ path }`;
  }

  if (Array.isArray(target)) {
    const index = toArrayIndex(target, lastKey);
    if (!(0 <= index && index < target.length)) {
      return `[op:replace] invalid array index: ${ path }`;
    }
    if (!deepEqual(target[index], value, { strict: true })) {
      patchWithShallowCopy(object, keys).splice(index, 1, value);
    }
  } else {
    if (!deepEqual(target[lastKey], value, { strict: true })) {
      patchWithShallowCopy(object, keys)[lastKey] = value;
    }
  }
}

function move(object, path, from, patchWithShallowCopy) {
  if (path !== from) {
    const keys = toKeys(from);
    const lastKey = keys.pop();
    const target = pluck(object, keys);

    if (target === null) {
      return `[op:move] path not found: ${ from }`;
    }

    let value;

    if (Array.isArray(target)) {
      const index = toArrayIndex(target, lastKey);
      if (!(0 <= index && index < target.length)) {
        return `[op:move] invalid array index: ${ path }`;
      }
      value = target[index];
      patchWithShallowCopy(object, keys).splice(index, 1);
    } else {
      value = target[lastKey];
      delete patchWithShallowCopy(object, keys)[lastKey];
    }

    return add(object, path, value, patchWithShallowCopy);
  }
}

function copy(object, path, from, patchWithShallowCopy) {
  if (path !== from) {
    const keys = toKeys(from);
    const lastKey = keys.pop();
    const target = pluck(object, keys);

    if (target === null) {
      return `[op:copy] path not found: ${ from }`;
    }

    return add(object, path, target[lastKey], patchWithShallowCopy);
  }
}

function test(object, path, expected) {
  const keys = toKeys(path);
  const lastKey = keys.pop();
  const target = pluck(object, keys);

  if (target === null) {
    return `[op:test] path not found: ${ path }`;
  }

  if (!deepEqual(target[lastKey], expected, { strict: true })) {
    const a = JSON.stringify(target[lastKey]);
    const b = JSON.stringify(expected);

    return `[op:test] not matched: ${ a } ${ b }`;
  }
}

function patch(object, patches, opts) {
  if (patches.length === 0) {
    return object;
  }

  const check = (opts && opts.strict) ? throwException : noop;
  const pluckFn = patches.length === 1 ? pluckWithShallowCopy :
    (cache => (object, keys) => pluckWithCachedShallowCopy(object, keys, cache))({});
  const root = { "": object };

  for (let i = 0, imax = patches.length; i < imax; i++) {
    const patch = patches[i];

    switch (patch.op) {
    case "add":
      check(add(root, `${ patch.path }`, patch.value, pluckFn));
      break;
    case "remove":
      check(remove(root, `${ patch.path }`, pluckFn));
      break;
    case "replace":
      check(replace(root, `${ patch.path }`, patch.value, pluckFn));
      break;
    case "move":
      check(move(root, `${ patch.path }`, `${ patch.from }`, pluckFn));
      break;
    case "copy":
      check(copy(root, `${ patch.path }`, `${ patch.from }`, pluckFn));
      break;
    case "test":
      check(test(root, `${ patch.path }`, patch.value));
      break;
    default:
      check(`[op:${ patch.op }] unknown`);
    }
  }

  return root[""];
}

module.exports = patch;
