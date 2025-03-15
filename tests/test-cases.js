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
`;
