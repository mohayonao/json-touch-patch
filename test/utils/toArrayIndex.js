"use strict";

require("run-with-mocha");

const assert = require("assert");
const toArrayIndex = require("../../lib/utils/toArrayIndex");

describe("utils/toArrayIndex", () => {
  it("works", () => {
    const array = [ 0, 1, 2, 3 ];

    assert(toArrayIndex(array, "0") === 0);
    assert(toArrayIndex(array, "10") === 10);
    assert(toArrayIndex(array, "-") === array.length);
    assert(toArrayIndex(array, "foo") === Infinity);
    assert(toArrayIndex(array, "1.0") === Infinity);
    assert(toArrayIndex(array, "-1") === Infinity);
  });
});
