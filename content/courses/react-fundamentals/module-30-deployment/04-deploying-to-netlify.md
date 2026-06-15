# Deploying to Netlify

Netlify is a hosting platform for static sites and frontend apps. It can build your React app from a Git repository, serve it from a CDN, create preview deployments for pull requests, and manage redirects, environment variables, and serverless functions.

It is a strong fit for Vite, Create React App, static React Router apps, documentation sites, dashboards, and marketing pages.

## Basic Deployment Flow

The usual flow is:

1. Push your React app to GitHub, GitLab, or Bitbucket.
2. Create a Netlify site from the repository.
3. Set the build command.
4. Set the publish directory.
5. Configure environment variables.
6. Deploy.

Common settings:

```text
Vite build command: npm run build
Vite publish directory: dist

Create React App build command: npm run build
Create React App publish directory: build
```

If your app lives in a monorepo, set the base directory to the folder that contains the app's `package.json`.

## SPA Redirects

Client-side React Router needs a fallback so direct refreshes work.

Create `public/_redirects`:

```text
/* /index.html 200
```

After build, Netlify copies this file into the published output.

Without this redirect:

- `/` works
- clicking to `/dashboard` works
- refreshing `/dashboard` may show a 404

## Environment Variables

Set public frontend variables in Netlify's site settings.

Examples:

```text
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ID=public-id
```

Remember:

- public frontend variables are included in the browser bundle
- changing them usually requires a rebuild
- private secrets should be used only in serverless functions or backend services

## Deploy Previews

Deploy previews are one of Netlify's most useful features. Each pull request can get its own temporary URL.

Use previews to check:

- UI changes before merging
- route refresh behavior
- environment-specific API behavior
- form flows
- accessibility fixes
- bundle and asset loading

Add the preview URL to code reviews when a UI change is hard to evaluate from code alone.

## Netlify Functions

Netlify Functions can handle small backend tasks:

- hiding secret API tokens
- sending contact form submissions
- generating signed URLs
- proxying requests to third-party services

Example structure:

```text
netlify/functions/weather.js
```

Important:

Do not move all app logic into functions by default. Use them for small server-side needs. For complex data models, authentication, or long-running tasks, use a real backend.

## Forms

Netlify can process static forms when configured correctly.

In React, form handling is often dynamic, so test the deployed form carefully. Make sure the generated HTML includes the expected form fields, hidden form name, and method attributes if using Netlify Forms.

## Common Mistakes

- Forgetting the `/* /index.html 200` redirect.
- Setting publish directory to the project root instead of `dist` or `build`.
- Using a private secret in a `VITE_` or `REACT_APP_` variable.
- Not rebuilding after environment variable changes.
- Assuming preview deployments use production environment variables.
- Ignoring build logs when a dependency or Node version differs from local development.

## Troubleshooting

Build fails:

- confirm the install command and package manager
- check Node version
- verify lockfile is committed
- read the first error, not only the final failure line

Page is blank:

- inspect browser console errors
- check asset paths
- confirm the publish directory contains `index.html`
- verify environment variables are present

Nested route 404:

- add `_redirects`
- redeploy
- test direct refresh

:::quiz
question: What file commonly fixes direct-refresh 404s for React Router apps on Netlify?
options:
  - package-lock.json
  - public/_redirects
  - .env.local
  - src/App.jsx
answer: 1
explanation: A Netlify redirects file can route all unmatched paths to index.html so the React router handles them.
:::

## Practice Challenge

Deploy a React Router app to Netlify.

Requirements:

- connect the app to a Git repository
- configure build command and publish directory
- add an SPA redirect
- set one public environment variable
- create a deploy preview from a pull request
- write a short deployment checklist in the README

Manual tests:

- home page loads
- nested route loads after refresh
- environment-dependent API URL is correct
- no private values appear in the browser bundle

## Recap

Netlify makes static React deployment approachable, especially with Git-based deploys and previews. The most important React-specific details are the publish directory, SPA redirects, environment variables, and preview testing.
