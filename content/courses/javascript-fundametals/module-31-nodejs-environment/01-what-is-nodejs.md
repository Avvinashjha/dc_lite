# What Is Node.js?

Node.js is a JavaScript runtime that lets you run JavaScript outside the browser.

Before Node.js, JavaScript was mostly used to make web pages interactive. With Node.js, JavaScript can also be used to:

- build web servers
- write command-line tools
- read and write files
- automate local development tasks
- connect to databases
- process streams of data
- run backend applications

Node.js does not replace the browser. It is a different environment for running the same language.

## Runtime vs Language

JavaScript is the language.

Node.js is one runtime that can execute JavaScript.

The browser is another runtime that can execute JavaScript.

That means many language features are shared:

```js
const users = ["Ada", "Linus", "Grace"];

const names = users.map((name) => name.toUpperCase());

console.log(names);
```

This code works in both Node.js and most modern browsers.

But runtime-specific APIs are different.

## Browser Runtime

The browser gives JavaScript APIs for working with web pages.

Examples:

- `window`
- `document`
- DOM nodes
- browser events
- `localStorage`
- `fetch`
- cookies
- browser security features like CORS

Browser JavaScript is often focused on the user interface.

```js
const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("Clicked");
});
```

This code needs a browser because `document` and DOM events are browser APIs.

## Node.js Runtime

Node.js gives JavaScript APIs for working with the operating system and server-side tasks.

Examples:

- `process`
- `Buffer`
- file system access
- command-line arguments
- environment variables
- built-in modules like `fs`, `path`, `http`, and `events`
- package management through npm

Node.js code often runs from the terminal or on a server.

```js
import { readFile } from "node:fs/promises";

const text = await readFile("message.txt", "utf8");

console.log(text);
```

This code needs Node.js because browsers do not allow normal web pages to freely read local files.

## What Node.js Is Good For

Node.js is especially common for:

- REST APIs
- realtime apps
- backend services
- build tools
- scripts
- development servers
- server-side rendering
- CLIs

Node.js works well for many I/O-heavy tasks.

I/O means input/output, such as reading files, making network requests, or talking to a database.

## V8 at a High Level

Node.js uses the V8 JavaScript engine.

V8 is the same JavaScript engine used by Chrome.

V8 handles the language itself:

- parsing JavaScript
- compiling and running code
- managing JavaScript objects
- collecting unused memory

V8 does not provide Node's file system or networking APIs by itself. Node.js adds those runtime features around V8.

## libuv at a High Level

Node.js also uses a library called libuv.

libuv helps Node.js handle:

- the event loop
- asynchronous file system operations
- timers
- networking
- a small internal thread pool for some operations

You do not need to use libuv directly as a beginner.

It matters because Node.js can start an operation, keep running other code, and handle the result later.

```js
import { readFile } from "node:fs/promises";

console.log("Before");

const text = await readFile("notes.txt", "utf8");

console.log(text);
console.log("After");
```

Node's async APIs are a big reason it is useful for backend work.

## Node.js Is Event-Driven

Node.js programs often react to events.

Examples:

- a file finishes loading
- a timer fires
- an HTTP request arrives
- a stream receives more data
- a process is about to exit

This should feel familiar after browser events.

In the browser, a user clicks a button.

In Node.js, a server receives a request.

Both are event-driven ideas.

## Node.js Is Not the Browser

This is a common beginner mistake:

```js
console.log(document.title);
```

In Node.js, this causes an error because `document` does not exist.

Another common mistake:

```js
alert("Hello");
```

`alert()` is a browser API, not a Node.js API.

Node.js code usually uses:

```js
console.log("Hello");
```

## Security Difference

Browser JavaScript is heavily sandboxed.

For example, a normal web page cannot freely delete files from your computer.

Node.js has much more access to the machine it runs on.

That power is useful, but it requires care.

Be careful with:

- deleting or overwriting files
- reading secrets
- using environment variables
- running shell commands
- trusting user-provided file paths
- installing unknown packages

## Common Mistakes

Do not assume browser globals exist in Node.js.

```js
// Browser-specific
document.querySelector("button");
```

Do not assume Node globals exist in the browser.

```js
// Node-specific
console.log(process.env.NODE_ENV);
```

Do not hard-code secrets into source files.

```js
// Avoid this
const apiKey = "secret-value";
```

Use environment variables for secrets in backend and local tooling contexts.

## Summary

Node.js is a runtime for running JavaScript outside the browser.

It uses V8 to run JavaScript and uses Node-specific runtime APIs for files, processes, networking, packages, and server-side work.

The language is still JavaScript, but the environment is different.
