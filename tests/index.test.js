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

async function testMultipleDirectories() {
  console.info("\n=== Testing multiple target directories ===");

  const testDir1 = path.join(__dirname, "testdir1");
  const testDir2 = path.join(__dirname, "testdir2");
  const mockFile1 = path.join(testDir1, "mock1.js");
  const mockFile2 = path.join(testDir2, "mock2.js");

  try {
    // Create test directories
    fs.mkdirSync(testDir1, { recursive: true });
    fs.mkdirSync(testDir2, { recursive: true });

    // Create mock files with console statements
    fs.writeFileSync(mockFile1, mockConsoleStatements, "utf8");
    fs.writeFileSync(mockFile2, mockMultipleMethodsStatements, "utf8");

    console.info("Created test directories and files");

    // Test with array of target directories
    const config = {
      targetDir: [testDir1, testDir2], // Array of directories
      ignoredDirectories: [],
      ignoredFiles: [],
      fileExtensions: [".js"],
      preview: false,
      verbose: true,
      methods: ["log", "error", "warn", "info", "debug"],
    };

    // Remove console statements from both directories
    const result = await removeConsoleLogs(config);

    // Read the file contents after processing
    const fileContent1 = fs.readFileSync(mockFile1, "utf8");
    const fileContent2 = fs.readFileSync(mockFile2, "utf8");

    // Check if both files are cleaned
    if (fileContent1.trim().length > 0 || fileContent2.trim().length > 0) {
      console.error(
        "❌ Test FAILED: Files still contain content after processing"
      );
      console.error("File 1 remaining content:", fileContent1);
      console.error("File 2 remaining content:", fileContent2);
      process.exit(1);
    } else {
      console.info(
        "✅ Test PASSED: All files in multiple directories were cleaned"
      );
      console.info(
        `Stats: Checked ${result.filesChecked} files, modified ${result.filesModified}, removed ${result.totalLogsRemoved} logs`
      );

      // Verify that files from both directories were processed
      const dir1Files = result.fileStats.filter((file) =>
        file.path.includes("mock1.js")
      );
      const dir2Files = result.fileStats.filter((file) =>
        file.path.includes("mock2.js")
      );

      if (dir1Files.length === 1 && dir2Files.length === 1) {
        console.info(
          "✅ Test PASSED: Files from both directories were processed"
        );
      } else {
        console.error(
          "❌ Test FAILED: Not all directories were processed correctly"
        );
        console.error("File stats:", result.fileStats);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  } finally {
    // Clean up - remove test directories and files
    if (fs.existsSync(mockFile1)) fs.unlinkSync(mockFile1);
    if (fs.existsSync(mockFile2)) fs.unlinkSync(mockFile2);
    if (fs.existsSync(testDir1)) fs.rmdirSync(testDir1);
    if (fs.existsSync(testDir2)) fs.rmdirSync(testDir2);
    console.info("Cleaned up test directories and files");
  }
}

async function runAllTests() {
  try {
    await testConsoleLogRemoval();
    await testMultipleMethodsRemoval();
    await testPreviewOption();
    await testMultipleDirectories();
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

runAllTests();
