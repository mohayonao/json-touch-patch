"use strict";

require("run-with-mocha");

const assert = require("assert");
const remove = require("../../lib/remove");
const pluck = require("../../lib/utils/pluck");

describe("op/remove", () => {
  let a;

  beforeEach(() => {
    a = { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } };
  });

  describe("works", () => {
    it("array", () => {
      assert(!remove(a, "/matrix/1/1", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 5 ], [ 6, 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
    });

    it("object", () => {
      assert(!remove(a, "/vector", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
      } });
    });
  });

  describe("error", () => {
    it("path not found", () => {
      assert(typeof remove(a, "/matrix/10/10", pluck) === "string");
    });

    it("invalid array index", () => {
      assert(typeof remove(a, "/matrix/1/10", pluck) === "string");
    });
  });
});
