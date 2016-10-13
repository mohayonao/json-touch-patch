module.exports = function(patchFn) {
  return {
    fn() {
      const doc = {
        foo: [ "all", "grass", "cows", "eat" ]
      };
      const patch = [
        { op: "move", from: "/foo/1", path: "/foo/3" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
