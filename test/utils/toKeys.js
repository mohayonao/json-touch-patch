"use strict";

require("run-with-mocha");

const assert = require("assert");
const toKeys = require("../../lib/utils/toKeys");

describe("utils/toKeys", () => {
  it("works", () => {
    assert.deepEqual(toKeys("/foo"), [ "", "foo" ]);
    assert.deepEqual(toKeys("/foo/bar/baz"), [ "", "foo", "bar", "baz" ]);
    assert.deepEqual(toKeys("/~01"), [ "", "~1" ]);
    assert.deepEqual(toKeys("/~10"), [ "", "/0" ]);
    assert.deepEqual(toKeys("/~20"), [ "", "~20" ]);
    assert.deepEqual(toKeys("/~01~10/~10~01/~11~20"), [ "", "~1/0", "/0~1", "/1~20" ]);
  });
});
