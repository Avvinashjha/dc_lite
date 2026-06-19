# Dependency Security

React apps depend on many packages: React itself, bundlers, routers, state libraries, test tools, UI libraries, icon packs, and build plugins.

Dependencies save time, but they also add security, maintenance, and supply-chain risk.

## Why Frontend Dependencies Matter

Frontend packages can run in two places:

- in the browser, where users execute bundled code
- during development or builds, where packages can access files and environment variables

A malicious build plugin can be more dangerous than a small browser utility because it may run on developer machines or CI.

## Read Before Installing

Before adding a dependency, check:

- whether the package is actively maintained
- download and release history
- open security issues
- license compatibility
- bundle size impact
- whether it runs at build time or runtime
- whether a native browser API already solves the problem

Small utilities are not automatically safe. Popular packages are not automatically safe either.

## Lockfiles

Lockfiles record exact dependency versions.

Common lockfiles:

- `package-lock.json`
- `yarn.lock`
- `pnpm-lock.yaml`

Commit lockfiles for applications so installs are reproducible.

Without a lockfile, a fresh install may pull different transitive dependency versions than the one you tested.

## Audits and Updates

Use audit tools as signals, not as autopilot.

```bash
npm audit
npm outdated
```

For each finding, ask:

- Is the vulnerable package included in production code?
- Is it a build-time or development-only dependency?
- Is the vulnerable function reachable in this app?
- Is there a safe upgrade path?
- Does the fix introduce breaking changes?

Do not ignore critical findings, but also do not blindly upgrade major versions without testing.

## Bundle Awareness

Every runtime dependency can affect performance and attack surface.

Use bundle inspection to understand what ships to users.

```bash
npm run build
```

Then inspect generated chunks with your bundler's analyzer or build output. Watch for accidentally bundling:

- server-only packages
- large date or utility libraries for one function
- test helpers
- admin-only code in public routes
- duplicate versions of the same package

## Third-Party Scripts

Analytics, chat widgets, maps, payment widgets, and tag managers can run code on your page.

Treat third-party scripts as privileged:

- load only what you need
- restrict domains with CSP when possible
- avoid passing sensitive data
- review data-sharing settings
- monitor script failures and performance cost
- isolate risky content with iframes when appropriate

If a third-party script can run arbitrary JavaScript on your page, it can potentially read page content and interact with your app.

## Environment and CI Risk

Build tools often run with access to environment variables.

Avoid:

- exposing production secrets to preview builds
- running untrusted install scripts with broad permissions
- printing tokens in build logs
- using pull request workflows that expose secrets to untrusted code
- installing packages from unknown registries without verification

Frontend security includes the pipeline that creates the bundle.

## Common Mistakes

- Adding packages for tiny problems that native APIs handle.
- Ignoring lockfile changes in code review.
- Running `npm audit fix --force` without testing.
- Assuming dev dependencies cannot matter.
- Loading third-party scripts without a data and CSP review.
- Keeping unused packages after refactors.

:::quiz
question: Why can a build-time dependency be security-sensitive?
options:
  - It may run on developer machines or CI with access to files and environment variables
  - It is never executed anywhere
  - It automatically becomes a browser cookie
  - It prevents all dependency updates
answer: 0
explanation: Build-time tools can execute during install, development, or CI and may have access to sensitive files, tokens, and build output.
:::

## Practice Challenge

Choose one React project and audit its dependencies. Identify one package that ships to the browser, one build-time package, one unused package candidate, and one package with a newer version. Explain the risk and upgrade plan for each.

## Recap

Dependency security is about reducing unnecessary packages, reviewing what runs in the browser and build pipeline, committing lockfiles, responding thoughtfully to audit findings, and treating third-party scripts as powerful code.
