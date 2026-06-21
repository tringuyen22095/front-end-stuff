const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// txt file in same folder
const FILE_NAME = "output.txt";

// output folder
const OUTPUT_DIR = "downloads";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// read txt file
const urls = fs
  .readFileSync(FILE_NAME, "utf-8")
  .split("\n")
  .map(line => line.trim())
  .filter(Boolean);

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    // get filename from url
    let fileName = path.basename(parsedUrl.pathname);

    // fallback if no filename
    if (!fileName || fileName === "/") {
      fileName = `file-${Date.now()}`;
    }

    const filePath = path.join(OUTPUT_DIR, fileName);

    const protocol = parsedUrl.protocol === "https:" ? https : http;

    const file = fs.createWriteStream(filePath);

    protocol.get(url, response => {
      // handle redirect
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        file.close();
        fs.unlinkSync(filePath);

        return resolve(downloadFile(response.headers.location));
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Downloaded: ${fileName}`);
        resolve();
      });
    }).on("error", err => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const url of urls) {
    try {
      console.log(`Downloading: ${url}`);
      await downloadFile(url);
    } catch (err) {
      console.error(`Failed: ${url}`);
      console.error(err.message);
    }
  }

  console.log("Done.");
}

main();