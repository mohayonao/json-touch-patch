module.exports = function(patchFn) {
  return {
    fn() {
      const doc = { foo: [ "bar", "qux", "baz" ] };
      const patch = [
        { op: "remove", path: "/foo/1" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
