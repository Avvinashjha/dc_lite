# ESLint and Prettier

ESLint and Prettier improve code quality in different ways.

- ESLint finds suspicious patterns and enforces code rules.
- Prettier formats code consistently.

Do not make them fight each other. Let Prettier own formatting and ESLint own correctness-oriented rules.

## Why React Apps Need Linting

React bugs are often caused by stale closures, incorrect hook dependencies, missing keys, unsafe effects, or inconsistent component boundaries.

The React Hooks plugin is especially important.

```jsx
import { useEffect, useState } from 'react';

export function SearchBox({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then((response) => response.json())
      .then(setResults);
  }, [query]);

  return <p>{results.length} results</p>;
}
```

If `query` is missing from the dependency array, the effect may use stale input.

## Prettier's Role

Prettier removes style debates.

```bash
npx prettier . --check
npx prettier . --write
```

Use it for indentation, line wrapping, quotes, trailing commas, and similar formatting details.

## ESLint's Role

ESLint can catch problems that formatting cannot.

```bash
npx eslint .
```

Useful React rules include checks for:

- hook dependency arrays
- hook call order
- missing keys in lists
- unused variables
- accessibility issues through `eslint-plugin-jsx-a11y`

## Common Configuration Shape

Modern projects often use flat config, but the idea is the same: combine recommended rules and project-specific rules.

```js
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

## Edge Cases

Sometimes `exhaustive-deps` reveals a design problem instead of a simple missing dependency. If adding a function to the array causes repeated effects, consider moving the function into the effect, memoizing it, or deriving state during render.

Avoid disabling a rule just to silence it.

```jsx
// Risky: this hides the stale closure question instead of answering it.
// eslint-disable-next-line react-hooks/exhaustive-deps
```

Disable rules only with a clear explanation.

## Common Mistakes

- Using ESLint for formatting rules that Prettier already handles.
- Running lint only locally and not in CI.
- Ignoring hook dependency warnings.
- Formatting generated files or build output.
- Auto-fixing without reviewing behavior-changing fixes.

:::quiz
question: What is the best division of responsibility between Prettier and ESLint?
options:
  - Prettier formats code, while ESLint catches suspicious patterns and rule violations
  - Prettier runs unit tests, while ESLint deploys the app
  - ESLint should replace all code review
  - Prettier should decide React hook dependencies
answer: 0
explanation: Prettier is a formatter. ESLint enforces rules and can catch likely bugs, especially with React-specific plugins.
:::

## Practice Challenge

Create a component with a `useEffect` that reads a prop. Run ESLint with React Hooks rules enabled. Fix the warning without disabling the rule, then explain why your fix is correct.

## Recap

Use Prettier to make style boring. Use ESLint to catch mistakes early. In React, hook and accessibility lint rules are not optional polish; they prevent real bugs.
