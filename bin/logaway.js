#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { removeConsoleLogs, printSummary } from "../src/index.js";

// Parse command-line arguments with yargs
const config = yargs(hideBin(process.argv))
  .option("targetDir", {
    alias: "t",
    description: "Directory to process",
    type: "string",
    default: "./src",
  })
  .option("ignoredDirs", {
    alias: "d",
    description: "Directories to ignore",
    type: "string",
    default: "",
    coerce: (val) => val.split(",").filter(Boolean),
  })
  .option("ignoredFiles", {
    alias: "f",
    description: "Files to ignore",
    type: "string",
    default: "",
    coerce: (val) => val.split(",").filter(Boolean),
  })
  .option("extensions", {
    alias: "e",
    description: "File extensions to process",
    type: "string",
    default: ".js,.jsx,.ts,.tsx",
    coerce: (val) => val.split(",").filter(Boolean),
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
    default: "log",
    coerce: (val) => val.split(",").filter(Boolean),
  })
  .help()
  .alias("help", "h").argv;

const configObj = {
  targetDir: config.targetDir,
  ignoredDirectories: config.ignoredDirs,
  ignoredFiles: config.ignoredFiles,
  fileExtensions: config.extensions,
  preview: config.preview,
  verbose: config.verbose,
  methods: config.methods,
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
        configObj.ignoredDirectories.length
          ? configObj.ignoredDirectories.join(", ")
          : "None"
      }`
    );
    console.log(
      `Ignored files: ${
        configObj.ignoredFiles.length
          ? configObj.ignoredFiles.join(", ")
          : "None"
      }`
    );
    console.log(`File extensions: ${configObj.fileExtensions.join(", ")}`);
  }

  try {
    const stats = removeConsoleLogs(configObj);
    printSummary(stats, configObj);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
