"use strict";

require("run-with-mocha");

const assert = require("assert");
const copy = require("../../lib/copy");
const pluck = require("../../lib/utils/pluck");

describe("op/copy", () => {
  let a;

  beforeEach(() => {
    a = { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } };
  });

  describe("works", () => {
    it("array", () => {
      assert(!copy(a, "/matrix/2/0", "/matrix/1/-", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5, 6 ], [ 6, 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
    });

    it("object", () => {
      assert(!copy(a, "/vector", "/matrix/-", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 10, 20 ] ],
        vector: [ 10, 20 ]
      } });
    });
  });

  describe("error", () => {
    it("path not found", () => {
      assert(typeof copy(a, "/matrix/10/10", "/matrix/1/1", pluck) === "string");
    });
  });
});
