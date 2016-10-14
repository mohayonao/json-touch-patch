/* eslint-disable */

const benchmark = require("benchmark");
const libs = require("../json-patch-libs");
const noop = () => {};

module.exports = function(setup, done = noop) {
  const suite = new benchmark.Suite();

  Object.keys(libs).forEach((libName) => {
    const opts = Object.assign({
      patchFn: libs[libName].patchFn,
      setup() {
        const patchFn = this.patchFn;
      },
    }, setup(libs[libName].patchFn));

    suite.add(libs[libName].title, opts);
  });

  suite.on("complete", (e) => {
    const results = Array.from(e.currentTarget).sort((a, b) => b.hz - a.hz);

    results.forEach((bench) => {
      console.log(format(bench.toString()));
    });

    done();
  });

  suite.on("error", (e) => {
    console.error(e);
  });

  suite.run({ async: true });
};

function format(result) {
  result = result.replace(/x \d[\d,]+/, (m) => {
    return `x ${ " ".repeat(Math.max(0, 12 - m.length)) }${ m.slice(2) }`;
  });
  return result;
}
