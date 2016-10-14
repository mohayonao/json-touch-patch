"use strict";

const shallowCopy = require("shallow-copy");
const deepEqual = require("deep-equal");

function returnAsBool(message) {
  return !!message;
}

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
    if (keys[i].indexOf("~") !== -1) {
      keys[i] = keys[i].replace(/~[01]/g, esc);
    }
  }

  return keys;
}

function toArrayIndex(array, index) {
  if (index === "-") {
    return array.length;
  }
  for (let i = 0, imax = index.length; i < imax; i++) {
    const ch = index.charCodeAt(i);
    if (ch < 48 || 57 < ch) {
      return Infinity;
    }
  }
  return +index;
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

function add(object, path, value, pluckWithShallowCopy) {
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
    if (target.length < index) {
      return `[op:add] invalid array index: ${ path }`;
    }
    pluckWithShallowCopy(object, keys).splice(index, 0, value);
  } else {
    pluckWithShallowCopy(object, keys)[lastKey] = value;
  }
}

function remove(object, path, pluckWithShallowCopy) {
  const keys = toKeys(path);
  const lastKey = keys.pop();
  const target = pluck(object, keys);

  if (target === null) {
    return `[op:remove] path not found: ${ path }`;
  }

  if (Array.isArray(target)) {
    const index = toArrayIndex(target, lastKey);
    if (target.length <= index) {
      return `[op:remove] invalid array index: ${ path }`;
    }
    pluckWithShallowCopy(object, keys).splice(index, 1);
  } else {
    delete pluckWithShallowCopy(object, keys)[lastKey];
  }
}

function replace(object, path, value, pluckWithShallowCopy) {
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
    if (target.length <= index) {
      return `[op:replace] invalid array index: ${ path }`;
    }
    if (!deepEqual(target[index], value, { strict: true })) {
      pluckWithShallowCopy(object, keys).splice(index, 1, value);
    }
  } else {
    if (!deepEqual(target[lastKey], value, { strict: true })) {
      pluckWithShallowCopy(object, keys)[lastKey] = value;
    }
  }
}

function move(object, path, from, pluckWithShallowCopy) {
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
      if (target.length <= index) {
        return `[op:move] invalid array index: ${ path }`;
      }
      value = target[index];
      pluckWithShallowCopy(object, keys).splice(index, 1);
    } else {
      value = target[lastKey];
      delete pluckWithShallowCopy(object, keys)[lastKey];
    }

    return add(object, path, value, pluckWithShallowCopy);
  }
}

function copy(object, path, from, pluckWithShallowCopy) {
  const keys = toKeys(from);
  const lastKey = keys.pop();
  const target = pluck(object, keys);

  if (target === null) {
    return `[op:copy] path not found: ${ from }`;
  }

  return add(object, path, target[lastKey], pluckWithShallowCopy);
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
  opts = opts || {};

  const exit = opts.strict ? throwException : returnAsBool;
  const pluckFn = patches.length === 1 ? pluckWithShallowCopy :
    (cache => (object, keys) => pluckWithCachedShallowCopy(object, keys, cache))({});
  const root = { "": object };

  for (let i = 0, imax = patches.length; i < imax; i++) {
    const patch = patches[i];

    switch (patch.op) {
    case "add":
      if (exit(add(root, `${ patch.path }`, patch.value, pluckFn))) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
      break;
    case "remove":
      if (exit(remove(root, `${ patch.path }`, pluckFn))) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
      break;
    case "replace":
      if (exit(replace(root, `${ patch.path }`, patch.value, pluckFn))) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
      break;
    case "move":
      if (exit(move(root, `${ patch.path }`, `${ patch.from }`, pluckFn))) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
      break;
    case "copy":
      if (exit(copy(root, `${ patch.path }`, `${ patch.from }`, pluckFn))) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
      break;
    case "test":
      if (exit(test(root, `${ patch.path }`, patch.value))) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
      break;
    default:
      if (exit(`[op:${ patch.op }] unknown`)) {
        opts.error = patch;
        return opts.partial ? root[""] : object;
      }
    }
  }

  return root[""];
}

module.exports = patch;
