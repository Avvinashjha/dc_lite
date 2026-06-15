# Source Maps and Build Inspection

React developers often debug source code, but users run the built output.

Source maps and build inspection help you understand the gap between the code you wrote and the files the browser downloads.

## Why Inspect Builds

Development servers are optimized for feedback. Production builds are optimized for users.

Inspecting a build helps answer:

- which files are shipped to the browser?
- how large are the JavaScript and CSS chunks?
- are source maps generated?
- are environment variables embedded?
- are route chunks split as expected?
- are duplicate dependencies included?
- are assets hashed for long-term caching?

Run the production path before shipping:

```bash
npm run build
npm run preview
```

If a bug appears only after deployment, reproduce it against the production build before guessing.

## Reading Build Output

A typical Vite build may produce a `dist/` folder like this:

```text
dist/
  index.html
  assets/
    index-a1b2c3.js
    index-d4e5f6.css
    Dashboard-g7h8i9.js
```

Hashed filenames help caching. If the file content changes, the hash changes, so browsers can safely cache older assets.

Code-split chunks often correspond to lazy-loaded routes or large dependencies.

```jsx
const Dashboard = lazy(() => import("./routes/Dashboard"));
```

After building, confirm that the dashboard code is not part of the initial route if it is meant to load later.

## Source Maps

Source maps connect generated JavaScript back to original source files.

Without source maps, production errors may point to minified code:

```text
TypeError: Cannot read properties of undefined at index-a1b2c3.js:1:43892
```

With source maps, error tools can show the original component and line.

Source maps are useful for debugging, but they can expose source structure and comments. Common strategies:

- upload source maps privately to an error tracker
- serve source maps only to authenticated internal users
- disable public source maps for sensitive apps
- generate source maps for staging but not public production

The right choice depends on your app's risk profile.

## Bundle Analysis

Bundle analysis shows what contributes to JavaScript size.

Look for:

- unexpectedly large libraries
- duplicate dependency versions
- server-only packages in browser bundles
- admin code loaded on public pages
- imports that defeat tree shaking
- large locales or icon sets imported all at once

Example mistake:

```js
// May import much more than needed depending on the package
import _ from "lodash";
```

More targeted:

```js
import debounce from "lodash/debounce";
```

Modern packages vary, so verify with the actual build output instead of assuming.

## Environment Variables in Built Code

Frontend environment variables are usually replaced at build time.

```js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

After building, the output may contain the literal value:

```js
const apiBaseUrl = "https://api.example.com";
```

That is why client-exposed environment variables are not secrets. Anyone can inspect downloaded JavaScript.

## Production-Only Edge Cases

Some issues appear only in optimized builds:

- incorrect asset base paths under subdirectory deployments
- client-side routes returning 404 on refresh
- dependency behavior changing after minification
- missing environment variables during CI build
- source maps uploaded for the wrong release
- lazy-loaded chunks failing after a deploy with stale HTML
- CSS order changing when extracted and minified

Previewing the build locally catches many of these before users do.

## Common Mistakes

- Shipping without running the production build.
- Assuming source maps are either always safe or always unsafe.
- Ignoring chunk sizes until performance becomes a production issue.
- Treating bundle analyzer output as a one-time task.
- Leaving old assets or stale service worker caches untested.
- Putting secrets in environment variables and expecting minification to hide them.

:::quiz
question: Why can frontend environment variables appear in the production JavaScript bundle?
options:
  - Bundlers often replace client-exposed variables with literal values at build time
  - Browsers automatically encrypt all environment variables
  - React stores environment variables only in server memory
  - Source maps remove all configuration values
answer: 0
explanation: Client-exposed variables are compiled into browser code. They are useful for public configuration, not private secrets.
:::

## Practice Challenge

Build a React app that has two lazy-loaded routes and one frontend environment variable. Inspect the output folder. Identify the initial JavaScript file, route chunks, CSS assets, hashed filenames, and whether source maps exist. Then write one risk or operational note for each finding.

## Recap

Build inspection connects source code to shipped code. Use it to verify chunks, source maps, assets, cache behavior, public configuration, and production-only failure modes before deployment.
