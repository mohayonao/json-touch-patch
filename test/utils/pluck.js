"use strict";

require("run-with-mocha");

const assert = require("assert");
const pluck = require("../../lib/utils/pluck");

describe("utils/pluck", () => {
  let a;

  before(() => {
    a = {
      foo: {
        bar: {
          baz: [ [ 10 ], [ 20 ] ]
        },
        foobar: [ 30 ]
      },
      qux: "quux"
    };
  });

  it("works", () => {
    assert(pluck(a, [ "foo", "*" ]) === a.foo);
    assert(pluck(a, [ "foo", "bar", "*" ]) === a.foo.bar);
    assert(pluck(a, [ "foo", "bar", "baz", "*" ]) === a.foo.bar.baz);
    assert(pluck(a, [ "foo", "qux", "*" ]) === null);
  });
});
