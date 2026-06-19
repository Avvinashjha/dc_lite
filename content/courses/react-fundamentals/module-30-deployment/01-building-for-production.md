# Building for Production

A production build is the version of your React app that users actually download.

During development, React gives you helpful warnings, readable source maps, hot reloading, and extra checks. In production, the goal changes: ship the smallest reliable bundle, load it quickly, and make failures visible without exposing implementation details.

## What a Production Build Does

Most React tooling, such as Vite, Next.js, Remix, Create React App, or custom Webpack setups, performs several build steps:

- transpiles modern JavaScript and JSX into browser-compatible code
- bundles modules into optimized assets
- minifies JavaScript and CSS
- replaces compile-time environment variables
- tree-shakes unused exports when possible
- fingerprints asset filenames for long-term caching
- generates static files that can be served by a CDN or web server

Example Vite commands:

```bash
npm run build
npm run preview
```

`npm run build` creates the production files. `npm run preview` serves those files locally so you can inspect behavior before deploying.

## Development vs Production

Development mode optimizes for feedback.

Production mode optimizes for users.

Important differences:

- React warnings may disappear in production.
- Error messages may be shorter.
- Source maps may be disabled or uploaded privately.
- Code splitting changes network behavior.
- Environment variables are frozen at build time for most static React apps.
- Strict Mode development double-invocation does not happen in production.

Do not assume a feature works in production just because it worked in the dev server.

## Build-Time Configuration

In a static React build, public environment variables are usually embedded during the build.

```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

Then:

```js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

If you change `VITE_API_BASE_URL` after the app is already built, the browser bundle will not automatically change. You must rebuild, unless your app loads runtime configuration from a separate endpoint or file.

Awareness note:

- Vite exposes only variables prefixed with `VITE_`.
- Create React App exposes only variables prefixed with `REACT_APP_`.
- Next.js exposes browser variables only when prefixed with `NEXT_PUBLIC_`.
- Never put secrets in frontend environment variables. They become visible to users.

## Inspecting Bundle Output

After a build, inspect the output directory.

Common output folders:

- Vite: `dist`
- Create React App: `build`
- Next.js static export: `out`

Look for:

- unexpectedly large JavaScript files
- duplicated dependencies
- source maps included when they should not be public
- images or fonts that were not optimized
- routes that fail on direct refresh
- incorrect API URLs

For Vite projects, a bundle analyzer plugin can show which packages dominate the bundle.

## Code Splitting

React can lazy-load parts of the app.

```jsx
import { Suspense, lazy } from "react";

const AdminPage = lazy(() => import("./AdminPage"));

export function App() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <AdminPage />
    </Suspense>
  );
}
```

Use code splitting for routes, dashboards, editors, charts, and admin features. Avoid splitting tiny components only to create extra network requests.

Edge case:

If a lazy chunk fails to load because the user has an old tab open after a deployment, show a recoverable error. A simple error boundary can offer a refresh button.

## Source Maps

Source maps connect minified production code back to original source code. They are useful for debugging error reports, but they can expose source structure.

Common options:

- disable public source maps
- upload source maps privately to an error tracker
- keep source maps for staging only

Choose based on the app's risk level. Internal dashboards may tolerate public source maps. finance, healthcare, or proprietary apps usually should not.

## Production Checklist

Before deploying:

1. Run tests.
2. Run linting and type checks.
3. Build the app locally.
4. Preview the built app.
5. Test direct navigation to nested routes.
6. Test refresh after login and logout.
7. Verify environment variables.
8. Check loading, empty, and error states.
9. Check browser console errors.
10. Confirm assets load with the expected cache headers.

## Common Mistakes

- Shipping a dev build to production.
- Assuming environment variables are runtime variables.
- Exposing API keys or private tokens in the frontend bundle.
- Testing only the dev server, not the built files.
- Forgetting fallback routing for single-page apps.
- Ignoring bundle size until the app feels slow.
- Treating source maps as harmless.

## Tricky Question

If a React app reads `import.meta.env.VITE_API_URL`, can the server change that value after the app is deployed?

Usually no. For a static build, that value was embedded into the JavaScript bundle during build time. To change it, rebuild the app or design a runtime configuration file that the app fetches when it starts.

:::quiz
question: Which statement about frontend environment variables is most accurate?
options:
  - They are safe for database passwords because they are stored in .env files.
  - They are usually embedded into the browser bundle during the build.
  - They can always be changed without rebuilding the app.
  - They are automatically encrypted by React.
answer: 1
explanation: Public frontend environment variables are normally replaced at build time and become part of the shipped JavaScript.
:::

## Practice Challenge

Build and inspect one React app.

Requirements:

- create a production build
- serve the built files locally
- verify one route by direct refresh
- log the configured API base URL in development only
- identify the largest generated JavaScript file
- write a short note explaining whether public source maps should be enabled

## Recap

A production build is not just a faster development build. It is a compiled artifact with embedded configuration, optimized assets, and different runtime behavior. Always test the built output before deploying it.
