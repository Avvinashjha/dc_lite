# Introduction to Docker

## Why It Matters

Docker packages an application with the operating system-level dependencies it needs to run. For Node.js developers, this reduces the classic "works on my machine" problem. A container can run the same app with the same Node version, environment variables, installed packages, and startup command across development, CI, staging, and production.

Docker is not only a deployment tool. It is also useful for local dependencies such as PostgreSQL, Redis, and message queues. Instead of installing every service directly on your laptop, you can run them as containers and remove them when finished.

## Core Concepts

### Image

An image is a read-only template used to create containers. It contains a filesystem, dependencies, and metadata such as the default command.

Example:

```bash
docker pull node:22-alpine
```

This downloads a Node.js image based on Alpine Linux.

### Container

A container is a running instance of an image.

```bash
docker run --rm node:22-alpine node --version
```

This starts a container, runs `node --version`, prints the version, and removes the container after it exits.

### Dockerfile

A Dockerfile is a recipe for building an image.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

Each instruction creates or configures part of the image.

### Layers

Docker images are built from layers. If a layer has not changed, Docker can reuse it from cache. This is why Dockerfiles often copy `package.json` and install dependencies before copying the rest of the source code.

### Port Publishing

Containers have their own network namespace. If an app listens on port `3000` inside the container, you publish it to a host port:

```bash
docker run -p 3000:3000 my-node-app
```

The left side is the host port. The right side is the container port.

### Volumes

Containers are disposable. Data written inside a container can disappear when the container is removed. Volumes persist data outside the container filesystem.

```bash
docker volume create postgres-data
```

Volumes are common for databases and local development workflows.

## Syntax and Examples

### Run a Node Container

```bash
docker run --rm node:22-alpine node -e "console.log(process.version)"
```

This runs Node without installing Node directly on the host.

### Run Redis Locally

```bash
docker run --name redis-dev --rm -p 6379:6379 redis:7-alpine
```

Your Node app can connect to `redis://localhost:6379` from the host.

### Build an Image

Given this Dockerfile:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

Build it:

```bash
docker build -t node-fundamentals-api .
```

Run it:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 node-fundamentals-api
```

### Inspect Containers

```bash
docker ps
docker logs <container-id>
docker exec -it <container-id> sh
docker stop <container-id>
```

These commands help you list, debug, enter, and stop containers.

## Use Cases

Docker is useful for:

- Running consistent Node.js versions across environments.
- Shipping APIs with predictable dependencies.
- Running local databases, caches, and queues.
- Building CI pipelines that match production more closely.
- Creating isolated test environments.
- Deploying to platforms that run containers, such as ECS, Cloud Run, Kubernetes, Fly.io, Render, and many others.

Docker is less useful when:

- A project is a tiny local script with no dependencies.
- The team does not need environment consistency.
- The runtime platform does not accept containers and already provides a managed build system.

## Security and Production Implications

### Image Size

Smaller images usually download faster and have a smaller attack surface. Alpine images are small, but some native Node packages behave differently on Alpine because it uses musl libc. Debian slim images are larger but often more compatible.

Common base images:

- `node:22-alpine`: small, good for many apps.
- `node:22-slim`: larger, more compatible.
- Distroless images: minimal runtime, more advanced debugging tradeoffs.

### Running as Root

Containers often run as root by default. Prefer a non-root user when possible.

```dockerfile
USER node
```

The official Node image includes a `node` user.

### Secrets

Do not bake secrets into images with `ENV` or `COPY`. Pass secrets at runtime through environment variables, secret managers, or platform-specific secret features.

### Reproducible Installs

Use lockfiles and `npm ci` in Docker builds. `npm install` can update lockfile-resolved dependencies in ways that make builds less repeatable.

### Container Lifecycle

Containers should be disposable. Store persistent data in databases, object storage, or volumes. Do not rely on files written inside an app container to survive deployment.

## Common Mistakes

- Copying the entire project before running `npm ci`, causing slow rebuilds.
- Forgetting `.dockerignore` and sending `node_modules` or secrets into the build context.
- Binding the app to `localhost` inside the container instead of `0.0.0.0`.
- Storing uploaded files inside a disposable container filesystem.
- Baking environment-specific secrets into the image.
- Running database migrations accidentally every time a container starts without coordination.
- Assuming Docker replaces application monitoring, logging, and health checks.

## Practical Challenge

Create a small Express app and containerize it:

1. Add a `/health` route.
2. Create a Dockerfile using an official Node image.
3. Use `WORKDIR /app`.
4. Copy package files before source files.
5. Install dependencies with `npm ci`.
6. Expose port `3000`.
7. Run the app with `docker run -p 3000:3000`.

Then stop and remove the container, rebuild the image after a source change, and confirm Docker reuses dependency layers when `package-lock.json` has not changed.

## Recap

Docker images package application dependencies and containers run those images in isolated environments. For Node.js apps, Docker improves consistency across development, CI, and production. Learn images, containers, Dockerfiles, layers, ports, and volumes before moving to Compose or production deployment. Containers are disposable, so design configuration, secrets, logs, and persistent data accordingly.
