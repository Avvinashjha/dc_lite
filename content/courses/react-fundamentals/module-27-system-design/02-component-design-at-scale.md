# Component Design at Scale

Component design at scale is less about creating many small components and more about creating understandable boundaries.

A good component answers:

- what data does it need?
- who owns that data?
- what can it render?
- what events can it emit?
- what should it not know about?

## Component Categories

A practical React app often has several component types:

- page components: route-level screens
- feature components: product-specific UI
- shared components: reusable building blocks
- layout components: structure and spacing
- provider components: context and integration setup

Do not force every component into the same pattern.

## Keep Data Ownership Clear

```jsx
function ProductPage() {
  const productQuery = useProduct();

  return <ProductDetails product={productQuery.data} />;
}
```

`ProductPage` owns fetching. `ProductDetails` renders the product. This makes `ProductDetails` easier to test and reuse.

## Avoid Over-General Components

A component that accepts too many props often becomes harder to use than duplicated markup.

```jsx
<Button variant="primary" size="sm" disabled={isSaving}>
  Save
</Button>
```

This is reasonable. A button with twenty visual flags and several unrelated behaviors is a warning sign.

Prefer composition when variation grows.

```jsx
<Card>
  <Card.Header title="Billing" />
  <Card.Body>
    <InvoiceList invoices={invoices} />
  </Card.Body>
</Card>
```

## Keys and Identity

React uses keys to understand list identity.

```jsx
{todos.map((todo) => (
  <TodoRow key={todo.id} todo={todo} />
))}
```

Do not use array indexes as keys when items can be inserted, removed, sorted, or filtered. Incorrect keys can preserve the wrong component state.

## Public APIs for Components

Reusable components need stable APIs. Props should describe intent, not internal implementation.

Good:

```jsx
<Modal title="Delete project" onClose={closeModal} />
```

Less useful:

```jsx
<Modal headerDivClass="red-large-border" internalMode="x2" />
```

## Common Mistakes

- Extracting components before the behavior is understood.
- Sharing feature-specific components too early.
- Passing entire API responses through many layers when only a few fields are needed.
- Mixing data fetching, formatting, permissions, and presentation in one component.
- Using unstable keys and then debugging strange state reuse.

:::quiz
question: Why are stable keys important when rendering lists in React?
options:
  - They help React preserve the correct component identity across updates
  - They encrypt list data in the browser
  - They make CSS selectors shorter
  - They prevent network requests automatically
answer: 0
explanation: Keys tell React which item each rendered element represents. Unstable keys can cause incorrect state preservation.
:::

## Practice Challenge

Refactor a large `DashboardPage` into route, feature, and shared components. Keep data fetching at the route or feature boundary. Write down the responsibility of each extracted component in one sentence.

## Recap

Scale comes from clear ownership and stable component APIs. Extract components to clarify responsibilities, not to satisfy a target file size.
