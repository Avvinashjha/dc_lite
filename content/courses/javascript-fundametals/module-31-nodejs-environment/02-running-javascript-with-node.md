# Running JavaScript with Node

Node.js programs are usually run from the terminal.

Instead of loading a script with a `<script>` tag in a browser, you run a file with the `node` command.

## Checking Node.js

To check whether Node.js is installed, run:

```sh
node --version
```

You should see a version number.

Example:

```text
v22.11.0
```

The exact version may be different.

You can also check npm:

```sh
npm --version
```

npm is the package manager commonly installed with Node.js.

## Your First Node Script

Create a file named `hello.js`.

```js
console.log("Hello from Node.js");
```

Run it:

```sh
node hello.js
```

Output:

```text
Hello from Node.js
```

Node reads the file, runs the JavaScript, prints the output, and exits.

## Running Inline Code

You can run a short piece of JavaScript with `node -e`.

```sh
node -e "console.log(2 + 3)"
```

Output:

```text
5
```

This is useful for quick experiments, but real programs usually live in files.

## The Node REPL

If you run `node` without a file, Node opens a REPL.

REPL stands for:

```text
Read Eval Print Loop
```

Start it:

```sh
node
```

Then type JavaScript:

```js
2 + 3
```

The REPL prints:

```text
5
```

Exit the REPL with:

```text
Ctrl + C twice
```

or:

```js
.exit
```

## Script Execution Order

Node runs top-level code from top to bottom.

```js
console.log("First");
console.log("Second");
console.log("Third");
```

Output:

```text
First
Second
Third
```

Asynchronous work can complete later.

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

console.log("End");
```

Output:

```text
Start
End
Timer
```

This is the event loop in action.

## Current Working Directory

Node scripts run from a current working directory.

That directory is usually the directory where you ran the command.

```js
console.log(process.cwd());
```

Run:

```sh
node app.js
```

`process.cwd()` helps you understand where relative file paths are resolved from.

This matters when reading files.

```js
import { readFile } from "node:fs/promises";

const text = await readFile("data.txt", "utf8");

console.log(text);
```

`data.txt` is looked up relative to the current working directory, not necessarily relative to the script file.

## File Paths in Node.js

On macOS and Linux, paths usually use `/`.

```text
notes/today.txt
```

On Windows, paths often use `\`.

```text
notes\today.txt
```

To build paths safely across operating systems, use the `path` module instead of manually joining strings.

```js
import path from "node:path";

const filePath = path.join("notes", "today.txt");

console.log(filePath);
```

## Top-Level await

Modern Node.js supports top-level `await` in ES modules.

```js
const response = await fetch("https://example.com");

console.log(response.status);
```

Whether a file is treated as an ES module depends on the file extension or package configuration.

You will learn more about this in the modules lesson.

## Exit Codes

When a Node process finishes, it exits with a status code.

By convention:

- `0` means success
- non-zero means failure

You can set an exit code:

```js
if (!process.env.API_KEY) {
  console.error("Missing API_KEY");
  process.exitCode = 1;
}
```

Prefer setting `process.exitCode` when possible because it lets pending logs and cleanup work finish.

`process.exit(1)` stops the process immediately.

## Watching for File Changes

Recent Node versions include watch mode:

```sh
node --watch app.js
```

Node restarts the script when files change.

This is useful during development.

In real projects, you may also see tools like `nodemon`, test runners, or framework-specific dev servers.

## Common Mistakes

Do not include the `node` command inside the JavaScript file.

```js
// Wrong inside app.js
node app.js
```

The command belongs in the terminal.

Do not assume relative paths are always relative to the file.

```js
// This depends on where you ran node from
await readFile("config.json", "utf8");
```

Do not ignore error output.

```js
console.error("Something went wrong");
process.exitCode = 1;
```

Errors should usually be visible in terminal scripts.

## Summary

Use `node file.js` to run JavaScript with Node.js.

The terminal, current working directory, process exit code, and module format all matter when running scripts.

Node.js feels like JavaScript, but it runs in a command-line/server environment instead of a browser page.
