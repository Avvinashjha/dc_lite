# Lockfiles and Repeatable Installs

## Why It Matters

`package.json` describes allowed dependency ranges. A lockfile records the exact dependency tree installed. Without a lockfile, two developers can install different transitive versions from the same `package.json`.

Repeatable installs are essential for debugging, CI, deployments, and security review.

## Core Concepts

npm uses `package-lock.json`. It records:

- Exact package versions
- Resolved tarball URLs
- Integrity hashes
- Transitive dependency relationships

Applications should usually commit the lockfile. Libraries often commit it too for development repeatability, although published consumers resolve their own dependency trees.

## Syntax and Examples

Install dependencies:

```bash
npm install
```

Clean install from lockfile:

```bash
npm ci
```

`npm ci` is preferred in CI because it removes `node_modules`, requires the lockfile to match `package.json`, and installs exactly from the lockfile.

Update a dependency:

```bash
npm install lodash@latest
```

Update within allowed ranges:

```bash
npm update
```

## Lockfile Workflow

A typical application workflow:

1. Developer changes dependencies with `npm install` or `npm uninstall`.
2. npm updates `package.json` and `package-lock.json`.
3. The pull request includes both files.
4. CI runs `npm ci`.
5. Deployment installs from the lockfile.

Do not manually edit the lockfile unless you deeply understand the format and have a specific reason.

## Use Cases

Lockfiles help with:

- Reproducing bugs
- Stable CI
- Predictable deployments
- Dependency reviews
- Supply chain integrity checks
- Faster install planning

## Common Mistakes

- Deleting the lockfile to "fix" dependency problems without understanding the change.
- Committing `package.json` changes without the lockfile.
- Running `npm install` in CI when `npm ci` is better.
- Mixing npm, pnpm, and Yarn lockfiles in one project accidentally.
- Assuming a lockfile removes the need for updates. It freezes versions until you intentionally update.

## Practical Challenge

Create a small project, install a dependency, and inspect `package-lock.json`. Then delete `node_modules` and run `npm ci`. Confirm the installed version matches the lockfile.

## Recap

Lockfiles make dependency resolution repeatable. Use npm commands to update them, commit them for applications, and prefer `npm ci` for CI and deployment installs.
