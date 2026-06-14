# Garbage Collection

JavaScript has automatic garbage collection.

That means you do not manually free memory the way you might in some lower-level languages. The JavaScript engine periodically finds values that are no longer needed and reclaims their memory.

## What Garbage Collection Does

Garbage collection removes values that your program can no longer reach.

```js
function createUser() {
  const user = { name: "Ada" };
  return user.name;
}

createUser();
```

After the function finishes, the `user` object cannot be reached anymore.

It becomes eligible for garbage collection.

Eligible does not mean collected immediately. The engine decides when to run garbage collection.

## Roots

Garbage collectors start from roots.

Roots are values the engine knows are currently reachable, such as:

- global variables
- currently running function variables
- the current call stack
- active timers and callbacks
- DOM nodes still attached to the page
- module-level variables

From those roots, the engine follows references to find more reachable values.

## Mark and Sweep

A common garbage collection strategy is called mark and sweep.

The simplified process is:

1. Start from the roots.
2. Mark every value that can be reached.
3. Follow references from those values and mark more values.
4. Sweep away unmarked values.

```js
let user = { name: "Ada" };
let profile = { owner: user };

user = null;
```

The original user object is still reachable through `profile.owner`, so it cannot be collected.

```js
profile = null;
```

Now the profile object and the user object may both be unreachable.

## Cycles Are Not Usually a Problem

Modern JavaScript engines use reachability-based collection, so cycles can still be collected if nothing reachable points to them.

```js
let a = {};
let b = {};

a.other = b;
b.other = a;

a = null;
b = null;
```

The two objects reference each other, but if no root can reach either object, the cycle can be collected.

## Garbage Collection Is Automatic, Not Predictable

You usually cannot control exactly when garbage collection runs.

```js
let data = new Array(100000).fill("item");

data = null;
```

This makes the array eligible for collection.

It does not guarantee that memory usage will drop immediately in developer tools.

## What Garbage Collection Cannot Fix

Garbage collection cannot collect reachable values.

```js
const logs = [];

function logMessage(message) {
  logs.push({ message, createdAt: Date.now() });
}
```

If `logs` grows forever, the collector cannot know those entries are no longer useful. They are still reachable by design.

This is how many memory leaks happen in JavaScript: values are not needed anymore, but code still keeps references to them.

## Best Practices

- Let short-lived local variables go out of scope naturally.
- Remove references from long-lived containers when data is no longer needed.
- Prefer bounded caches over arrays or maps that grow forever.
- Do explicit cleanup for timers, event listeners, subscriptions, and requests.
- Do not rely on garbage collection running at a specific time.

## Common Mistakes

- Expecting `value = null` to immediately reduce memory usage.
- Thinking circular references always leak.
- Keeping old data reachable in global arrays or maps.
- Using finalizers as a substitute for explicit cleanup.

## Summary

Garbage collection is based on reachability. The engine starts from roots, marks reachable values, and can reclaim values that are not reachable.

Your job is to avoid keeping unnecessary references alive.
