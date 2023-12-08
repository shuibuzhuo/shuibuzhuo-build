const chokidar = require("chokidar");
const path = require("path");
const cp = require("child_process");

function runServer() {
  console.log("runServer pid", process.pid);
  // cp.execFile(
  //   "node",
  //   [path.resolve(__dirname, "./DevService.js"), "--force"],
  //   {},
  //   (err, stdout) => {
  //     if (!err) {
  //       console.log(stdout);
  //     } else {
  //       console.log(err);
  //     }
  //   }
  // );

  // cp.exec(
  //   `node ${path.resolve(__dirname, "./DevService.js")} --force`,
  //   (err, stdout) => {
  //     if (!err) {
  //       console.log(stdout);
  //     } else {
  //       console.log(err);
  //     }
  //   }
  // );

  const buffer = cp.execSync(
    `node ${path.resolve(__dirname, "./DevService.js")} --force`
  );

  console.log(buffer.toString());
}

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
