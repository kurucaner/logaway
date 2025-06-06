#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import { removeConsoleLogs } from "../src/index.js";
import { printSummary } from "../src/print-summary.js";
import { arrayHasLength, isArray } from "../src/utils.js";
import { cosmiconfigSync } from "cosmiconfig";
import { checkForUpdates } from "./version-checker.js";

const DefaultValues = {
  targetDir: "./",
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  methods: ["log"],
  reportFormat: "",
  reportPath: "",
  preview: false,
  prettier: false,
  verbose: false,
  ignoredDirs: [],
  ignoredFiles: [],
};

const ModuleName = "logaway";
const explorerSync = cosmiconfigSync(ModuleName);
const searchResult = explorerSync.search();

const fileConfig = searchResult
  ? searchResult.config.default || searchResult.config
  : {};

if (fileConfig.ignoredDirs && isArray(fileConfig.ignoredDirs)) {
  fileConfig.ignoredDirs = fileConfig.ignoredDirs;
} else if (
  fileConfig.ignoredDirs &&
  typeof fileConfig.ignoredDirs === "string"
) {
  fileConfig.ignoredDirs = fileConfig.ignoredDirs.split(",").filter(Boolean);
}

if (fileConfig.ignoredFiles && isArray(fileConfig.ignoredFiles)) {
  fileConfig.ignoredFiles = fileConfig.ignoredFiles;
} else if (
  fileConfig.ignoredFiles &&
  typeof fileConfig.ignoredFiles === "string"
) {
  fileConfig.ignoredFiles = fileConfig.ignoredFiles.split(",").filter(Boolean);
}

if (fileConfig.extensions && isArray(fileConfig.extensions)) {
  fileConfig.extensions = fileConfig.extensions;
} else if (fileConfig.extensions && typeof fileConfig.extensions === "string") {
  fileConfig.extensions = fileConfig.extensions.split(",").filter(Boolean);
}

if (fileConfig.methods && isArray(fileConfig.methods)) {
  fileConfig.methods = fileConfig.methods;
} else if (fileConfig.methods && typeof fileConfig.methods === "string") {
  fileConfig.methods = fileConfig.methods.split(",").filter(Boolean);
}

// Parse command-line arguments with yargs
const cliOptions = yargs(hideBin(process.argv))
  .command("init", "Create a default configuration file", {}, async () => {
    const configFiles = [
      "logaway.config.js",
      ".logawayrc.json",
      ".logawayrc.yaml",
      ".logawayrc.yml",
      ".logawayrc",
    ];

    // Check for existing config files
    const existingConfigs = configFiles.filter((file) =>
      fs.existsSync(path.join(process.cwd(), file))
    );

    // Check for package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      if (packageJson.logaway) {
        existingConfigs.push("package.json (logaway field)");
      }
    }

    if (existingConfigs.length > 0) {
      console.error("Error: Configuration already exists in:");
      existingConfigs.forEach((config) => console.error(`- ${config}`));
      process.exit(1);
    }

    const defaultConfig = {
      targetDir: "./",
      ignoredDirs: ["node_modules", "dist", "build"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      methods: ["log", "debug"],
      prettier: true,
    };

    try {
      const configPath = path.join(process.cwd(), ".logawayrc.json");
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 1));
      process.exit(0);
    } catch (error) {
      console.error("Error creating configuration file:", error.message);
      process.exit(1);
    }
  })
  .option("targetDir", {
    alias: "t",
    description: "Directory to process",
    type: "string",
    default: undefined,
  })
  .option("ignoredDirs", {
    alias: "d",
    description: "Directories to ignore",
    type: "string",
    array: true,
    default: [],
  })
  .option("ignoredFiles", {
    alias: "f",
    description: "Files to ignore",
    type: "string",
    array: true,
    default: [],
  })
  .option("extensions", {
    alias: "e",
    description: "File extensions to process",
    type: "string",
    default: [],
    array: true,
  })
  .option("preview", {
    alias: "p",
    description: "preview mode (no output)",
    type: "boolean",
    default: undefined,
  })
  .option("verbose", {
    alias: "v",
    description: "Show detailed information for each file",
    type: "boolean",
    default: undefined,
  })
  .option("methods", {
    alias: "m",
    description: "Console methods to remove (comma-separated)",
    type: "string",
    default: [],
    array: true,
  })
  .option("prettier", {
    description: "Format modified files with Prettier",
    type: "boolean",
    default: undefined,
  })
  .option("reportFormat", {
    alias: "rf",
    description: "Report file format",
    choices: ["json", "csv", null],
    type: "string",
    default: undefined,
  })
  .option("reportPath", {
    alias: "rp",
    description: "Report file path",
    type: "string",
    default: undefined,
  })
  .help()
  .alias("help", "h")
  .config(fileConfig).argv;

// Only run the main logic if we're not in init command
if (cliOptions._[0] === "init") {
  console.log("init command");
  process.exit(0);
}

// Check for updates before processing
await checkForUpdates();

const mergedConfig = {
  ...DefaultValues,
  ...Object.fromEntries(
    Object.entries(cliOptions).filter(([key, value]) => {
      // $ is used by yargs, _ are args not matched by yargs

      if (isArray(value)) {
        const hasCliValue = arrayHasLength(value);
        return hasCliValue && !key.startsWith("$") && !key.startsWith("_");
      }

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
    console.log(
      `Console methods: ${
        configObj.methods?.length ? configObj.methods?.join(", ") : "None"
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
