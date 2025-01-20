const fs = require('fs');
const path = require('path');

const copyDir = path.join(__dirname, 'files-copy');
const dir = path.join(__dirname, 'files');
console.log(dir);
fs.rm(copyDir, { recursive: true, force: true }, (err) => {
  if (err) throw console.log(err);
  fs.mkdir(copyDir, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) throw console.log(err);
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(dir, file.name);
          const copyPath = path.join(copyDir, file.name);
          fs.copyFile(filePath, copyPath, (err) => {
            if (err) throw console.error(err);
          });
        }
      });
    });
  });
});
