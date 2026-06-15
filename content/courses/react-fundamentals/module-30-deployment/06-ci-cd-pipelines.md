# CI/CD Pipelines

CI/CD means continuous integration and continuous deployment or delivery.

For a React app, CI checks whether a change is safe to merge. CD deploys the app after the change is accepted. Together, they reduce "works on my machine" releases.

## What CI Should Check

A practical React CI pipeline usually runs:

- dependency installation
- linting
- formatting check, if the project uses a formatter
- type checking, if using TypeScript
- unit tests
- component tests
- production build
- optional end-to-end smoke tests

Example scripts:

```json
{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "vite build"
  }
}
```

Then CI can run:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

## Example GitHub Actions Workflow

```yaml
name: React CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

Adjust commands to match your project. Do not add fake scripts just because a sample workflow includes them.

## Deployment Pipeline

A simple deployment pipeline:

1. Open a pull request.
2. CI runs checks.
3. A preview deployment is created.
4. The team reviews code and UI.
5. The branch is merged into `main`.
6. Production deployment runs.
7. Smoke tests check the deployed app.
8. Monitoring watches for errors.

For learning projects, steps 1-6 may be enough. For real products, smoke tests and monitoring matter.

## Environment Variables in CI

CI needs environment variables for builds and tests.

Examples:

- public API base URL
- test analytics key
- feature flag defaults
- deployment token

Rules:

- store secrets in the CI provider's secret manager
- never print secrets in logs
- keep production secrets separate from preview secrets
- document required variables in the README
- fail clearly when required variables are missing

## Caching in CI

CI caches can speed up installs and builds.

Common caches:

- npm, pnpm, or Yarn package cache
- framework build cache
- Playwright browser cache

Be careful:

- cache dependencies, not `node_modules`, unless your tool recommends it
- invalidate caches when lockfiles change
- do not cache secrets
- debug flaky builds by temporarily disabling cache

## Quality Gates

A quality gate prevents risky code from being merged or deployed.

Examples:

- required CI status checks
- minimum test coverage for changed code
- bundle size budgets
- accessibility checks
- end-to-end smoke tests
- manual approval before production deployment

Bundle budgets are useful for React apps because dependency additions can quietly make the app much slower.

## Common Mistakes

- Running tests but not running a production build.
- Using `npm install` in CI when `npm ci` is available.
- Letting CI use a different Node version from production.
- Storing deployment tokens in repository files.
- Making flaky tests optional instead of fixing them.
- Deploying every branch to production.
- Ignoring failed preview deployments because local dev works.

## Edge Cases

Monorepos:

Set the working directory correctly and cache dependencies for the right package manager.

End-to-end tests:

Start the built app, wait for it to be ready, then run tests against that server.

Deployment race conditions:

If two commits merge quickly, make sure the newest successful deployment wins.

:::quiz
question: Which CI check is especially important because it catches issues that the development server may hide?
options:
  - Production build
  - Git username
  - README word count
  - Browser bookmark count
answer: 0
explanation: A production build catches bundling, environment, type, and optimization issues that may not appear in a dev server.
:::

## Practice Challenge

Add CI to a React app.

Requirements:

- run dependency installation from the lockfile
- run linting
- run tests
- run a production build
- cache package manager downloads
- document required environment variables
- block merging when CI fails

Extension:

Add a smoke test that opens the deployed home page and checks for one visible heading.

## Recap

CI/CD makes React deployments repeatable. A useful pipeline installs from the lockfile, checks quality, builds production assets, protects secrets, creates previews, and deploys only reviewed code.
