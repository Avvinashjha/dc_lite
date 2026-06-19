# Webpack

Webpack is a mature bundler that powers many large React applications. Even if you use Vite today, understanding Webpack helps you work on existing codebases and debug build pipelines.

Webpack starts from one or more entry points, follows imports, applies loaders, and emits bundles.

## Mental Model

```text
entry -> dependency graph -> loaders -> plugins -> output bundles
```

A simplified React setup might look like this:

```js
module.exports = {
  entry: './src/main.jsx',
  output: {
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

## Loaders

Loaders transform files before they enter the bundle. Babel can transform JSX. CSS loaders can process CSS imports. Asset modules can handle images and fonts.

The order of loaders matters. In arrays, Webpack applies loaders from right to left.

```js
use: ['style-loader', 'css-loader']
```

Here `css-loader` resolves CSS first, then `style-loader` injects it into the page.

## Plugins

Plugins affect broader build behavior. They can generate HTML, extract CSS, define environment variables, analyze bundles, or clean output folders.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({ template: './index.html' }),
]
```

## Code Splitting

React apps often split routes or heavy features.

```jsx
import { lazy, Suspense } from 'react';

const AdminPage = lazy(() => import('./AdminPage'));

export function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AdminPage />
    </Suspense>
  );
}
```

Webpack sees the dynamic import and can create a separate chunk.

## Source Maps

Webpack has several `devtool` options. Fast source maps are useful in development. Production source maps require a deliberate decision.

```js
devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'
```

Public production source maps make debugging easier but may expose source details. Many teams upload them to monitoring tools instead of serving them to everyone.

## Common Mistakes

- Using development mode for production bundles.
- Accidentally bundling duplicate versions of React.
- Misconfiguring loader order.
- Shipping source maps without understanding visibility.
- Ignoring bundle analyzer output when dependencies grow.

:::quiz
question: In Webpack, what is a loader mainly used for?
options:
  - Transforming imported files before they are bundled
  - Running database migrations
  - Opening pull requests automatically
  - Replacing the browser's rendering engine
answer: 0
explanation: Loaders transform modules such as JSX, CSS, images, or TypeScript before Webpack includes them in the dependency graph.
:::

## Practice Challenge

Find a Webpack React project or create a small one. Add a dynamic import for a rarely used component and build the project. Confirm that a separate chunk is emitted, then explain when that chunk is loaded.

## Recap

Webpack is powerful because it is explicit and extensible. That flexibility is useful in complex apps, but it also means small configuration mistakes can affect every deployed user.
