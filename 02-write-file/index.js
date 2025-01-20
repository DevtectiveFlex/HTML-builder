const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;
const textFilePath = path.join(__dirname, 'text.txt');

const createTextFile = () => {
  fs.writeFile(textFilePath, '', (err) => {
    if (err) throw console.error(err);
  });
};
const rl = readline.createInterface(stdin, stdout);

createTextFile();
stdout.write('Write your text in console\n');
process.on('exit', () => stdout.write('Goodbye!'));
process.on('SIGINT', () => {
  process.exit();
});

const outputStream = fs.createWriteStream(textFilePath, 'utf-8');
rl.on('line', (data) => {
  if (data.trim().toLowerCase() === 'exit') {
    process.exit();
  }
  outputStream.write(data);
});
