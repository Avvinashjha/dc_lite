# package.json, npm, and Packages

Most Node.js projects have a `package.json` file.

`package.json` describes the project and lists the packages it depends on.

npm is the package manager commonly used with Node.js.

## What Is a Package?

A package is reusable code that can be installed into a project.

Packages can provide:

- libraries
- frameworks
- command-line tools
- build tools
- testing tools
- type definitions

Examples of popular npm packages include Express, React, Vite, Jest, and TypeScript.

## Creating `package.json`

Create a new Node project:

```sh
npm init
```

For defaults:

```sh
npm init -y
```

Example `package.json`:

```json
{
  "name": "node-demo",
  "version": "1.0.0",
  "description": "A small Node.js demo",
  "type": "module",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {}
}
```

## Important Fields

Common fields:

| Field | Meaning |
| --- | --- |
| `name` | package or project name |
| `version` | package version |
| `description` | short project description |
| `type` | module format for `.js` files |
| `scripts` | commands you can run with npm |
| `dependencies` | packages needed at runtime |
| `devDependencies` | packages needed during development |

For beginner projects, `scripts`, `dependencies`, and `"type": "module"` are especially important.

## npm Scripts

Scripts are shortcuts for commands.

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js",
    "test": "node --test"
  }
}
```

Run a script:

```sh
npm run dev
```

Some script names have shortcuts.

```sh
npm start
npm test
```

Scripts make common project commands easy to remember.

## Installing a Package

Install a runtime dependency:

```sh
npm install package-name
```

Example:

```sh
npm install slugify
```

Use it:

```js
import slugify from "slugify";

console.log(slugify("Hello Node.js"));
```

npm updates `package.json` and creates or updates `package-lock.json`.

It also installs code into `node_modules`.

## Runtime Dependencies

Runtime dependencies are needed by the application when it runs.

```sh
npm install express
```

This adds a package to `dependencies`.

```json
{
  "dependencies": {
    "express": "^5.0.0"
  }
}
```

Use runtime dependencies for packages your app imports in production code.

## Development Dependencies

Development dependencies are needed while building, testing, or formatting.

```sh
npm install --save-dev prettier
```

This adds a package to `devDependencies`.

```json
{
  "devDependencies": {
    "prettier": "^3.0.0"
  }
}
```

Use dev dependencies for tools, not application runtime logic.

## `node_modules`

`node_modules` contains installed package files.

It can be very large.

Usually, do not commit `node_modules` to git.

Instead, commit:

- `package.json`
- `package-lock.json`

Then another developer can run:

```sh
npm install
```

to recreate `node_modules`.

## `package-lock.json`

`package-lock.json` records exact package versions.

This helps installs be repeatable.

Commit `package-lock.json` for applications.

It reduces "works on my machine" problems by making dependency versions more predictable.

## Semantic Versioning

Package versions often follow this shape:

```text
major.minor.patch
```

Example:

```text
2.5.1
```

General meaning:

- major: breaking changes
- minor: new features without breaking existing code
- patch: bug fixes

npm version ranges like `^2.5.1` allow some updates.

Do not assume every package follows semantic versioning perfectly.

## Security and Trust

Installing a package runs code from someone else.

Be careful with:

- unknown packages
- packages with very few downloads or maintainers
- packages that ask for unnecessary permissions
- typosquatting packages with names similar to popular packages
- packages that have not been updated in years

Before installing a package, ask:

- Do I really need it?
- Is it maintained?
- Is it popular enough to trust?
- Can I use a built-in API instead?

For small tasks, a built-in Node module may be better than another dependency.

## Common Mistakes

Do not manually edit `package-lock.json` unless you know exactly why.

Do not commit `node_modules`.

Do not install a package for something the language or Node already does well.

Do not ignore security warnings forever.

Do not put secrets in `package.json` scripts.

```json
{
  "scripts": {
    "deploy": "API_KEY=secret-value node deploy.js"
  }
}
```

Secrets belong in environment-specific configuration, not committed files.

## Summary

`package.json` describes a Node project.

npm installs packages and runs project scripts.

Use dependencies carefully, commit lockfiles for applications, and remember that every package is code you are choosing to trust.
