# Writing Modular Code

Knowing import/export syntax is only the first step.

The real skill is deciding how to split code into modules.

Good modules make code easier to understand, test, reuse, and change.

Bad modules can make a project feel more confusing than one large file.

## What Makes a Good Module?

A good module has a clear purpose.

Examples:

```text
formatters.js     -> formatting values
apiClient.js      -> making API requests
cart.js           -> cart logic
validation.js     -> form validation helpers
userService.js    -> user-related operations
```

If you cannot describe a module's purpose in one sentence, it may be doing too much.

## Start With One File, Then Split

When learning, it is okay to start with one file.

As the file grows, look for groups of related code.

Example:

```js
function formatCurrency(amount) {}
function formatDate(date) {}
function validateEmail(email) {}
function validatePassword(password) {}
function fetchUser(id) {}
```

This could become:

```text
formatters.js
validation.js
userApi.js
```

Do not split too early just to create many files.

Split when it improves clarity.

## Example: Utility Module

```js
// formatters.js
export function formatCurrency(amount) {
  return `Rs.${amount.toFixed(2)}`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN").format(date);
}
```

Use it:

```js
// app.js
import { formatCurrency, formatDate } from "./formatters.js";

console.log(formatCurrency(2499));
console.log(formatDate(new Date()));
```

Utility modules usually work well with named exports.

## Example: Configuration Module

```js
// config.js
export const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
```

Use it:

```js
import { config } from "./config.js";

console.log(config.apiUrl);
```

Configuration modules should be simple and predictable.

Avoid putting too much logic in them.

## Example: Service Module

A service module groups operations around a domain concept.

```js
// userService.js
import { config } from "./config.js";

export async function getUser(id) {
  const response = await fetch(`${config.apiUrl}/users/${id}`);
  return response.json();
}

export async function updateUser(id, data) {
  const response = await fetch(`${config.apiUrl}/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return response.json();
}
```

This module focuses on user-related API operations.

## Keep Dependencies One-Way When Possible

Try to avoid circular dependencies.

A circular dependency happens when two modules import each other.

```text
a.js imports b.js
b.js imports a.js
```

This can make code harder to reason about and sometimes causes bugs.

If two modules depend on each other, consider extracting shared code into a third module.

```text
a.js
b.js
shared.js
```

Both `a.js` and `b.js` can import from `shared.js`.

## Avoid Giant Utility Files

A file named `utils.js` often becomes a dumping ground.

```text
utils.js
  formatDate
  validateEmail
  fetchUser
  calculateTax
  renderModal
```

These functions are unrelated.

Better:

```text
formatters.js
validators.js
tax.js
modal.js
```

Clear names make imports easier to understand.

## Export the Public API

Think of exports as the module's public API.

If another file does not need something, do not export it.

```js
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email) {
  const normalized = normalizeEmail(email);
  return normalized.includes("@");
}
```

`normalizeEmail` is private to the module.

`isValidEmail` is public.

This keeps modules easier to change later.

## Prefer Pure Helpers When Possible

Pure helper functions are easy to reuse and test.

```js
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

This function:

- receives input
- returns output
- does not depend on global state
- does not mutate external values

Pure helpers are excellent module exports.

## File Naming

Use names that describe purpose.

Good:

```text
cartTotals.js
userValidation.js
apiClient.js
dateFormatters.js
```

Less helpful:

```text
helpers.js
stuff.js
misc.js
common.js
```

Generic names are sometimes acceptable, but avoid making them dumping grounds.

## Index Files

Some projects use `index.js` to re-export files from a folder.

```text
utils/
  index.js
  formatters.js
  validators.js
```

You will learn re-exports and barrel files in the next lesson.

They can make imports shorter, but they should be used carefully.

## Best Practices

Give each module one clear responsibility.

Export only what other files need.

Prefer named exports for related utility functions.

Avoid circular dependencies.

Avoid giant `utils.js` files with unrelated functions.

Keep module-level state minimal and intentional.

Use clear file names.

## Common Mistakes

### Mistake 1: Splitting Too Much Too Early

Creating many tiny files can make beginner projects harder to follow.

Split when there is a clear reason.

### Mistake 2: Exporting Everything

```js
export function internalHelper() {}
export function publicFunction() {}
```

If `internalHelper` is only used inside the module, keep it private.

### Mistake 3: Creating Circular Dependencies

```text
cart.js imports checkout.js
checkout.js imports cart.js
```

Extract shared behavior into another module.

## Quick Check

Which module name is clearer for date formatting helpers?

```text
utils.js
```

or:

```text
dateFormatters.js
```

`dateFormatters.js` is clearer because it describes the module's purpose.

## Summary

Modular code is about organizing responsibility.

- Good modules have one clear purpose.
- Split files when it improves clarity.
- Export only the public API.
- Keep private helpers unexported.
- Avoid circular dependencies.
- Avoid dumping unrelated functions into `utils.js`.
- Use clear file names and predictable imports.
