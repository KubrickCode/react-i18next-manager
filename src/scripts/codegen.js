const fs = require("fs");
const path = require("path");

// Define directories
const backendDir = path.join(__dirname, "../backend/src");
const frontendDir = path.join(__dirname, "../frontend/src/core/codegen");

// Function to transform DTO content
function transformDto(content) {
  // Remove import lines at the start of the file
  let lines = content.split("\n");
  let importEndIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "") {
      importEndIndex = i + 1; // include the empty line
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
    const frontendFileName = path.basename(filePath).replace(".ts", ".tsx");
    const frontendFilePath = path.join(frontendDir, frontendFileName);

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
          updateIndexFile(frontendFileName);
        }
      });
    });
  }
}

// Function to update the index.tsx file
function updateIndexFile(fileName) {
  const indexPath = path.join(frontendDir, "index.tsx");
  const exportStatement = `export * from "./${fileName.replace(
    ".tsx",
    ""
  )}";\n`;

  fs.appendFile(indexPath, exportStatement, (err) => {
    if (err) {
      console.error(`Error updating index.tsx file: ${err}`);
    } else {
      console.log(`index.tsx has been updated with ${fileName}`);
    }
  });
}

// Clear the codegen directory before starting
function clearCodegenDir() {
  fs.rmdirSync(frontendDir, { recursive: true });
  fs.mkdirSync(frontendDir, { recursive: true });
  console.log("codegen directory has been cleared.");
}

// Clear the index.tsx file before starting
function clearIndexFile() {
  const indexPath = path.join(frontendDir, "index.tsx");
  fs.writeFile(indexPath, "", (err) => {
    if (err) {
      console.error(`Error clearing index.tsx file: ${err}`);
    } else {
      console.log("index.tsx has been cleared.");
    }
  });
}

// Start reading files from the backend directory
clearCodegenDir();
clearIndexFile();
readFilesRecursively(backendDir, handleDtoFile, (err) => {
  if (err) {
    console.error(`Error during file processing: ${err}`);
  } else {
    console.log("All files have been processed.");
  }
});
