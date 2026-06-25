const fs = require("fs");
const path = require("path");

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Fix incorrect imports
  const patterns = [
    // Fix @mui/material/X imports (except styles and CssBaseline)
    {
      regex:
        /import\s+{([^}]*)}\s+from\s+['"]@mui\/material\/(?!styles|CssBaseline)[^'"]+['"]/g,
      replacement: (match) => {
        const imports = match.match(/{(.*)}/)[1];
        return `import {${imports}} from '@mui/material'`;
      },
    },
    // Fix specific component imports
    {
      regex: /import\s+(\w+)\s+from\s+['"]@mui\/material\/(\w+)['"]/g,
      replacement: (match, component, path) => {
        if (path !== "styles" && path !== "CssBaseline") {
          return `import ${component} from '@mui/material/${path}'`;
        }
        return match;
      },
    },
  ];

  patterns.forEach((pattern) => {
    const newContent = content.replace(pattern.regex, pattern.replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && file !== "node_modules") {
      walkDir(filePath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      fixImports(filePath);
    }
  });
}

walkDir("./src");
console.log("Import fixes completed!");
