const fs = require("fs");
const path = require("path");

const materialPath = path.join(__dirname, "node_modules", "@mui", "material");
const iconsPath = path.join(
  __dirname,
  "node_modules",
  "@mui",
  "icons-material",
);

console.log("Checking MUI installations...");

if (fs.existsSync(materialPath)) {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(materialPath, "package.json"), "utf8"),
  );
  console.log(`@mui/material version: ${packageJson.version}`);

  // Check exports
  console.log("Exports:", Object.keys(packageJson.exports || {}));

  // Check if esm exists
  const hasEsm = fs.existsSync(path.join(materialPath, "esm"));
  console.log(`Has esm folder: ${hasEsm}`);
} else {
  console.log("@mui/material not found in node_modules");
}

if (fs.existsSync(iconsPath)) {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(iconsPath, "package.json"), "utf8"),
  );
  console.log(`@mui/icons-material version: ${packageJson.version}`);
} else {
  console.log("@mui/icons-material not found in node_modules");
}
