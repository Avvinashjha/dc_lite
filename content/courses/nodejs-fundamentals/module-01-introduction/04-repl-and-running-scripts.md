# The REPL and Running Scripts

## Why It Matters

Node.js can run full applications, but it is also useful as a small interactive tool. The REPL helps you test expressions quickly, inspect APIs, and build confidence before writing a full script. Script execution teaches you how Node.js receives arguments, resolves files, exits, and reports errors.

## Core Concepts

### The REPL

REPL means Read, Evaluate, Print, Loop. Start it with:

```bash
node
```

Then type JavaScript:

```js
1 + 2
['a', 'b'].map((value) => value.toUpperCase())
```

The REPL supports `await` in modern Node.js:

```js
const response = await fetch('https://example.com')
response.status
```

Exit with `.exit` or `Ctrl+D`.

### Running files

Most real code lives in files:

```js
// greet.mjs
const name = process.argv[2] ?? 'friend';
console.log(`Hello, ${name}`);
```

Run it:

```bash
node greet.mjs Ada
```

`process.argv` contains the executable path, script path, and user arguments. For simple scripts, reading it directly is fine. For complex CLIs, use a small parser or a CLI framework.

### Standard input and output

Node.js programs can read from standard input and write to standard output. This makes them composable in shells.

```js
import { stdin, stdout } from 'node:process';

stdin.setEncoding('utf8');

let input = '';

stdin.on('data', (chunk) => {
  input += chunk;
});

stdin.on('end', () => {
  stdout.write(input.toUpperCase());
});
```

Run:

```bash
echo "hello" | node upper.mjs
```

## Syntax and Examples

### Inline evaluation

Use `node -e` for one-off commands:

```bash
node -e "console.log(new Date().toISOString())"
```

Use `node -p` to print the expression result:

```bash
node -p "process.platform"
```

### Watch mode

Recent Node.js versions include watch mode:

```bash
node --watch server.mjs
```

This restarts the process when imported files change. It is useful during development, but production process management should use a process manager, container orchestrator, or platform service.

### Exit codes

Exit codes communicate success or failure to shells and CI:

```js
if (!process.env.API_KEY) {
  console.error('Missing API_KEY');
  process.exitCode = 1;
} else {
  console.log('Ready');
}
```

Prefer setting `process.exitCode` when possible. Calling `process.exit()` ends the process immediately and may skip pending writes or cleanup.

## Common Mistakes

- Testing too much in the REPL and forgetting to save repeatable scripts.
- Logging errors to standard output instead of standard error.
- Using `process.exit()` in the middle of async cleanup.
- Assuming command line arguments are already validated.
- Writing scripts that depend on the current working directory without checking it.

## Practical Challenge

Write `word-count.mjs`. It should read text from standard input and print the number of lines, words, and characters.

Example:

```bash
echo "Node makes scripts practical" | node word-count.mjs
```

Hints:

- Use `process.stdin`.
- Split words on whitespace.
- Print errors to `console.error`.

## Recap

The REPL is for quick exploration. Scripts are for repeatable work. Node.js programs interact with the shell through arguments, environment variables, standard streams, and exit codes. Learning these basics makes Node.js useful before you even build a server.
