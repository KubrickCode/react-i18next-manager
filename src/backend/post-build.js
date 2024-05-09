const fs = require("fs");
const path = require("path");

const rewriteImportsAndAddDirname = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      rewriteImportsAndAddDirname(fullPath);
    } else if (file.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/from\s+"(.+?)"/g, (match, p1) => {
        return p1.startsWith(".") && !p1.endsWith(".js")
          ? match.replace(p1, `${p1}.js`)
          : match;
      });

      if (file.name === "app.js" || file.name === "init.js") {
        const lastImportIndex = content.lastIndexOf("import");
        const endOfLastImport = content.indexOf("\n", lastImportIndex);
        const dirnameCode = `import { fileURLToPath } from 'url';\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));\n`;
        content =
          content.slice(0, endOfLastImport + 1) +
          dirnameCode +
          content.slice(endOfLastImport + 1);
      }

      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
};

rewriteImportsAndAddDirname(path.join(__dirname, "dist"));
