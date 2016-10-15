const rightPad = require("right-pad");
const FAST_JSON_PATCH = require("fast-json-patch");
const JSON_PATCH = require("json-patch");
const JSONPATCH = require("jsonpatch");
const JIFF = require("jiff");
const JSON8_PATCH = require("json8-patch");
const RFC6902 = require("rfc6902");
const JSON_TOUCH_PATCH = require("..");

const libs = module.exports = {
  "fast-json-patch": {
    applyType: "apply",
    patchFn: FAST_JSON_PATCH.apply,
    normalizedPatchFn: ((patchFn) => {
      return (object, patches) => {
        patchFn(object, patches);
        return object;
      };
    })(FAST_JSON_PATCH.apply),
  },
  "json-patch": {
    applyType: "apply",
    patchFn: JSON_PATCH.apply,
    normalizedPatchFn: ((patchFn) => {
      return (object, patches) => {
        patchFn(object, patches);
        return object;
      };
    })(JSON_PATCH.apply),
  },
  "jsonpatch": {
    applyType: "shallow-copy & appy",
    patchFn: JSONPATCH.apply_patch,
    normalizedPatchFn: ((patchFn) => {
      return (object, patches) => {
        return patchFn(object, patches);
      };
    })(JSONPATCH.apply_patch),
  },
  "jiff": {
    applyType: "deep-copy & apply",
    patchFn: ((patchFn) => {
      return (object, patches) => patchFn.patch(patches, object);
    })(JIFF),
    normalizedPatchFn: ((patchFn) => {
      return (object, patches) => patchFn.patch(patches, object);
    })(JIFF),
  },
  "json8-patch": {
    applyType: "apply",
    patchFn: JSON8_PATCH.apply,
    normalizedPatchFn: ((patchFn) => {
      return (object, patches) => patchFn(object, patches).doc;
    })(JSON8_PATCH.apply),
  },
  "rfc6902": {
    applyType: "apply",
    patchFn: RFC6902.applyPatch,
    normalizedPatchFn: ((patchFn) => {
      return (object, patches) => {
        patchFn(object, patches);
        return object;
      };
    })(RFC6902.applyPatch)
  },
  "<json-touch-patch>": {
    applyType: "shallow-copy & appy",
    patchFn: JSON_TOUCH_PATCH,
    normalizedPatchFn: JSON_TOUCH_PATCH,
  },
};

const maxLen = Object.keys(libs).reduce((a, b) => Math.max(a, b.length), 0);

Object.keys(libs).forEach((libName) => {
  const applyType = libs[libName].applyType.charAt(0).toUpperCase();
  const padLibName = rightPad(libName, maxLen);
  libs[libName].title = `[${ applyType }] ${ padLibName }`;
});
