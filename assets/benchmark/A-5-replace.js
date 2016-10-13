module.exports = function(patchFn) {
  return {
    fn() {
      const doc = { baz: "qux", foo: "bar" };
      const patch = [
        { op: "replace", path: "/baz", value: "boo" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
