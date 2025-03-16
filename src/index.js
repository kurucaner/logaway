import fs from "fs";
import path from "path";

export function removeConsoleLogs(config) {
  // Extract configuration
  const {
    targetDir,
    ignoredDirectories,
    ignoredFiles,
    fileExtensions,
    preview,
    verbose,
    methods = ["log"],
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

  function processDirectory(dir) {
    // Check if directory exists before proceeding
    if (!fs.existsSync(dir)) {
      throw new Error(`Directory "${dir}" does not exist.`);
    }

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !ignoredDirectories.includes(entry.name)) {
          processDirectory(fullPath);
        } else if (
          entry.isFile() &&
          fileExtensions.includes(path.extname(entry.name)) &&
          !ignoredFiles.includes(entry.name)
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

            if (verbose) {
              console.info(
                `${
                  preview ? "[DRY RUN] Would remove" : "Removed"
                } ${totalFileLogsRemoved} console statement(s) from ${relativePath}`
              );

              // If verbose, show breakdown by method
              Object.entries(fileMethodStats).forEach(([method, count]) => {
                if (count > 0) {
                  console.info(`  - console.${method}: ${count}`);
                }
              });
            }

            if (!preview) {
              fs.writeFileSync(fullPath, updatedContent, "utf8");
            }

            filesModified++;
            totalLogsRemoved += totalFileLogsRemoved;
          }
        }
      });
    } catch (error) {
      throw new Error(`Error processing directory ${dir}: ${error.message}`);
    }
  }

  processDirectory(targetDir);

  return {
    filesChecked,
    filesModified,
    totalLogsRemoved,
    fileStats,
    methodStats,
  };
}

export function printSummary(stats, config) {
  const { preview } = config;
  const {
    filesChecked,
    filesModified,
    totalLogsRemoved,
    fileStats,
    methodStats,
  } = stats;

  console.info("\n=== Summary ===");
  console.info(`Files checked: ${filesChecked}`);
  console.info(`Files modified: ${filesModified}`);
  console.info(`Total console statements removed: ${totalLogsRemoved}`);

  if (totalLogsRemoved > 0) {
    // Print breakdown by method
    console.info("\n=== Breakdown by Method ===");
    Object.entries(methodStats)
      .filter(([_, count]) => count > 0)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .forEach(([method, count]) => {
        console.info(`console.${method}: ${count}`);
      });

    // Sort files by number of logs removed (descending)
    fileStats.sort((a, b) => b.logsRemoved - a.logsRemoved);

    console.info("\n=== Files with most console statements ===");
    // Print top 5 files or all if less than 5
    const topFiles = fileStats.slice(0, Math.min(5, fileStats.length));
    topFiles.forEach((file, index) => {
      console.info(
        `${index + 1}. ${file.path}: ${file.logsRemoved} console statement(s)`
      );

      // Show method breakdown for top files
      Object.entries(file.methodBreakdown)
        .filter(([_, count]) => count > 0)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .forEach(([method, count]) => {
          console.info(`   - console.${method}: ${count}`);
        });
    });

    if (preview) {
      console.info(
        "\nThis was a dry run. No files were modified. Run without --preview to apply changes."
      );
    }
  } else {
    console.info("\nNo console statements found in the specified directory.");
  }

  if (!preview && totalLogsRemoved > 0) {
    console.info(`\nAll console statements have been removed successfully! 🎉`);
  }
}
