"use strict";

require("run-with-mocha");

const assert = require("assert");
const throwException = require("../../lib/utils/throwException");

describe("utils/throwException", () => {
  it("noop", () => {
    assert.doesNotThrow(() => {
      throwException();
    });
  });

  it("throw", () => {
    assert.throws(() => {
      throwException("halt!");
    }, "halt!");
  });
});
