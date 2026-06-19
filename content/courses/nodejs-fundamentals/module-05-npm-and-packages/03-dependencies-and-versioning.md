# Dependencies and Semantic Versioning

## Why It Matters

Dependencies let you build faster, but they also import someone else's code, bugs, release process, and security posture into your project. Versioning controls how updates arrive.

Semantic versioning, often called semver, is the convention behind version numbers such as `2.4.1`.

## Core Concepts

A semver version has three parts:

```text
MAJOR.MINOR.PATCH
```

- MAJOR changes can break compatibility.
- MINOR changes add compatible features.
- PATCH changes fix compatible bugs.

Example:

```text
3.2.5
```

`3` is major, `2` is minor, and `5` is patch.

## Version Ranges

Common npm ranges:

```json
{
  "dependencies": {
    "a": "1.2.3",
    "b": "^1.2.3",
    "c": "~1.2.3",
    "d": ">=1.2.3 <2"
  }
}
```

Meaning:

- Exact `1.2.3` allows only that version.
- Caret `^1.2.3` allows compatible minor and patch updates before `2.0.0`.
- Tilde `~1.2.3` allows patch updates before `1.3.0`.
- Explicit ranges describe custom boundaries.

The lockfile records the exact version installed today.

## Dependency Types

Runtime dependency:

```bash
npm install express
```

Development dependency:

```bash
npm install --save-dev eslint
```

Peer dependency means the consumer must provide the dependency. This is common for plugins:

```json
{
  "peerDependencies": {
    "react": ">=18"
  }
}
```

## Use Cases

Use exact versions when reproducibility matters more than automatic updates, especially in published libraries with strict compatibility needs. Use caret ranges in many applications, combined with a lockfile and update process. Use peer dependencies when your package extends or plugs into a host package.

## Common Mistakes

- Believing semver guarantees no bugs. It is a promise by maintainers, not a law.
- Updating dependencies without running tests.
- Ignoring transitive dependencies.
- Using `latest` in `package.json`.
- Confusing dependency ranges with the exact installed version.
- Putting a package in both `dependencies` and `devDependencies`.

## Practical Challenge

Given `^2.3.4`, list which versions are allowed: `2.3.5`, `2.9.0`, `3.0.0`, `1.9.9`. Then inspect a real `package-lock.json` and find the exact installed version for one dependency.

## Recap

Semver communicates compatibility expectations. npm ranges describe what may be installed, while lockfiles record what was installed. Treat updates as code changes that need review and tests.
