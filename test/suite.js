"use strict";

require("run-with-mocha");

const assert = require("assert");
const specTests = require("json-patch-test-suite/spec_tests");
const tests = require("json-patch-test-suite/tests");
const touchPatch = require("../src");

describe("spec tests", () => {
  specTests.filter((test) => {
    return !test.disabled && !test.error && test.expected;
  }).forEach(({ comment, doc, patch, expected }) => {
    it(`${ comment || JSON.stringify(doc) }`, () => {
      const originalDoc = JSON.parse(JSON.stringify(doc));
      const actual = touchPatch(doc, patch);

      assert.deepEqual(actual, expected);
      assert.deepEqual(doc, originalDoc);
    });
  });

  specTests.filter((test) => {
    return !test.disabled && test.error;
  }).forEach(({ comment, doc, patch, error }) => {
    it(`${ comment || error }`, () => {
      assert.throws(() => {
        touchPatch(doc, patch);
      });
    });
  });
});

describe("tests", () => {
  tests.filter((test) => {
    return !test.disabled && !test.error && test.expected;
  }).forEach(({ comment, doc, patch, expected }) => {
    it(`${ comment || JSON.stringify(doc) }`, () => {
      const originalDoc = JSON.parse(JSON.stringify(doc));
      const actual = touchPatch(doc, patch);

      assert.deepEqual(actual, expected);
      assert.deepEqual(doc, originalDoc);
    });
  });

  tests.filter((test) => {
    return !test.disabled && test.error;
  }).forEach(({ comment, doc, patch, error }) => {
    it(`${ comment || error }`, () => {
      assert.throws(() => {
        touchPatch(doc, patch);
      });
    });
  });
});
