# Practical Secure Coding Habits

Security improves when small safe habits become normal.

You do not need to be a security expert to write safer JavaScript.

You do need to slow down around trust boundaries.

## Find Trust Boundaries

A trust boundary is a place where data moves from one level of trust to another.

Examples:

- browser to server
- server to browser
- user input to DOM
- third-party API to your app
- localStorage to app state
- URL parameter to database query

When data crosses a trust boundary, validate it and use it carefully.

## Keep Data and Code Separate

Many security problems happen when data is accidentally treated as code.

Safer patterns:

- use `textContent` for text
- use `addEventListener` for events
- use `URLSearchParams` for query strings
- use `JSON.stringify()` for JSON request bodies
- use allow lists for user-selected actions

Riskier patterns:

- using `innerHTML` with untrusted data
- building code strings
- using `eval()`
- accepting unexpected object keys
- trusting hidden form values

## Validate Before Important Actions

Validate data before actions that matter.

```js
function parseQuantity(value) {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Quantity must be between 1 and 99");
  }

  return quantity;
}
```

This kind of validation helps the frontend avoid bad requests.

The server should still repeat important validation.

## Fail Safely

When something unexpected happens, choose the safer behavior.

```js
function canShowAdminPanel(user) {
  return user?.role === "admin";
}
```

If `user` is missing or malformed, the function returns `false`.

It does not accidentally show privileged UI.

Remember: UI checks are not enough for authorization, but they should still fail safely.

## Rate Limiting Concepts

Rate limiting controls how often an action can happen.

It is usually enforced on the server.

It can help protect:

- login attempts
- password reset emails
- form submissions
- expensive API endpoints
- search endpoints

The frontend can support rate limiting by disabling buttons temporarily or showing retry messages.

```js
submitButton.disabled = true;

try {
  await submitForm();
} finally {
  submitButton.disabled = false;
}
```

This improves user experience.

It does not replace server-side rate limits.

## Use HTTPS

Production web apps should use HTTPS.

HTTPS protects data in transit between the browser and server.

It is also required for many modern browser features and secure cookie behavior.

Do not send sensitive data over plain HTTP.

## Review Security-Sensitive Changes

Some changes deserve extra attention:

- authentication flows
- authorization checks
- payment flows
- file uploads
- HTML rendering
- dependency updates
- token storage
- server error handling
- CORS and cookie settings

Ask for review when a change touches one of these areas.

## Use the Principle of Least Privilege

Give code, users, and tokens only the access they need.

Examples:

- a read-only token should not be able to write data
- a user profile endpoint should not return private admin fields
- a public API key should be restricted by domain or quota
- a frontend role should not decide server permissions

Less access means fewer things can go wrong.

## Security Checklist

Before shipping a feature, ask:

- Is all important input validated on the server?
- Are untrusted values rendered with safe DOM APIs?
- Are secrets kept out of frontend code?
- Are cookies and tokens stored intentionally?
- Are authorization checks enforced on the server?
- Are errors useful without leaking internals?
- Are dependencies necessary and maintained?
- Could repeated requests cause abuse or high cost?

## Common Mistakes

Do not treat security as only a backend concern.

Do not rely on the UI to enforce permissions.

Do not keep sensitive tokens longer than needed.

Do not ignore unexpected data shapes.

Do not skip review for changes that touch authentication or HTML rendering.

## Summary

Secure coding is built from repeatable habits.

Find trust boundaries, keep data and code separate, validate important inputs, fail safely, and rely on the server for final security decisions.
