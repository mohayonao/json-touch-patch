"use strict";

require("run-with-mocha");

const assert = require("assert");
const toBoolean = require("../../lib/utils/toBoolean");

describe("utils/toBoolean", () => {
  it("works", () => {
    assert(toBoolean("message") === true);
    assert(toBoolean(undefined) === false);
    assert(toBoolean(null) === false);
  });
});
