function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAttributeValue(tag, attributeName) {
  const pattern = new RegExp(
    `\\b${escapeRegex(attributeName)}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i'
  );
  const match = tag.match(pattern);
  if (!match) {
    return null;
  }
  return match[1] ?? match[2] ?? match[3] ?? null;
}

function extractMatches(content, regexText, options = {}) {
  const {
    flags = 'gi',
    mode = 'attribute',
    attributeName = 'src',
  } = options;

  const regex = new RegExp(regexText, flags);
  const results = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const matchedTag = match[0];

    if (mode === 'full') {
      results.push(matchedTag);
      continue;
    }

    const value = getAttributeValue(matchedTag, attributeName);
    if (value !== null) {
      results.push(value);
    }
  }

  return results;
}

function normalizePrefixValue(prefix, value) {
  if (typeof prefix !== 'string' || !prefix.trim()) {
    return value;
  }
  const p = prefix.trim().replace(/\/+$/, '');
  const v = value.replace(/^\/+/, '');
  return `${p}/${v}`;
}

function applyPrefixToMatches(matches, prefix) {
  if (typeof prefix !== 'string' || !prefix.trim()) {
    return matches;
  }
  return matches.map(match => normalizePrefixValue(prefix, match));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractMatches, normalizePrefixValue, applyPrefixToMatches };
}
