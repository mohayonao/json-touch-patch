"use strict";

require("run-with-mocha");

const assert = require("assert");
const touchPatch = require("../src");

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

describe("touch", () => {
  it("noop", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, []);
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

  it("add", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "add", path: "/matrix/1/-", value: 9 },
    ]);
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 3, 4, 5, 9 ],
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

  it("replace", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "replace", path: "/matrix/1/1", value: 9 },
    ]);
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 3, 9, 5 ],
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

  it("remove", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "remove", path: "/matrix/1/1" },
    ]);
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 3,    5 ],
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

  it("move", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "move", path: "/matrix/0", from: "/matrix/1" },
    ]);
    const expected = {
      matrix: [
        [ 3, 4, 5 ],
        [ 0, 1, 2 ],
        [ 6, 7, 8 ],
      ],
      vector: [ 10, 20 ],
    };

    assert.deepEqual(actual, expected);
    assert(doc !== actual);
    assert(doc.matrix[0] !== actual.matrix[0]);
    assert(doc.matrix[1] !== actual.matrix[1]);
    assert(doc.matrix[2] === actual.matrix[2]);
    assert(doc.matrix[0] === actual.matrix[1]);
    assert(doc.matrix[1] === actual.matrix[0]);
    assert(doc.vector === actual.vector);
  });

  it("copy", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "copy", path: "/matrix/2", from: "/matrix/1" },
    ]);
    const expected = {
      matrix: [
        [ 0, 1, 2 ],
        [ 3, 4, 5 ],
        [ 3, 4, 5 ],
        [ 6, 7, 8 ],
      ],
      vector: [ 10, 20 ],
    };

    assert.deepEqual(actual, expected);
    assert(doc !== actual);
    assert(doc.matrix[0] === actual.matrix[0]);
    assert(doc.matrix[1] === actual.matrix[1]);
    assert(doc.matrix[2] !== actual.matrix[2]);
    assert(doc.matrix[2] === actual.matrix[3]);
    assert(actual.matrix[1] === actual.matrix[2]);
    assert(doc.vector === actual.vector);
  });

  it("not move", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "move", path: "/matrix/1", from: "/matrix/1" },
    ]);
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

  it("not copy", () => {
    const doc = createDoc();
    const actual = touchPatch(doc, [
      { op: "copy", path: "/matrix/1", from: "/matrix/1" },
    ]);
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