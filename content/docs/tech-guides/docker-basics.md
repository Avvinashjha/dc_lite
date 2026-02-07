# Docker Basics

A beginner-friendly guide to Docker containerization.

## What is Docker?

Docker packages your application and its dependencies into a **container** - a lightweight, standalone, executable unit that runs consistently across any environment.

## Key Concepts

- **Image**: A blueprint for a container (like a class)
- **Container**: A running instance of an image (like an object)
- **Dockerfile**: Instructions to build an image
- **Docker Compose**: Tool for defining multi-container apps

## Getting Started

### Install Docker

Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop).

```bash
# Verify installation
docker --version
docker compose version
```

### Your First Dockerfile

Create a `Dockerfile` in your project:

```dockerfile
# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### Build and Run

```bash
# Build the image
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

Visit `http://localhost:3000` to see your app!

## Docker Compose

For multi-service applications, use `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
```

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

## Essential Commands

```bash
# Images
docker images              # List images
docker pull image:tag      # Download an image
docker rmi image:tag       # Remove an image

# Containers
docker ps                  # List running containers
docker ps -a               # List all containers
docker stop container_id   # Stop a container
docker rm container_id     # Remove a container

# Debugging
docker logs container_id   # View container logs
docker exec -it id bash    # Shell into container
```

## Best Practices

1. **Use .dockerignore** to exclude unnecessary files
2. **Multi-stage builds** for smaller images
3. **Don't run as root** in containers
4. **Use specific image tags** (not `latest`)
5. **Layer caching** - put rarely changing steps first
