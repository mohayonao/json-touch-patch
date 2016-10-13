module.exports = function(patchFn) {
  return {
    fn() {
      const doc =  { baz: "qux", foo: [ "a", 2, "c" ] };
      const patch = [
        { op: "test", path: "/baz", value: "qux" },
        { op: "test", path: "/foo/1", value: 2 },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
