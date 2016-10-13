/* eslint-disable */

const testSuite = require("json-patch-test-suite/tests");
const libs = require("../json-patch-libs");

const okTestSuite = testSuite.filter((testItem) => {
  return Object.keys(libs).every((libName) => {
    const testItem2 = JSON.parse(JSON.stringify(testItem));
    const patchFn = libs[libName].patchFn;
    try {
      patchFn(testItem2.doc, testItem2.patch);
    } catch (e) {
      return false;
    }
    return true;
  });
});

for (let i = 0; i < okTestSuite.length; i++) {
  okTestSuite[i].compiledDoc = JSON.stringify(okTestSuite[i].doc);
}

module.exports = function(patchFn) {
  return {
    testSuite: okTestSuite,
    setup() {
      const patchFn = this.patchFn;
      const testSuite = this.testSuite;
      const numberOfTestSuites = testSuite.length;
    },
    fn() {
      for (let i = 0; i < numberOfTestSuites; i++) {
        patchFn(JSON.parse(testSuite[i].compiledDoc), testSuite[i].patch);
      }
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
