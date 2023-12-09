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

  // const buffer = cp.execSync(
  //   `node ${path.resolve(__dirname, "./DevService.js")} --force`
  // );

  // console.log(buffer.toString());

  // const child = cp.spawn("node", [
  //   path.resolve(__dirname, "./DevService.js"),
  //   "--force",
  // ]);

  // child.stdout.on("data", function (data) {
  //   console.log("stdout data", data.toString());
  // });
  // child.stderr.on("data", function (data) {
  //   console.log("strerr data", data.toString());
  // });
  // child.stdout.on("error", function (err) {
  //   console.log("error err", err);
  // });
  // child.stdout.on("close", function (code) {
  //   console.log("close code", code);
  // });

  const scriptPath = path.resolve(__dirname, "./DevService.js");
  const child = cp.fork(scriptPath);
  child.on("message", (data) => {
    console.log("data from child", data);
  });
  child.send("hello from main process");
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
