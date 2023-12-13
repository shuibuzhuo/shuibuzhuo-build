const chokidar = require("chokidar");
const path = require("path");
const cp = require("child_process");
const { getConfigFile } = require("../utils");
const log = require("../utils/log");

let child;
function runServer(args = {}) {
  const { config = "" } = args;

  const scriptPath = path.resolve(__dirname, "./DevService.js");
  child = cp.fork(scriptPath, ["--port 8080", "--config " + config]);

  child.on("exit", (code) => {
    if (code) {
      process.exit(code);
    }
  });
}

function onChange() {
  log.verbose("config changed!");
  child.kill();
  runServer();
}

function runWatcher() {
  const configPath = getConfigFile();
  chokidar
    .watch(configPath)
    .on("change", onChange)
    .on("error", (error) => {
      console.error("file watch error!", error);
      process.exit(1);
    });
}

module.exports = function (opts, cmd) {
  runServer(opts);

  runWatcher();
};
