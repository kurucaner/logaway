import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { removeConsoleLogs } from "../src/index.js";
import { mockConsoleStatements } from "./test-cases.js";

// Get current directory (works in ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function testConsoleLogRemoval() {
  const mockFilePath = path.join(__dirname, "mock.js");

  try {
    // Create a temporary mock file with console.log examples
    fs.writeFileSync(mockFilePath, mockConsoleStatements, "utf8");
    console.info("Created temporary test file:", mockFilePath);

    // Run the console.log remover on just this file
    const config = {
      targetDir: __dirname,
      ignoredDirectories: [],
      ignoredFiles: ["test-cases.js"], // Make sure mock.js is not ignored
      fileExtensions: [".js"],
      dryRun: false,
      verbose: true,
    };

    // Remove console logs
    const result = removeConsoleLogs(config);

    // Read the file content after processing
    const fileContent = fs.readFileSync(mockFilePath, "utf8");

    // Check if there's any content left (excluding whitespace)
    if (fileContent.trim().length > 0) {
      console.error(
        "❌ Test FAILED: mock.js still contains characters after processing"
      );
      console.error("Remaining content:", fileContent);
      process.exit(1);
    } else {
      console.info(
        "✅ Test PASSED: mock.js was completely cleaned of console.logs"
      );
      console.info(
        `Stats: Checked ${result.filesChecked} files, modified ${result.filesModified}, removed ${result.totalLogsRemoved} logs`
      );
    }
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  } finally {
    // Clean up - remove the test file
    if (fs.existsSync(mockFilePath)) {
      fs.unlinkSync(mockFilePath);
      console.info("Cleaned up temporary test file");
    }
  }
}

// Run the test
testConsoleLogRemoval();
