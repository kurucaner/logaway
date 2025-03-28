import fs from "fs";
import path from "path";
import assert from "assert";
import { fileURLToPath } from "url";
import { removeConsoleLogs } from "../src/index.js";
import {
  mockConsoleStatements,
  mockMultipleMethodsStatements,
} from "./test-cases.js";
import { printSummary } from "../src/print-summary.js";

// Get current directory (works in ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testConsoleLogRemoval() {
  const mockFilePath = path.join(__dirname, "mock.js");
  // Store original console.info to restore later
  const originalConsoleInfo = console.info;
  const consoleMessages = [];

  // Mock console.info to capture messages
  console.info = (...args) => {
    consoleMessages.push(args.join(" "));
    originalConsoleInfo(...args);
  };

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
    const result = await removeConsoleLogs(config);
    printSummary(result, config);
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

      // Check if the success message was displayed
      const successMessage =
        "All console statements have been removed successfully! 🎉";
      if (consoleMessages.some((msg) => msg === successMessage)) {
        console.info("✅ Test PASSED: Success message was displayed correctly");
      } else {
        console.error("❌ Test FAILED: Success message was not displayed");
        console.error("Expected message:", successMessage);
        console.error("Captured messages:", consoleMessages);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  } finally {
    // Restore original console.info
    console.info = originalConsoleInfo;

    // Clean up - remove the test file
    if (fs.existsSync(mockFilePath)) {
      fs.unlinkSync(mockFilePath);
      console.info("Cleaned up temporary test file");
    }
  }
}

async function testMultipleMethodsRemoval() {
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
    const result = await removeConsoleLogs(config);

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

async function testPreviewOption() {
  console.info("\n=== Testing preview option ===");
  const mockFilePath = path.join(__dirname, "mock-preview.js");

  try {
    // Create a temporary mock file with console.log examples
    fs.writeFileSync(mockFilePath, mockConsoleStatements, "utf8");
    console.info("Created temporary test file:", mockFilePath);

    // Store original content for later comparison
    const originalContent = fs.readFileSync(mockFilePath, "utf8");

    // Run the remover with preview option
    const config = {
      targetDir: __dirname,
      ignoredDirectories: [],
      ignoredFiles: ["test-cases.js", "index.test.js"],
      fileExtensions: [".js"],
      preview: true, // Use preview mode
      verbose: true,
      methods: ["log"],
    };

    // Run with preview option
    const result = await removeConsoleLogs(config);

    // Read the file content after processing
    const fileContent = fs.readFileSync(mockFilePath, "utf8");

    // Check that file content is unchanged
    if (fileContent !== originalContent) {
      console.error(
        "❌ Test FAILED: mock-preview.js was modified despite preview mode"
      );
      console.error("Expected file to remain unchanged");
      process.exit(1);
    } else {
      console.info(
        "✅ Test PASSED: mock-preview.js was not modified with preview option"
      );

      // Verify that the statistics correctly report what would have changed
      if (result.totalLogsRemoved > 0) {
        console.info(
          `✅ Test PASSED: Successfully detected ${result.totalLogsRemoved} console logs that would be removed`
        );
        console.info(
          `Stats: Checked ${result.filesChecked} files, would modify ${result.filesModified} files`
        );
      } else {
        console.error(
          "❌ Test FAILED: Failed to detect console logs in preview mode"
        );
        process.exit(1);
      }
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
    await testPreviewOption();
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

runAllTests();
