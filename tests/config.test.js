import fs from "fs";
import path from "path";
import assert from "assert";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { cosmiconfigSync } from "cosmiconfig";
import test from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function cleanupTestFiles(files) {
  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
}

const testConfigFiles = [
  path.join(projectRoot, ".logawayrc.json"),
  path.join(projectRoot, "logaway.config.js"),
  path.join(__dirname, "test-package.json"),
  path.join(__dirname, "mock-config-test.js"),
];

test("Configuration System Tests", async (t) => {
  t.beforeEach(() => {
    cleanupTestFiles(testConfigFiles);

    fs.writeFileSync(
      path.join(__dirname, "mock-config-test.js"),
      "\n\n",
      "utf8"
    );
  });

  t.afterEach(() => {
    cleanupTestFiles(testConfigFiles);
  });

  await t.test("Should load configuration from .logawayrc.json file", () => {
    fs.writeFileSync(
      path.join(projectRoot, ".logawayrc.json"),
      JSON.stringify({
        targetDir: "./tests",
        ignoredDirs: ["node_modules"],
        methods: ["log", "debug"],
      }),
      "utf8"
    );

    const explorer = cosmiconfigSync("logaway");
    const search = explorer.search();
    const result = search.config.default || search.config;

    assert.ok(result, "Config should be found");
    assert.strictEqual(result.targetDir, "./tests");
    assert.deepStrictEqual(result.ignoredDirs, ["node_modules"]);
    assert.deepStrictEqual(result.methods, ["log", "debug"]);
  });

  await t.test("Should load configuration from logaway.config.js file", () => {
    fs.writeFileSync(
      path.join(projectRoot, "logaway.config.js"),
      `export default {
          targetDir: './tests',
          ignoredDirs: ['dist', 'coverage'],
          methods: ['log', 'warn']
        };`,
      "utf8"
    );

    const explorer = cosmiconfigSync("logaway");
    const search = explorer.search();
    const result = search.config.default || search.config;

    assert.ok(result, "Config should be found");
    assert.strictEqual(result.targetDir, "./tests");
    assert.deepStrictEqual(result.ignoredDirs, ["dist", "coverage"]);
    assert.deepStrictEqual(result.methods, ["log", "warn"]);
  });

  await t.test("CLI arguments should override json file configuration", () => {
    fs.writeFileSync(
      path.join(projectRoot, ".logawayrc.json"),
      JSON.stringify({
        targetDir: "./src",
        ignoredDirs: ["node_modules", "foo"],
        methods: ["log"],
      }),
      "utf8"
    );

    const output = execSync(
      "node ./bin/logaway.js --targetDir=./tests --methods=debug,info --preview --verbose",
      { encoding: "utf8" }
    );
    assert.ok(output.includes("Starting to process ./tests"));
    assert.ok(output.includes("debug") || output.includes("info"));
    assert.ok(!output.includes("Starting to process ./src"));
  });

  await t.test("CLI arguments should override js file configuration", () => {
    fs.writeFileSync(
      path.join(projectRoot, "logaway.config.js"),
      `export default {
          targetDir: './src',
          ignoredDirs: ['node_modules'],
          methods: ['log']
        };`,
      "utf8"
    );

    const output = execSync(
      "node ./bin/logaway.js --targetDir=./tests --methods=debug,info --preview --verbose",
      { encoding: "utf8" }
    );

    assert.ok(output.includes("Starting to process ./tests"));
    assert.ok(output.includes("debug") || output.includes("info"));
    assert.ok(!output.includes("Starting to process ./src"));
  });

  await t.test("Should normalize configuration values properly", () => {
    fs.writeFileSync(
      path.join(projectRoot, ".logawayrc.json"),
      JSON.stringify({
        targetDir: "./tests",
        ignoredDirs: "node_modules,dist",
        methods: "log,debug",
      }),
      "utf8"
    );

    const output = execSync("node ./bin/logaway.js --preview --verbose", {
      encoding: "utf8",
    });

    assert.ok(output.includes("Ignored directories: node_modules, dist"));
    assert.ok(output.includes("log") && output.includes("debug"));
  });

  await t.test(
    "Should use default values when not specified in config or CLI",
    () => {
      const output = execSync("node ./bin/logaway.js --preview --verbose", {
        encoding: "utf8",
      });

      assert.ok(output.includes("File extensions: .js, .jsx, .ts, .tsx"));
      assert.ok(output.includes("Starting to process ./src"));
      assert.ok(output.includes("Ignored directories: None"));
      assert.ok(output.includes("Ignored files: None"));
      assert.ok(output.includes("log"));
    }
  );

  await t.test("Should handle package.json configuration", () => {
    fs.writeFileSync(
      path.join(__dirname, "test-package.json"),
      JSON.stringify({
        name: "test-package",
        logaway: {
          targetDir: "./tests",
          ignoredDirs: ["coverage"],
          methods: ["warn", "error"],
        },
      }),
      "utf8"
    );

    const explorer = cosmiconfigSync("logaway", {
      searchPlaces: ["test-package.json"],
    });

    const result = explorer.search(__dirname);

    assert.ok(result, "Config should be found in package.json");
    assert.strictEqual(result.config.logaway.targetDir, "./tests");
    assert.deepStrictEqual(result.config.logaway.ignoredDirs, ["coverage"]);
    assert.deepStrictEqual(result.config.logaway.methods, ["warn", "error"]);
  });
});
