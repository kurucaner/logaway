import fs from "fs";
import path from "path";

export function generateReportFile(report, format, customReportPath) {
  let reportPath = customReportPath || process.cwd();

  let content;
  let extension;

  switch (format.toLowerCase()) {
    case "json":
      content = JSON.stringify(report, null, 2);
      extension = "json";
      break;
    case "csv":
      content = generateCSV(report);
      extension = "csv";
      break;
    default:
      content = generateTextReport(report);
      extension = "txt";
  }

  // If reportPath is a directory, create a filename
  if (fs.existsSync(reportPath) && fs.lstatSync(reportPath).isDirectory()) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    reportPath = path.join(reportPath, `logaway-${timestamp}.${extension}`);
  } else if (!reportPath.endsWith(`.${extension}`)) {
    reportPath = `${reportPath}.${extension}`;
  }

  fs.writeFileSync(reportPath, content, "utf8");
  console.info(`Report saved to: ${reportPath}`);
}

function generateTextReport(report) {
  let text = "=== Log Removal Report ===\n\n";

  // Summary section
  text += "=== Summary ===\n";
  text += `Files checked: ${report.summary.filesChecked}\n`;
  text += `Files modified: ${report.summary.filesModified}\n`;
  text += `Total console statements removed: ${report.summary.totalLogsRemoved}\n`;
  text += `Generated: ${report.summary.timestamp}\n\n`;

  // Method breakdown
  text += "=== Method Breakdown ===\n";
  Object.entries(report.methodStats)
    .filter(([_, count]) => count > 0)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .forEach(([method, count]) => {
      text += `console.${method}: ${count}\n`;
    });
  text += "\n";

  // File details
  text += "=== Modified Files ===\n";
  // Sort files by number of logs removed (descending)
  const sortedFiles = [...report.fileStats].sort(
    (a, b) => b.logsRemoved - a.logsRemoved
  );

  sortedFiles.forEach((file) => {
    text += `${file.path}: ${file.logsRemoved} statement(s)\n`;

    // Method breakdown for each file
    Object.entries(file.methodBreakdown)
      .filter(([_, count]) => count > 0)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .forEach(([method, count]) => {
        text += `  - console.${method}: ${count}\n`;
      });
    text += "\n";
  });

  return text;
}

function generateCSV(report) {
  // Header row
  let csv = "File,Total Logs Removed";

  // Add method names to header
  Object.keys(report.methodStats).forEach((method) => {
    csv += `,console.${method}`;
  });
  csv += "\n";

  // Data rows
  report.fileStats.forEach((file) => {
    csv += `"${file.path}",${file.logsRemoved}`;

    // Add method counts for this file
    Object.keys(report.methodStats).forEach((method) => {
      csv += `,${file.methodBreakdown[method] || 0}`;
    });
    csv += "\n";
  });

  // Summary row
  csv += `"TOTAL",${report.summary.totalLogsRemoved}`;
  Object.entries(report.methodStats).forEach(([_, count]) => {
    csv += `,${count}`;
  });
  csv += "\n";

  return csv;
}
