# Dependencies, Secrets, and Error Handling

Modern JavaScript apps depend on many packages and services.

Security is not only about your own functions.

It also includes:

- package choices
- dependency updates
- secret handling
- error messages
- logging
- deployment settings

## Choose Dependencies Carefully

Packages can save time.

They can also add risk.

Before adding a package, ask:

- Do we really need this dependency?
- Is it actively maintained?
- Does it have many unnecessary permissions or features?
- Is there a smaller built-in API that solves the problem?
- Does the team already use a similar package?

For example, use `URLSearchParams` instead of adding a package just to build query strings.

```js
const params = new URLSearchParams({
  q: "javascript security",
  page: "1",
});
```

## Keep Dependencies Updated

Security fixes often arrive as package updates.

Use the tooling your project already has.

Common examples:

```bash
npm audit
npm outdated
```

Do not update packages blindly in a production app.

Read release notes, run tests, and pay attention to major version changes.

## Lockfiles Matter

Files like `package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml` record exact dependency versions.

They help teams install the same dependency tree.

Commit lockfiles for apps.

Review unexpected lockfile changes carefully.

## Secrets Do Not Belong in Frontend Code

Frontend code is visible to users.

These should not be placed in browser JavaScript:

- private API keys
- database URLs
- signing secrets
- service account credentials
- production tokens

Environment variables in frontend build tools may still be bundled into public JavaScript if they are used by client code.

Only expose values that are meant to be public.

## Public Config vs Secret Config

Some values are safe to expose.

Examples:

- public analytics IDs
- public API base URLs
- feature flags that do not reveal sensitive logic

Secrets must stay on the server.

If the frontend needs an action that requires a secret, call your backend.

```js
await fetch("/api/send-invite", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
});
```

The backend can validate the request, check permissions, and use the secret safely.

## Safe Error Handling

Error messages should help users without revealing too much.

```js
try {
  await savePaymentMethod(formData);
  showMessage("Payment method saved.");
} catch (error) {
  console.error(error);
  showError("We could not save your payment method. Please try again.");
}
```

The user sees a helpful general message.

The developer logs the detailed error.

## Do Not Leak Sensitive Details

Avoid showing raw internal errors to users.

Risky details include:

- stack traces
- SQL queries
- file paths
- access tokens
- private request headers
- internal service names

During development, detailed errors are useful.

In production, show safer messages and send details to secure logs.

## Be Careful with Logs

Logs are useful for debugging.

They can also leak private data.

Avoid logging:

- passwords
- full tokens
- session cookies
- credit card data
- sensitive personal information

If you need to identify a token or ID in logs, use a short prefix or a separate safe identifier.

## Common Mistakes

Do not add a package when a platform API already solves the problem.

Do not ignore dependency warnings forever.

Do not commit real secrets.

Do not assume frontend environment variables are private.

Do not show raw server errors to users in production.

Do not log sensitive values.

## Summary

Dependencies, secrets, and errors are part of application security.

Use fewer dependencies when reasonable, keep packages updated, keep secrets on the server, and show users safe error messages.
