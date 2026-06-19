# Tailwind CSS

Tailwind CSS is a utility-first CSS framework.

Instead of writing many custom class names, you compose small utility classes directly in markup.

```jsx
function ProductCard({ product }) {
  return (
    <article className="rounded-lg border border-slate-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{product.description}</p>
    </article>
  );
}
```

This can be fast because you rarely leave the component file.

## Why Teams Like Tailwind

Tailwind works well when:

- the team wants a constrained design system
- utility classes are acceptable in JSX
- rapid UI iteration matters
- unused styles should be minimized by the build process
- designers and developers agree on token scales

It is not "no CSS".

It is CSS expressed through a utility vocabulary.

## Responsive Styling

Tailwind uses responsive prefixes.

```jsx
<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</section>
```

This creates one column by default, two on small screens, and three on large screens.

## State Styling

Tailwind includes variants for states.

```jsx
<button className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
  Save
</button>
```

Do not forget focus-visible and disabled states.

Utility classes can still produce inaccessible UI if important states are omitted.

## Conditional Classes

Use a class helper for variants.

```jsx
function Badge({ tone = "neutral", children }) {
  const toneClasses = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
```

For design systems, variant helpers such as class variance utilities can keep this organized.

## Common Mistakes

- Creating unreadably long class strings without extracting components.
- Using arbitrary values everywhere instead of the design scale.
- Forgetting semantic HTML because visual utilities make anything look clickable.
- Applying dark mode classes inconsistently.
- Mixing Tailwind with large custom CSS overrides that fight the utility system.

:::quiz
question: What does `sm:grid-cols-2` mean in Tailwind?
options:
  - Always use two columns on every screen size
  - Use two columns at the configured `sm` breakpoint and above
  - Hide the grid on small screens
  - Create two CSS files
answer: 1
explanation: Responsive prefixes apply utilities at the configured breakpoint and larger screen sizes.
:::

## Practical Challenge

Build a responsive pricing-card grid with Tailwind.

Include:

- one column on mobile
- three columns on large screens
- accessible button focus styles
- a highlighted "recommended" plan
- dark mode classes

Then identify one repeated class group that should become a reusable component.

## Recap

Tailwind is productive when your team accepts utility-first markup and uses a consistent design scale.

It still requires good component boundaries, accessibility checks, and restraint with custom one-off values.
