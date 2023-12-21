#!/usr/bin/env node
checkDebug();

const { program } = require("commander");
const pkg = require("../package.json");
const checkNode = require("../lib/checkNode");
const startServer = require("../lib/start/startServer");
const build = require("../lib/build/build");

const MIN_NODE_VERSION = "8.9.0";

function checkDebug() {
  if (process.argv.indexOf("--debug") >= 0 || process.argv.indexOf("-d") >= 0) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
}

(async () => {
  try {
    if (!checkNode(MIN_NODE_VERSION)) {
      throw new Error(
        "Please upgrade your node version to v" + MIN_NODE_VERSION
      );
    }

    program.version(pkg.version);

    program
      .command("start")
      .option("-c, --config <config>", "配置文件路径")
      .option("--stop-build", "停止启动服务")
      .option("--custom-webpack-path <customWebpackPath>", "自定义webpack路径")
      .description("start server by shuibuzhuo-build")
      .allowUnknownOption()
      .action(startServer);

    program
      .command("build")
      .option("-c, --config <config>", "配置文件路径")
      .option("--custom-webpack-path", "自定义webpack配置")
      .description("build project by shuibuzhuo-build")
      .allowUnknownOption()
      .action(build);

    program.option("-d, --debug", "开启调式模式");

    program.parse();
  } catch (error) {
    console.log(error.message);
  }
})();
