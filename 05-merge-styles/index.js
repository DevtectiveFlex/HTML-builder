const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(bundlePath, 'utf-8');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) throw console.error(err);
  const cssfiles = files.filter((file) => {
    if (file.isFile()) {
      return path.extname(file.name).toLowerCase() === '.css';
    }
  });
  cssfiles.forEach((file) => {
    const filePath = path.join(file.path, file.name);
    const readStream = fs.createReadStream(filePath, 'utf-8');
    readStream.pipe(writeStream);
  });
});
