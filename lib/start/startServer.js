const chokidar = require("chokidar");
const path = require("path");
const cp = require("child_process");

let child;
function runServer() {
  const scriptPath = path.resolve(__dirname, "./DevService.js");
  child = cp.fork(scriptPath, ["--port 8080"]);

  child.on("exit", (code) => {
    if (code) {
      process.exit(code);
    }
  });
}

function onChange() {
  console.log("config changed!");
  child.kill();
  runServer();
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
