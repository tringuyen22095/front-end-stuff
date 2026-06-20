# Task2 Implementation Plan

## Requirement Understanding

Enhance the current HTML tag matcher so it can process multiple selected files, combine all extracted results into one output, optionally prefix every result line with a normalized URL prefix, and make the output easier to copy.

The browser page remains the main workflow, but the Node CLI/service should also be updated so browser and terminal behavior stay consistent.

## Confirmed Decisions

- Multiple selected files produce one combined output.
- Results do not need to be grouped by file name.
- Prefix applies to every result line when enabled, including full matched tag mode for consistency.
- Prefix joining should normalize slashes.
  - Example: `https://xx.knit.bid/` + `/static/abc` becomes `https://xx.knit.bid/static/abc`.
- If prefix checkbox is checked but prefix text is empty or only spaces, skip prefixing.
- Prefix text should be `.trim()` before use.
- Prefix values are saved only when the prefix checkbox is checked.
- Duplicate prefix values must not be added to localStorage.
- Copy-to-clipboard is required; using either a `pre` or `textarea` for display is acceptable.
- CLI/service should also support multi-file and prefix behavior.

## Browser UI Plan

Update `index.html`:

1. File input
   - Add `multiple`.
   - Keep existing accepted file types: `.html,.htm,.xml,.xhtml`.

2. Prefix controls
   - Add a checkbox for enabling prefix.
   - Add an autocomplete text field next to it.
   - Hide the text field when checkbox is unchecked.
   - Show the text field when checkbox is checked.
   - Use a native `<datalist>` for autocomplete unless a stronger custom combobox is needed.

3. localStorage
   - Use one localStorage key, for example `htmlTagMatcherPrefixes`.
   - On page load:
     - If the key is missing or invalid, initialize it as:

```json
["https://xx.knit.bid/"]
```

   - Populate the autocomplete list from that array.
   - On `Next`, if prefix checkbox is checked and trimmed prefix text is not empty:
     - Add it to the array only if it does not already exist.
     - Save the updated array as JSON.
     - Refresh autocomplete options.

4. Processing
   - Read every selected file with `FileReader`.
   - For each file:
     - Run `extractMatches(content, regexText, options)`.
     - Apply prefix transformation to each match when enabled and valid.
   - Combine all transformed matches into one output string.
   - Display one result per line.
   - Status text should report total matches across all files.

5. Output actions
   - Keep `Download output.txt`.
   - Add `Copy to clipboard` next to it.
   - Copy should copy the exact current output text.
   - If no matches exist, copy should not copy the `(no matches)` display placeholder.

## Shared Matching/Formatting Plan

Update `matcher.js` to include small pure helpers if useful:

```js
normalizePrefixValue(prefix, value)
applyPrefixToMatches(matches, prefix)
```

Expected behavior:

- `normalizePrefixValue('', value)` returns `value`.
- Empty or whitespace-only prefix skips prefixing.
- Slash normalization handles common URL/path joins:
  - `https://site.com/` + `/a` -> `https://site.com/a`
  - `https://site.com` + `/a` -> `https://site.com/a`
  - `https://site.com/` + `a` -> `https://site.com/a`
  - `https://site.com` + `a` -> `https://site.com/a`

Keeping this in `matcher.js` lets browser and CLI reuse the same behavior.

## Node Service Plan

Update `service.js`:

1. Add support for one or many file paths.
2. For each file path:
   - Read file content.
   - Extract matches.
   - Apply optional prefix.
3. Combine all matches into one output.
4. Write one `output.txt`.

Output location decision:

- If one file is processed, keep current behavior: write `output.txt` beside that file.
- If multiple files are processed, write `output.txt` in the current working directory.

This avoids choosing one input file's folder as the output folder when several files may come from different directories.

## CLI Plan

Update `cli.js` to accept multiple files and optional prefix without making the command too ambiguous.

Recommended CLI format:

```bash
node cli.js <regexText> [attributeName] [mode] [--prefix <prefix>] -- <filePath...>
```

Example:

```bash
node cli.js '<img[^>]*class="target-img"[^>]*>' src attribute --prefix 'https://xx.knit.bid/' -- ./sample.html ./html/page1.html
```

Concern:

The current CLI format is:

```bash
node cli.js <filePath> <regexText> [attributeName] [mode]
```

Supporting multiple files cleanly conflicts with this existing positional format. During implementation, either:

- preserve backward compatibility and add a second syntax for multi-file usage, or
- replace the CLI syntax and document the breaking change.

My recommendation is to preserve backward compatibility for existing single-file usage, and add a new `--files` or `--` based multi-file path.

## Validation Plan

1. Browser
   - Open `index.html`.
   - Confirm localStorage initializes with `["https://xx.knit.bid/"]`.
   - Select multiple sample HTML files.
   - Run the current image regex.
   - Confirm combined results contain matches from all selected files.
   - Enable prefix and choose `https://xx.knit.bid/`.
   - Confirm output URLs have normalized slashes.
   - Enter a new prefix, click `Next`, and confirm it is saved to localStorage.
   - Enter an existing prefix and confirm no duplicate is added.
   - Click `Copy to clipboard` and confirm copied text matches the output.
   - Click `Download output.txt` and confirm downloaded content matches output.

2. Node CLI
   - Run existing single-file command and confirm it still works.
   - Run multi-file command and confirm one combined `output.txt`.
   - Run prefix command and confirm slash normalization.

## Open Concern Before Implementation

The only remaining concern is the exact CLI argument format. Browser behavior is fully clear.

Recommended implementation choice:

- Keep existing CLI command working.
- Add a new multi-file CLI syntax using `--` before file paths.

Example:

```bash
node cli.js '<regexText>' src attribute --prefix 'https://xx.knit.bid/' -- file1.html file2.html
```
