"use strict";

require("run-with-mocha");

const assert = require("assert");
const createAPI = require("../../lib/utils/createAPI");
const pluck = require("../../lib/utils/pluck");
const deepEqual = require("../../lib/utils/deepEqual");
const shallowCopy = require("../../lib/utils/shallowCopy");
const toKeys = require("../../lib/utils/toKeys");

describe("utils/createAPI", () => {
  let a, api;

  beforeEach(() => {
    a = { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } };
    api = createAPI(a, pluck);
  });

  it("get(path)", () => {
    assert(api.get("/matrix/1/1") === 4);
    assert(api.get("/matrix/9/0") === undefined);
  });

  it("add(path, value)", () => {
    const value = 9;

    assert(!api.add("/matrix/1/1", value));
    assert.deepEqual(a, { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, value, 4, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } });
  });

  it("remove(path)", () => {
    assert(!api.remove("/matrix/1/1"));
    assert.deepEqual(a, { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } });
  });

  it("replace(path, value)", () => {
    const value = 9;

    assert(!api.replace("/matrix/1/1", value));
    assert.deepEqual(a, { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, value, 5 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } });
  });

  it("move(from, path)", () => {
    assert(!api.move("/matrix/2/0", "/matrix/1/-"));
    assert.deepEqual(a, { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5, 6 ], [ 7, 8 ] ],
      vector: [ 10, 20 ]
    } });
  });

  it("copy(from, path)", () => {
    assert(!api.copy("/matrix/2/0", "/matrix/1/-"));
    assert.deepEqual(a, { "": {
      matrix: [ [ 0, 1, 2 ], [ 3, 4, 5, 6 ], [ 6, 7, 8 ] ],
      vector: [ 10, 20 ]
    } });
  });

  it("test(path, expected)", () => {
    assert(!api.test("/vector", [ 10, 20 ]));
  });

  it("utils", () => {
    assert(api.deepEqual === deepEqual);
    assert(api.shallowCopy === shallowCopy);
    assert(api.toKeys = toKeys);
  });
});
