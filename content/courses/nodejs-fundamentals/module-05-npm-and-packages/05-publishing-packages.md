# Publishing Packages

## Why It Matters

Publishing makes code reusable outside its original project. Packages can be public libraries, private company modules, CLIs, design system utilities, or shared config packages.

Publishing also creates responsibility. Once other people depend on your package, changes need versioning, documentation, and compatibility care.

## Core Concepts

A publishable package needs at least:

- A valid `name`
- A `version`
- Useful files
- Clear entry points
- A license decision
- Authentication to the registry

Example:

```json
{
  "name": "@acme/string-tools",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.js"
  },
  "files": ["src", "README.md"],
  "license": "MIT"
}
```

Scoped packages use names like `@scope/name`. They are common for organizations.

## Syntax and Examples

### Dry run

Before publishing, inspect what would be included:

```bash
npm pack --dry-run
```

This helps catch accidentally included secrets, tests, build artifacts, or missing files.

### Publishing

```bash
npm publish
```

For scoped public packages:

```bash
npm publish --access public
```

Private package publishing depends on registry and organization settings.

### CLI packages

Packages can expose executables:

```json
{
  "bin": {
    "say-hello": "./bin/say-hello.js"
  }
}
```

The executable should usually start with:

```js
#!/usr/bin/env node
```

## Use Cases

Publish packages for:

- Shared utilities
- CLIs
- Internal SDKs
- Framework plugins
- Configuration presets
- Reusable TypeScript types

Do not publish when copying a small function would be clearer inside one app.

## Common Mistakes

- Publishing secrets or local config files.
- Forgetting to run `npm pack --dry-run`.
- Breaking users with a patch or minor release.
- Publishing source that depends on unbuilt local files.
- Using broad exports that expose private internals.
- Ignoring README quality.

## Practical Challenge

Create a tiny package that exports a `slugify` function. Add `exports`, `files`, and a README. Run `npm pack --dry-run` and explain each file that would be included.

## Recap

Publishing is more than uploading code. A good package has clear exports, careful included files, semantic versions, documentation, and a release process that respects consumers.
