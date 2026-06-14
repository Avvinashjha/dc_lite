# Environment Variables and CLI Arguments

Node.js programs often receive input from outside the source code.

Two common sources are:

- environment variables
- command-line arguments

These are especially useful for scripts, tools, and backend apps.

## Why External Configuration Matters

Avoid hard-coding values that change by environment.

```js
// Avoid
const databaseUrl = "postgres://user:password@example.com/app";
```

This is risky because:

- secrets may be committed to git
- local and production settings are different
- deployments become harder to configure
- rotating credentials becomes painful

Use environment variables for values that differ between machines or deployments.

## Reading Environment Variables

Environment variables are available on `process.env`.

```js
const nodeEnv = process.env.NODE_ENV || "development";

console.log(`Environment: ${nodeEnv}`);
```

Every value from `process.env` is a string or `undefined`.

```js
const port = Number(process.env.PORT || 3000);

console.log(port);
```

Convert values when you need numbers or booleans.

## Setting Environment Variables

On macOS and Linux shells:

```sh
PORT=4000 node app.js
```

Then read it:

```js
const port = Number(process.env.PORT || 3000);

console.log(`Using port ${port}`);
```

For longer-running projects, teams often use deployment configuration, shell profiles, or `.env` files loaded by tooling.

Do not commit real secrets in `.env` files.

## Required Configuration

If a value is required, fail early with a useful error.

```js
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("Missing required environment variable: API_KEY");
}
```

This is better than letting the program fail later with a confusing error.

## Boolean Environment Values

Environment variables are strings.

This can surprise beginners.

```js
process.env.DEBUG = "false";

console.log(Boolean(process.env.DEBUG)); // true
```

The string `"false"` is truthy.

Parse booleans explicitly.

```js
const debug = process.env.DEBUG === "true";
```

## Command-Line Arguments

Command-line arguments are values passed after the script name.

Run:

```sh
node greet.js Ada
```

Read:

```js
const name = process.argv[2] || "friend";

console.log(`Hello, ${name}!`);
```

`process.argv` includes:

1. the Node executable path
2. the script path
3. your custom arguments

That is why user arguments start at index `2`.

## Multiple Arguments

Example:

```sh
node add.js 2 3
```

Script:

```js
const first = Number(process.argv[2]);
const second = Number(process.argv[3]);

console.log(first + second);
```

Output:

```text
5
```

Validate arguments before using them.

```js
if (Number.isNaN(first) || Number.isNaN(second)) {
  console.error("Usage: node add.js <number> <number>");
  process.exitCode = 1;
} else {
  console.log(first + second);
}
```

## Flags

Simple scripts may parse flags manually.

```sh
node app.js --name Ada --verbose
```

Basic parsing:

```js
const args = process.argv.slice(2);

const verbose = args.includes("--verbose");
const nameIndex = args.indexOf("--name");
const name = nameIndex === -1 ? "friend" : args[nameIndex + 1];

if (verbose) {
  console.log("Verbose mode enabled");
}

console.log(`Hello, ${name}`);
```

For serious CLIs, use a package designed for argument parsing.

## Standard Input and Output

Node processes can communicate through standard streams:

- `process.stdin`
- `process.stdout`
- `process.stderr`

You already use stdout through `console.log()`.

```js
process.stdout.write("Normal output\n");
process.stderr.write("Error output\n");
```

Use stderr for errors so other tools can separate normal output from error messages.

## Exit Codes

Set an exit code when a script fails.

```js
if (!process.env.API_KEY) {
  console.error("Missing API_KEY");
  process.exitCode = 1;
}
```

This matters for automation, CI, and shell scripts.

A successful command exits with `0`.

A failing command should exit with a non-zero code.

## Security Cautions

Environment variables can contain secrets.

Do not print secrets in logs.

```js
// Avoid
console.log(process.env.API_KEY);
```

Command-line arguments may be visible in shell history or process lists.

Avoid passing highly sensitive secrets as CLI arguments.

Prefer secret managers, deployment configuration, or environment variables depending on your platform.

Always validate file paths, URLs, and commands that come from user input.

## Common Mistakes

Do not assume an environment variable exists.

Do not forget that environment variables are strings.

Do not use `Boolean(process.env.FLAG)` for `"false"` values.

Do not ignore invalid CLI arguments.

Do not log secrets while debugging.

## Summary

Use `process.env` for environment-specific configuration and `process.argv` for command-line input.

Convert values to the right type, validate required inputs, use meaningful exit codes, and keep secrets out of source code and logs.
