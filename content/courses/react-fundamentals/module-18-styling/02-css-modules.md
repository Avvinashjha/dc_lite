# CSS Modules

CSS Modules let you write normal CSS with locally scoped class names.

They are a good middle ground between global CSS and more complex styling systems.

## The Basic Pattern

Create a file such as `ProductCard.module.css`.

```css
.card {
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 1rem;
}

.title {
  font-size: 1.25rem;
  margin: 0;
}
```

Import it into a component.

```jsx
import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{product.name}</h2>
    </article>
  );
}
```

The build tool turns `styles.card` into a unique generated class name.

This avoids accidental conflicts with another `.card` elsewhere.

## Conditional Classes

```css
.button {
  border: 0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

.primary {
  background: #0969da;
  color: white;
}

.danger {
  background: #cf222e;
  color: white;
}
```

```jsx
import styles from "./Button.module.css";

function Button({ variant = "primary", children }) {
  const className = `${styles.button} ${styles[variant]}`;

  return <button className={className}>{children}</button>;
}
```

For complex conditions, use a helper like `clsx`.

```jsx
const className = clsx(styles.button, {
  [styles.active]: isActive,
  [styles.disabled]: disabled,
});
```

## Global Escape Hatch

CSS Modules can still target global selectors when needed.

```css
:global(body) {
  margin: 0;
}
```

Use global rules sparingly.

If everything becomes global, CSS Modules lose their main benefit.

## Composition

Some CSS Module setups support `composes`.

```css
.base {
  border-radius: 6px;
  padding: 0.5rem;
}

.primary {
  composes: base;
  background: #0969da;
  color: white;
}
```

Composition can reduce duplication, but overusing it can make styles hard to trace.

## Common Mistakes

- Forgetting to import the module and using raw string class names by accident.
- Expecting `.title` from one module to affect another component.
- Using dynamic class names that do not exist in the module.
- Putting global resets into every module.
- Over-nesting selectors until the component becomes hard to reuse.

:::quiz
question: What is the main benefit of CSS Modules?
options:
  - They make all CSS global
  - They scope class names to avoid accidental naming conflicts
  - They remove the need for responsive design
  - They run API requests from CSS
answer: 1
explanation: CSS Modules generate scoped class names so common names like `.card` do not collide across components.
:::

## Practical Challenge

Create a `Tabs` component with a CSS Module.

Include:

- base tab styling
- active tab styling
- keyboard focus styling
- responsive wrapping when the screen is narrow

Then explain which styles should stay local and which, if any, should be global.

## Recap

CSS Modules keep the strengths of CSS while reducing global class conflicts.

They are a strong default when you want scoped component styles without adopting a runtime styling library.
