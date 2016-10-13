"use strict";

require("run-with-mocha");

const assert = require("assert");
const specTests = require("json-patch-test-suite/spec_tests");
const tests = require("json-patch-test-suite/tests");
const touchPatch = require("../src");

describe("spec tests", () => {
  describe("patch", () => {
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
  });

  describe("{ strict: true } throw error", () => {
    specTests.filter((test) => {
      return !test.disabled && test.error;
    }).forEach(({ comment, doc, patch, error }) => {
      it(`${ comment || error }`, () => {
        const originalDoc = JSON.parse(JSON.stringify(doc));

        assert.throws(() => {
          touchPatch(doc, patch, { strict: true });
        });

        assert.deepEqual(doc, originalDoc);
      });
    });
  });

  describe("{ strict: false } revert silently when throw error", () => {
    specTests.filter((test) => {
      return !test.disabled && test.error;
    }).forEach(({ comment, doc, patch, error, expected }) => {
      it(`${ comment || error }`, () => {
        const originalDoc = JSON.parse(JSON.stringify(doc));
        let actual = null;

        assert.doesNotThrow(() => {
          actual = touchPatch(doc, patch);
        });
        assert.deepEqual(actual, expected || doc);
        assert.deepEqual(doc, originalDoc);
      });
    });
  });
});

describe("tests", () => {
  describe("patch", () => {
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
  });

  describe("{ strict: true } throw error", () => {
    tests.filter((test) => {
      return !test.disabled && test.error;
    }).forEach(({ comment, doc, patch, error }) => {
      it(`${ comment || error }`, () => {
        const originalDoc = JSON.parse(JSON.stringify(doc));

        assert.throws(() => {
          touchPatch(doc, patch, { strict: true });
        });

        assert.deepEqual(doc, originalDoc);
      });
    });
  });

  describe("{ strict: false } revert silently when throw error", () => {
    tests.filter((test) => {
      return !test.disabled && test.error;
    }).forEach(({ comment, doc, patch, error, expected }) => {
      it(`${ comment || error }`, () => {
        const originalDoc = JSON.parse(JSON.stringify(doc));
        let actual = null;

        assert.doesNotThrow(() => {
          actual = touchPatch(doc, patch);
        });
        assert.deepEqual(actual, expected || doc);
        assert.deepEqual(doc, originalDoc);
      });
    });
  });
});
