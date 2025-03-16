import fs from "fs";
import path from "path";
import assert from "assert";
import { fileURLToPath } from "url";
import { removeConsoleLogs } from "../src/index.js";
import {
  mockConsoleStatements,
  mockMultipleMethodsStatements,
} from "./test-cases.js";

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
      ignoredFiles: ["test-cases.js", "index.test.js"],
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

function testMultipleMethodsRemoval() {
  console.info("\n=== Testing multiple console methods removal ===");
  const mockFilePath = path.join(__dirname, "mock-methods.js");

  try {
    // Create a temporary mock file with various console method examples
    fs.writeFileSync(mockFilePath, mockMultipleMethodsStatements, "utf8");
    console.info("Created temporary test file:", mockFilePath);

    // Run the remover with multiple methods
    const config = {
      targetDir: __dirname,
      ignoredDirectories: [],
      ignoredFiles: ["test-cases.js", "index.test.js"],
      fileExtensions: [".js"],
      dryRun: false,
      verbose: true,
      methods: ["log", "error", "warn", "info", "debug"], // Test all methods
    };

    // Remove console statements
    const result = removeConsoleLogs(config);

    // Read the file content after processing
    const fileContent = fs.readFileSync(mockFilePath, "utf8");

    // Check if there's any content left (excluding whitespace)
    if (fileContent.trim().length > 0) {
      console.error(
        "❌ Test FAILED: mock-methods.js still contains characters after processing"
      );
      console.error("Remaining content:", fileContent);
      process.exit(1);
    } else {
      console.info(
        "✅ Test PASSED: mock-methods.js was completely cleaned of all console methods"
      );

      // Verify specific method counts
      const { methodStats } = result;
      assert.strictEqual(
        methodStats.log,
        11,
        "Should remove 11 console.log statements"
      );
      assert.strictEqual(
        methodStats.error,
        8,
        "Should remove 8 console.error statements"
      );
      assert.strictEqual(
        methodStats.warn,
        7,
        "Should remove 7 console.warn statements"
      );
      assert.strictEqual(
        methodStats.info,
        8,
        "Should remove 8 console.info statements"
      );
      assert.strictEqual(
        methodStats.debug,
        6,
        "Should remove 6 console.debug statements"
      );

      console.info("✅ Test PASSED: Method counts verified correctly");
      console.info("Method breakdown:", methodStats);
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

async function runAllTests() {
  try {
    await testConsoleLogRemoval();
    await testMultipleMethodsRemoval();
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

runAllTests();
