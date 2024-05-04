const fs = require("fs");
const path = require("path");

const rewriteImports = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      rewriteImports(fullPath);
    } else if (file.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/from\s+"(.+?)"/g, (match, p1) => {
        if (p1.startsWith(".") && !p1.endsWith(".js")) {
          return match.replace(p1, `${p1}.js`);
        }
        return match;
      });
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
};

rewriteImports(path.join(__dirname, "dist"));
