# Console Methods

The console is often the first debugging tool you reach for.

It helps you answer practical questions:

- Did this code run?
- What value does this variable have right now?
- How many times did this branch execute?
- What data came back from an API?
- Which object changed unexpectedly?

Console debugging is not a replacement for breakpoints, tests, or DevTools, but it is quick and useful when used carefully.

## `console.log`

`console.log()` prints values to the console.

```js
const user = {
  id: 42,
  name: "Maya",
  role: "admin",
};

console.log(user);
```

Use clear labels so the output is easy to recognize.

```js
console.log("user before update:", user);
console.log("selected id:", selectedId);
```

Without labels, several logs can become confusing quickly.

```js
console.log(user);
console.log(user);
console.log(user);
```

## Logging Multiple Values

You can log several values in one call.

```js
console.log("cart total:", total, "item count:", cart.length);
```

This is useful when the bug depends on more than one value.

```js
function applyDiscount(price, discountPercent) {
  console.log("discount inputs:", price, discountPercent);
  return price - price * discountPercent;
}
```

If the function returns the wrong result, first confirm that the inputs are what you think they are.

## Logging Objects Carefully

In browser consoles, logged objects can sometimes be displayed as live references.

That means the object may look different after later code mutates it.

```js
const settings = { theme: "light" };

console.log("before:", settings);

settings.theme = "dark";
```

If you need a snapshot, clone the value before logging.

```js
console.log("snapshot:", structuredClone(settings));
```

For JSON-safe data, you may also see this pattern:

```js
console.log("snapshot:", JSON.parse(JSON.stringify(settings)));
```

Prefer `structuredClone()` when available because it supports more data types than JSON serialization.

## `console.warn` and `console.error`

Use `console.warn()` for suspicious states that are not necessarily fatal.

```js
if (items.length === 0) {
  console.warn("Expected at least one item");
}
```

Use `console.error()` for failures.

```js
try {
  const user = JSON.parse(rawUser);
  console.log(user);
} catch (error) {
  console.error("Could not parse user JSON:", error);
}
```

Warnings and errors are usually styled differently in DevTools, which makes them easier to find.

## `console.table`

`console.table()` is useful for arrays of objects.

```js
const users = [
  { id: 1, name: "Asha", active: true },
  { id: 2, name: "Noah", active: false },
  { id: 3, name: "Lina", active: true },
];

console.table(users);
```

This can make list data much easier to scan than a normal log.

You can also choose specific columns.

```js
console.table(users, ["id", "active"]);
```

## `console.count`

`console.count()` counts how many times a label has been logged.

```js
function renderItem(item) {
  console.count("renderItem called");
  return `<li>${item.name}</li>`;
}
```

This helps when code runs more often than expected.

```js
button.addEventListener("click", () => {
  console.count("button clicked");
});
```

Reset a counter with `console.countReset()`.

```js
console.countReset("button clicked");
```

## `console.time`

Use `console.time()` and `console.timeEnd()` for quick timing checks.

```js
console.time("filter users");

const activeUsers = users.filter((user) => user.active);

console.timeEnd("filter users");
```

The label passed to `console.timeEnd()` must match the label passed to `console.time()`.

This is not a full performance profiling tool, but it can help you notice unexpectedly slow code.

## `console.trace`

`console.trace()` prints a stack trace from the current location.

```js
function saveSettings(settings) {
  console.trace("saveSettings was called");
  // save the settings
}
```

Use it when you know a function is running, but you do not know what called it.

## Debugging Conditions

A helpful pattern is to log only when something unusual happens.

```js
function getUserName(user) {
  if (!user || typeof user.name !== "string") {
    console.warn("Invalid user passed to getUserName:", user);
  }

  return user.name;
}
```

This keeps your console focused.

Avoid logging every value in a large loop unless you really need it.

```js
for (const order of orders) {
  if (order.total < 0) {
    console.warn("Negative order total:", order);
  }
}
```

## Removing Debug Logs

Temporary debug logs should usually be removed before code is committed or shipped.

Debug logs can:

- expose sensitive data
- slow down noisy code paths
- make real errors harder to notice
- confuse other developers

If a log is useful long term, make it intentional and clear.

```js
console.warn("Retrying request after network failure");
```

## Common Mistakes

Do not log only the final result when the bug is caused by an earlier input.

```js
function calculateTotal(items, taxRate) {
  console.log("inputs:", items, taxRate);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  console.log("subtotal:", subtotal);

  return subtotal + subtotal * taxRate;
}
```

Do not leave vague messages.

```js
console.log("here");
console.log("test");
console.log("value");
```

Prefer searchable labels.

```js
console.log("checkout submit payload:", payload);
```

## Summary

Console methods help you inspect values, count calls, time code, and trace where functions are called from.

Use them deliberately:

- label your logs
- inspect inputs as well as outputs
- use `warn`, `error`, `table`, `count`, `time`, and `trace` when they fit
- remove temporary logs when the investigation is over

Good console debugging turns guesses into observations.
