# Module Pattern

The module pattern organizes related code into a private scope and exposes only what other files need.

Modern JavaScript has built-in modules with `import` and `export`.

The core idea is still the same:

- keep implementation details private
- expose a small public API
- group related behavior together

## Why Modules Matter

Without modules, code can become a collection of global variables and functions.

```js
let currentUser = null;

function setUser(user) {
  currentUser = user;
}

function getUserName() {
  return currentUser.name;
}
```

Any script could accidentally change `currentUser`.

Modules help limit what can be accessed from outside.

## ES Module Example

```js
// userSession.js
let currentUser = null;

export function signIn(user) {
  currentUser = user;
}

export function signOut() {
  currentUser = null;
}

export function getCurrentUser() {
  return currentUser;
}
```

The variable `currentUser` is private to the module.

Other files can only use the exported functions.

```js
// app.js
import { signIn, getCurrentUser } from "./userSession.js";

signIn({ id: 1, name: "Ada" });

console.log(getCurrentUser().name); // Ada
```

## Private Implementation Details

A module can expose a clean function while hiding helper functions.

```js
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return email.includes("@");
}

export function createUser(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Invalid email");
  }

  return {
    email: normalizedEmail,
    active: true,
  };
}
```

Only `createUser` is exported.

The helpers can change later without affecting importing files.

## The Older Closure-Based Module Pattern

Before ES modules were common, developers often used closures.

```js
const counterModule = (() => {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    reset() {
      count = 0;
    },
  };
})();

console.log(counterModule.increment()); // 1
console.log(counterModule.increment()); // 2
```

`count` is private because only the returned methods can access it.

You will still see this pattern in older code and some browser scripts.

## Module State

Modules can hold state.

That can be useful, but it should be done carefully.

```js
let token = null;

export function setToken(nextToken) {
  token = nextToken;
}

export function getToken() {
  return token;
}
```

This creates shared state for every file that imports the module.

That may be fine for a small app session store.

It may be risky if tests run in the same process and forget to reset the state.

## Prefer Explicit Inputs When Possible

Instead of hiding everything inside module state, often pass values directly.

```js
export function createAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
```

This function is easier to test because the token is an input.

## Named Exports vs Default Export

Named exports work well for modules that expose several related utilities.

```js
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export function formatPercent(value) {
  return `${value * 100}%`;
}
```

Default exports work well when a module has one main value.

```js
export default function createLogger(prefix) {
  return (message) => console.log(`[${prefix}] ${message}`);
}
```

Follow the style already used in your project.

## Common Mistakes

### Exporting Everything

If every helper is exported, the module no longer hides its implementation.

Export only the functions other modules truly need.

### Creating Hidden Global State

Module variables are shared.

If many functions read and write them, the module can become difficult to reason about.

### Mixing Too Many Responsibilities

A module named `utils.js` can become a dumping ground.

Prefer modules with clear responsibilities, such as `dateFormatters.js`, `cartTotals.js`, or `userSession.js`.

## Best Practices

- Keep module APIs small.
- Name modules after the responsibility they own.
- Keep private helpers unexported.
- Prefer pure exported functions when possible.
- Be cautious with module-level mutable state.
- Avoid circular imports.

## Summary

The module pattern keeps related code together and hides details that other files do not need.

Modern JavaScript modules give you this pattern through `import` and `export`.

Good modules make code easier to understand because they expose a small, stable API and keep implementation details local.

