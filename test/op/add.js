"use strict";

require("run-with-mocha");

const assert = require("assert");
const add = require("../../lib/add");
const pluck = require("../../lib/utils/pluck");

describe("op/add", () => {
  let a;

  beforeEach(() => {
    a = { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } };
  });

  describe("works", () => {
    it("array", () => {
      const value = 9;

      assert(!add(a, "/matrix/1/1", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, value, 4, 5 ], [ 6, 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
    });

    it("object", () => {
      const value = [ 30, 40 ];

      assert(!add(a, "/vector", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
        vector: value
      } });
      assert(a[""].vector === value);
    });

    it("object no changes", () => {
      const value = [ 10, 20 ];

      assert(!add(a, "/vector", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
        vector: value
      } });
      assert(a[""].vector !== value);
    });
  });

  describe("error", () => {
    it("missing value", () => {
      assert(typeof add(a, "/", undefined, pluck) === "string");
    });

    it("path not found", () => {
      assert(typeof add(a, "/matrix/10/10", 9, pluck) === "string");
    });

    it("invalid array index", () => {
      assert(typeof add(a, "/matrix/1/10", 9, pluck) === "string");
    });
  });
});
