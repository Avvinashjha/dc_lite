# Dependency Security and Auditing

## Why It Matters

Every dependency is code that runs in your project. It can contain vulnerabilities, malicious install scripts, abandoned maintainers, risky transitive dependencies, or accidental breaking changes.

Dependency security is not about avoiding packages entirely. It is about choosing them deliberately, updating them safely, and reducing unnecessary exposure.

## Core Concepts

### Direct and transitive dependencies

A direct dependency is listed in your `package.json`. A transitive dependency is installed because one of your dependencies needs it.

Your application may have a small `dependencies` list and still install hundreds of packages.

### npm audit

`npm audit` checks installed dependencies against known vulnerability advisories.

```bash
npm audit
```

Fix automatically where appropriate:

```bash
npm audit fix
```

Be careful with:

```bash
npm audit fix --force
```

`--force` may install breaking upgrades. Treat it like a code change that needs review and tests.

## Practical Evaluation Checklist

Before adding a dependency, ask:

- Does Node.js already provide this?
- Is the package actively maintained?
- How many dependencies does it bring?
- Does it run install scripts?
- Is the API stable?
- Is the license acceptable?
- Is the package name trustworthy?
- Can we remove it later without major churn?

Small packages are not automatically safe, and popular packages are not automatically correct.

## Syntax and Examples

### Inspecting dependency tree

```bash
npm ls package-name
```

Explain why a package is installed:

```bash
npm explain package-name
```

### Restricting production installs

```bash
npm ci --omit=dev
```

This installs runtime dependencies without development dependencies. Build pipelines often install dev dependencies to build and test, then deploy a smaller production artifact.

### Avoiding install scripts when appropriate

```bash
npm ci --ignore-scripts
```

This can reduce risk in some environments, but it can also break packages that legitimately need build steps. Use with understanding.

## Common Mistakes

- Treating `npm audit` output as the whole security program.
- Running forced fixes without reading the resulting version changes.
- Keeping unused dependencies.
- Adding packages for trivial helpers.
- Ignoring lockfile changes in review.
- Logging or committing npm tokens.
- Installing globally when a local dev dependency is safer and repeatable.

## Use Cases

Dependency security practices matter for:

- Public web apps
- CI pipelines
- CLI tools installed by users
- Internal services with sensitive data
- Packages published for others
- Projects with strict compliance requirements

## Practical Challenge

Choose one dependency in a project and investigate it:

1. Why is it installed?
2. Is it direct or transitive?
3. How many packages depend on it?
4. Does `npm audit` report anything?
5. Could a built-in Node.js module replace it?

Write a short recommendation: keep, update, replace, or remove.

## Recap

Dependency security is ongoing maintenance. Use audits, lockfiles, reviews, and conservative package choices together. The safest dependency is the one you do not need, but the right dependency can still be worth it when it is maintained and clearly valuable.
