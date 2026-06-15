# Embedding Expressions in JSX

Curly braces let JSX read values from JavaScript.

They are how React components mix UI structure with dynamic data.

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

## Expressions, Not Statements

Inside `{}`, JSX accepts JavaScript expressions.

An expression produces a value.

```jsx
<p>{user.name}</p>
<p>{price * quantity}</p>
<p>{isOnline ? "Online" : "Offline"}</p>
```

Statements control flow or perform actions. They do not produce a value in the way JSX needs.

```jsx
// Invalid
<p>{if (isOnline) "Online"}</p>

// Invalid
<ul>{for (const item of items) <li>{item}</li>}</ul>
```

Move statement logic before the return, or use expressions such as ternaries and `.map()`.

```jsx
function StatusLabel({ isOnline }) {
  const label = isOnline ? "Online" : "Offline";

  return <p>{label}</p>;
}
```

## Rendering Lists with map

Arrays are expressions, so `.map()` is the usual way to render repeated UI.

```jsx
function TagList({ tags }) {
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
```

The callback returns JSX for each item. React receives an array of elements.

## Conditional Values

Use a ternary when you need either one UI branch or another.

```jsx
function AuthButton({ isLoggedIn }) {
  return (
    <button>
      {isLoggedIn ? "Sign out" : "Sign in"}
    </button>
  );
}
```

Use `&&` when you only want to show something if a condition is true.

```jsx
function Inbox({ unreadCount }) {
  return (
    <header>
      <h1>Inbox</h1>
      {unreadCount > 0 && <strong>{unreadCount} unread</strong>}
    </header>
  );
}
```

Watch out for numeric values with `&&`.

```jsx
// If items.length is 0, React renders 0.
{items.length && <p>Items found</p>}

// Safer
{items.length > 0 && <p>Items found</p>}
```

## Values React Does and Does Not Render

React renders strings and numbers.

```jsx
<p>{0}</p>
<p>{"Saved"}</p>
```

React ignores `true`, `false`, `null`, and `undefined`.

```jsx
<p>{false}</p>
<p>{null}</p>
```

Objects are not valid as direct children.

```jsx
// Invalid: objects are not directly renderable
<pre>{user}</pre>

// Valid for debugging
<pre>{JSON.stringify(user, null, 2)}</pre>
```

Arrays can render if their items are renderable.

```jsx
<p>{["React", " ", "JSX"]}</p>
```

## Calling Functions in JSX

You can call functions inside JSX, but keep render logic cheap and predictable.

```jsx
function ProductPrice({ amount, currency }) {
  return <p>{formatPrice(amount, currency)}</p>;
}
```

Avoid doing expensive work directly in JSX on every render.

```jsx
// Risky if sortProducts is expensive or mutates the array
{sortProducts(products).map((product) => (
  <ProductRow key={product.id} product={product} />
))}
```

Prefer preparing data above the return, especially when the logic needs names or comments.

## Escaping and Text Safety

Values inserted with `{}` are escaped.

```jsx
function SearchResult({ query }) {
  return <p>Results for {query}</p>;
}
```

If `query` contains HTML, React displays the characters as text. It does not execute scripts or parse tags.

This is safer than building HTML strings manually.

## Common Mistakes

- Putting `if` or `for` statements directly inside `{}`.
- Using `items.length && ...` and accidentally rendering `0`.
- Rendering an object directly instead of one of its fields.
- Calling a state setter while rendering, which can cause render loops.
- Doing heavy calculations in JSX instead of preparing values clearly.

:::quiz
question: Which value will React render as visible text?
options:
  - false
  - null
  - undefined
  - 0
answer: 3
explanation: React ignores false, null, and undefined as children, but it renders numbers, including 0.
:::

## Practice Challenge

Create a `CartSummary` component that receives `items`.

It should:

- show `Your cart is empty` when there are no items
- show the number of items when there are items
- render each item name in a list
- use stable keys from each item's `id`

Starter data:

```jsx
const items = [
  { id: "sku-1", name: "Keyboard" },
  { id: "sku-2", name: "Mouse" },
];
```

## Recap

Curly braces let JSX use JavaScript expressions. Use them for values, ternaries, function results, and arrays from `.map()`, but keep statements and expensive logic outside the markup.
