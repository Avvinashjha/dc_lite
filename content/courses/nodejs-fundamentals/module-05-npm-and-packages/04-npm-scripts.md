# npm Scripts

## Why It Matters

npm scripts are the standard command interface for Node.js projects. They hide long commands behind memorable names and give every teammate the same entry points for development, testing, building, and starting the app.

Good scripts make a project easier to use. Messy scripts make tooling hard to discover.

## Core Concepts

Scripts live in `package.json`:

```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "node --test",
    "lint": "eslint ."
  }
}
```

Run them:

```bash
npm run dev
npm test
npm start
```

`start` and `test` are common shortcuts. Most other scripts use `npm run`.

## Syntax and Examples

### Local binaries

When a script runs, npm adds `node_modules/.bin` to `PATH`. This means scripts can use locally installed tools:

```json
{
  "scripts": {
    "test": "vitest",
    "format": "prettier . --write"
  }
}
```

You do not need global installs for project tools.

### Arguments

Pass arguments after `--`:

```bash
npm run test -- --watch
```

### Pre and post scripts

npm can run lifecycle scripts:

```json
{
  "scripts": {
    "pretest": "npm run lint",
    "test": "node --test",
    "posttest": "echo done"
  }
}
```

Use these sparingly. Hidden lifecycle behavior can surprise contributors.

## Use Cases

Common scripts:

- `dev`: local development server
- `start`: production entry point
- `test`: test suite
- `lint`: static checks
- `format`: code formatting
- `build`: compile or bundle
- `typecheck`: TypeScript validation

## Common Mistakes

- Depending on globally installed tools.
- Creating script names no one can discover.
- Hiding too much behavior in `pre` and `post` scripts.
- Writing shell commands that work only on one operating system when the team needs cross-platform support.
- Using scripts for secrets instead of environment variables or secret managers.

## Practical Challenge

Create scripts for a small Node.js project:

- `dev` runs `node --watch index.js`
- `start` runs `node index.js`
- `check` runs tests and linting

Then run a script with an extra argument after `--`.

## Recap

npm scripts are the project command surface. Use them to make common workflows repeatable, local, and easy to discover. Keep scripts clear and avoid hidden surprises.
