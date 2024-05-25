const fs = require("fs");
const path = require("path");

const defaultConfig = {
  targetPath: "./i18n",
};

const configPath = path.join(process.cwd(), "i18n-config.json");

fs.writeFile(
  configPath,
  JSON.stringify(defaultConfig, null, 2),
  "utf8",
  (err) => {
    if (err) {
      console.error("Failed to create configuration file:", err);
      process.exit(1);
    }
    console.log(`Configuration file created at ${configPath}`);
  }
);
