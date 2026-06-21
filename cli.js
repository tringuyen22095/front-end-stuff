const { processFiles } = require('./service');

const args = process.argv.slice(2);
const hasDoubleDash = args.includes('--');

let regexText = null;
let attributeName = 'src';
let mode = 'attribute';
let prefix = null;
let filePaths = [];

if (hasDoubleDash) {
  const dashIndex = args.indexOf('--');
  filePaths = args.slice(dashIndex + 1);

  const beforeDash = args.slice(0, dashIndex);
  if (beforeDash.length > 0) {
    regexText = beforeDash[0];
  }

  const positional = [];
  for (let i = 1; i < beforeDash.length; i++) {
    if (beforeDash[i] === '--prefix') {
      prefix = beforeDash[i + 1] || null;
      i++;
    } else {
      positional.push(beforeDash[i]);
    }
  }

  if (positional.length > 0) {
    attributeName = positional[0];
  }
  if (positional.length > 1) {
    mode = positional[1];
  }
} else {
  const filePath = args[0];
  regexText = args[1];
  attributeName = args[2] || 'src';
  mode = args[3] || 'attribute';
  if (filePath) {
    filePaths = [filePath];
  }
}

if (filePaths.length === 0 || !regexText) {
  console.error('Usage (Single File): node cli.js <filePath> <regexText> [attributeName] [mode]');
  console.error('Usage (Multi File):  node cli.js <regexText> [attributeName] [mode] [--prefix <prefix>] -- <filePath...>');
  process.exit(1);
}

const result = processFiles(filePaths, regexText, {
  attributeName,
  mode,
  prefix,
});

console.log(result.outputPath);
