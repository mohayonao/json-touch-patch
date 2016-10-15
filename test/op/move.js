"use strict";

require("run-with-mocha");

const assert = require("assert");
const move = require("../../lib/move");
const pluck = require("../../lib/utils/pluck");

describe("op/move", () => {
  let a;

  beforeEach(() => {
    a = { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } };
  });

  describe("works", () => {
    it("array", () => {
      assert(!move(a, "/matrix/2/0", "/matrix/1/-", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5, 6 ], [ 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
    });

    it("object", () => {
      assert(!move(a, "/vector", "/matrix/-", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 10, 20 ] ],
      } });
    });

    it("no changes", () => {
      assert(!move(a, "/matrix/-", "/matrix/-", pluck));
      assert.deepEqual(a, { "": {
        matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
        vector: [ 10, 20 ]
      } });
    });
  });

  describe("error", () => {
    it("path not found", () => {
      assert(typeof move(a, "/matrix/10/10", "/matrix/1/1", pluck) === "string");
    });

    it("invalid array index", () => {
      assert(typeof move(a, "/matrix/1/10", "/matrix/1/1", pluck) === "string");
    });
  });
});
