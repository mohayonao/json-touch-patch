/* eslint-disable */

const createLargeMatrix = new Function(`
  return ${ JSON.stringify(
    Array.from({ length: 25 }, () => {
      return Array.from({ length: 25 }, () => {
        return Array.from({ length: 25, }).fill(0);
      });
    })
  ) };
`);

module.exports = function(patchFn) {
  return {
    createLargeMatrix,
    setup() {
      const patchFn = this.patchFn;
      const createLargeMatrix = this.createLargeMatrix;
    },
    fn() {
      const doc = {
        matrix: createLargeMatrix()
      };
      const patch = [
        { op: "replace", path: "/matrix/5/10/20", value: 1 },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
