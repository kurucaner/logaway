import fs from "fs";
import path from "path";

export function removeConsoleLogs(config) {
  // Extract configuration
  const {
    targetDir,
    ignoredDirectories,
    ignoredFiles,
    fileExtensions,
    dryRun,
    verbose
  } = config;

  // Statistics
  let filesChecked = 0;
  let filesModified = 0;
  let totalLogsRemoved = 0;
  let fileStats = [];

  function processDirectory(dir) {
    // Check if directory exists before proceeding
    if (!fs.existsSync(dir)) {
      throw new Error(`Directory "${dir}" does not exist.`);
    }

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (
          entry.isDirectory() &&
          !ignoredDirectories.includes(entry.name)
        ) {
          processDirectory(fullPath);
        } else if (
          entry.isFile() &&
          fileExtensions.includes(path.extname(entry.name)) &&
          !ignoredFiles.includes(entry.name)
        ) {
          filesChecked++;

          const fileContent = fs.readFileSync(fullPath, "utf8");
          let count = 0;

          // Count console.log occurrences
          const matches = fileContent.match(
            /((\/\/)?\s*console\.log\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\);?)/g
          );
          count = matches ? matches.length : 0;

          // Only process and report if logs were found
          if (count > 0) {
            const updatedContent = fileContent.replace(
              /((\/\/)?\s*console\.log\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\);?)/g,
              ""
            );

            // Store stats for each file with logs
            const relativePath = path.relative(targetDir, fullPath);
            fileStats.push({
              path: relativePath,
              logsRemoved: count,
            });

            if (verbose) {
              console.log(
                `${dryRun ? "[DRY RUN] Would remove" : "Removed"} ${count} console.log(s) from ${relativePath}`
              );
            }

            if (!dryRun) {
              fs.writeFileSync(fullPath, updatedContent, "utf8");
            }

            filesModified++;
            totalLogsRemoved += count;
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
    fileStats
  };
}

export function printSummary(stats, config) {
  const { dryRun } = config;
  const { filesChecked, filesModified, totalLogsRemoved, fileStats } = stats;

  console.log("\n=== Summary ===");
  console.log(`Files checked: ${filesChecked}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total console.logs removed: ${totalLogsRemoved}`);

  if (totalLogsRemoved > 0) {
    // Sort files by number of logs removed (descending)
    fileStats.sort((a, b) => b.logsRemoved - a.logsRemoved);

    console.log("\n=== Files with most console.logs ===");
    // Print top 5 files or all if less than 5
    const topFiles = fileStats.slice(0, Math.min(5, fileStats.length));
    topFiles.forEach((file, index) => {
      console.log(
        `${index + 1}. ${file.path}: ${file.logsRemoved} console.log(s)`
      );
    });

    if (dryRun) {
      console.log(
        "\nThis was a dry run. No files were modified. Run without --dryRun to apply changes."
      );
    }
  } else {
    console.log("\nNo console.logs found in the specified directory.");
  }

  if (!dryRun && totalLogsRemoved > 0) {
    console.log(`\nAll console.logs have been removed successfully! 🎉`);
  }
}