# Dockerize a Node Project

## Why It Matters

Dockerizing a Node.js project means turning source code into a repeatable container image that can run consistently in development, CI, and production. A good Docker setup installs dependencies reproducibly, keeps images reasonably small, avoids leaking secrets, runs as a non-root user, and starts the app with the same command every time.

The goal is not to put any Dockerfile in the repository. The goal is to build an image that is understandable, cache-friendly, secure enough for production, and easy to debug when something goes wrong.

## Core Concepts

### Build Context

The build context is the set of files sent to Docker during `docker build`.

```bash
docker build -t my-api .
```

The `.` means the current directory is the build context. If the context includes `node_modules`, logs, `.env`, or large generated files, builds become slower and may accidentally include sensitive data.

### `.dockerignore`

`.dockerignore` controls what is excluded from the build context.

```text
node_modules
dist
.git
.env
npm-debug.log
coverage
Dockerfile
compose.yml
```

Exclude files that are not needed to build the image. Do not send secrets to Docker.

### Dependency Layer Caching

Copy dependency manifests before copying source:

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

When source files change but `package-lock.json` does not, Docker can reuse the dependency install layer.

### Production Dependencies

Production images usually do not need test runners, TypeScript compilers, or development watchers. For plain JavaScript apps:

```dockerfile
RUN npm ci --omit=dev
```

For TypeScript apps, you often need dev dependencies during the build stage, then copy compiled output into a smaller runtime stage.

## Syntax and Examples

### Example Project

```text
my-api/
  src/
    server.ts
    app.ts
  package.json
  package-lock.json
  tsconfig.json
  Dockerfile
  .dockerignore
```

`src/server.ts`:

```ts
import { createServer } from 'node:http';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);
const server = createServer(createApp());

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
```

Binding to `0.0.0.0` allows traffic from outside the container. Binding only to `localhost` can make the app unreachable through published ports.

### Multi-Stage Dockerfile for TypeScript

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

What each stage does:

- `deps`: installs all dependencies needed to build.
- `build`: compiles TypeScript into JavaScript.
- `runtime`: installs only production dependencies and copies compiled output.

This keeps the final image focused on what it needs to run.

### `.dockerignore`

```text
node_modules
dist
coverage
.git
.env
.env.*
*.log
Dockerfile
compose.yml
README.md
```

Do not ignore files required by the build. If your build needs migrations, public assets, or Prisma schema files, make sure they are included.

### Build and Run

```bash
docker build -t my-api .
docker run --rm -p 3000:3000 -e PORT=3000 my-api
```

Test:

```bash
curl http://localhost:3000/health
```

### Passing Configuration

Use environment variables at runtime:

```bash
docker run --rm \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DATABASE_URL=postgres://app:secret@host.docker.internal:5432/appdb \
  my-api
```

For Compose, set these in the service definition. For production, use the platform secret or environment management system.

### Health Checks

You can define a health check in the Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
```

Health checks help orchestration platforms decide whether a container is healthy. Keep the endpoint lightweight and avoid checking every dependency unless that matches your platform's expectations.

## Production Guidance

### Use Lockfiles

Use `npm ci`, not `npm install`, in Docker builds. It installs exactly what the lockfile describes and fails when `package.json` and `package-lock.json` disagree.

### Run as Non-Root

The official Node image includes a `node` user. Use it in the runtime stage:

```dockerfile
USER node
```

If the app needs to write files, ensure the target directory is owned by that user.

```dockerfile
RUN mkdir -p /app/tmp && chown -R node:node /app/tmp
```

### Keep Secrets Out of Images

Never do this:

```dockerfile
ENV DATABASE_URL=postgres://prod-user:prod-password@example.com/app
```

Image layers can be inspected. Pass secrets at runtime.

### Logging

Containers should usually log to stdout and stderr. Let the platform collect logs.

```js
console.info('Application started');
console.error(error);
```

Avoid writing application logs only to files inside the container.

### Graceful Shutdown

Containers receive signals such as `SIGTERM` during deployments. Handle shutdown so the server stops accepting new requests and closes resources.

```js
import { createServer } from 'node:http';
import { app } from './app.js';
import { pool } from './database.js';

const server = createServer(app);

server.listen(3000, '0.0.0.0');

process.on('SIGTERM', () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
```

### Native Dependencies

Some packages compile native code. Alpine images can require extra build tools or have compatibility issues. If a dependency fails on Alpine, try `node:22-slim` or install required system packages.

## Use Cases

Dockerized Node projects work well for:

- APIs deployed to container platforms.
- Background workers.
- Scheduled jobs.
- Integration test environments.
- Local demos with Compose.
- Services that need a fixed Node version and OS dependencies.

Docker may add unnecessary complexity for small static sites, simple scripts, or platforms that already build and run Node apps directly without container images.

## Common Mistakes

- Forgetting `.dockerignore`.
- Copying `.env` into the image.
- Running as root in the final image.
- Installing dev dependencies in the final runtime image.
- Not binding the server to `0.0.0.0`.
- Running TypeScript source in production without including the runner.
- Using `npm install` instead of `npm ci`.
- Writing uploaded files into the container filesystem and expecting them to survive deploys.
- Building for one CPU architecture and deploying to another without checking image platform.
- Skipping graceful shutdown.

## Practical Challenge

Dockerize a TypeScript Express API:

1. Add a `/health` route.
2. Add `build` and `start` scripts to `package.json`.
3. Create a `.dockerignore` that excludes `node_modules`, `.env`, `dist`, logs, and coverage.
4. Write a multi-stage Dockerfile.
5. Use `npm ci` and `npm ci --omit=dev`.
6. Copy only compiled `dist` output into the final stage.
7. Run as the `node` user.
8. Build and run the image locally.
9. Confirm `curl http://localhost:3000/health` works.

Then inspect the image size and compare it with a single-stage image that includes dev dependencies.

## Recap

A production-ready Node Dockerfile should be reproducible, cache-friendly, and careful with security. Use `.dockerignore`, lockfiles, dependency layer caching, multi-stage builds for TypeScript, runtime environment variables, non-root users, stdout logging, and graceful shutdown. Docker does not remove the need for good application design, but it gives you a consistent package for running that design across environments.
