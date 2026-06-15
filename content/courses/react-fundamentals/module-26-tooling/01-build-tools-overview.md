# Build Tools Overview

React applications are usually written with modern JavaScript, JSX, CSS imports, TypeScript, environment variables, and many small modules. Browsers do not understand all of that directly in the same way your source code is written, so build tools prepare the app for development and production.

A build tool answers questions like:

- how does JSX become browser-friendly JavaScript?
- how are files bundled or split into chunks?
- how are CSS, images, and fonts referenced?
- how are development errors mapped back to source files?
- how are production assets minified, hashed, and cached?

## Development vs Production

Development tooling optimizes feedback speed. It should start quickly, show useful errors, and update the browser after edits.

Production tooling optimizes what the user downloads and executes.

```bash
npm run dev
npm run build
npm run preview
```

Those commands usually do different things. A dev server can serve source-like modules and skip heavy optimization. A production build should remove dead code, minify output, and generate static assets.

## What Happens to JSX

JSX is syntax for describing UI, but browsers do not execute JSX directly.

```jsx
export function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

A compiler transforms it into JavaScript function calls. Modern React projects may use Babel, SWC, or esbuild for this transformation.

## Bundling and Code Splitting

A bundler follows imports and creates files the browser can load.

```jsx
import { formatPrice } from './money';
import './ProductCard.css';

export function ProductCard({ product }) {
  return <p>{formatPrice(product.price)}</p>;
}
```

The bundler must decide where `money`, CSS, and the component code end up. In production, it may create multiple chunks so that rarely used pages are loaded later.

## Source Maps

Minified production files are hard to debug. Source maps connect generated code back to original source files.

Source maps are useful, but they can expose source structure. Decide whether to upload them privately to an error tracker, serve them publicly, or disable them based on the application risk.

## Common Tooling Pieces

- Vite: fast dev server and production build pipeline.
- Webpack: configurable bundler used in many mature apps.
- Babel: JavaScript and JSX transformation.
- ESLint: catches suspicious or inconsistent code.
- Prettier: formats code consistently.
- TypeScript: adds static typing when the project uses it.

## Common Mistakes

- Assuming the dev server is the same as the production build.
- Debugging a production-only issue without running `npm run build` and previewing the result.
- Putting secrets in frontend environment variables.
- Ignoring source-map and bundle-size settings until after launch.
- Adding plugins without understanding their build-time and runtime effects.

:::quiz
question: What is the main reason React projects need a build step?
options:
  - To transform, bundle, and optimize source files for browsers
  - To make React components run only on Node.js
  - To replace all tests with static analysis
  - To hide all frontend code from users
answer: 0
explanation: Build tools transform JSX and modern syntax, resolve imports, bundle assets, and optimize output. Frontend code is still delivered to users.
:::

## Practice Challenge

Create a small React app and compare `npm run dev` with `npm run build`. Inspect the generated output folder. Find the JavaScript chunks, CSS files, hashed filenames, and any source map files. Write down one difference between development behavior and production output.

## Recap

Build tools are part of the runtime story. They affect startup speed, debugging, caching, security posture, and deploy behavior. A strong React developer understands what the toolchain is doing, even when using a preset.
