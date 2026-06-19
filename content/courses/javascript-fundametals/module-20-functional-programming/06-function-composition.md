# Function Composition

Function composition means combining small functions to build larger behavior.

Instead of writing one large function, you write small functions and connect them.

## Simple Example

```js
function trim(value) {
  return value.trim();
}

function lowercase(value) {
  return value.toLowerCase();
}

const input = "  ALICE@example.COM  ";

const normalized = lowercase(trim(input));

console.log(normalized); // alice@example.com
```

The output of `trim(input)` becomes the input to `lowercase()`.

## Why Composition Helps

Small functions are easier to:

- test
- reuse
- name
- debug
- combine

Composition works best when functions are pure.

Pure functions make it easier to trust each step.

## Breaking Logic Into Steps

Large function:

```js
function createSlug(title) {
  return title
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-");
}
```

Composed from smaller functions:

```js
const trim = (value) => value.trim();
const lowercase = (value) => value.toLowerCase();
const replaceSpacesWithHyphens = (value) => value.replaceAll(" ", "-");

function createSlug(title) {
  return replaceSpacesWithHyphens(lowercase(trim(title)));
}

console.log(createSlug("  JavaScript Basics  ")); // javascript-basics
```

Each helper has one job.

## A compose() Helper

Nested calls can become hard to read.

```js
replaceSpacesWithHyphens(lowercase(trim(title)));
```

You can create a `compose` helper.

```js
const compose = (...functions) => {
  return (value) => {
    return functions.reduceRight((currentValue, fn) => {
      return fn(currentValue);
    }, value);
  };
};
```

Use it:

```js
const createSlug = compose(
  replaceSpacesWithHyphens,
  lowercase,
  trim
);

console.log(createSlug("  JavaScript Basics  ")); // javascript-basics
```

`compose` runs from right to left.

```text
trim -> lowercase -> replaceSpacesWithHyphens
```

## A pipe() Helper

Some people prefer left-to-right flow.

```js
const pipe = (...functions) => {
  return (value) => {
    return functions.reduce((currentValue, fn) => {
      return fn(currentValue);
    }, value);
  };
};
```

Use it:

```js
const createSlug = pipe(
  trim,
  lowercase,
  replaceSpacesWithHyphens
);

console.log(createSlug("  JavaScript Basics  ")); // javascript-basics
```

`pipe` reads in the same order the data moves.

```text
trim -> lowercase -> replaceSpacesWithHyphens
```

## Composition With Objects

```js
const addTax = (product) => ({
  ...product,
  priceWithTax: product.price * 1.18,
});

const addLabel = (product) => ({
  ...product,
  label: `${product.name} - Rs. ${product.priceWithTax}`,
});

const formatProduct = pipe(addTax, addLabel);

const product = {
  name: "Keyboard",
  price: 1000,
};

console.log(formatProduct(product));
```

Each function returns a new object.

The original product is not mutated.

## Composition With Array Methods

You can compose transformation functions and use them in pipelines.

```js
const isInStock = (product) => product.inStock;
const getName = (product) => product.name;

const names = products
  .filter(isInStock)
  .map(getName);
```

This is a common functional JavaScript style.

## Composition and Function Shape

Composition is easiest when each function has one input and one output.

```js
const trim = (value) => value.trim();
const lowercase = (value) => value.toLowerCase();
```

Functions with many arguments can be harder to compose.

Currying can help turn multi-argument functions into composable functions.

## Best Practices

Compose small functions with clear names.

Keep functions pure when possible.

Use `pipe` for readable left-to-right transformations.

Use `compose` when right-to-left mathematical style fits your team.

Avoid composition chains that hide simple logic.

Prefer clarity over cleverness.

## Common Mistakes

### Mistake 1: Composing Functions in the Wrong Order

Order matters.

```js
const result = lowercase(trim(input));
```

is not always the same as:

```js
const result = trim(lowercase(input));
```

For these functions it is fine, but for many transformations order changes the result.

### Mistake 2: Composing Functions With Unexpected Side Effects

Composition is easier when each function simply returns a value.

Side effects can make the chain harder to reason about.

### Mistake 3: Making Everything Abstract

This may be harder to read:

```js
const result = pipe(a, b, c, d, e)(value);
```

If the steps are unclear, use named intermediate variables.

## Summary

Function composition combines small functions into larger behavior.

- The output of one function becomes the input of another.
- Pure functions are easiest to compose.
- `compose` often runs right to left.
- `pipe` often runs left to right.
- Currying can make functions easier to compose.
- Keep composed code readable.
