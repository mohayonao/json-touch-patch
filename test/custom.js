"use strict";

require("run-with-mocha");

const assert = require("assert");
const touchPatch = require("..");

function createDoc() {
  return {
    matrix: [
      [ 0, 1, 2 ],
      [ 3, 4, 5 ],
      [ 6, 7, 8 ],
    ],
    vector: [ 10, 20 ],
  };
}

describe("custom", () => {
  it("@increment", () => {
    const doc = createDoc();
    const custom = {
      "@increment": (api, patch) => {
        return api.replace(patch.path, api.get(patch.path) + patch.value);
      },
    };
    const actual = touchPatch(doc, [
      { op: "@increment", path: "/matrix/1/1", value: 2 },
    ], { custom });
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 3, 6, 5 ],
        [ 6, 7, 8 ],
      ],
      vector: [ 10, 20 ],
    };

    assert.deepEqual(actual, expected);
    assert(doc !== actual);
    assert(doc.matrix[0] === actual.matrix[0]);
    assert(doc.matrix[1] !== actual.matrix[1]);
    assert(doc.matrix[2] === actual.matrix[2]);
    assert(doc.vector === actual.vector);
  });

  it("@map", () => {
    const doc = createDoc();
    const custom = {
      "@map": (api, patch) => {
        return api.replace(patch.path, api.get(patch.path).map(patch.map));
      },
    };
    const actual = touchPatch(doc, [
      { op: "@map", path: "/matrix/1", map: (x) => x * 10 },
    ], { custom });
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 30, 40, 50 ],
        [ 6, 7, 8 ],
      ],
      vector: [ 10, 20 ],
    };

    assert.deepEqual(actual, expected);
    assert(doc !== actual);
    assert(doc.matrix[0] === actual.matrix[0]);
    assert(doc.matrix[1] !== actual.matrix[1]);
    assert(doc.matrix[2] === actual.matrix[2]);
    assert(doc.vector === actual.vector);
  });

  it("@fail", () => {
    const doc = createDoc();
    const custom = {
      "@fail": () => {
        return "failed!";
      },
    };
    const actual = touchPatch(doc, [
      { op: "replace", path: "/matrix/1/1", value: 9 },
      { op: "@fail" },
    ], { custom });
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 3, 4, 5 ],
        [ 6, 7, 8 ],
      ],
      vector: [ 10, 20 ],
    };

    assert.deepEqual(actual, expected);
    assert(doc === actual);
  });
});
