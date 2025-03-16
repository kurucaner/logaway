# logaway

A CLI tool to remove console.log statements from JavaScript and TypeScript files.

> **Note:** This tool only removes `console.log()` statements and will not affect other console methods like `console.info()`, `console.error()`, `console.warn()`, etc.

## Installation

### Global Installation

| Package Manager | Command                   |
| :-------------: | :------------------------ |
|       npm       | `npm install -g logaway`  |
|      yarn       | `yarn global add logaway` |
|      pnpm       | `pnpm add -g logaway`     |
|       bun       | `bun add -g logaway`      |

### Local Installation (as dev dependency)

| Package Manager | Command                          |
| :-------------: | :------------------------------- |
|       npm       | `npm install --save-dev logaway` |
|      yarn       | `yarn add --dev logaway`         |
|      pnpm       | `pnpm add -D logaway`            |
|       bun       | `bun add -d logaway`             |

Then add a script to your package.json:

```json
{
  "scripts": {
    "logaway": "logaway"
  }
}
```

## Usage

### Global Usage

```bash
logaway [options]
```

### Local Usage (with npm scripts)

```bash
npm run logaway [options]
```

Note: When using npm scripts, you need to add `--` before passing arguments to the underlying command.

For example:

```bash
npm run logaway --targetDir=./app --dryRun
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

21. Optional chaining with nullish coalescing:

```javascript
console.log(user?.profile?.settings ?? "No settings");
```

22. Console.log with generator function results:

```javascript
console.log(generator.next().value);
```

23. Console.log with spread operator and nullish coalescing:

```javascript
console.log("User data:", ...userData, "Default:", defaultValue ?? "No value");
```

24. Console.log with computed property names in objects:

```javascript
console.log({ ["computed" + "Name"]: value });
```

25. Console.log with new operator

```javascript
console.log(new Date());
```

26. Styled console.log with CSS directives

```javascript
console.log("%cStyled log message", "color: blue; font-weight: bold");
```

27. Async function results

```javascript
console.log(async () => await fetchUserData(userId));
```

28. Console.log with multiple conditionals

```javascript
console.log(
  importantData || "No data available",
  attempts > 3 ? "Retry limit exceeded" : "Retrying..."
);
```

29. Console.log with immediately invoked function expression (IIFE)

```javascript
console.log(
  (function () {
    return calculateComplexValue(a, b);
  })()
);
```

30. Console.log with tagged template literals

```javascript
console.log(debug`User authentication ${status} with token ${token}`);
```

31. Console.log with complex conditional chains

```javascript
console.log(
  user && user.isAdmin
    ? "Admin access"
    : user && user.isEditor
    ? "Editor access"
    : "Regular access"
);
```

32. console.log() with array destructuring assignment

```javascript
console.log(([a, b] = [1, 2]));
```

33. console.log() with nested template literals

```javascript
console.log(`User: ${`${firstName} ${lastName}`}`);
```

34. console.log() with no arguments

```javascript
console.log();
```

35. console.log() with a regular expression

```javascript
console.log(/^user-\d+$/);
```

36. console.log() with chained method calls

```javascript
console.log(
  users
    .find((u) => u.id === 5)
    .getPurchases()
    .filter((p) => p.active)
);
```

37. console.log() with unicode escape sequences

```javascript
console.log("\u0048\u0065\u006c\u006c\u006f");
```

## License

MIT

```
MIT License

Copyright (c) 2021-present Tanner Linsley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
