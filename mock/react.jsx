console.log("User logged in successfully");
console.log(userId);
console.log("User ID: " + userId);
console.log(`User ${userName} (ID: ${userId}) logged in at ${loginTime}`);
console.log("Authentication:", status, "for user", userName);
console.log({ userId, userName, email, lastLogin });
console.log(userPermissions);
console.log(calculateTotalPrice(items));
console.log(
  `Login ${isSuccessful ? "successful" : "failed"} for user ${userName}`
);
console.log(JSON.stringify(userData, null, 2));
console.log({ name, email, ...otherUserData });
console.log(`User profile:
  Name: ${userName}
  Email: ${email}
  Role: ${role}
  Last active: ${lastActive}`);
// console.log("Debugging user authentication");
console.log("Cart total: $" + (subtotal + tax).toFixed(2));
console.log("User settings:", user.preferences.notifications);
console.log("Error in authentication process:", error.message);
console.log(users.filter((user) => user.isActive).map((user) => user.name));
console.log(`#${isDebug ? "DEBUG" : "INFO"}`);
console.log("User data:", ...userData);
console.log(
  `Payment ${
    payment.status === "completed" ? "succeeded" : "failed"
  }: ${formatCurrency(payment.amount)}`
);
console.log(user?.profile?.settings ?? "No settings");
console.log(generator.next().value);
console.log("User data:", ...userData, "Default:", defaultValue ?? "No value");
console.log({ ["computed" + "Name"]: value });
console.log(new Date());
console.log("%cStyled log message", "color: blue; font-weight: bold");
console.log(async () => await fetchUserData(userId));
console.log(
  importantData || "No data available",
  attempts > 3 ? "Retry limit exceeded" : "Retrying..."
);
console.log(
  (function () {
    return calculateComplexValue(a, b);
  })()
);
console.log(debug`User authentication ${status} with token ${token}`);
console.log(
  user && user.isAdmin
    ? "Admin access"
    : user && user.isEditor
    ? "Editor access"
    : "Regular access"
);
console.log(([a, b] = [1, 2]));
console.log(`User: ${firstName} ${lastName}`);
console.log();
console.log(/^user-\d+$/);
console.log(
  users
    .find((u) => u.id === 5)
    .getPurchases()
    .filter((p) => p.active)
);
console.log("\u0048\u0065\u006c\u006c\u006f");

console.info("User logged in successfully");
console.info(userId);
console.info("User ID: " + userId);
console.info(`User ${userName} (ID: ${userId}) logged in at ${loginTime}`);
console.info("Authentication:", status, "for user", userName);
console.info({ userId, userName, email, lastLogin });
console.info(userPermissions);
console.info(calculateTotalPrice(items));
console.info(
  `Login ${isSuccessful ? "successful" : "failed"} for user ${userName}`
);
console.info(JSON.stringify(userData, null, 2));
console.info({ name, email, ...otherUserData });
console.info(`User profile:
  Name: ${userName}
  Email: ${email}
  Role: ${role}
  Last active: ${lastActive}`);
// console.info("Debugging user authentication");
console.info("Cart total: $" + (subtotal + tax).toFixed(2));
console.info("User settings:", user.preferences.notifications);
console.info("Error in authentication process:", error.message);
console.info(users.filter((user) => user.isActive).map((user) => user.name));
console.info(`#${isDebug ? "DEBUG" : "INFO"}`);
console.info("User data:", ...userData);
console.info(
  `Payment ${
    payment.status === "completed" ? "succeeded" : "failed"
  }: ${formatCurrency(payment.amount)}`
);
console.info(user?.profile?.settings ?? "No settings");
console.info(generator.next().value);
console.info("User data:", ...userData, "Default:", defaultValue ?? "No value");
console.info({ ["computed" + "Name"]: value });
console.info(new Date());
console.info("%cStyled log message", "color: blue; font-weight: bold");
console.info(async () => await fetchUserData(userId));
console.info(
  importantData || "No data available",
  attempts > 3 ? "Retry limit exceeded" : "Retrying..."
);
console.info(
  (function () {
    return calculateComplexValue(a, b);
  })()
);
console.info(debug`User authentication ${status} with token ${token}`);
console.info(
  user && user.isAdmin
    ? "Admin access"
    : user && user.isEditor
    ? "Editor access"
    : "Regular access"
);
console.info(([a, b] = [1, 2]));
console.info(`User: ${firstName} ${lastName}`);
console.info();
console.info(/^user-\d+$/);
console.info(
  users
    .find((u) => u.id === 5)
    .getPurchases()
    .filter((p) => p.active)
);
console.info("\u0048\u0065\u006c\u006c\u006f");

console.error("User logged in successfully");
console.error(userId);
console.error("User ID: " + userId);
console.error(`User ${userName} (ID: ${userId}) logged in at ${loginTime}`);
console.error("Authentication:", status, "for user", userName);
console.error({ userId, userName, email, lastLogin });
console.error(userPermissions);
console.error(calculateTotalPrice(items));
console.error(
  `Login ${isSuccessful ? "successful" : "failed"} for user ${userName}`
);
console.error(JSON.stringify(userData, null, 2));
console.error({ name, email, ...otherUserData });
console.error(`User profile:
  Name: ${userName}
  Email: ${email}
  Role: ${role}
  Last active: ${lastActive}`);
// console.error("Debugging user authentication");
console.error("Cart total: $" + (subtotal + tax).toFixed(2));
console.error("User settings:", user.preferences.notifications);
console.error("Error in authentication process:", error.message);
console.error(users.filter((user) => user.isActive).map((user) => user.name));
console.error(`#${isDebug ? "DEBUG" : "INFO"}`);
console.error("User data:", ...userData);
console.error(
  `Payment ${
    payment.status === "completed" ? "succeeded" : "failed"
  }: ${formatCurrency(payment.amount)}`
);
console.error(user?.profile?.settings ?? "No settings");
console.error(generator.next().value);
console.error(
  "User data:",
  ...userData,
  "Default:",
  defaultValue ?? "No value"
);
console.error({ ["computed" + "Name"]: value });
console.error(new Date());
console.error("%cStyled log message", "color: blue; font-weight: bold");
console.error(async () => await fetchUserData(userId));
console.error(
  importantData || "No data available",
  attempts > 3 ? "Retry limit exceeded" : "Retrying..."
);
console.error(
  (function () {
    return calculateComplexValue(a, b);
  })()
);
console.error(debug`User authentication ${status} with token ${token}`);
console.error(
  user && user.isAdmin
    ? "Admin access"
    : user && user.isEditor
    ? "Editor access"
    : "Regular access"
);
console.error(([a, b] = [1, 2]));
console.error(`User: ${firstName} ${lastName}`);
console.error();
console.error(/^user-\d+$/);
console.error(
  users
    .find((u) => u.id === 5)
    .getPurchases()
    .filter((p) => p.active)
);
console.error("\u0048\u0065\u006c\u006c\u006f");
