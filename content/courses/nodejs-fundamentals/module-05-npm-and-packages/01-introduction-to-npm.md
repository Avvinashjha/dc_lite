# Introduction to npm

## Why It Matters

npm is both a package registry and a command line tool. The registry hosts reusable JavaScript packages. The CLI installs packages, runs scripts, manages versions, and helps audit dependencies.

Most Node.js projects depend on npm concepts even if they use pnpm or Yarn instead of the npm CLI.

## Core Concepts

### package

A package is a directory with a `package.json` file. It may be an application, a library, a CLI, or an internal workspace package.

### registry

The default npm registry is a public package host. Companies may also use private registries for internal packages.

### node_modules

Installed packages are placed in `node_modules` for Node.js and tooling to resolve. You normally do not edit this directory or commit it to Git.

### package-lock.json

The lockfile records exact resolved dependency versions. It makes installs more repeatable.

## Syntax and Examples

Initialize a package:

```bash
npm init
npm init -y
```

Install a runtime dependency:

```bash
npm install express
```

Install a development dependency:

```bash
npm install --save-dev vitest
```

Run a package binary without installing globally:

```bash
npx cowsay "Hello npm"
```

In modern npm, `npm exec` is the clearer command:

```bash
npm exec cowsay "Hello npm"
```

## Use Cases

npm helps with:

- Installing libraries
- Sharing packages
- Running project scripts
- Managing dependency versions
- Auditing known vulnerabilities
- Publishing CLIs and libraries

## Tradeoffs

The npm ecosystem is powerful because reuse is easy. That same convenience creates risks:

- Too many dependencies increase attack surface.
- Package updates can introduce breaking changes.
- Transitive dependencies can be hard to inspect.
- Similar package names can be confusing.

Good Node.js developers treat dependencies as code they are choosing to run.

## Common Mistakes

- Installing packages globally when a project dependency is better.
- Committing `node_modules`.
- Ignoring the lockfile in applications.
- Adding a package for a tiny task that built-in modules already solve.
- Running unknown package binaries without checking what they do.

## Practical Challenge

Create a new folder, run `npm init -y`, install one runtime dependency and one dev dependency, then inspect how `package.json`, `package-lock.json`, and `node_modules` changed.

## Recap

npm provides package installation, script execution, and registry access. It is central to Node.js development, but every dependency should be chosen intentionally and locked repeatably.
