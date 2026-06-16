# Docker and Docker Compose

## Why It Matters

Most real Node.js apps need more than one process. An API may depend on PostgreSQL, Redis, a worker, and a local email testing service. Starting each dependency with separate `docker run` commands becomes tedious and error-prone.

Docker Compose lets you describe multiple services in one YAML file. With one command, you can start the API, database, cache, networks, volumes, and environment variables needed for local development or integration testing.

Compose is not only for local development, but that is where most Node.js teams first benefit from it. It gives every developer a repeatable environment without manually installing infrastructure services.

## Core Concepts

### Service

A service is a container definition in `compose.yml`.

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
```

The service name also becomes a DNS name on the Compose network. If you define a service named `postgres`, other services can connect to hostname `postgres`.

### Network

Compose creates a default network for the project. Services can talk to each other by service name.

From the API container:

```text
postgres://app:secret@postgres:5432/appdb
redis://redis:6379
```

Notice the hostnames are `postgres` and `redis`, not `localhost`. Inside a container, `localhost` means the same container.

### Volume

Volumes persist data outside a container.

```yaml
volumes:
  postgres-data:
```

Without a volume, removing the database container can remove its data.

### Environment Variables

Compose can pass environment variables to containers.

```yaml
environment:
  NODE_ENV: development
  PORT: 3000
```

Do not commit real production secrets to Compose files. For local development, use obvious non-production values.

### Health Checks

`depends_on` can control startup order, but startup order is not the same as readiness. A database container may be running before it is ready to accept connections. Health checks help Compose understand readiness.

## Syntax and Examples

### A Node API with Postgres and Redis

```yaml
services:
  api:
    build:
      context: .
      target: development
    command: npm run dev
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgres://app:secret@postgres:5432/appdb
      REDIS_URL: redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

Start everything:

```bash
docker compose up
```

Start in the background:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Stop services and delete volumes:

```bash
docker compose down -v
```

Be careful with `-v`; it removes persisted local data.

### Development Dockerfile Target

Compose can build a specific Dockerfile stage:

```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "dist/server.js"]
```

The development stage includes dev dependencies and can run watchers. The production stage omits dev dependencies and runs compiled output.

### Reading Environment Variables in Node

```js
import { createClient } from 'redis';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;

if (!databaseUrl || !redisUrl) {
  throw new Error('DATABASE_URL and REDIS_URL are required');
}

export const pool = new pg.Pool({
  connectionString: databaseUrl
});

export const redis = createClient({
  url: redisUrl
});
```

The app should not hardcode Compose hostnames. It should read URLs from configuration. Compose supplies local values; production supplies production values.

### Running One-Off Commands

Run migrations:

```bash
docker compose run --rm api npm run migrate
```

Open a shell:

```bash
docker compose exec api sh
```

View logs:

```bash
docker compose logs -f api
```

Rebuild after dependency changes:

```bash
docker compose up --build
```

## Use Cases

Compose is useful for:

- Local development environments.
- Integration tests that need real databases or caches.
- Running background workers beside an API.
- Demonstrating full-stack examples.
- Reproducing bugs with known service versions.
- Onboarding new developers quickly.

Compose is not a complete replacement for production orchestration. Production platforms often use Kubernetes, ECS, Nomad, Docker Swarm, or managed container services. Compose concepts still transfer: services, networks, volumes, environment, health, and logs.

## Security and Production Implications

### Local Secrets vs Production Secrets

It is fine for a local Compose file to use `POSTGRES_PASSWORD: secret` when the database is only local. Never reuse these values in production. Do not commit real credentials.

### Port Exposure

Only publish ports that need host access. The API may need `3000:3000`; Postgres and Redis only need host ports if your local tools connect from outside Compose.

```yaml
redis:
  image: redis:7-alpine
```

Without `ports`, other Compose services can still reach Redis, but your host cannot connect through `localhost:6379`.

### Readiness

Apps should still retry database connections or fail cleanly. Compose health checks reduce race conditions, but robust apps handle temporary dependency failures.

### Volumes and Data Reset

Named volumes persist across container rebuilds. This is helpful until test data becomes confusing. Learn when to run `docker compose down -v` to reset local state.

## Common Mistakes

- Using `localhost` from one container to reach another container.
- Expecting `depends_on` without health checks to mean "ready."
- Forgetting named volumes for database data.
- Mounting the whole project over `/app` and hiding installed dependencies.
- Publishing every service port unnecessarily.
- Committing production secrets in `compose.yml`.
- Forgetting to rebuild after changing `package-lock.json` or Dockerfile instructions.
- Treating Compose development settings as production hardening.

## Practical Challenge

Create a Compose environment for a Node API:

1. Add an `api` service that builds your local Dockerfile.
2. Add a `postgres` service with a named volume.
3. Add a `redis` service.
4. Pass `DATABASE_URL` and `REDIS_URL` into the API.
5. Add a Postgres health check.
6. Start everything with `docker compose up`.
7. From the API, connect to `postgres` and `redis` by service name.

Then run a one-off migration command with `docker compose run --rm api npm run migrate`.

## Recap

Docker Compose describes a multi-service environment in one file. It is especially useful for Node.js apps that depend on databases, caches, workers, and other infrastructure. Use service names for networking, named volumes for persistence, environment variables for configuration, and health checks for readiness. Keep local convenience separate from production security.
