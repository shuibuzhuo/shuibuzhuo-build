const chokidar = require("chokidar");
const path = require("path");

function runServer() {}

function onChange() {
  console.log("change");
}

function runWatcher() {
  const configPath = path.resolve(__dirname, "./config.json");
  chokidar
    .watch(configPath)
    .on("change", onChange)
    .on("error", (error) => {
      console.error("file watch error!", error);
      process.exit(1);
    });
}

module.exports = function (arg, opts, cmd) {
  runServer();

  runWatcher();
};
