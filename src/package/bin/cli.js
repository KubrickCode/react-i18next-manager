#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

program.version("0.3.9");

program
  .command("studio")
  .description("Start the server")
  .action(() => {
    const configFilePath = path.join(process.cwd(), "i18n-config.json");
    if (!fs.existsSync(configFilePath)) {
      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        "i18n-config.json file not found. Do you want to create it? (y/n): ",
        (answer) => {
          if (answer.toLowerCase() === "y") {
            console.log("Creating i18n-config.json file...");
            execSync("npx @kubrick/react-i18next-manager init", {
              stdio: "inherit",
            });
            require("../dist/main.js");
          } else {
            console.log(
              "Please create the i18n-config.json file and restart the server."
            );
            process.exit(1);
          }
          rl.close();
        }
      );
    } else {
      require("../dist/main.js");
    }
  });

program
  .command("init")
  .description("Initialize configuration")
  .action(() => {
    require("./init.js");
  });

program.parse(process.argv);
