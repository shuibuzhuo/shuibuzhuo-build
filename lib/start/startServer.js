const chokidar = require("chokidar");
const path = require("path");

function runServer() {}

function runWatcher() {
  chokidar
    .watch(path.resolve(process.cwd(), "lib/start"))
    .on("all", (eventName, path) => {
      console.log(eventName, path);
    });
}

module.exports = function (arg, opts, cmd) {
  runServer();

  runWatcher();
};
