#!/usr/bin/env node
const { Command } = require("commander");
const pkg = require("../package.json");
const checkNode = require("../lib/checkNode");

const MIN_NODE_VERSION = "8.9.0";

(async () => {
  try {
    if (!checkNode(MIN_NODE_VERSION)) {
      throw new Error(
        "Please upgrade your node version to v" + MIN_NODE_VERSION
      );
    }
  } catch (error) {
    console.log(error.message);
  }
})();
