#!/usr/bin/env node
const { program } = require("commander");
const pkg = require("../package.json");
const checkNode = require("../lib/checkNode");
const startServer = require("../lib/start/startServer");
const build = require("../lib/build/build");

const MIN_NODE_VERSION = "8.9.0";

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
      .description("start server by shuibuzhuo-build")
      .allowUnknownOption()
      .action(startServer);

    program
      .command("build")
      .description("build project by shuibuzhuo-build")
      .allowUnknownOption()
      .action(build);

    program.parse();
  } catch (error) {
    console.log(error.message);
  }
})();
