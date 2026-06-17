# Setting Up a TypeScript Project

## Why It Matters

TypeScript adds static types to JavaScript. In Node.js backends, this helps catch mistakes before runtime, documents function contracts, improves editor autocomplete, and makes refactoring safer as the codebase grows.

TypeScript does not make a program correct by itself. It cannot prove that a database row exists, that a JSON request body is valid, or that an environment variable is configured. It does, however, make many everyday errors visible earlier: misspelled properties, wrong argument types, forgotten null checks, and mismatched return shapes.

A good setup matters because TypeScript touches build scripts, module format, package metadata, test tooling, linting, runtime imports, and deployment output.

## Core Concepts

### TypeScript Source vs JavaScript Output

Node.js runs JavaScript. TypeScript files such as `src/server.ts` must either be compiled to JavaScript or run through a development tool that transpiles them.

Common layout:

```text
my-api/
  src/
    server.ts
    app.ts
  dist/
    server.js
    app.js
  package.json
  tsconfig.json
```

`src` is authored by developers. `dist` is generated and deployed.

### Compiler

The TypeScript compiler, `tsc`, checks types and can emit JavaScript.

```bash
npm install --save-dev typescript
npx tsc --init
```

You can run:

```bash
npx tsc --noEmit
```

to type-check without writing output files.

### Runtime Tooling

During development, many teams use a runner such as `tsx` to run TypeScript directly:

```bash
npm install --save-dev tsx
```

Then:

```bash
npx tsx src/server.ts
```

For production, compile with `tsc` and run the generated JavaScript with Node.

### ESM and CommonJS

Modern Node supports ESM with `import` and `export`. In a new project, prefer ESM unless your dependencies or platform require CommonJS.

`package.json`:

```json
{
  "type": "module"
}
```

ESM imports should include file extensions in emitted JavaScript. With `moduleResolution` set to `NodeNext`, TypeScript expects extension-aware imports:

```ts
import { createApp } from './app.js';
```

Even though the source file is `app.ts`, the import points to the JavaScript file that will exist after compilation.

## Syntax and Examples

### Create a Project

```bash
mkdir node-ts-api
cd node-ts-api
npm init -y
npm install express
npm install --save-dev typescript tsx @types/node @types/express
```

### Package Scripts

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

These scripts separate development, type-checking, build, and production runtime.

### A Practical `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "node_modules"]
}
```

Important options:

- `strict`: enables the main family of type safety checks.
- `rootDir`: where TypeScript source files live.
- `outDir`: where compiled JavaScript is written.
- `module` and `moduleResolution`: align TypeScript with Node ESM behavior.
- `sourceMap`: helps stack traces map back to TypeScript source.
- `noUncheckedIndexedAccess`: makes array and object indexing safer.
- `exactOptionalPropertyTypes`: makes optional fields more precise.

### Minimal Express App

`src/app.ts`:

```ts
import express, { type Request, type Response } from 'express';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  return app;
}
```

`src/server.ts`:

```ts
import { createServer } from 'node:http';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);
const app = createApp();
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Notice the `node:http` built-in specifier and the `.js` extension in the local ESM import.

### Type-Only Imports

Use `type` imports when a value is only needed for checking.

```ts
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
```

Type-only imports can be removed from emitted JavaScript, which avoids runtime import confusion.

## Use Cases

TypeScript is especially helpful in Node.js apps for:

- Route handlers with typed params, request bodies, and response shapes.
- Service layers with explicit inputs and outputs.
- Database model and DTO definitions.
- Configuration parsing and environment variable validation.
- Refactoring large codebases.
- Shared types between backend and frontend packages.
- Safer test doubles and mocks.

It is less useful if the project is a tiny script that will not be maintained, though even scripts can benefit from editor support and type-checking.

## Tradeoffs

TypeScript adds a build step and some configuration complexity. Developers need to understand type errors, module resolution, and differences between source imports and runtime imports. Some libraries have incomplete or inaccurate types, and strict settings can slow down initial migration.

The benefits grow with codebase size and team size. A small app may feel slower to set up in TypeScript, but a large app is much easier to maintain when contracts are visible in code.

## Production Implications

### Compile Before Deploying

Prefer deploying compiled JavaScript from `dist`. This keeps production startup simple:

```bash
npm run build
npm start
```

### Do Not Rely on TypeScript for Runtime Validation

Types disappear at runtime. If an HTTP client sends invalid JSON, TypeScript cannot stop it. Use runtime validation for external inputs.

```ts
function parsePort(value: string | undefined): number {
  const port = Number(value || 3000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return port;
}
```

### Source Maps

Source maps help connect production stack traces to TypeScript source. Enable them with `sourceMap: true`, but understand how your logging and deployment platform handles them.

## Common Mistakes

- Disabling `strict` to avoid learning type errors.
- Using `any` whenever the compiler complains.
- Forgetting `.js` extensions in ESM local imports.
- Running TypeScript directly in production without a clear reason.
- Assuming TypeScript validates request bodies at runtime.
- Committing generated `dist` files when the project convention excludes them.
- Mixing CommonJS and ESM without understanding package boundaries.
- Installing runtime dependencies as dev dependencies or type packages as production dependencies.

## Practical Challenge

Create a TypeScript Express project:

1. Configure `package.json` for ESM.
2. Add `dev`, `typecheck`, `build`, and `start` scripts.
3. Create a strict `tsconfig.json`.
4. Add `src/app.ts` with a `/health` route.
5. Add `src/server.ts` that uses `node:http`.
6. Run `npm run typecheck`, `npm run build`, and `npm start`.

Then intentionally introduce a type error, confirm `tsc` catches it, and fix it.

## Recap

A strong TypeScript setup gives Node.js projects safer contracts and better refactoring support. Use strict compiler settings, separate source from build output, prefer ESM for new projects, use `node:` specifiers for built-ins, and remember that TypeScript checks code at build time while runtime validation still protects external boundaries.
