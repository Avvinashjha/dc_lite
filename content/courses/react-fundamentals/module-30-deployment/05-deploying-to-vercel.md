# Deploying to Vercel

Vercel is a deployment platform for frontend applications. It is especially popular for Next.js, but it also works well for Vite, Create React App, Remix, Astro, and other frontend projects.

Vercel can build from Git, create preview deployments for each pull request, serve static assets from the edge, and run serverless or edge functions depending on the framework.

## Basic Deployment Flow

The common flow:

1. Push your app to a Git provider.
2. Import the repository into Vercel.
3. Choose the framework preset.
4. Confirm the build command and output directory.
5. Add environment variables.
6. Deploy.

Common settings:

```text
Vite build command: npm run build
Vite output directory: dist

Create React App build command: npm run build
Create React App output directory: build

Next.js build command: next build
Next.js output: handled by Vercel preset
```

For most Next.js apps, use the default preset unless you have a specific reason to customize it.

## Preview and Production Environments

Vercel separates deployments into environments:

- development
- preview
- production

This matters for environment variables.

Example:

```text
VITE_API_BASE_URL=https://api-preview.example.com
```

You may want preview deployments to call a staging API, not production.

Awareness note:

Frontend variables with prefixes such as `VITE_` or `NEXT_PUBLIC_` are public. Anyone can inspect them in the browser.

## React Router Fallbacks

For a Vite or Create React App single-page app using React Router, direct refresh on nested routes may need rewrite configuration.

Example `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Do not use this blindly for every app. Next.js, Remix, and other file-based routers have their own routing systems.

## Serverless Functions

Vercel can run serverless functions.

Use them for:

- hiding private API keys
- lightweight API routes
- webhook handlers
- authentication callbacks
- small integrations

For Next.js, API routes or route handlers are integrated into the framework. For plain Vite apps, function setup depends on Vercel's supported file conventions.

Keep function limits in mind:

- cold starts may affect latency
- execution time is limited
- long-running jobs need a different system
- functions should validate input like any backend endpoint

## Domains and HTTPS

Vercel provides HTTPS automatically for configured domains.

When connecting a custom domain:

- update DNS records exactly as instructed
- test both root and `www` if needed
- confirm redirects are intentional
- verify OAuth callback URLs after the domain changes

Domain changes often expose hidden assumptions in API CORS settings, cookie settings, and authentication redirects.

## Common Mistakes

- Deploying a React Router app without testing direct refresh.
- Setting preview deployments to production-only APIs.
- Adding private secrets to `NEXT_PUBLIC_` or `VITE_` variables.
- Customizing the Next.js build output without understanding Vercel's preset.
- Forgetting to update OAuth or CORS allowed origins.
- Assuming a serverless function behaves like a permanent server process.

## Troubleshooting

Build works locally but fails on Vercel:

- check Node version
- check package manager detection
- confirm lockfile is committed
- inspect build logs for missing environment variables
- ensure the project root is correct in monorepos

Page loads locally but blank on Vercel:

- inspect the deployed browser console
- check asset paths
- confirm output directory
- verify public environment variables

API call fails only in production:

- check CORS allowed origins
- check whether the deployed app is calling the correct base URL
- confirm HTTPS vs HTTP

:::quiz
question: In Vercel, why might preview deployments need different environment variables than production?
options:
  - Preview deployments cannot use environment variables.
  - Preview deployments should often call staging services instead of production services.
  - Production variables are automatically secret in browser code.
  - Vercel ignores variables for React apps.
answer: 1
explanation: Preview deployments are for testing unmerged changes, so they often need staging APIs, test analytics, or sandbox integrations.
:::

## Practice Challenge

Deploy a React app to Vercel.

Requirements:

- connect a Git repository
- verify framework preset, build command, and output directory
- configure separate preview and production API URLs
- test a preview deployment from a pull request
- test direct refresh on a nested route
- write deployment troubleshooting notes in the README

Extension:

Add a small serverless endpoint that returns public app metadata, then call it from the React app.

## Recap

Vercel provides fast Git-based frontend deployment with excellent preview workflows. React developers should understand framework presets, environment scopes, router fallback behavior, and the difference between frontend variables and server-side secrets.
