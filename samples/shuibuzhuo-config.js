const path = require("path");

const entry = "src/index.js";
module.exports = {
  entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
  plugins: ["shuibuzhuo-build-test"],
};
