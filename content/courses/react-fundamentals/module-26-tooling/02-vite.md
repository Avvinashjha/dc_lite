# Vite

Vite is a popular default choice for modern React apps because it gives fast development startup and a straightforward production build.

The key idea is that development and production use different strategies:

- development: native ES modules and fast transforms
- production: optimized bundling, minification, chunking, and asset hashing

## Creating a React App

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

A typical Vite React project has:

```text
src/
  main.jsx
  App.jsx
index.html
vite.config.js
package.json
```

Unlike some older setups, `index.html` is part of the module graph. The script tag points to your source entry.

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

## Development Server

Vite's dev server serves modules on demand. When you edit a component, Hot Module Replacement can update the browser without a full reload.

This improves feedback speed, but it can hide lifecycle issues if you rely only on HMR. Occasionally refresh the page to test real startup behavior.

## Production Build

```bash
npm run build
npm run preview
```

`npm run build` creates optimized files, usually in `dist/`. `npm run preview` serves that build locally so you can catch routing, asset-path, and environment mistakes before deployment.

## Configuration

Common React configuration includes plugins, aliases, server options, and build settings.

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

Aliases can make imports easier to read, but use them consistently. Too many aliases can make code harder to move between tools.

## Environment Variables in Vite

Only variables prefixed with `VITE_` are exposed to client code.

```env
VITE_API_BASE_URL=https://api.example.com
```

```js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

Do not put private keys, database passwords, or admin tokens in `VITE_` variables. They become part of the client bundle.

## Edge Cases

- Browser-only code can fail during tests or SSR-like rendering if it reads `window` too early.
- A route that works in dev may 404 on static hosting unless rewrites are configured.
- Assets referenced with incorrect base paths may work locally and fail under a subdirectory deploy.
- Some packages behave differently when optimized by esbuild in dev and Rollup in production.

:::quiz
question: Why should you run `npm run preview` after `npm run build`?
options:
  - It serves the production build locally so production-only issues can be caught
  - It automatically deploys the app to Vercel
  - It disables all environment variables
  - It rewrites React components into class components
answer: 0
explanation: Previewing the built output helps catch routing, asset, and optimization issues that the dev server may not show.
:::

## Common Mistakes

- Treating `import.meta.env.VITE_SECRET` as secret.
- Deploying without testing the production build.
- Forgetting static-host rewrites for client-side routing.
- Adding a plugin before checking whether Vite already supports the feature.

## Practice Challenge

Add a `VITE_API_BASE_URL` variable to a Vite React app. Render it in development, build the app, and inspect the generated JavaScript to confirm that frontend environment variables are embedded into the bundle.

## Recap

Vite is fast because it keeps development lightweight and production optimized. Learn both modes: most confusing Vite bugs come from assuming they are identical.
