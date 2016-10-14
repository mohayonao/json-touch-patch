module.exports = function(patchFn) {
  return {
    fn() {
      const doc = { foo: [ "bar", "baz" ] };
      const patch = [
        { op: "add", path: "/foo/-", value: "qux0" },
        { op: "add", path: "/foo/-", value: "qux1" },
        { op: "add", path: "/foo/-", value: "qux2" },
        { op: "add", path: "/foo/-", value: "qux3" },
        { op: "add", path: "/foo/-", value: "qux4" },
        { op: "add", path: "/foo/-", value: "qux5" },
        { op: "add", path: "/foo/-", value: "qux6" },
        { op: "add", path: "/foo/-", value: "qux7" },
        { op: "add", path: "/foo/-", value: "qux8" },
        { op: "add", path: "/foo/-", value: "qux9" },
      ];

      patchFn(doc, patch);
    }
  };
};

if (require.main === module) {
  require("./_benchmark")(module.exports);
}
