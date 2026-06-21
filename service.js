const fs = require('fs');
const path = require('path');
const { extractMatches, applyPrefixToMatches } = require('./matcher');

function processFiles(filePaths, regexText, options = {}) {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  const { prefix } = options;

  let allMatches = [];
  for (const filePath of paths) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = extractMatches(content, regexText, options);
    allMatches = allMatches.concat(matches);
  }

  if (prefix) {
    allMatches = applyPrefixToMatches(allMatches, prefix);
  }

  let outputPath;
  if (paths.length === 1) {
    // If one file is processed, keep current behavior: write output.txt beside that file.
    const baseDir = path.dirname(path.resolve(paths[0]));
    outputPath = path.join(baseDir, 'output.txt');
  } else {
    // If multiple files are processed, write output.txt in the current working directory.
    outputPath = path.join(process.cwd(), 'output.txt');
  }

  const output = allMatches.length > 0 ? `${allMatches.join('\n')}\n` : '';
  fs.writeFileSync(outputPath, output, 'utf8');

  return {
    outputPath,
    matchCount: allMatches.length,
    matches: allMatches,
  };
}

function processFile(filePath, regexText, options = {}) {
  return processFiles([filePath], regexText, options);
}

module.exports = { processFiles, processFile };
