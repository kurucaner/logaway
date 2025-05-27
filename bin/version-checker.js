import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);
const currentVersion = packageJson.version;

export async function checkForUpdates() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "registry.npmjs.org",
      path: "/logaway/latest",
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const latestVersion = JSON.parse(data).version;
          if (latestVersion !== currentVersion) {
            console.log("\n📦 A new version of logaway is available!");
            console.log(`Current version: ${currentVersion}`);
            console.log(`Latest version: ${latestVersion}`);
            console.log('Run "npm install -g logaway" to update\n');
          }
          resolve();
        } catch {
          // Silently fail - don't interrupt the user's workflow
          resolve();
        }
      });
    });

    req.on("error", () => {
      // Silently fail - don't interrupt the user's workflow
      resolve();
    });

    req.end();
  });
}
