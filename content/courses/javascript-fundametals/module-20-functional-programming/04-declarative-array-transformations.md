# Declarative Array Transformations

Functional programming often favors declarative code.

Declarative code describes what you want.

Imperative code describes step by step how to do it.

Both styles are useful.

Functional JavaScript often uses declarative array transformations.

## Imperative Example

```js
const products = [
  { name: "Keyboard", price: 100, inStock: true },
  { name: "Monitor", price: 300, inStock: false },
  { name: "Mouse", price: 50, inStock: true },
];

const names = [];

for (const product of products) {
  if (product.inStock) {
    names.push(product.name);
  }
}

console.log(names); // ["Keyboard", "Mouse"]
```

This code explains each step.

## Declarative Version

```js
const names = products
  .filter((product) => product.inStock)
  .map((product) => product.name);

console.log(names); // ["Keyboard", "Mouse"]
```

This code describes the transformation:

1. Keep products in stock.
2. Convert products to names.

## Transformation Pipelines

You can chain array methods to build a pipeline.

```js
const total = products
  .filter((product) => product.inStock)
  .map((product) => product.price)
  .reduce((sum, price) => sum + price, 0);

console.log(total); // 150
```

Each step returns a value used by the next step.

## Naming Steps for Readability

Long chains can become hard to read.

You can split them into named steps.

```js
const inStockProducts = products.filter((product) => product.inStock);
const prices = inStockProducts.map((product) => product.price);
const total = prices.reduce((sum, price) => sum + price, 0);
```

This is still functional and declarative.

Readable code matters more than clever code.

## Using Predicate Functions

A predicate is a function that returns `true` or `false`.

```js
function isInStock(product) {
  return product.inStock;
}

const availableProducts = products.filter(isInStock);
```

Predicates make filters reusable.

```js
function isAffordable(product) {
  return product.price <= 100;
}

const affordableProducts = products.filter(isAffordable);
```

## Using Mapper Functions

A mapper converts one value into another.

```js
function getProductName(product) {
  return product.name;
}

const names = products.map(getProductName);
```

Named mapper functions can make transformations easier to test.

## Avoid Mutating in Transformations

Avoid this:

```js
const discounted = products.map((product) => {
  product.price = product.price * 0.9;
  return product;
});
```

This mutates the original product objects.

Prefer:

```js
const discounted = products.map((product) => {
  return {
    ...product,
    price: product.price * 0.9,
  };
});
```

Now each item is copied and updated.

## Sorting Declaratively

`sort()` mutates the original array.

```js
const sorted = [...products].sort((a, b) => a.price - b.price);
```

If supported, use `toSorted()`.

```js
const sorted = products.toSorted((a, b) => a.price - b.price);
```

Both approaches avoid changing the original `products` array.

## find() and some()

Not every transformation needs `map`, `filter`, or `reduce`.

Use `find()` to get one matching item.

```js
const keyboard = products.find((product) => product.name === "Keyboard");
```

Use `some()` to check if at least one item matches.

```js
const hasOutOfStockProduct = products.some((product) => !product.inStock);
```

Use `every()` to check if all items match.

```js
const allInStock = products.every((product) => product.inStock);
```

## Best Practices

Use array methods to express data transformations.

Prefer named predicate and mapper functions when logic grows.

Keep chains readable.

Avoid mutation inside `map`, `filter`, and `reduce`.

Split long pipelines into named steps.

Use `find`, `some`, and `every` for the right intent.

## Common Mistakes

### Mistake 1: Making Chains Too Clever

One long chain can be harder to read than several named steps.

Prefer clarity.

### Mistake 2: Mutating Inside map()

`map()` should usually return transformed values without changing the original items.

### Mistake 3: Using filter() to Find One Item

```js
const matches = products.filter((product) => product.id === 1);
const product = matches[0];
```

Use:

```js
const product = products.find((product) => product.id === 1);
```

## Summary

Declarative array transformations describe what should happen to data.

- Use `filter()` to keep items.
- Use `map()` to transform items.
- Use `reduce()` to combine values.
- Use `find()`, `some()`, and `every()` for specific questions.
- Avoid mutation inside transformation callbacks.
- Split complex pipelines into readable named steps.
