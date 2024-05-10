const fs = require("fs-extra");
const path = require("path");

const copyBuildFiles = async () => {
  const frontendDir = path.join(__dirname, "../frontend/dist");
  const backendDir = path.join(__dirname, "../backend/dist/src");
  const targetDir = path.join(__dirname, "dist");

  try {
    await fs.ensureDir(targetDir);
    await fs.copy(frontendDir, targetDir, {
      overwrite: true,
    });
    await fs.copy(backendDir, targetDir, {
      overwrite: true,
    });
    console.log("Successfully copied build files!");
  } catch (error) {
    console.error("Failed to copy files:", error);
    process.exit(1);
  }
};

copyBuildFiles();
