# The path Module

## Why It Matters

File paths look simple until your code runs on different operating systems, receives user input, or needs to resolve files relative to a module. The `node:path` module handles separators, extensions, directory names, and normalization in a platform-aware way.

Never build important file paths with manual string concatenation.

## Core Concepts

```js
import path from 'node:path';

const fullPath = path.join('content', 'courses', 'lesson.md');
console.log(fullPath);
```

On Unix-like systems this uses `/`. On Windows it uses `\`. Your code should usually not care.

Important functions:

- `path.join()` combines segments and normalizes separators.
- `path.resolve()` creates an absolute path.
- `path.dirname()` gets the parent directory.
- `path.basename()` gets the final portion.
- `path.extname()` gets the extension.
- `path.normalize()` cleans `.` and `..` segments.

## Syntax and Examples

### Joining and resolving

```js
import path from 'node:path';

console.log(path.join('uploads', 'images', 'avatar.png'));
console.log(path.resolve('uploads', 'images', 'avatar.png'));
```

`join` returns a normalized path from segments. `resolve` returns an absolute path based on the current working directory unless an absolute segment appears.

### ESM module-relative paths

CommonJS has `__dirname`. ESM uses `import.meta.url`:

```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'templates', 'email.html');
console.log(templatePath);
```

Use this when a file should be resolved relative to the module, not wherever the command was run.

### Guarding against path traversal

```js
import path from 'node:path';

const uploadRoot = path.resolve('uploads');
const requested = path.resolve(uploadRoot, '../secret.txt');

if (!requested.startsWith(`${uploadRoot}${path.sep}`)) {
  throw new Error('Path escapes upload directory');
}
```

Real security checks need careful handling, but the principle is important: normalize and compare absolute paths before trusting user-controlled file names.

## Use Cases

Use `node:path` when:

- Loading files relative to a module
- Writing cross-platform CLIs
- Handling upload paths
- Generating output files
- Inspecting extensions
- Separating names from directories

## Common Mistakes

- Concatenating paths with `/`.
- Confusing current working directory with module directory.
- Trusting `..` in user input.
- Using `path.join` for URLs. URLs use different rules; use `URL` for URLs.
- Assuming `path.extname('archive.tar.gz')` returns `.tar.gz`. It returns `.gz`.

## Practical Challenge

Write a script that accepts a file path and prints:

- Absolute path
- Directory name
- Base name
- Extension
- Whether it is inside the current working directory

Use only `node:path` and `node:process`.

## Recap

`node:path` makes path handling portable and safer. Use it whenever paths cross module boundaries, operating systems, or user input. Remember that file paths and URLs are different abstractions.
