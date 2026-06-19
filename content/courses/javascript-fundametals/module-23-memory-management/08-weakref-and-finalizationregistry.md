# WeakRef and FinalizationRegistry

JavaScript includes two advanced memory-related APIs: `WeakRef` and `FinalizationRegistry`.

Most applications do not need them.

They are useful in specialized library code, but they come with important cautions because garbage collection timing is unpredictable.

## WeakRef

A `WeakRef` holds a weak reference to an object.

```js
let user = { name: "Ada" };
const userRef = new WeakRef(user);

console.log(userRef.deref()); // object, if it is still alive

user = null;
```

Later, `userRef.deref()` may return the object or `undefined`.

```js
const value = userRef.deref();

if (value) {
  console.log(value.name);
} else {
  console.log("The object was collected");
}
```

You must always handle the `undefined` case.

## WeakRef Is Not Predictable

This is not reliable:

```js
const ref = new WeakRef({ name: "Ada" });

if (ref.deref()) {
  console.log("Still alive");
}
```

The object may stay alive longer than you expect, or it may be collected later.

Your program should not depend on exactly when collection happens.

## FinalizationRegistry

`FinalizationRegistry` lets you register callbacks that may run after an object is garbage collected.

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Collected ${heldValue}`);
});

let user = { name: "Ada" };
registry.register(user, "user object");

user = null;
```

The callback might run eventually. It might not run before the page closes or the process exits.

## Do Not Use Finalizers for Required Cleanup

This is the most important rule.

Do not rely on `FinalizationRegistry` to:

- close files
- release database connections
- remove event listeners
- clear timers
- abort requests
- save user data
- update important program state

Use explicit cleanup instead.

```js
function startPolling() {
  const intervalId = setInterval(loadData, 1000);

  return function stopPolling() {
    clearInterval(intervalId);
  };
}
```

This is reliable. A finalizer is not.

## When WeakRef Might Be Useful

`WeakRef` can support advanced caches where values may be reused if still available, but recalculated if collected.

```js
const imageCache = new Map();

function rememberImage(url, image) {
  imageCache.set(url, new WeakRef(image));
}

function getCachedImage(url) {
  const ref = imageCache.get(url);
  const image = ref?.deref();

  if (!image) {
    imageCache.delete(url);
  }

  return image;
}
```

Even here, you may still need a normal cache limit because the `Map` retains the URL keys and weak reference objects.

## Prefer Simpler Tools First

Before using `WeakRef`, consider:

- Can a regular local variable solve this?
- Can a bounded `Map` cache solve this?
- Can `WeakMap` associate metadata with object keys more clearly?
- Can explicit cleanup solve the lifecycle problem?

Often the answer is yes.

## Best Practices

- Treat `WeakRef` and `FinalizationRegistry` as advanced tools.
- Always handle `WeakRef#deref()` returning `undefined`.
- Never depend on finalizers running promptly or at all before shutdown.
- Prefer explicit cleanup for important resources.
- Document why weak references are necessary if you use them.

## Common Mistakes

- Using `WeakRef` to avoid thinking about ownership.
- Expecting finalizers to run immediately after setting a variable to `null`.
- Putting required business logic inside a finalizer callback.
- Forgetting that surrounding collections can still hold other strong references.

## Summary

`WeakRef` and `FinalizationRegistry` expose advanced interactions with garbage collection.

They are rarely needed in beginner or application code. Prefer clear ownership, bounded caches, weak collections, and explicit cleanup.
