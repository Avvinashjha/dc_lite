# Node.js Runtime and Globals

Node.js gives your JavaScript program a runtime environment.

That environment includes:

- a JavaScript engine
- an event loop
- built-in modules
- global values
- access to process information
- APIs for files, networking, timers, and more

This lesson focuses on the values Node makes available while your program runs.

## Global Objects

A global value can be used without importing it.

In browsers, common globals include:

```js
window;
document;
localStorage;
```

In Node.js, common globals include:

```js
global;
process;
Buffer;
setTimeout;
setInterval;
console;
```

Some globals exist in both environments, but they may not behave exactly the same.

## `global`

In Node.js, `global` is the global object.

```js
global.appName = "Demo App";

console.log(global.appName);
```

This works, but avoid storing application data on `global`.

Global mutable state makes programs harder to test and reason about.

Prefer normal variables, function arguments, modules, and configuration objects.

## `globalThis`

Modern JavaScript provides `globalThis`.

`globalThis` is a standard way to refer to the global object across runtimes.

```js
console.log(globalThis.setTimeout === setTimeout);
```

In Node.js, `globalThis` and `global` point to the same global object.

In a browser, `globalThis` and `window` usually point to the same global object.

Use `globalThis` when writing code that may run in multiple environments.

## `process`

`process` represents the current Node.js process.

Useful properties include:

```js
console.log(process.version);
console.log(process.platform);
console.log(process.cwd());
console.log(process.argv);
console.log(process.env.NODE_ENV);
```

Common uses:

- reading environment variables
- reading command-line arguments
- checking the current working directory
- setting an exit code
- responding to process events

## Environment Variables

Environment variables are values passed to a process by the operating system or shell.

Node exposes them through `process.env`.

```js
const mode = process.env.NODE_ENV || "development";

console.log(`Running in ${mode} mode`);
```

Environment variables are often used for:

- API keys
- database URLs
- feature flags
- deployment settings
- environment names

Do not commit secret values to source control.

## Command-Line Arguments

`process.argv` contains the command used to start the process.

```js
console.log(process.argv);
```

Run:

```sh
node greet.js Ada
```

`process.argv` usually contains:

```text
[
  "/path/to/node",
  "/path/to/greet.js",
  "Ada"
]
```

The user-provided arguments begin at index `2`.

```js
const name = process.argv[2] || "friend";

console.log(`Hello, ${name}!`);
```

## Timers

Node.js provides timer functions.

```js
setTimeout(() => {
  console.log("Runs later");
}, 1000);
```

```js
const id = setInterval(() => {
  console.log("Runs repeatedly");
}, 1000);

setTimeout(() => {
  clearInterval(id);
}, 3500);
```

Timers are asynchronous.

They schedule callbacks to run later through the event loop.

## `Buffer`

`Buffer` represents binary data.

Strings are text.

Buffers are bytes.

```js
const data = Buffer.from("Hello");

console.log(data);
console.log(data.toString("utf8"));
```

Buffers are common when working with:

- files
- network responses
- streams
- binary formats
- encoded data

If you read a file without an encoding, Node may give you a `Buffer`.

```js
import { readFile } from "node:fs/promises";

const data = await readFile("image.png");

console.log(Buffer.isBuffer(data)); // true
```

For text files, pass an encoding.

```js
const text = await readFile("notes.txt", "utf8");
```

## `__dirname` and `__filename`

In CommonJS modules, Node provides:

- `__dirname`
- `__filename`

```js
console.log(__dirname);
console.log(__filename);
```

These are not available by default in ES modules.

In ES modules, you can use `import.meta.url`.

```js
console.log(import.meta.url);
```

Module format matters in Node.js.

You will learn more in the next lesson.

## Browser APIs Are Not Node Globals

This does not work in a normal Node script:

```js
document.querySelector("h1");
```

Node does not have a DOM.

This also does not work:

```js
alert("Saved");
```

Node code usually communicates through:

- terminal output
- files
- HTTP responses
- logs
- returned values

## Node APIs Are Not Browser Globals

This does not work in normal browser JavaScript:

```js
console.log(process.env.API_KEY);
```

Frontend build tools sometimes replace environment-like values during bundling, but that is not the same as Node's runtime `process.env`.

Do not assume Node APIs are available in browser code.

## Common Mistakes

Do not put secrets in `global`.

Do not assume `process.env.MY_VALUE` is always defined.

```js
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("Missing API_KEY");
}
```

Do not treat `Buffer` like a normal string.

```js
const data = Buffer.from("Hello");

console.log(data.length); // byte length
```

Do not use browser globals in Node unless a library explicitly provides a simulated browser environment.

## Summary

Node.js provides runtime globals like `process`, `Buffer`, timers, `global`, and `globalThis`.

These values are useful, but they are specific to the environment.

Good Node.js code is clear about what comes from JavaScript itself, what comes from Node.js, and what comes from your own modules.
