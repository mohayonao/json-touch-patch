"use strict";

require("run-with-mocha");

const assert = require("assert");
const test = require("../../lib/test");
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
      assert(!test(a, "/matrix/1/1", 4, pluck));
    });

    it("object", () => {
      assert(!test(a, "/vector", [ 10, 20 ], pluck));
    });
  });

  describe("error", () => {
    it("path not found", () => {
      assert(typeof test(a, "/matrix/10/10", "/matrix/1/1", pluck) === "string");
    });

    it("not matched", () => {
      assert(typeof test(a, "/matrix/1/1", 9, pluck) === "string");
    });
  });
});
