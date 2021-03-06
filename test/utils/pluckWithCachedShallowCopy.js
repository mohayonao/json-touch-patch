"use strict";

require("run-with-mocha");

const assert = require("assert");
const pluckWithCachedShallowCopy = require("../../lib/utils/pluckWithCachedShallowCopy");

describe("utils/pluckWithCachedShallowCopy", () => {
  let a, cache;

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
    cache = new Set();
  });

  it("works", () => {
    const a_foo = a.foo;
    const a_foo_bar = a.foo.bar;
    const a_foo_foobar = a.foo.foobar;
    const a_foo_bar_baz = a.foo.bar.baz;
    const a_foo_bar_baz_1 = a.foo.bar.baz[1];
    const a_qux = a.qux;
    const actual = pluckWithCachedShallowCopy(a, [ "foo", "bar", "baz", "0", "*" ], cache);

    assert(actual === a.foo.bar.baz[0]);
    assert(a.foo !== a_foo);
    assert(a.foo.bar !== a_foo_bar);
    assert(a.foo.bar.baz !== a_foo_bar_baz);
    assert(a.foo.bar.baz[1] === a_foo_bar_baz_1);
    assert(a.foo.foobar === a_foo_foobar);
    assert(a.qux === a_qux);
  });

  it("works with cache", () => {
    const a_foo = a.foo;
    const a_foo_bar = a.foo.bar;
    const a_foo_foobar = a.foo.foobar;
    const a_foo_bar_baz = a.foo.bar.baz;
    const a_foo_bar_baz_1 = a.foo.bar.baz[1];
    const a_qux = a.qux;
    const actual = pluckWithCachedShallowCopy(a, [ "foo", "bar", "baz", "1", "*" ], cache);

    assert(actual === a.foo.bar.baz[1]);
    assert(a.foo === a_foo);
    assert(a.foo.bar === a_foo_bar);
    assert(a.foo.bar.baz === a_foo_bar_baz);
    assert(a.foo.bar.baz[1] !== a_foo_bar_baz_1);
    assert(a.foo.foobar === a_foo_foobar);
    assert(a.qux === a_qux);
  });
});
