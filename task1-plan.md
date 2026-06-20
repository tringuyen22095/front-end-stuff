# Task1 Implementation Plan

## Requirement Understanding

Build a simple JavaScript/HTML utility that finds matching HTML/XML tags from a file using a raw JavaScript regex string, then extracts either a specific attribute value or the full matched tag.

The final solution will be split into 3 JavaScript/HTML files:

1. `matcher.js`
   - Shared matching/extraction logic.
   - Can be reused by browser code and Node.js code.
   - Does not read or write files directly.

2. `service.js`
   - Node.js service layer.
   - Reads an HTML/XML file from disk by `filePath`.
   - Calls `matcher.js` to find matches.
   - Writes results to `output.txt`.

3. `index.html`
   - Simple Bootstrap 5 page.
   - Can be opened directly in a browser.
   - Lets user choose a file, enter regex, choose extraction mode, and enter attribute name.
   - Browser can preview matches and optionally download output, but cannot write `output.txt` beside the selected file directly because browsers do not allow unrestricted filesystem writes.

A small CLI runner is also useful for actually creating `output.txt` from Terminal. I will add it as `cli.js`, because `service.js` exports logic but does not execute itself.

## Agreed Decisions

- Use Node.js for real file reading/writing.
- No web server.
- Bootstrap 5 CDN is accepted.
- Regex input is a raw JavaScript regex string, not `/regex/flags` format.
- Regex flags default to `gi`:
  - `g`: find all matches.
  - `i`: case-insensitive matching.
- Output file name is always `output.txt`.
- Add extraction mode switch:
  - `attribute`: extract a named attribute value.
  - `full`: output the full matched tag.
- Add attribute name input, default value `src`.

## Important Browser Limitation

A browser page opened directly from `index.html` can read the selected file content with `FileReader`, but it cannot write `output.txt` into the same folder as the selected file.

Therefore:

- Browser mode can preview matches and trigger a downloaded txt file.
- CLI/Node mode can create `output.txt` on disk.

## Planned Files

### `matcher.js`

Responsible for pure extraction logic.

Expected API:

```js
extractMatches(content, regexText, options)
```

Where `options` contains:

```js
{
  flags: 'gi',
  mode: 'attribute',
  attributeName: 'src'
}
```

Behavior:

- Compile `regexText` using `new RegExp(regexText, flags)`.
- Match all tags from file content.
- If mode is `full`, return each full matched tag.
- If mode is `attribute`, parse each matched tag and return the selected attribute value.
- Ignore matched tags that do not contain the selected attribute.

### `service.js`

Responsible for Node.js filesystem behavior.

Expected API:

```js
processFile(filePath, regexText, options)
```

Behavior:

- Read file content from `filePath`.
- Call `extractMatches` from `matcher.js`.
- Write one result per line into `output.txt` in the same base directory as `filePath`.
- Return basic processing summary, such as output path and match count.

### `cli.js`

Responsible for Terminal usage.

Expected command format:

```bash
node cli.js <filePath> <regexText> [attributeName] [mode]
```

Example:

```bash
node cli.js ./sample.html '<img[^>]*class="target-img"[^>]*>' src attribute
```

Expected result:

```text
./output.txt
```

The output file will contain extracted values, one per line.

### `index.html`

Responsible for browser UI.

UI fields:

- File input for HTML/XML file.
- Text input for raw regex.
- Text input for attribute name, default `src`.
- Switch/select for mode:
  - Extract attribute.
  - Full matched tag.
- Next button.
- Loading spinner while processing.
- Results preview area.
- Optional download button for generated txt content.

Layout:

- Bootstrap 5 CDN.
- Centered form horizontally and vertically.
- Simple, clean form controller style.

### `sample.html`

Acceptance-test sample file.

Content should include:

- At least 5 `img` tags.
- Same class attribute on those images.
- Different `src` values.
- Other tags like `div`, `p`, `ul`, `li`.

Example regex for testing:

```text
<img[^>]*class="target-img"[^>]*>
```

Expected output for attribute `src`:

```text
images/photo-1.jpg
images/photo-2.jpg
images/photo-3.jpg
images/photo-4.jpg
images/photo-5.jpg
```

## Terminal Commands

Run CLI extraction:

```bash
node cli.js ./sample.html '<img[^>]*class="target-img"[^>]*>' src attribute
```

Run full-tag extraction:

```bash
node cli.js ./sample.html '<img[^>]*class="target-img"[^>]*>' src full
```

View output:

```bash
cat output.txt
```

Open browser page directly:

```bash
open index.html
```

If `open` is unavailable, manually open `index.html` in a browser.

## Validation Plan

1. Create `sample.html` with 5 matching image tags.
2. Run CLI command in attribute mode.
3. Confirm `output.txt` contains exactly 5 `src` values.
4. Run CLI command in full mode.
5. Confirm `output.txt` contains the full matched image tags.
6. Open `index.html` in browser.
7. Upload `sample.html`, enter the same regex, and confirm preview results match CLI behavior.

## Implementation Order

1. Build `matcher.js` pure extraction logic.
2. Build `service.js` Node file read/write wrapper.
3. Build `cli.js` command-line runner.
4. Build `index.html` Bootstrap UI and browser preview flow.
5. Build `sample.html` acceptance-test fixture.
6. Run CLI validation and verify `output.txt`.
