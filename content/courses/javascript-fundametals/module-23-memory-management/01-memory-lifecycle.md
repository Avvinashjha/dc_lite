# Memory Lifecycle

Every JavaScript program uses memory.

When your code creates values, the JavaScript engine needs somewhere to store them. When those values are no longer needed, the engine tries to reclaim that memory automatically.

A simple mental model is:

1. Allocate memory.
2. Use the value.
3. Release the memory when it is no longer reachable.

JavaScript handles most releasing for you through garbage collection, but your code still controls which values stay reachable.

## Allocation

Allocation means reserving memory for a value.

```js
const name = "Ada";
const scores = [95, 88, 91];
const user = {
  id: 1,
  name: "Ada",
};
```

Strings, arrays, objects, functions, dates, promises, DOM nodes, and many other values need memory.

You also allocate memory when you call functions:

```js
function greet(name) {
  const message = `Hello, ${name}`;
  return message;
}

greet("Ada");
```

The parameter `name` and local variable `message` exist while the function is running.

## Use

Using memory means reading from it, writing to it, passing it around, or connecting it to other values.

```js
const cart = [];

cart.push({ id: 1, name: "Keyboard", price: 75 });
cart.push({ id: 2, name: "Mouse", price: 25 });

const total = cart.reduce((sum, item) => sum + item.price, 0);
```

The array stores references to item objects. The reducer reads each object and calculates a total.

## Release

In JavaScript, you usually do not manually free memory.

Instead, memory can be reclaimed when a value is no longer reachable.

```js
function createReport() {
  const rows = new Array(1000).fill("row");
  return rows.length;
}

createReport();
```

After `createReport()` finishes, nothing outside the function can reach `rows`, so the array can be garbage collected.

Eligible for collection does not mean collected immediately. The engine decides when garbage collection should run.

## Reachability Matters

A value stays in memory if JavaScript can still reach it from active code.

```js
let cachedUsers = [];

function loadUsers(users) {
  cachedUsers = users;
}
```

The latest `users` array remains reachable through `cachedUsers`.

That might be intentional. It becomes a problem if the program keeps storing data it will never use again.

## Memory Management Is Mostly About References

JavaScript's memory management is less about deleting individual values and more about removing unnecessary references.

```js
let selectedUser = { id: 1, name: "Ada" };

selectedUser = null;
```

Setting `selectedUser` to `null` does not directly destroy the object.

It removes that variable's reference to the object. If no other reference exists, the object can be collected later.

## Common Sources of Long-Lived Memory

Some values naturally live longer than others:

- global variables
- module-level variables
- active timers
- event listeners
- caches
- DOM trees still attached to the page
- pending promises and async operations
- closures kept by long-lived functions

These are not automatically bad. They just deserve more attention because they can keep other values alive.

## Best Practices

- Keep data in the smallest useful scope.
- Avoid storing large data globally unless it is truly shared application state.
- Clear timers when they are no longer needed.
- Remove event listeners when a component or feature is cleaned up.
- Limit cache size instead of letting caches grow forever.
- Avoid keeping references to DOM nodes after they are removed.

## Common Mistakes

- Assuming JavaScript instantly frees memory when a function ends.
- Keeping old data in arrays or maps forever.
- Storing large responses in global variables for debugging and forgetting about them.
- Leaving background timers running after the related UI is gone.

## Summary

JavaScript memory follows a lifecycle: allocate, use, and release.

The garbage collector handles release automatically, but it can only collect values your program can no longer reach. Good memory management means keeping references intentional and cleaning up long-lived resources.
