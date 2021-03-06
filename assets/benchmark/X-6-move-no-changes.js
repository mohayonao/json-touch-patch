module.exports = function(patchFn) {
  return {
    fn() {
      const doc = {
        foo: { bar: "baz", waldo: "fred" },
        qux: { corge: "grault" },
      };
      const patch = [
        { op: "move", from: "/foo/waldo", path: "/foo/waldo" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
