"use strict";

require("run-with-mocha");

const assert = require("assert");
const deepEqual = require("../../lib/utils/deepEqual");

describe("utils/deepEqual", () => {
  it("number", () => {
    assert(deepEqual(3, 3) === true);
    assert(deepEqual(3, 4) === false);
    assert(deepEqual(3, "3") === false);
    assert(deepEqual(3, [ 3 ]) === false);
    assert(deepEqual(NaN, NaN) === false);
  });

  it("string", () => {
    assert(deepEqual("str", 'str') === true);
    assert(deepEqual("0", 0) === false);
    assert(deepEqual("", null) === false);
  });

  it("null", () => {
    assert(deepEqual(null, null) === true);
    assert(deepEqual(null, 0) === false);
    assert(deepEqual(null, undefined) === false);
  });

  it("array", () => {
    assert(deepEqual([], []) === true);
    assert(deepEqual([ 1, 2, 3 ], [ 1, 2, 3 ]) === true);
    assert(deepEqual([ 1, 2, 3 ], [ 1, 2, 3, 4 ]) === false);
    assert(deepEqual([ 1, 2, 3, 4 ], [ 1, 2, 3 ]) === false);
    assert(deepEqual([ 1 ], 1) === false);
    assert(deepEqual([ 1, 2, 3 ], { length: 3, 0: 1, 1: 2, 2: 3 }) === false);
  });

  it("nested array", () => {
    assert(deepEqual([ 1, [ 2, [ 3 ] ] ], [ 1, [ 2, [ 3 ] ] ]) === true);
    assert(deepEqual([ 1, [ 2, [ 3 ] ] ], [ 1, [ 2, [ 3, [ 4 ] ] ] ]) === false);
    assert(deepEqual([ 1, [ 2, [ 3, [ 4 ] ] ] ], [ 1, [ 2, 3 ] ]) === false);
  });

  it("object", () => {
    assert(deepEqual({}, {}) === true);
    assert(deepEqual({ a: 0, b: 1, c: 2 }, { a: 0, b: 1, c: 2 }) === true);
    assert(deepEqual({ a: 0, b: 1, c: 2 }, { c: 2, b: 1, a: 0 }) === true);
    assert(deepEqual({ a: 0, b: 1, c: 2 }, { a: 2, b: 1, c: 0 }) === false);
    assert(deepEqual({ a: 0, b: 1, c: 2 }, { a: 0, b: 1, c: 2, d: 3 }) === false);
    assert(deepEqual({ a: 0, b: 1, c: 2, d: 3 }, { a: 0, b: 1, c: 2 }) === false);
    assert(deepEqual({ length: 3, 0: 1, 1: 2, 2: 3 }, [ 1, 2, 3 ]) === false);
  });

  it("nested object", () => {
    assert(deepEqual({ a: { a: 0, b: { b: 1, c: [ 2 ] } } }, { a: { a: 0, b: { b: 1, c: [ 2 ] } } }) === true);
    assert(deepEqual({ a: { a: 0, b: { b: 1, c: [ 2 ] } } }, { a: { a: 0, b: { b: 1, c: [ 2, 3 ] } } }) === false);
    assert(deepEqual({ a: { a: 0, b: { b: 1, c: [ 2 ] } } }, { a: { a: 0, b: { b: 1, c: [ 2 ], d: 3 } } }) === false);
  });
});
