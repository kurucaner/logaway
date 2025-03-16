export const mockConsoleStatements = `
console.log("User logged in successfully");
console.log(userId);
console.log("User ID: " + userId);
console.log(\`User \${userName} (ID: \${userId}) logged in at \${loginTime}\`);
console.log("Authentication:", status, "for user", userName);
console.log({ userId, userName, email, lastLogin });
console.log(userPermissions);
console.log(calculateTotalPrice(items));
console.log(
  \`Login \${isSuccessful ? "successful" : "failed"} for user \${userName}\`
);
console.log(JSON.stringify(userData, null, 2));
console.log({ name, email, ...otherUserData });
console.log(\`User profile:
  Name: \${userName}
  Email: \${email}
  Role: \${role}
  Last active: \${lastActive}\`);
// console.log("Debugging user authentication");
console.log("Cart total: $" + (subtotal + tax).toFixed(2));
console.log("User settings:", user.preferences.notifications);
console.log("Error in authentication process:", error.message);
console.log(users.filter((user) => user.isActive).map((user) => user.name));
console.log(\`#\${isDebug ? "DEBUG" : "INFO"}\`);
console.log("User data:", ...userData);
console.log(
  \`Payment \${
    payment.status === "completed" ? "succeeded" : "failed"
  }: \${formatCurrency(payment.amount)}\`
);
console.log(user?.profile?.settings ?? "No settings");
console.log(generator.next().value);
console.log("User data:", ...userData, "Default:", defaultValue ?? "No value");
console.log({ ["computed" + "Name"]: value });
console.log(new Date());
console.log("%cStyled log message", "color: blue; font-weight: bold");
console.log(async () => await fetchUserData(userId));
console.log(importantData || "No data available", attempts > 3 ? "Retry limit exceeded" : "Retrying...");
console.log((function() { return calculateComplexValue(a, b); })());
console.log(debug\`User authentication \${status} with token \${token}\`);
console.log(user && user.isAdmin ? "Admin access" : user && user.isEditor ? "Editor access" : "Regular access");
console.log([a, b] = [1, 2]);
console.log(\`User: \${firstName} \${lastName}\`);
console.log();
console.log(/^user-\d+$/);
console.log(users.find(u => u.id === 5).getPurchases().filter(p => p.active));
console.log("\u0048\u0065\u006c\u006c\u006f");
`;

// New test data with multiple console methods
export const mockMultipleMethodsStatements = `
console.log("User logged in successfully");
console.log(userId);
console.log("User ID: " + userId);
console.log(\`User \${userName} logged in\`);
console.log({ userId, userName });
console.log(userPermissions);
console.log(calculateTotalPrice(items));
console.log("Cart total: $" + total.toFixed(2));
console.log("User settings:", settings);
console.log("Debug info:", debugData);
// console.log("This is commented out");
console.error("Authentication failed");
console.error("Error code:", errorCode);
console.error(new Error("Connection failed"));
console.error(\`Failed to load user \${userId}: \${errorMessage}\`);
console.error({ errorType, errorMessage, timestamp });
console.error("Critical system failure", errorObject);
console.error("Error in module", moduleName, "at line", lineNumber);
// console.error("This is commented out");
console.warn("Deprecated method called");
console.warn("Performance warning: slow operation detected");
console.warn(\`Low memory warning: \${availableMemory}MB remaining\`);
console.warn("User permissions incomplete", permissions);
console.warn({ warningCode: "W001", message: "Resource usage high" });
console.warn("Warning:", warningMessage);
// console.warn("This is commented out");
console.info("Application started");
console.info("Version:", appVersion);
console.info(\`Server running on port \${port}\`);
console.info("Configuration loaded:", configName);
console.info({ serverName, serverStatus, uptime });
console.info("Database connected successfully");
console.info("Starting background tasks");
// console.info("This is commented out");
console.debug("Function called with parameters:", params);
console.debug("Intermediate calculation result:", result);
console.debug(\`Debug: Step \${step} of \${totalSteps}\`);
console.debug({ debugLevel: "verbose", component: "auth", message: "Token validation" });
console.debug("Memory usage:", process.memoryUsage());
// console.debug("This is commented out");
`;
