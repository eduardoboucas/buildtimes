const fs = require("fs");
const baseDir = "posts-legacy";
const files = fs.readdirSync(baseDir);

files.forEach(file => {
  const baseName = file.split(".").shift();
  const directory = `${baseDir}/${baseName}`;

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.renameSync(`${baseDir}/${file}`, `${directory}/${file}`);
});
