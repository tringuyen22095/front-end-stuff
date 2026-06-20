const fs = require('fs');
const path = require('path');
const { extractMatches } = require('./matcher');

function processFile(filePath, regexText, options = {}) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = extractMatches(content, regexText, options);
  const baseDir = path.dirname(path.resolve(filePath));
  const outputPath = path.join(baseDir, 'output.txt');
  const output = matches.length > 0 ? `${matches.join('\n')}\n` : '';

  fs.writeFileSync(outputPath, output, 'utf8');

  return {
    outputPath,
    matchCount: matches.length,
    matches,
  };
}

module.exports = { processFile };
