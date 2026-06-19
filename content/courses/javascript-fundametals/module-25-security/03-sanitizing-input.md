# Sanitizing Input

Input handling is one of the most important security habits in JavaScript.

Every value that enters your app should be treated as untrusted until it has been checked.

Untrusted input can come from:

- forms
- query strings
- route parameters
- request bodies
- browser storage
- API responses
- uploaded files
- third-party widgets

## Validation vs Sanitization

Validation asks: "Is this value acceptable?"

Sanitization asks: "Can this value be cleaned into a safer form?"

They are related, but they are not the same.

## Validation Example

Validation rejects values that do not match your rules.

```js
function isValidUsername(username) {
  return /^[a-z0-9_]{3,20}$/i.test(username);
}

console.log(isValidUsername("alex_21")); // true
console.log(isValidUsername("a")); // false
console.log(isValidUsername("alex admin")); // false
```

This function defines what a username is allowed to be.

It does not try to clean every possible input.

It accepts or rejects.

## Sanitization Example

Sanitization transforms a value.

```js
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

const email = normalizeEmail("  ASHA@example.COM ");

console.log(email); // asha@example.com
```

This is useful for consistent storage and comparison.

But sanitization should not replace validation.

After normalizing, still validate the result.

```js
function isLikelyEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const email = normalizeEmail(input.value);

if (!isLikelyEmail(email)) {
  showError("Enter a valid email address.");
}
```

## Prefer Allow Lists

An allow list defines what is allowed.

```js
const allowedSortFields = new Set(["name", "price", "createdAt"]);

function getSortField(value) {
  if (allowedSortFields.has(value)) {
    return value;
  }

  return "createdAt";
}
```

This is usually safer than trying to list every bad value.

Bad-value lists are easy to miss.

Good-value lists are easier to reason about.

## Validate on the Server

Frontend validation improves user experience.

It does not protect the server by itself.

Users can change browser code, disable JavaScript, edit requests, or call your API directly.

Always validate important rules on the server too.

Frontend validation is helpful for:

- quick feedback
- fewer accidental bad requests
- better form messages

Server validation is required for:

- authorization
- payment amounts
- account ownership
- roles and permissions
- database writes

## Validate Data from APIs

Do not assume an API response has the exact shape you expected.

```js
function parseUser(data) {
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data.id !== "string" ||
    typeof data.name !== "string"
  ) {
    throw new Error("Invalid user response");
  }

  return {
    id: data.id,
    name: data.name,
  };
}
```

This kind of checking protects your UI from broken or unexpected data.

In larger apps, teams often use validation libraries to define schemas.

## Encode Values for URLs

When building URLs, use the platform APIs.

```js
const params = new URLSearchParams({
  search: searchInput.value,
  page: "1",
});

const response = await fetch(`/api/products?${params.toString()}`);
```

`URLSearchParams` handles URL encoding.

Avoid manually joining query strings with raw user input.

## Do Not Trust Hidden Inputs

Hidden form inputs are still user-controlled.

```html
<input type="hidden" name="role" value="user">
```

A browser user can edit this value before submitting.

Never rely on hidden inputs for permissions, prices, user IDs, or ownership checks.

The server should decide those values from trusted data.

## Common Mistakes

Do not only validate in the browser.

Do not confuse trimming a value with making it safe everywhere.

Do not use one sanitizer for every output context.

Do not accept unexpected object properties without thinking about how they are used.

Do not rely on hidden fields for security decisions.

## Summary

Validation decides whether input is acceptable.

Sanitization cleans or normalizes input.

Use allow lists, validate important rules on the server, and use built-in APIs like `URLSearchParams` for encoding.
