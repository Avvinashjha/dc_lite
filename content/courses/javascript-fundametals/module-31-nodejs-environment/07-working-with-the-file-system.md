# Working with the File System

Node.js can read, write, create, and delete files.

This is one of the biggest differences between Node.js and browser JavaScript.

Browser JavaScript is sandboxed for user safety. Node.js scripts can access the machine they run on, so file system code must be written carefully.

## Use the Promise API

Modern Node code often imports from `node:fs/promises`.

```js
import { readFile } from "node:fs/promises";

const text = await readFile("notes.txt", "utf8");

console.log(text);
```

This works well with `async` and `await`.

## Reading Text Files

Pass an encoding when reading text.

```js
import { readFile } from "node:fs/promises";

const config = await readFile("config.json", "utf8");

console.log(config);
```

Without `"utf8"`, Node returns a `Buffer`.

```js
const data = await readFile("config.json");

console.log(Buffer.isBuffer(data)); // true
```

Use a string encoding for text.

Use a buffer for binary data.

## Parsing JSON Files

JSON files contain text.

Read the file, then parse it.

```js
import { readFile } from "node:fs/promises";

const text = await readFile("settings.json", "utf8");
const settings = JSON.parse(text);

console.log(settings.theme);
```

`JSON.parse()` can throw if the file is not valid JSON.

```js
try {
  const text = await readFile("settings.json", "utf8");
  const settings = JSON.parse(text);

  console.log(settings);
} catch (error) {
  console.error("Could not load settings");
  console.error(error.message);
}
```

## Writing Files

Use `writeFile()` to create or replace a file.

```js
import { writeFile } from "node:fs/promises";

await writeFile("message.txt", "Hello from Node\n", "utf8");
```

Be careful: `writeFile()` replaces the file if it already exists.

## Appending Files

Use `appendFile()` to add content to the end of a file.

```js
import { appendFile } from "node:fs/promises";

await appendFile("app.log", "Started app\n", "utf8");
```

Appending is useful for simple logs.

For production logging, teams usually use a logging library or platform service.

## Creating Directories

Use `mkdir()`.

```js
import { mkdir } from "node:fs/promises";

await mkdir("output", { recursive: true });
```

`recursive: true` means Node will not fail if the directory already exists, and it can create parent directories as needed.

## Listing Directory Contents

Use `readdir()`.

```js
import { readdir } from "node:fs/promises";

const files = await readdir("data");

for (const file of files) {
  console.log(file);
}
```

You can ask for directory entry objects:

```js
const entries = await readdir("data", { withFileTypes: true });

for (const entry of entries) {
  console.log(entry.name, entry.isFile());
}
```

## Deleting Files

Use `unlink()` to delete a file.

```js
import { unlink } from "node:fs/promises";

await unlink("old-output.txt");
```

Be careful with delete operations.

Never delete paths built from untrusted input without validation.

## Checking File Information

Use `stat()`.

```js
import { stat } from "node:fs/promises";

const info = await stat("notes.txt");

console.log(info.size);
console.log(info.isFile());
console.log(info.isDirectory());
```

This can help you decide how to process a path.

## Relative Paths

Relative paths are resolved from the current working directory.

```js
console.log(process.cwd());
```

If you run a script from a different directory, a relative path may point somewhere else.

For project scripts, this is often fine.

For reusable modules, pass file paths in explicitly or carefully build paths from a known base.

## Safer Path Building

Use `path.join()`.

```js
import path from "node:path";
import { readFile } from "node:fs/promises";

const filePath = path.join("data", "users.json");
const text = await readFile(filePath, "utf8");

console.log(text);
```

Avoid:

```js
const filePath = "data/" + fileName;
```

Manual path building is easy to get wrong.

## File System Errors

File operations can fail.

Examples:

- file does not exist
- permission denied
- invalid path
- disk is full
- path is a directory when you expected a file

Handle errors where you can provide useful behavior.

```js
import { readFile } from "node:fs/promises";

try {
  const text = await readFile("notes.txt", "utf8");
  console.log(text);
} catch (error) {
  if (error.code === "ENOENT") {
    console.error("notes.txt does not exist");
  } else {
    throw error;
  }
}
```

`ENOENT` means the file or directory was not found.

## Security Cautions

File system code can be dangerous when paths come from users.

Avoid this:

```js
const fileName = process.argv[2];
const text = await readFile(`uploads/${fileName}`, "utf8");
```

A malicious user might pass a path like:

```text
../../secret.txt
```

This is called path traversal.

Safer code validates allowed filenames or resolves paths and checks that they stay inside an expected directory.

## Common Mistakes

Do not forget `await`.

```js
const text = readFile("notes.txt", "utf8"); // Promise, not text
```

Do not parse JSON before reading file text.

Do not ignore file system errors.

Do not delete or overwrite files unless you are sure the path is correct.

Do not store secrets in files that are committed to git.

## Summary

Node.js can work directly with files and directories through `node:fs/promises`.

Use encodings for text, handle file system errors, build paths carefully, and treat file paths from users as untrusted input.
