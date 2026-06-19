# Lifting State Up

Lifting state up means moving state to the nearest common parent of the components that need it.

It is how React keeps shared data consistent without duplicating it.

## The Problem

Imagine two components need the same selected product id.

```jsx
function ProductList() {
  const [selectedId, setSelectedId] = useState(null);
  // ...
}

function ProductDetails() {
  const [selectedId, setSelectedId] = useState(null);
  // ...
}
```

This creates two separate states. Selecting a product in the list does not automatically update the details panel.

Instead, move the state to their shared parent.

## Shared Parent State

```jsx
function ProductsPage({ products }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedProduct = products.find((product) => product.id === selectedId);

  return (
    <main>
      <ProductList
        products={products}
        selectedId={selectedId}
        onSelectProduct={setSelectedId}
      />
      <ProductDetails product={selectedProduct} />
    </main>
  );
}
```

The parent owns the state. Children receive the current value and callbacks through props.

```jsx
function ProductList({ products, selectedId, onSelectProduct }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button
            className={product.id === selectedId ? "selected" : ""}
            onClick={() => onSelectProduct(product.id)}
          >
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Controlled Components

Inputs often use lifted state when another component needs the value.

```jsx
function SearchPage({ products }) {
  const [query, setQuery] = useState("");

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <SearchBox query={query} onQueryChange={setQuery} />
      <ProductResults products={visibleProducts} />
    </>
  );
}
```

The input component becomes controlled by props.

```jsx
function SearchBox({ query, onQueryChange }) {
  return (
    <input
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      placeholder="Search products"
    />
  );
}
```

The source of truth is the parent.

## How Far Should State Move?

Move state only as high as needed.

Good rule:

- If only one component needs it, keep it local.
- If siblings need it, move it to their nearest common parent.
- If many distant parts need it, later tools like context or external stores may help.

Do not lift everything to the top of the app by default. That can make many components re-render and make data flow harder to follow.

## Passing Events Up

Children should not directly modify parent state. They call callback props.

```jsx
function RatingPicker({ value, onChange }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => onChange(rating)}
          aria-pressed={rating === value}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}
```

The parent decides what the callback does.

```jsx
<RatingPicker value={rating} onChange={setRating} />
```

This keeps child components reusable.

## Common Mistakes

- Keeping duplicate state in siblings and trying to manually sync it.
- Lifting state higher than necessary.
- Copying a prop into local state and then wondering why it gets stale.
- Passing too many unrelated props through many layers before learning alternatives.
- Mutating parent-owned objects inside a child instead of calling a callback.

:::quiz
question: When should you lift state up?
options:
  - Whenever a component has any state
  - When multiple components need to read or update the same data
  - Only when using forms
  - To avoid writing event handlers
answer: 1
explanation: Shared state should live in the nearest common parent so all dependent components read one source of truth.
:::

## Practice Challenge

Build a `TemperatureConverter`.

Requirements:

- parent stores Celsius state
- `CelsiusInput` edits Celsius
- `FahrenheitDisplay` shows the converted Fahrenheit value
- changing Celsius updates both components

Conversion:

```jsx
const fahrenheit = (celsius * 9) / 5 + 32;
```

## Recap

Lift state when multiple components need the same changing data. Put the state in the nearest common parent, pass values down, and pass callbacks down so children can request updates.
