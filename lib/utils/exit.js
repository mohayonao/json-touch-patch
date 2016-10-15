"use strict";

function exit(object, root, patch, opts) {
  opts.error = patch;
  return opts.partial ? root[""] : object;
}

module.exports = exit;
