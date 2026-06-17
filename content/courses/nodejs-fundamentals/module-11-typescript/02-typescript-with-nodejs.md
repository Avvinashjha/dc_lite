# Building with TypeScript and Node.js

## Why It Matters

Once TypeScript is configured, the real value comes from how you design your Node.js code. Types should make application boundaries clearer: what a route accepts, what a service returns, what configuration exists, what errors can happen, and where external data must be validated.

Good TypeScript does not mean adding complicated types everywhere. It means making important contracts explicit while keeping code readable. In backend applications, the highest-value contracts are usually request input, service input, database output, environment configuration, and public response shapes.

## Core Concepts

### Types at Boundaries

TypeScript is strongest when you define clear boundaries:

- HTTP request body to validated input.
- Database row to domain object.
- Environment variables to typed config.
- Service result to API response.
- Unknown errors to safe error responses.

External data should enter as `unknown` or broad types, then be parsed into trusted types.

### Interfaces, Types, and Inference

You can define object shapes with `interface` or `type`.

```ts
interface User {
  id: string;
  email: string;
  role: 'member' | 'admin';
}

type CreateUserInput = {
  email: string;
  password: string;
};
```

Use explicit types for exported function inputs and important domain models. Let TypeScript infer simple local variables.

```ts
const maxLoginAttempts = 5; // inference is enough
```

### `unknown` vs `any`

`any` turns off type checking for a value. `unknown` forces you to inspect the value before using it.

```ts
function getMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}
```

Prefer `unknown` at unsafe boundaries.

### Discriminated Unions

Discriminated unions are useful for service results.

```ts
type LoginResult =
  | { ok: true; userId: string }
  | { ok: false; reason: 'invalid_credentials' | 'locked' };

function statusForLogin(result: LoginResult): number {
  if (result.ok) {
    return 200;
  }

  return result.reason === 'locked' ? 423 : 401;
}
```

The `ok` field tells TypeScript which branch you are in.

## Syntax and Examples

### Typed Configuration

Environment variables are strings or undefined. Parse them once during startup.

```ts
export type AppConfig = {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  databaseUrl: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function parseNodeEnv(value: string | undefined): AppConfig['nodeEnv'] {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }

  return 'development';
}

export function loadConfig(): AppConfig {
  const port = Number(process.env.PORT || 3000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return {
    nodeEnv: parseNodeEnv(process.env.NODE_ENV),
    port,
    databaseUrl: requireEnv('DATABASE_URL')
  };
}
```

After `loadConfig` succeeds, the rest of the app can depend on a typed config object instead of repeatedly reading `process.env`.

### Typed Services

Keep business logic outside route handlers when it grows beyond simple CRUD.

```ts
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: 'member' | 'admin';
};

export type UserRepository = {
  findByEmail(email: string): Promise<User | null>;
  create(input: { email: string; passwordHash: string }): Promise<User>;
};

export async function registerUser(
  input: { email: string; password: string },
  deps: { users: UserRepository; hashPassword(password: string): Promise<string> }
) {
  const existingUser = await deps.users.findByEmail(input.email);

  if (existingUser) {
    return { ok: false as const, reason: 'email_taken' as const };
  }

  const passwordHash = await deps.hashPassword(input.password);
  const user = await deps.users.create({ email: input.email, passwordHash });

  return { ok: true as const, user };
}
```

The repository type makes the service testable because tests can pass a fake `users` implementation.

### Typed Express Handlers

Express types can be verbose. Use them where they clarify params, body, or response data.

```ts
import type { Request, Response, NextFunction } from 'express';

type CreateTaskBody = {
  title: string;
};

type TaskResponse = {
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
};

export async function createTaskHandler(
  req: Request<Record<string, never>, TaskResponse, CreateTaskBody>,
  res: Response<TaskResponse>,
  next: NextFunction
) {
  try {
    const task = await tasks.create({
      title: req.body.title
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}
```

This type says:

- No route params are expected.
- The response body is `TaskResponse`.
- The request body should be `CreateTaskBody`.

However, Express types do not validate runtime input. If the client sends `{ "title": 42 }`, TypeScript will not stop it at runtime.

### Runtime Validation with Zod

```bash
npm install zod
```

```ts
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120)
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

app.post('/tasks', async (req, res, next) => {
  try {
    const input: CreateTaskInput = createTaskSchema.parse(req.body);
    const task = await tasks.create(input);

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});
```

Zod creates a runtime parser and a TypeScript type from the same schema. That prevents duplication between validation rules and static types.

### Custom Request Properties

If authentication middleware attaches `req.user`, declare it for TypeScript.

Create `src/types/express.d.ts`:

```ts
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'member' | 'admin';
      };
    }
  }
}
```

Then middleware and handlers can safely refer to `req.user`.

```ts
export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  next();
}
```

### Working with Node APIs

TypeScript works naturally with modern Node APIs.

```ts
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export async function sha256File(path: string): Promise<string> {
  const buffer = await readFile(path);

  return createHash('sha256')
    .update(buffer)
    .digest('hex');
}
```

The Node type definitions from `@types/node` provide types for built-in modules, globals, streams, buffers, and process APIs.

## Use Cases

TypeScript improves backend code when:

- Several routes share service functions.
- Request and response shapes need to stay consistent.
- Database access returns nullable or optional values.
- Business logic has multiple result states.
- Tests need reliable fakes and mocks.
- Refactors move fields, rename functions, or split modules.
- Shared packages define contracts between services.

## Security and Production Implications

### Types Do Not Replace Validation

Every external boundary still needs runtime validation:

- HTTP bodies.
- Query strings.
- Route params.
- Headers.
- Cookies.
- Environment variables.
- Webhook payloads.
- Database values after migrations or manual edits.

TypeScript helps after data is parsed into a trusted shape.

### Avoid `any` Creep

One `any` can spread through a codebase and hide real problems. If a dependency returns `any`, wrap it with a typed function or validate its output.

```ts
function parseJsonObject(value: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value);

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Expected a JSON object');
  }

  return parsed;
}
```

### Handle Async Errors

Types can show that a function returns `Promise<T>`, but they do not force Express 4 to catch rejected promises in every setup. Use a consistent error handling pattern.

```ts
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function asyncHandler(handler: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
```

### Keep Public API Types Stable

Response types become part of a contract with frontend apps, mobile clients, and other services. Changing a response field name may compile locally but break consumers. Treat public DTO types carefully.

## Common Mistakes

- Using `any` instead of modeling uncertainty with `unknown`.
- Typing `req.body` and then skipping runtime validation.
- Exporting database row types directly as public API response types.
- Making types so abstract that they are harder to read than the code.
- Forgetting to type null results from database lookups.
- Ignoring `strictNullChecks` errors by adding non-null assertions everywhere.
- Declaring global Express types but not including the declaration file in `tsconfig.json`.
- Mixing domain models, persistence models, and API DTOs without clear boundaries.

## Practical Challenge

Build a typed task API:

1. Define `Task`, `CreateTaskInput`, and `TaskResponse` types.
2. Add a Zod schema for creating tasks.
3. Write a service function that returns a discriminated union for success or validation failure.
4. Add an Express route that parses the request body and returns a typed response.
5. Add an error handler that accepts `unknown` and returns a safe JSON error.
6. Add a fake repository in a test and confirm TypeScript checks the fake implementation.

Then remove one required field from the fake repository return value and observe the compiler error.

## Recap

Building Node.js apps with TypeScript is about clear contracts at important boundaries. Use explicit types for domain models and service inputs, runtime validation for external data, `unknown` for unsafe values, discriminated unions for multi-state results, and type-only imports where appropriate. Keep the types practical: they should make the code easier to change, not harder to understand.
