const fs = require("fs");
const benchmark = require("./_benchmark");

const benchTargets = fs.readdirSync(__dirname).filter(filename => /^[A-Z]-/.test(filename)).sort();

benchTargets.reduce((p, filename) => {
  return p.then(() => {
    return new Promise((resolve) => {
      global.console.log(`# ${ filename }`);
      benchmark(require(`./${ filename }`), () => {
        global.console.log();
        resolve();
      });
    });
  });
}, Promise.resolve());
