module.exports = function(patchFn) {
  return {
    fn() {
      const doc = { foo: "bar" };
      const patch = [
        { op: "add", path: "/baz", value: "qux" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
