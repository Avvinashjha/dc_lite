# Environment Variables

Environment variables let you configure a React app for different environments, such as local development, staging, and production. In frontend apps, they require extra care because anything included in the client bundle can be viewed by users.

## Public by Default After Bundling

In a browser app, environment variables are not read from the server at runtime unless your hosting setup injects configuration separately. Build tools replace allowed variables during the build.

```js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

After build, that value is usually plain text inside a JavaScript file.

## Vite Naming

Vite exposes only variables prefixed with `VITE_`.

```env
VITE_API_BASE_URL=https://api.example.com
VITE_SENTRY_DSN=https://public-dsn.example
```

This prefix is a reminder: the value is client-visible. It is not a security boundary for secrets.

## What Belongs in Frontend Env Vars

Usually safe:

- public API base URL
- analytics public key
- feature flag identifier
- public Sentry DSN
- app version or build SHA

Not safe:

- database URL
- private API key
- JWT signing secret
- service account JSON
- admin token

## Build-Time vs Runtime Config

A static React build often bakes configuration into the bundle. If you build once and deploy the same files to multiple environments, build-time variables can be a problem.

Runtime config patterns include:

- serving `/config.json` from the environment
- injecting a small script before the app loads
- using server-side rendering or edge functions to provide config

Example runtime config shape:

```html
<script>
  window.__APP_CONFIG__ = {
    apiBaseUrl: 'https://api.example.com'
  };
</script>
```

Validate this object before using it. A missing config value should fail loudly during startup, not produce confusing API calls later.

## Source Maps and Secrets

Source maps do not create secrets, but they can make exposed code easier to read. If a secret appears in your source, source maps can make the mistake easier to discover. The real fix is to keep secrets out of frontend code entirely.

## Common Mistakes

- Prefixing a secret with `VITE_` and assuming it is protected.
- Changing an environment variable in hosting settings without rebuilding a static app.
- Using different variable names locally and in CI.
- Forgetting to document required variables.
- Reading env vars deep in components instead of centralizing config validation.

:::quiz
question: Which value should not be placed in a React frontend environment variable?
options:
  - A private token that can access an admin API
  - A public API base URL
  - A public analytics measurement id
  - A build version string
answer: 0
explanation: Frontend environment variables are bundled into client code. Private tokens and secrets must stay on a trusted server.
:::

## Practice Challenge

Create a `config.js` module that reads `import.meta.env.VITE_API_BASE_URL`, validates that it exists, and exports a typed or documented config object. Then replace direct environment reads in components with imports from that config module.

## Recap

Frontend environment variables are configuration, not secret storage. Centralize them, validate them, document them, and remember that build-time values may require a rebuild to change.
