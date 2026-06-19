# Node Test Runner, Vitest, and Jest

## Why It Matters

Node has a built-in test runner, while Vitest and Jest provide richer ecosystems. Choosing a runner affects configuration, mocking APIs, watch mode, coverage, ESM support, and team familiarity.

## Core Concepts

- `node:test` is built into Node and works well for lightweight tests.
- Vitest is fast, ESM-friendly, and popular in Vite/frontend-adjacent projects.
- Jest has a large ecosystem and mature mocking features.
- Assertions can come from `node:assert/strict`, runner APIs, or third-party libraries.
- Consistency matters more than using every feature a runner provides.

## Flow to Remember

The runner discovers test files, executes test cases, reports failures, optionally collects coverage, and exits with a code CI can trust.

## Syntax and Examples

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

describe('normalizeEmail', () => {
  it('trims and lowercases email addresses', () => {
    assert.equal(normalizeEmail(' USER@Example.COM '), 'user@example.com');
  });
});

// Run with: node --test
```

## Use Cases and Tradeoffs

- Use `node:test` for libraries, services, and projects that value minimal dependencies.
- Use Vitest when you want fast watch mode, snapshots, and modern ESM ergonomics.
- Use Jest when your team already has Jest patterns or needs its ecosystem.
- Run tests in CI with deterministic environment variables and isolated databases.

## Common Mistakes

- Mixing runner globals and assertion styles without team conventions.
- Testing ESM modules with CommonJS-only configuration copied from old projects.
- Relying on watch mode behavior that CI does not use.
- Ignoring coverage quality and chasing only coverage percentage.

## Practical Challenge

Write the same `normalizeEmail` test using `node:test`, then outline how it would look in Vitest or Jest. Note which syntax changes.

## Recap

- Node now includes a capable test runner.
- Vitest and Jest add ecosystem features.
- Pick one primary style and keep tests consistent.

