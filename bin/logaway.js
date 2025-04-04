#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { removeConsoleLogs } from "../src/index.js";
import { printSummary } from "../src/print-summary.js";

import { cosmiconfigSync } from "cosmiconfig";

const DefaultValues = {
  targetDir: "./src",
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  methods: ["log"],
  reportFormat: "json",
};

const ModuleName = "logaway";
const explorerSync = cosmiconfigSync(ModuleName);
const searchResult = explorerSync.search();

const fileConfig = searchResult
  ? searchResult.config.default || searchResult.config
  : {};

if (fileConfig.ignoredDirs && Array.isArray(fileConfig.ignoredDirs)) {
  fileConfig.ignoredDirs = fileConfig.ignoredDirs;
} else if (
  fileConfig.ignoredDirs &&
  typeof fileConfig.ignoredDirs === "string"
) {
  fileConfig.ignoredDirs = fileConfig.ignoredDirs.split(",").filter(Boolean);
}

if (fileConfig.ignoredFiles && Array.isArray(fileConfig.ignoredFiles)) {
  fileConfig.ignoredFiles = fileConfig.ignoredFiles;
} else if (
  fileConfig.ignoredFiles &&
  typeof fileConfig.ignoredFiles === "string"
) {
  fileConfig.ignoredFiles = fileConfig.ignoredFiles.split(",").filter(Boolean);
}

if (fileConfig.extensions && Array.isArray(fileConfig.extensions)) {
  fileConfig.extensions = fileConfig.extensions;
} else if (fileConfig.extensions && typeof fileConfig.extensions === "string") {
  fileConfig.extensions = fileConfig.extensions.split(",").filter(Boolean);
}

if (fileConfig.methods && Array.isArray(fileConfig.methods)) {
  fileConfig.methods = fileConfig.methods;
} else if (fileConfig.methods && typeof fileConfig.methods === "string") {
  fileConfig.methods = fileConfig.methods.split(",").filter(Boolean);
}

// Parse command-line arguments with yargs
const cliOptions = yargs(hideBin(process.argv))
  .option("targetDir", {
    alias: "t",
    description: "Directory to process",
    type: "string",
    default: null,
  })
  .option("ignoredDirs", {
    alias: "d",
    description: "Directories to ignore",
    type: "string",
    array: true,
    default: null,
  })
  .option("ignoredFiles", {
    alias: "f",
    description: "Files to ignore",
    type: "string",
    array: true,
    default: null,
  })
  .option("extensions", {
    alias: "e",
    description: "File extensions to process",
    type: "string",
    default: null,
    array: true,
  })
  .option("preview", {
    alias: "p",
    description: "preview mode (no output)",
    type: "boolean",
    default: false,
  })
  .option("verbose", {
    alias: "v",
    description: "Show detailed information for each file",
    type: "boolean",
    default: false,
  })
  .option("methods", {
    alias: "m",
    description: "Console methods to remove (comma-separated)",
    type: "string",
    default: null,
    array: true,
  })
  .option("prettier", {
    description: "Format modified files with Prettier",
    type: "boolean",
    default: false,
  })
  .option("reportFormat", {
    alias: "rf",
    description: "Report file format",
    choices: ["json", "csv", null],
    type: "string",
    default: null,
  })
  .option("reportPath", {
    alias: "rp",
    description: "Report file path",
    type: "string",
    default: null,
  })
  .help()
  .alias("help", "h")
  .config(fileConfig).argv;

const mergedConfig = {
  ...DefaultValues,
  ...Object.fromEntries(
    Object.entries(cliOptions).filter(([key, value]) => {
      // $ is used by yargs, _ are args not matched by yargs
      return (
        value !== undefined && !key.startsWith("$") && !key.startsWith("_")
      );
    })
  ),
};

const configObj = {
  targetDir: mergedConfig.targetDir,
  ignoredDirectories: mergedConfig.ignoredDirs,
  ignoredFiles: mergedConfig.ignoredFiles,
  fileExtensions: mergedConfig.extensions,
  preview: mergedConfig.preview,
  verbose: mergedConfig.verbose,
  methods: mergedConfig.methods,
  prettier: mergedConfig.prettier,
  reportFormat: mergedConfig.reportFormat,
  reportPath: mergedConfig.reportPath,
};

// Check if target directory exists before starting the process
if (!fs.existsSync(configObj.targetDir)) {
  console.error(
    `Error: Target directory "${configObj.targetDir}" does not exist.`
  );
  console.log(
    "Please provide a valid directory path using --targetDir option."
  );
  process.exit(1);
} else {
  console.log(
    `${configObj.preview ? "[DRY RUN] " : ""}Starting to process ${
      configObj.targetDir
    }...`
  );
  if (configObj.verbose || configObj.preview) {
    console.log(
      `Ignored directories: ${
        configObj.ignoredDirectories?.length
          ? configObj.ignoredDirectories?.join(", ")
          : "None"
      }`
    );
    console.log(
      `Ignored files: ${
        configObj.ignoredFiles?.length
          ? configObj.ignoredFiles?.join(", ")
          : "None"
      }`
    );
    console.log(`File extensions: ${configObj.fileExtensions.join(", ")}`);
  }

  try {
    const stats = await removeConsoleLogs(configObj);
    printSummary(stats, configObj);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
