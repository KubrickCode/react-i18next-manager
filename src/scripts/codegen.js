const fs = require("fs");
const path = require("path");

// Define directories
const backendDir = path.join(__dirname, "../nest/src");
const frontendDir = path.join(__dirname, "../frontend/src/core/codegen");

// Ensure the frontend codegen directory exists
if (!fs.existsSync(frontendDir)) {
  fs.mkdirSync(frontendDir, { recursive: true });
}

// Function to transform DTO content
function transformDto(content) {
  // Remove import lines at the start of the file
  let lines = content.split("\n");
  let importEndIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") {
      importEndIndex = i;
      break;
    }
  }
  lines = lines.slice(importEndIndex);

  let transformed = lines.join("\n");

  // Remove decorators and related lines
  transformed = transformed.replace(/@\w+\(([^()]*)\)/g, "");
  transformed = transformed.replace(/@\w+/g, "");
  transformed = transformed.replace(/\(\(\) => [\w\d]+\)/g, "");

  // Replace UUID with string
  transformed = transformed.replace(/\bUUID\b/g, "string");

  // Replace class with type
  transformed = transformed.replace(/\bclass\b/g, "type");
  transformed = transformed.replace(/(?<=type\s+\w+\s+){/g, " = {");

  // Trim leading and trailing whitespace from each line
  transformed = transformed
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // Remove multiple consecutive empty lines
  transformed = transformed.replace(/\n\s*\n/g, "\n");

  return transformed;
}

// Function to recursively read files in a directory
function readFilesRecursively(dir, fileCallback, finishCallback) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return finishCallback(err);
    }

    let pending = files.length;
    if (!pending) return finishCallback(null);

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(`Error stating file: ${err}`);
          return finishCallback(err);
        }

        if (stat && stat.isDirectory()) {
          readFilesRecursively(filePath, fileCallback, (err) => {
            if (!--pending) finishCallback(err);
          });
        } else {
          fileCallback(filePath);
          if (!--pending) finishCallback(null);
        }
      });
    });
  });
}

// Function to handle each DTO file
function handleDtoFile(filePath) {
  if (filePath.endsWith("dto.ts")) {
    const frontendFilePath = path.join(frontendDir, path.basename(filePath));

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath} from disk: ${err}`);
        return;
      }

      const transformedData = transformDto(data);

      fs.writeFile(frontendFilePath, transformedData, "utf8", (err) => {
        if (err) {
          console.error(`Error writing file ${filePath} to disk: ${err}`);
        } else {
          console.log(
            `DTO file ${filePath} has been transformed and saved to frontend directory`
          );
        }
      });
    });
  }
}

// Start reading files from the backend directory
readFilesRecursively(backendDir, handleDtoFile, (err) => {
  if (err) {
    console.error(`Error during file processing: ${err}`);
  } else {
    console.log("All files have been processed.");
  }
});
