const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

const outputFile = (filePath, file) => {
  fs.stat(filePath, (err, stat) => {
    if (err) throw console.log(err);
    const fileExtension = path.extname(file.name).slice(1);
    const fileName = file.name.replace(path.extname(file.name), '');
    const fileStats = (stat.size / 1024).toFixed(3);

    console.log(`${fileName} - ${fileExtension} - ${fileStats}kb`);
  });
};

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw console.error(err);
  files.forEach((file) => {
    if (file.isFile()) {
      const pathToFile = path.join(file.path, file.name);
      outputFile(pathToFile, file);
    }
  });
});
