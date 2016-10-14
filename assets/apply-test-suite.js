/* eslint no-console: 0 */

const assert = require("assert");
const testSuite = require("json-patch-test-suite/tests")
const libs = require("./json-patch-libs");

const okTestSuite = testSuite.filter((test) => {
  return !test.disabled && !test.error && test.expected;
});

Object.keys(libs).forEach((libName) => {
  const patchFn = libs[libName].normalizedPatchFn;
  const failed = JSON.parse(JSON.stringify(okTestSuite)).reduce((count, testItem) => {
    try {
      assert.deepEqual(patchFn(testItem.doc, testItem.patch), testItem.expected);
    } catch (e) {
      // console.log(libName, JSON.stringify(testItem), e.message);
      return count + 1;
    }
    return count;
  }, 0);

  console.log(`${ libs[libName].title }: ${ failed } failed / ${ okTestSuite.length } tests`);
});
