#!/usr/bin/env node
const { program } = require("commander");

program.option("--first").option("-s --seperator <char>");

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.seperator, limit));
