export function printSummary(stats, config) {
    const { preview, verbose } = config;
    const { filesChecked, filesModified, totalLogsRemoved, fileStats } = stats;
  
    if (verbose || preview) {
      console.info("\n=== Summary ===");
      console.info(`Files checked: ${filesChecked}`);
      console.info(`Files modified: ${filesModified}`);
      console.info(`Total console statements removed: ${totalLogsRemoved}`);
    }
  
    if (totalLogsRemoved > 0) {
      // Sort files by number of logs removed (descending)
      fileStats.sort((a, b) => b.logsRemoved - a.logsRemoved);
  
      if (verbose || preview) {
        console.info("\n=== Files with most console statements ===");
      }
      // Print top 5 files or all if less than 5
      const topFiles = fileStats.slice(0, Math.min(5, fileStats.length));
      topFiles.forEach((file, index) => {
        if (verbose || preview) {
          console.info(
            `${index + 1}. ${file.path}: ${file.logsRemoved} console statement${
              file.logsRemoved === 1 ? "" : "s"
            }`
          );
        }
  
        // Show method breakdown for top files
        if (verbose || preview) {
          Object.entries(file.methodBreakdown)
            .filter(([_, count]) => count > 0)
            .sort(([_, countA], [__, countB]) => countB - countA)
            .forEach(([method, count]) => {
              console.info(`   - console.${method}: ${count}`);
            });
        }
      });
  
      if (preview) {
        console.info(
          "This was a dry run. No files were modified. Run without --preview to apply changes."
        );
      }
    } else {
      console.info("No console statements found in the specified directory.");
    }
  
    if (!preview && totalLogsRemoved > 0) {
      console.info(`All console statements have been removed successfully! 🎉`);
    }
  }
  