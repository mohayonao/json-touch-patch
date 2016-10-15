var _deepEqual = require("deep-equal");
var strict = { strict: true };

function deepEqual(a, b) {
  return _deepEqual(a, b, strict);
}

module.exports = deepEqual;
