# Environment Variables and Config Validation

## Why It Matters

Configuration controls ports, database URLs, secrets, feature flags, and third-party endpoints. Invalid configuration should fail at startup, not halfway through handling a production request.

## Core Concepts

- Environment variables are strings or undefined at runtime.
- Parse and validate config once during startup.
- Separate secrets from non-secret config and avoid logging secret values.
- Provide defaults only for safe local-development values.
- Expose a typed config object to the rest of the app.

## Flow to Remember

The process starts, config code reads `process.env`, validates required values, converts types, freezes or exports config, and the app starts only if config is valid.

## Syntax and Examples

```js
import process from 'node:process';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function numberFromEnv(name, fallback) {
  const raw = process.env[name] ?? String(fallback);
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
  return value;
}

export const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: numberFromEnv('PORT', 3000),
  databaseUrl: required('DATABASE_URL'),
  webhookSecret: required('WEBHOOK_SECRET')
});
```

## Use Cases and Tradeoffs

- Validate config before creating database pools, HTTP clients, and servers.
- Use `.env` files for local development, not as the production secret source.
- Use schema libraries for larger apps.
- Document required variables with examples that do not include real secrets.

## Common Mistakes

- Using `process.env.PORT` as a number without conversion.
- Defaulting production secrets to development values.
- Reading environment variables throughout the codebase.
- Printing full database URLs or API keys in startup logs.

## Practical Challenge

Create a config module that validates `PORT`, `DATABASE_URL`, `NODE_ENV`, and `CORS_ORIGIN`. Make invalid values throw before the server starts.

## Recap

- Environment variables are untyped input.
- Validate configuration at startup.
- Central config keeps the rest of the app predictable.

