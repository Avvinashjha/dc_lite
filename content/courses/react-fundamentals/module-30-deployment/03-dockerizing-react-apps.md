# Dockerizing React Apps

Docker packages an application with the files and runtime needed to run it consistently. For React apps, Docker is most useful when you want repeatable builds, containerized previews, or a static app served by a production web server such as Nginx.

Most client-side React apps do not need Node.js at runtime. They need Node.js to build, then a static server to serve the generated files.

## The Common Production Pattern

A common Docker setup uses two stages:

1. Build the React app with Node.
2. Serve the static output with Nginx.

Example for a Vite app:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

This keeps the final image smaller because it does not include Node, source files, or development dependencies.

## SPA Routing with Nginx

React Router apps often need fallback routing. If a user refreshes `/dashboard`, Nginx must serve `index.html`, not return 404.

Example `nginx.conf`:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
  }
}
```

The `/assets/` rule works well when build files have fingerprinted names.

## .dockerignore

Do not send unnecessary files into the Docker build context.

```dockerignore
node_modules
dist
build
.git
.env
coverage
npm-debug.log
```

This makes builds faster and reduces the chance of copying secrets.

## Build Arguments vs Runtime Environment

Frontend environment variables are often build-time values.

```dockerfile
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
```

Build command:

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t react-app .
```

Important:

This value is embedded in the built JavaScript. Changing a container environment variable later will not change the already-built frontend bundle.

If you need runtime configuration, serve a separate `config.json` file or endpoint and fetch it when the app starts.

## Running Locally

Build and run:

```bash
docker build -t react-app .
docker run --rm -p 8080:80 react-app
```

Then open:

```text
http://localhost:8080
```

Test both `/` and a nested route like `/settings`.

## When Docker Is Useful

Docker is useful when:

- the deployment target runs containers
- CI should build the same artifact every time
- frontend and backend are deployed together
- you need an Nginx fallback and caching configuration
- the app is part of a larger Docker Compose environment

Docker may be unnecessary when:

- deploying directly to Netlify or Vercel
- the app is a simple static site
- your hosting provider already handles builds and CDN serving

## Common Mistakes

- Serving `dist` with Node in production when a static server would be enough.
- Forgetting SPA fallback routing.
- Copying `.env` into the image.
- Using `npm install` instead of `npm ci` in repeatable builds.
- Not pinning a reasonable Node major version.
- Assuming runtime container variables change build-time React values.
- Shipping a huge image containing source and dev dependencies.

## Edge Cases

Client-side routing:

Without fallback routing, direct navigation to nested routes fails.

API proxying:

If Nginx proxies `/api` to a backend, configure timeouts and headers intentionally. Do not hide CORS issues by accident.

Health checks:

For container platforms, expose a simple path like `/` or `/health.html` that confirms the static server is running.

:::quiz
question: In a typical Dockerized Vite React app, why use a multi-stage Dockerfile?
options:
  - To run React twice in production.
  - To build with Node and serve only static files from a smaller final image.
  - To avoid writing a package.json file.
  - To make environment variables private in the browser.
answer: 1
explanation: Multi-stage builds let Node create the production assets, then copy only the output into a lightweight web server image.
:::

## Practice Challenge

Dockerize a React app.

Requirements:

- create a `Dockerfile`
- create a `.dockerignore`
- serve production files with Nginx
- support direct refresh on nested routes
- add long-term caching for fingerprinted assets
- document build arguments in the README

Manual tests:

- open the home page
- refresh a nested route
- inspect response headers for assets
- confirm `.env` was not copied into the image

## Recap

Dockerizing a React app is usually a build-and-serve process. Use Node to produce static files, serve them from a small web server image, configure SPA fallback routing, and be clear about build-time configuration.
