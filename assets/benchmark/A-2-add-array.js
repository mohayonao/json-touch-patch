module.exports = function(patchFn) {
  return {
    fn() {
      const doc = { foo: [ "bar", "baz" ] };
      const patch = [
        { op: "add", path: "/foo/1", value: "qux" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
