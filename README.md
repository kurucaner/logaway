# logaway

A CLI tool to remove console.log statements from JavaScript and TypeScript files.

> **Note:** This tool only removes `console.log()` statements and will not affect other console methods like `console.info()`, `console.error()`, `console.warn()`, etc.

## Installation

```bash
npm install -g logaway
```

## Usage

```bash
logaway [options]
```

### Options

- `--targetDir`, `-t` <path> - Directory to process (default: "./src")
- `--ignoredDirs`, `-d` <dir1,dir2> - Comma-separated list of directories to ignore
- `--ignoredFiles`, `-f` <file1,file2> - Comma-separated list of files to ignore (default: "logger.ts")
- `--extensions`, `-e` <.js,.ts> - Comma-separated list of file extensions to process (default: ".js,.jsx,.ts,.tsx")
- `--dryRun`, `-dr` - Preview changes without modifying files
- `--verbose`, `-v` - Show detailed information for each file
- `--help`, `-h` - Show help information

### Examples

```bash
# Process the default src directory
logaway

# Specify a target directory and ignore some folders
logaway --targetDir=./app --ignoredDirs=node_modules,dist

# Using shortcuts
logaway -t ./app -d node_modules,dist -e .js,.ts

# Dry run to preview changes
logaway --dryRun
```

## Examples of Removed Logs

This tool will detect and remove various forms of console.log statements, including:

1. Simple string log

```javascript
console.log("User logged in successfully");
```

2. Variable log

```javascript
console.log(userId);
```

3. String concatenation

```javascript
console.log("User ID: " + userId);
```

4. Template literals

```javascript
console.log(`User ${userName} (ID: ${userId}) logged in at ${loginTime}`);
```

5. Multiple arguments

```javascript
console.log("Authentication:", status, "for user", userName);
```

6. Object logging

```javascript
console.log({ userId, userName, email, lastLogin });
```

7. Array logging

```javascript
console.log(userPermissions);
```

8. Logging function results

```javascript
console.log(calculateTotalPrice(items));
```

9. Conditional logging with ternary

```javascript
console.log(
  `Login ${isSuccessful ? "successful" : "failed"} for user ${userName}`
);
```

10. JSON stringified object

```javascript
console.log(JSON.stringify(userData, null, 2));
```

11. Destructuring in log

```javascript
console.log({ name, email, ...otherUserData });
```

12. Multiline string log

```javascript
console.log(`User profile:
  Name: ${userName}
  Email: ${email}
  Role: ${role}
  Last active: ${lastActive}`);
```

13. Commented log

```javascript
// console.log("Debugging user authentication");
```

14. Logging with expression

```javascript
console.log("Cart total: $" + (subtotal + tax).toFixed(2));
```

15. Nested object logging

```javascript
console.log("User settings:", user.preferences.notifications);
```

16. Error context logging

```javascript
console.log("Error in authentication process:", error.message);
```

17. Array method result

```javascript
console.log(users.filter((user) => user.isActive).map((user) => user.name));
```

18. Conditional log with && operator

```javascript
console.log(`#${isDebug ? "DEBUG" : "INFO"}`);
```

19. Console log with spread operator

```javascript
console.log("User data:", ...userData);
```

20. Logging with ternary and complex expressions

```javascript
console.log(
  `Payment ${
    payment.status === "completed" ? "succeeded" : "failed"
  }: ${formatCurrency(payment.amount)}`
);
```

## License

MIT
