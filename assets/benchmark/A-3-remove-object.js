module.exports = function(patchFn) {
  return {
    fn() {
      const doc = { baz: "qux", foo: "bar" };
      const patch = [
        { op: "remove", path: "/baz" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
