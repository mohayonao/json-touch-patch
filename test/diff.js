"use strict";

require("run-with-mocha");

const assert = require("assert");
const specTests = require("json-patch-test-suite/spec_tests");
const tests = require("json-patch-test-suite/tests");
const diff = require("fast-json-patch").compare;
const touchPatch = require("../src");

describe("spec tests", () => {
  specTests.filter((test) => {
    return !test.disabled && !test.error && test.expected;
  }).forEach(({ comment, doc, expected }) => {
    it(`${ comment || JSON.stringify(doc) }`, () => {
      const originalDoc = JSON.parse(JSON.stringify(doc));
      const actual = touchPatch(doc, diff(doc, expected));

      assert.deepEqual(actual, expected);
      assert.deepEqual(doc, originalDoc);
    });
  });
});

describe("tests", () => {
  tests.filter((test) => {
    return !test.disabled && !test.error && test.expected;
  }).forEach(({ comment, doc, expected }) => {
    it(`${ comment || JSON.stringify(doc) }`, () => {
      const originalDoc = JSON.parse(JSON.stringify(doc));
      const actual = touchPatch(doc, diff(doc, expected));

      assert.deepEqual(actual, expected);
      assert.deepEqual(doc, originalDoc);
    });
  });
});
