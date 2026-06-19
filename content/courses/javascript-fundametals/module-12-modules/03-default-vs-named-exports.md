# Default vs Named Exports

JavaScript modules have two main export styles:

- named exports
- default exports

Understanding the difference helps you avoid many import errors.

## Named Exports

Named exports export values by their exact names.

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

Import named exports with curly braces:

```js
import { add, subtract } from "./math.js";
```

The names must match the exported names.

```js
add(2, 3);
subtract(5, 2);
```

## Default Exports

A default export is the main value exported by a module.

```js
// logger.js
export default function log(message) {
  console.log(`[LOG] ${message}`);
}
```

Import a default export without curly braces:

```js
import log from "./logger.js";

log("App started");
```

A module can have only one default export.

## Default Export Names Are Flexible

When importing a default export, you can choose the local name.

```js
import log from "./logger.js";
```

This also works:

```js
import writeLog from "./logger.js";
```

The default export does not require the import name to match.

This can be useful, but it can also reduce consistency if different files use different names for the same export.

## Named Export Names Must Match

Named exports are different.

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

Correct:

```js
import { add } from "./math.js";
```

Incorrect:

```js
import { sum } from "./math.js";
```

Unless the module exports `sum`, this fails.

To rename a named import, use `as`:

```js
import { add as sum } from "./math.js";
```

## Exporting Default Values

You can default-export functions:

```js
export default function createUser(name) {
  return { name };
}
```

You can default-export classes:

```js
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

You can default-export objects:

```js
const config = {
  apiUrl: "https://api.example.com",
};

export default config;
```

You can also default-export expressions:

```js
export default {
  theme: "dark",
};
```

For beginner code, named declarations are often easier to read and debug.

## Combining Default and Named Exports

A module can have one default export and multiple named exports.

```js
// api.js
export const apiUrl = "https://api.example.com";

export function buildUrl(path) {
  return `${apiUrl}${path}`;
}

export default function request(path) {
  return fetch(buildUrl(path));
}
```

Import them together:

```js
import request, { apiUrl, buildUrl } from "./api.js";
```

The default import comes first.

Named imports go inside curly braces.

## Named vs Default: Which Should You Use?

There is no single rule for every project.

But these guidelines help.

Use named exports when a file exports multiple utilities:

```js
export function formatDate(date) {}
export function formatCurrency(amount) {}
```

Use a default export when a module has one clear main purpose:

```js
export default function createRouter() {}
```

Many teams prefer named exports because they make refactoring and searching easier.

Some frameworks and libraries use default exports frequently.

Follow your project's style.

## Why Named Exports Are Often Clearer

Named exports make imports consistent.

```js
import { formatDate } from "./formatters.js";
```

Every file imports the same name.

Default exports can be renamed freely:

```js
import format from "./formatters.js";
import formatDate from "./formatters.js";
import dateFormatter from "./formatters.js";
```

This flexibility can become confusing.

## Common Import Syntax

Named export:

```js
export function add(a, b) {
  return a + b;
}
```

```js
import { add } from "./math.js";
```

Default export:

```js
export default function add(a, b) {
  return a + b;
}
```

```js
import add from "./math.js";
```

Default plus named:

```js
import request, { buildUrl } from "./api.js";
```

Namespace import for named exports:

```js
import * as math from "./math.js";
```

## Best Practices

Use named exports for utility modules.

Use default exports only when there is one obvious main export.

Do not mix styles randomly.

Keep import names clear and consistent.

Avoid exporting too many unrelated things from one file.

If a module has many exports, consider splitting it.

## Common Mistakes

### Mistake 1: Using Curly Braces for a Default Export

```js
// logger.js
export default function log(message) {}
```

Incorrect:

```js
import { log } from "./logger.js";
```

Correct:

```js
import log from "./logger.js";
```

### Mistake 2: Omitting Curly Braces for a Named Export

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

Incorrect:

```js
import add from "./math.js";
```

Correct:

```js
import { add } from "./math.js";
```

### Mistake 3: Having More Than One Default Export

```js
export default function add() {}
export default function subtract() {}
```

A module can have only one default export.

Use named exports for multiple values.

## Quick Check

How do you import this?

```js
export function add(a, b) {
  return a + b;
}
```

Answer:

```js
import { add } from "./math.js";
```

How do you import this?

```js
export default function add(a, b) {
  return a + b;
}
```

Answer:

```js
import add from "./math.js";
```

## Summary

Named and default exports use different syntax.

- Named exports are imported with curly braces.
- Named export names must match unless aliased.
- Default exports are imported without curly braces.
- A module can have only one default export.
- A module can have many named exports.
- You can combine one default export with named exports.
- Named exports are often clearer for utility modules.
