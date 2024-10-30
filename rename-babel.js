const fs = require("fs");

const [oldPath, newPath] = process.argv.slice(2);

fs.rename(oldPath, newPath, (err) => {
  if (err) {
    console.error(`Error renaming ${oldPath} to ${newPath}:`, err);
    process.exit(1);
  } else {
    console.log(`Successfully renamed ${oldPath} to ${newPath}`);
  }
});
