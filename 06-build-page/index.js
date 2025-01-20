const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const assetsDir = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');

const outputPath = path.join(projectDistPath, 'index.html');
const bundlePath = path.join(projectDistPath, 'style.css');
const copiedAssetsDir = path.join(projectDistPath, 'assets');

const createHtml = async () => {
  let template = await fs.promises.readFile(templatePath, 'utf-8');
  const componentFiles = await fs.promises.readdir(componentsPath);
  for (let file of componentFiles) {
    const fileName = path.basename(file, '.html');
    const filePath = path.join(componentsPath, file);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    template = template.replace(`{{${fileName}}}`, fileContent);
  }
  await fs.promises.writeFile(outputPath, template);
};

const getStyles = () => {
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
};

const getAssets = async (assets, copiedAssets) => {
  await fs.promises.mkdir(copiedAssets, { recursive: true });
  const files = await fs.promises.readdir(assets, { withFileTypes: true });
  for (let file of files) {
    const from = path.join(assets, file.name);
    const to = path.join(copiedAssets, file.name);
    if (file.isFile()) {
      fs.promises.copyFile(from, to);
    } else {
      await getAssets(from, to);
    }
  }
};

const buildPage = async () => {
  createHtml();
  await fs.promises.rm(copiedAssetsDir, { recursive: true, force: true });
  getAssets(assetsDir, copiedAssetsDir);
  getStyles();
};

fs.promises.mkdir(projectDistPath, { recursive: true });
buildPage();
