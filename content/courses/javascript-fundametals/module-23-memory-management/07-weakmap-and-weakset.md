# WeakMap and WeakSet

`WeakMap` and `WeakSet` are special collections that hold weak references to objects.

They are useful when you want to associate data with an object without preventing that object from being garbage collected.

## Strong References in Map

A regular `Map` strongly references its keys and values.

```js
const metadata = new Map();
let button = document.querySelector("button");

metadata.set(button, { clicked: 0 });
button = null;
```

The button may still be reachable because it is a key in `metadata`.

If the map is long-lived, this can keep old objects around.

## WeakMap Keys Are Weak

A `WeakMap` does not prevent its keys from being collected.

```js
const metadata = new WeakMap();
let button = document.querySelector("button");

metadata.set(button, { clicked: 0 });
button = null;
```

If nothing else can reach the button, the button can be collected. Its `WeakMap` entry can disappear too.

## WeakMap Keys Must Be Objects

```js
const weakMap = new WeakMap();

weakMap.set({ id: 1 }, "metadata");
weakMap.set("id", "metadata"); // TypeError
```

Primitive values like strings and numbers cannot be `WeakMap` keys.

## Private Object Data

`WeakMap` can store data connected to object instances.

```js
const privateData = new WeakMap();

class Counter {
  constructor() {
    privateData.set(this, { count: 0 });
  }

  increment() {
    const data = privateData.get(this);
    data.count += 1;
    return data.count;
  }
}

const counter = new Counter();
console.log(counter.increment()); // 1
```

When a `Counter` instance becomes unreachable, its private data can be collected too.

Modern JavaScript also has private class fields, so `WeakMap` is not always necessary for privacy.

## DOM Metadata

`WeakMap` is often useful for metadata attached to DOM nodes.

```js
const stateByElement = new WeakMap();

function initializeTooltip(element, message) {
  stateByElement.set(element, {
    message,
    visible: false,
  });
}

function showTooltip(element) {
  const state = stateByElement.get(element);

  if (state) {
    state.visible = true;
  }
}
```

If the element is removed and nothing else references it, the metadata does not keep it alive.

## WeakSet

`WeakSet` stores objects weakly.

It is useful when you only need to know whether an object has been seen.

```js
const processed = new WeakSet();

function processNode(node) {
  if (processed.has(node)) {
    return;
  }

  processed.add(node);
  // Process the node...
}
```

The `WeakSet` does not keep old nodes alive by itself.

## Weak Collections Are Not Iterable

You cannot loop through a `WeakMap` or `WeakSet`.

```js
const weakMap = new WeakMap();

// No weakMap.keys()
// No weakMap.size
// No for...of weakMap
```

This is intentional. If code could list weak keys, garbage collection behavior would become observable and unpredictable.

Use a regular `Map` when you need iteration, size, or manual eviction.

## Best Practices

- Use `WeakMap` for object metadata that should not keep the object alive.
- Use `WeakSet` for object membership tracking that should not keep objects alive.
- Use regular `Map` or `Set` when keys are primitives or when you need iteration.
- Do not use weak collections as general-purpose caches for strings or numbers.

## Common Mistakes

- Trying to use strings as `WeakMap` keys.
- Expecting `WeakMap` to have `size`, `keys()`, or iteration.
- Using `WeakMap` when a regular bounded cache would be clearer.
- Thinking weak references replace explicit cleanup for timers, listeners, or subscriptions.

## Summary

`WeakMap` and `WeakSet` let you associate data with objects without keeping those objects alive.

They are best for object metadata and membership tracking, not for every cache.
