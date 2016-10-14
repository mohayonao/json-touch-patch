/* eslint no-console: 0 */

const libs = require("./json-patch-libs");

function detectApplyType(patch) {
  const a = {
    matrix: [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ],
    vector: [ 10, 20 ]
  };
  const patches = [
    { op: "replace", path: "/matrix/1/1", value: 9 }
  ];
  const b = patch(a, patches);

  if (a.matrix[1][1] === 9) {
    return "apply";
  }

  if (a !== b &&
    a.matrix    !== b.matrix &&
    a.matrix[0] === b.matrix[0] &&
    a.matrix[1] !== b.matrix[1] &&
    a.matrix[2] === b.matrix[2] &&
    a.vector    === b.vector) {
    return "shallow-copy";
  }

  return "deep-copy";
}

Object.keys(libs).forEach((libName) => {
  const patchFn = libs[libName].normalizedPatchFn;

  console.log(`${ libs[libName].title }: ${ detectApplyType(patchFn) }`);
});
