# Styling Approaches

React does not require one styling system.

You can use plain CSS, CSS Modules, CSS-in-JS, utility classes, component libraries, or a combination.

The right choice depends on team workflow, design system needs, bundle size, performance, and maintainability.

## Common Options

| Approach | Strength | Watch Out For |
| --- | --- | --- |
| Global CSS | simple and browser-native | naming conflicts and leakage |
| CSS Modules | scoped class names | still needs good composition habits |
| CSS-in-JS | props-driven styling and colocated styles | runtime cost and tooling complexity |
| Tailwind CSS | fast utility workflow | long class strings and design discipline |
| Bootstrap | quick prebuilt UI patterns | generic look and customization limits |
| Design system components | consistency | upfront investment |

You do not need to use every approach.

Most production apps standardize on one primary approach and a few supporting conventions.

## Plain CSS

Plain CSS is still powerful.

```css
.card {
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 1rem;
}

.cardTitle {
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
}
```

```jsx
function ProductCard({ product }) {
  return (
    <article className="card">
      <h2 className="cardTitle">{product.name}</h2>
    </article>
  );
}
```

The risk is that class names are global unless your tooling scopes them.

## Inline Styles

Inline styles are useful for dynamic values that are truly calculated in JavaScript.

```jsx
function ProgressBar({ value }) {
  return (
    <div className="progress">
      <div className="progressFill" style={{ width: `${value}%` }} />
    </div>
  );
}
```

Do not use inline styles for everything.

They cannot express pseudo-classes like `:hover`, media queries, or many accessibility states cleanly.

## Conditional Classes

React styling often means choosing classes based on state.

```jsx
function Button({ variant = "primary", disabled, children }) {
  const className = `button button-${variant} ${disabled ? "button-disabled" : ""}`;

  return (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  );
}
```

Libraries such as `clsx` can make this cleaner in real projects.

## Responsive and Accessible Styling

Styling should support usability, not just appearance.

Check:

- keyboard focus is visible
- text has enough contrast
- layout works on small screens
- clickable targets are large enough
- motion respects reduced-motion preferences
- disabled controls look disabled and are actually disabled

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    scroll-behavior: auto;
  }
}
```

## Common Mistakes

- Choosing a styling tool before defining design constraints.
- Using inline styles for hover, focus, and responsive behavior.
- Forgetting accessible focus states.
- Creating one-off styles instead of reusable design tokens.
- Mixing many styling systems without clear boundaries.

:::quiz
question: Which styling concern is accessibility-related?
options:
  - Whether a class name is camelCase
  - Whether keyboard focus is visible
  - Whether styles are colocated with components
  - Whether the project uses Sass
answer: 1
explanation: Visible keyboard focus is essential for users who navigate without a mouse.
:::

## Practical Challenge

Take a simple `Button` component and define:

- primary and secondary variants
- disabled styling
- visible focus styling
- responsive spacing

Implement it using plain CSS first, then discuss how CSS Modules or Tailwind would change the implementation.

## Recap

React styling is about choosing a maintainable system for the product.

Prioritize consistency, accessibility, responsive behavior, and team clarity over chasing a fashionable tool.
