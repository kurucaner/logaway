import test from "node:test";
import assert from "assert";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

// Mock https.request
const originalRequest = https.request;
let mockResponse = null;

test("Version Check Tests", async (t) => {
  t.beforeEach(() => {
    // Reset mock response before each test
    mockResponse = null;
  });

  t.afterEach(() => {
    // Restore original https.request after each test
    https.request = originalRequest;
  });

  await t.test(
    "Should show update message when newer version is available",
    async () => {
      // Mock a newer version response
      mockResponse = {
        version: "999.999.999",
      };

      // Mock https.request
      https.request = (options, callback) => {
        const mockRes = {
          on: (event, handler) => {
            if (event === "data") {
              handler(JSON.stringify(mockResponse));
            }
            if (event === "end") {
              handler();
            }
          },
        };
        callback(mockRes);
        return {
          on: () => {},
          end: () => {},
        };
      };

      // Capture console.log output
      const originalConsoleLog = console.log;
      let logOutput = "";
      console.log = (...args) => {
        logOutput += args.join(" ") + "\n";
      };

      // Import and run the check
      const { checkForUpdates } = await import("../bin/logaway.js");
      await checkForUpdates();

      // Restore console.log
      console.log = originalConsoleLog;

      // Verify the output
      assert.ok(logOutput.includes("A new version of logaway is available"));
      assert.ok(logOutput.includes(`Current version: ${packageJson.version}`));
      assert.ok(logOutput.includes("Latest version: 999.999.999"));
    }
  );

  await t.test("Should not show message when versions match", async () => {
    // Mock same version response
    mockResponse = {
      version: packageJson.version,
    };

    // Mock https.request
    https.request = (options, callback) => {
      const mockRes = {
        on: (event, handler) => {
          if (event === "data") {
            handler(JSON.stringify(mockResponse));
          }
          if (event === "end") {
            handler();
          }
        },
      };
      callback(mockRes);
      return {
        on: () => {},
        end: () => {},
      };
    };

    // Capture console.log output
    const originalConsoleLog = console.log;
    let logOutput = "";
    console.log = (...args) => {
      logOutput += args.join(" ") + "\n";
    };

    // Import and run the check
    const { checkForUpdates } = await import("../bin/logaway.js");
    await checkForUpdates();

    // Restore console.log
    console.log = originalConsoleLog;

    // Verify no update message was shown
    assert.strictEqual(logOutput, "");
  });

  await t.test("Should handle network errors gracefully", async () => {
    // Mock network error
    https.request = (options, callback) => {
      return {
        on: (event, handler) => {
          if (event === "error") {
            handler(new Error("Network error"));
          }
        },
        end: () => {},
      };
    };

    // Capture console.log output
    const originalConsoleLog = console.log;
    let logOutput = "";
    console.log = (...args) => {
      logOutput += args.join(" ") + "\n";
    };

    // Import and run the check
    const { checkForUpdates } = await import("../bin/logaway.js");
    await checkForUpdates();

    // Restore console.log
    console.log = originalConsoleLog;

    // Verify no error message was shown
    assert.strictEqual(logOutput, "");
  });
});
