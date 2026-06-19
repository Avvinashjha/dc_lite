# Observer and Pub/Sub

The observer pattern lets one object notify many listeners when something changes.

A related pattern, publish/subscribe, lets code publish events by name and lets other code subscribe to those events.

Both patterns help decouple the code that detects an event from the code that reacts to it.

## A Simple Observer

```js
function createCounter() {
  let count = 0;
  const listeners = [];

  return {
    subscribe(listener) {
      listeners.push(listener);
    },
    increment() {
      count += 1;

      for (const listener of listeners) {
        listener(count);
      }
    },
  };
}

const counter = createCounter();

counter.subscribe((count) => {
  console.log(`Count changed to ${count}`);
});

counter.increment(); // Count changed to 1
```

The counter does not know what each listener does.

It only knows that listeners should be called when the count changes.

## Returning an Unsubscribe Function

Listeners should usually be removable.

```js
function createEventSource() {
  const listeners = new Set();

  return {
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    notify(value) {
      for (const listener of listeners) {
        listener(value);
      }
    },
  };
}

const source = createEventSource();

const unsubscribe = source.subscribe((value) => {
  console.log(value);
});

source.notify("first");
unsubscribe();
source.notify("second");
```

Using a `Set` prevents the same function from being subscribed more than once.

## Pub/Sub With Event Names

Pub/sub often uses event names.

```js
function createEventBus() {
  const listeners = new Map();

  return {
    subscribe(eventName, listener) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, new Set());
      }

      listeners.get(eventName).add(listener);

      return () => {
        listeners.get(eventName).delete(listener);
      };
    },
    publish(eventName, data) {
      const eventListeners = listeners.get(eventName) ?? [];

      for (const listener of eventListeners) {
        listener(data);
      }
    },
  };
}

const events = createEventBus();

events.subscribe("user:signed-in", (user) => {
  console.log(`${user.name} signed in`);
});

events.publish("user:signed-in", { name: "Ada" });
```

The publisher does not import or call the subscriber directly.

## Browser Events Are Similar

DOM events are a built-in observer-style system.

```js
button.addEventListener("click", () => {
  console.log("Button clicked");
});
```

The button emits a `click` event.

Your listener reacts to it.

## Observer vs Pub/Sub

The terms are often used loosely.

A practical distinction:

| Pattern | Typical shape |
| --- | --- |
| Observer | Subject directly keeps a list of observers |
| Pub/sub | Publisher and subscriber communicate through an event bus or topic name |

In both cases, code reacts to events without tightly coupling every part together.

## Error Handling in Listeners

If one listener throws an error, it can stop the rest from running.

```js
function notifyAll(listeners, value) {
  for (const listener of listeners) {
    try {
      listener(value);
    } catch (error) {
      console.error("Listener failed", error);
    }
  }
}
```

Whether to catch listener errors depends on the app.

For UI events, you may want one broken listener not to break all others.

For critical workflows, you may want errors to stop the process.

## Async Listeners

If listeners can be async, decide whether to wait for them.

```js
async function publishAsync(listeners, data) {
  await Promise.all(
    listeners.map((listener) => listener(data))
  );
}
```

Waiting is useful when the publisher must know that all work finished.

Not waiting is useful for fire-and-forget notifications.

Be explicit about the behavior.

## Common Use Cases

Observer and pub/sub patterns are common for:

- UI events
- state changes
- chat messages
- notifications
- analytics tracking
- plugin systems
- real-time data updates

## Common Mistakes

### Forgetting to Unsubscribe

In long-running apps, forgotten listeners can cause memory leaks.

Always unsubscribe when a listener is no longer needed.

### Using Events for Everything

Events can make flow harder to trace.

If one function can directly call another clearly, do that.

### Vague Event Names

Names like `update` or `change` become confusing.

Prefer specific names like `cart:item-added` or `user:signed-out`.

### Hidden Data Contracts

Subscribers need to know the shape of event data.

Keep payloads simple and documented.

## Best Practices

- Return an unsubscribe function from `subscribe`.
- Use clear event names.
- Keep event payloads small and predictable.
- Decide how listener errors should behave.
- Avoid using a global event bus as a replacement for clear function calls.
- Clean up listeners when components or objects are destroyed.

## Summary

Observer and pub/sub patterns let code react to changes without hard-coding every relationship.

They are powerful for event-driven systems, but too many events can make behavior difficult to follow.

Use them when decoupling event producers from event consumers makes the code clearer.

