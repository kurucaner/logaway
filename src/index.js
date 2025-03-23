import fs from "fs";
import path from "path";
import { generateReportFile } from "./generate-report-file.js";
import prettier from "prettier";

export async function removeConsoleLogs(config) {
  // Extract configuration
  const {
    targetDir,
    ignoredDirectories,
    ignoredFiles,
    fileExtensions,
    preview,
    methods = ["log"],
    prettier: usePrettier = false,
    reportFormat = null,
    reportPath = null,
  } = config;

  // Statistics
  let filesChecked = 0;
  let filesModified = 0;
  let totalLogsRemoved = 0;
  let fileStats = [];
  let methodStats = methods.reduce((acc, method) => {
    acc[method] = 0;
    return acc;
  }, {});

  async function processDirectory(dir) {
    // Check if directory exists before proceeding
    if (!fs.existsSync(dir)) {
      throw new Error(`Directory "${dir}" does not exist.`);
    }

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !ignoredDirectories?.includes(entry.name)) {
          await processDirectory(fullPath);
        } else if (
          entry.isFile() &&
          fileExtensions?.includes(path.extname(entry.name)) &&
          !ignoredFiles?.includes(entry.name)
        ) {
          filesChecked++;

          const fileContent = fs.readFileSync(fullPath, "utf8");

          // Create stats for this file
          let fileMethodStats = methods.reduce((acc, method) => {
            acc[method] = 0;
            return acc;
          }, {});

          let totalFileLogsRemoved = 0;
          let updatedContent = fileContent;

          // Process each method individually to count them properly
          methods.forEach((method) => {
            const methodRegex = new RegExp(
              `((\/\/)?\\s*console\\.(${method})\\((?:[^()]+|\\((?:[^()]+|\\([^()]*\\))*\\))*\\);?)`,
              "g"
            );

            const matches = updatedContent.match(methodRegex);
            const methodCount = matches ? matches.length : 0;

            if (methodCount > 0) {
              fileMethodStats[method] = methodCount;
              methodStats[method] += methodCount;
              totalFileLogsRemoved += methodCount;

              // Replace this specific method
              updatedContent = updatedContent.replace(methodRegex, "");
            }
          });

          // Only process and report if logs were found
          if (totalFileLogsRemoved > 0) {
            // Store stats for each file with logs
            const relativePath = path.relative(targetDir, fullPath);
            fileStats.push({
              path: relativePath,
              logsRemoved: totalFileLogsRemoved,
              methodBreakdown: fileMethodStats,
            });

            if (!preview) {
              // Write file without console logs
              fs.writeFileSync(fullPath, updatedContent, "utf8");

              // Format with Prettier if enabled
              if (usePrettier) {
                try {
                  // Check if there's a Prettier config for this file
                  const prettierConfig = await prettier.resolveConfig(fullPath);

                  // Format the content
                  const formattedContent = await prettier.format(
                    updatedContent,
                    {
                      ...prettierConfig,
                      filepath: fullPath, // This helps Prettier infer the parser
                    }
                  );

                  // Write the formatted content back to the file
                  fs.writeFileSync(fullPath, formattedContent, "utf8");
                } catch (error) {
                  console.warn(
                    `Warning: Could not format ${relativePath} with Prettier: ${error.message}`
                  );
                }
              }
            }

            filesModified++;
            totalLogsRemoved += totalFileLogsRemoved;
          }
        }
      }
    } catch (error) {
      throw new Error(`Error processing directory ${dir}: ${error.message}`);
    }
  }

  await processDirectory(targetDir);

  const report = {
    summary: {
      filesChecked,
      filesModified,
      totalLogsRemoved,
      timestamp: new Date().toISOString(),
    },
    methodStats,
    fileStats,
  };

  if (reportFormat) {
    generateReportFile(report, reportFormat, reportPath);
  }

  return {
    filesChecked,
    filesModified,
    totalLogsRemoved,
    fileStats,
    methodStats,
  };
}

