"use strict";

require("run-with-mocha");

const assert = require("assert");
const exit = require("../../lib/utils/exit");

describe("utils/exit", () => {
  it("no option", () => {
    const object = {};
    const root = { "": {} };
    const patch = {};
    const opts = {};

    assert(exit(object, root, patch, opts) === object);
    assert(opts.error = patch);
  });

  it("partial", () => {
    const object = {};
    const root = { "": {} };
    const patch = {};
    const opts = { partial: true };

    assert(exit(object, root, patch, opts) === root[""]);
    assert(opts.error = patch);
  });
});
