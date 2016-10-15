"use strict";

require("run-with-mocha");

const assert = require("assert");
const replace = require("../../lib/replace");
const pluck = require("../../lib/utils/pluck");

describe("op/replace", () => {
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

      assert(!replace(a, "/matrix/1/1", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, value, 5 ], [ 6, 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
    });

    it("array no changes", () => {
      const value = [ 3, 4, 5 ];

      assert(!replace(a, "/matrix/1", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], value, [ 6, 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
      assert(a[""].matrix[1] !== value);
    });

    it("object", () => {
      const value = [ 30, 40 ];

      assert(!replace(a, "/vector", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
        vector: value
      } });
      assert(a[""].vector === value);
    });

    it("object no changes", () => {
      const value = [ 10, 20 ];

      assert(!replace(a, "/vector", value, pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
        vector: value
      } });
      assert(a.vector !== value);
    });
  });

  describe("error", () => {
    it("missing value", () => {
      assert(typeof replace(a, "/matrix/1/1", undefined, pluck) === "string");
    });

    it("path not found", () => {
      assert(typeof replace(a, "/matrix/10/10", 9, pluck) === "string");
    });

    it("invalid array index", () => {
      assert(typeof replace(a, "/matrix/1/10", 9, pluck) === "string");
    });
  });
});
