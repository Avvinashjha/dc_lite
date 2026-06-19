# Babel

Babel is a JavaScript compiler. In React projects, it is commonly used to transform JSX and modern JavaScript syntax into code that your target browsers can run.

You do not always configure Babel directly. Vite, Webpack, Jest, and framework presets may configure it for you. Still, knowing what Babel does makes build and test failures easier to understand.

## JSX Transformation

React components often use JSX:

```jsx
const element = <button disabled={isSaving}>Save</button>;
```

A compiler transforms that syntax into JavaScript. With the modern JSX transform, you usually do not need to import `React` only for JSX.

## Presets and Plugins

A preset is a group of plugins. A plugin performs a specific transformation.

Common presets include:

- `@babel/preset-env` for JavaScript syntax based on target environments
- `@babel/preset-react` for JSX
- `@babel/preset-typescript` for TypeScript syntax removal

Example configuration:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "defaults" }],
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

## Babel Is Not a Type Checker

Babel can remove TypeScript syntax, but it does not fully type-check your app.

```ts
const count: number = 'five';
```

A Babel-only transform may remove the annotation and still emit JavaScript. Use `tsc --noEmit` or your framework's type-check command when you need type correctness.

## Polyfills

Syntax transforms and runtime APIs are different.

Babel can transform optional chaining syntax, but it does not magically implement every missing browser API unless configured with polyfills.

```js
const name = user?.profile?.name;
```

If your code uses `IntersectionObserver`, `ResizeObserver`, or `Intl` features in older browsers, check browser support and polyfill strategy separately.

## React Fast Refresh

Development tools may use Babel plugins to support React Fast Refresh. This is why a component can update without losing all local state during development.

Fast Refresh is a development feature. Do not depend on it for production behavior.

## Common Mistakes

- Assuming Babel type-checks TypeScript.
- Adding broad polyfills that increase bundle size for all users.
- Forgetting that test transforms and app transforms may be configured separately.
- Debugging generated code without source maps.
- Using different Babel settings in development, tests, and production without a reason.

:::quiz
question: Which statement about Babel and TypeScript is correct?
options:
  - Babel can strip TypeScript syntax, but it does not replace a real type check
  - Babel stores TypeScript types in the browser for runtime validation
  - Babel prevents all runtime errors in React components
  - Babel only works with class components
answer: 0
explanation: Babel can transform syntax, including removing TypeScript annotations, but type checking requires TypeScript tooling such as `tsc`.
:::

## Practice Challenge

Take a small JSX snippet and paste it into Babel's online REPL using the React preset. Compare the output for classic and automatic JSX runtimes. Explain what changed and why it matters for imports.

## Recap

Babel is about transformation, not application architecture. Understand which syntax it transforms, which runtime features still need support, and where your project configures it.
