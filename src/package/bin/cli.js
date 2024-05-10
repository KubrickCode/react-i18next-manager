#!/usr/bin/env node

const { program } = require("commander");

program.version("0.3.9");

program
  .command("studio")
  .description("Start the Express server")
  .action(() => {
    require("../dist/main.js");
  });

program
  .command("init")
  .description("Initialize configuration")
  .action(() => {
    require("../dist/init.js");
  });

program.parse(process.argv);
