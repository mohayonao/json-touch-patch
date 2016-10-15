"use strict";

require("run-with-mocha");

const assert = require("assert");
const shallowCopy = require("../../lib/utils/shallowCopy");

describe("utils/shallowCopy", () => {
  it("scalar", () => {
    assert(shallowCopy(0) === 0);
    assert(shallowCopy(null) === null);
  });

  it("array", () => {
    const a = [ [ 1 ], [ 2 ], [ 3 ] ];
    const b = shallowCopy(a);

    assert(a !== b);
    assert.deepEqual(a, b);
    assert(a[0] === b[0]);
    assert(a[1] === b[1]);
    assert(a[2] === b[2]);
  });

  it("object", () => {
    const a = { x: { y: { z: 0 } } };
    const b = shallowCopy(a);

    assert(a !== b);
    assert.deepEqual(a, b);
    assert(a.x === b.x);
  });

  it("combined", () => {
    const a = {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], ],
      vector: [ 10, 20 ]
    };
    const b = shallowCopy(a);

    assert(a !== b);
    assert.deepEqual(a, b);
    assert(a.matrix === b.matrix);
    assert(a.vector === b.vector);
  });
});
