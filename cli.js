const { processFile } = require('./service');

const [, , filePath, regexText, attributeName = 'src', mode = 'attribute'] = process.argv;

if (!filePath || !regexText) {
  console.error('Usage: node cli.js <filePath> <regexText> [attributeName] [mode]');
  process.exit(1);
}

const result = processFile(filePath, regexText, {
  attributeName,
  mode,
});

console.log(result.outputPath);
