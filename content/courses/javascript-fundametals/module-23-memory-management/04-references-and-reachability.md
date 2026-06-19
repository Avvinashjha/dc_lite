# References and Reachability

A reference is a connection from one part of your program to a value.

Reachability means JavaScript can get to a value by starting from active roots and following references.

If a value is reachable, it stays in memory.

## Variables Hold References

```js
const user = {
  id: 1,
  name: "Ada",
};
```

The variable `user` refers to an object.

If another variable points to the same object, the object remains reachable through both variables.

```js
const selectedUser = user;
```

Now both `user` and `selectedUser` refer to the same object.

## Object Graphs

Objects can reference other objects.

```js
const team = {
  name: "Frontend",
  lead: {
    name: "Ada",
  },
  members: [
    { name: "Grace" },
    { name: "Linus" },
  ],
};
```

This creates an object graph.

As long as `team` is reachable, its `lead`, `members` array, and member objects are reachable too.

## Removing One Reference May Not Be Enough

```js
let user = { name: "Ada" };
const users = [user];

user = null;
```

The object is still reachable through `users[0]`.

To allow collection, every unnecessary reference must be removed.

```js
users.pop();
```

Now, if no other reference exists, the object can be collected.

## DOM References

In browser code, DOM nodes can also keep memory alive.

```js
let removedButton = document.querySelector("button");

removedButton.remove();
```

The button is removed from the page, but the JavaScript variable still references it.

```js
removedButton = null;
```

If there are no other references or listeners keeping it alive, it can be collected.

## Hidden References

Some references are easy to miss.

```js
const listeners = [];

function trackButton(button) {
  function handleClick() {
    console.log(button.textContent);
  }

  button.addEventListener("click", handleClick);
  listeners.push(handleClick);
}
```

The `handleClick` function closes over `button`. The `listeners` array keeps `handleClick` alive, which keeps `button` alive.

This may be intentional, but it should be cleaned up when tracking ends.

## Reachability With Maps

A regular `Map` strongly references its keys and values.

```js
const metadata = new Map();
let user = { id: 1 };

metadata.set(user, { lastSeen: Date.now() });
user = null;
```

The user object is still reachable as a key in `metadata`.

If you want metadata that should disappear when the object is otherwise gone, a `WeakMap` may be a better fit.

## Best Practices

- Think about who owns data and when that owner should release it.
- Remove items from arrays, objects, maps, and sets when they are no longer useful.
- Avoid accidental module-level storage for temporary values.
- Be especially careful with DOM nodes, callbacks, and caches because they often form hidden reference chains.

## Common Mistakes

- Clearing one variable while another collection still references the same object.
- Removing a DOM node but keeping a JavaScript reference to it.
- Forgetting that functions can retain values through closures.
- Assuming a `Map` key disappears when your local variable is set to `null`.

## Summary

Memory is retained through references. A value can be collected only when it is no longer reachable through any active reference chain.

When diagnosing memory problems, ask: what is still pointing to this value?
