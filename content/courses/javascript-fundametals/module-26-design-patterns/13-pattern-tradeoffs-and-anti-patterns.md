# Pattern Tradeoffs and Anti-Patterns

Design patterns are tools.

A good tool solves a specific problem.

The wrong tool can make simple work harder.

This lesson reviews how to choose patterns wisely and avoid common anti-patterns.

## Start With the Problem

Before choosing a pattern, describe the problem in plain language.

Good problem statements:

- Object creation is duplicated in five places.
- API response shapes are leaking into UI code.
- A button should trigger different actions depending on configuration.
- Several services need to react when the current user changes.
- Tests are hard because functions import real browser storage directly.

Weak problem statements:

- We should use more patterns.
- This code does not look enterprise enough.
- We may need every possible variation someday.

Patterns should answer a real design pressure.

## Match Problems to Patterns

| Problem | Possible pattern |
| --- | --- |
| Repeated object creation | Factory |
| One shared infrastructure service | Singleton, with caution |
| Many listeners reacting to change | Observer or pub/sub |
| Interchangeable algorithms | Strategy |
| External interface does not match your app | Adapter |
| Complex workflow needs a simple API | Facade |
| Add behavior around a function | Decorator or wrapper |
| Queue, retry, log, or undo actions | Command |
| Traverse values consistently | Iterator |
| Replace services in tests | Dependency injection |
| Combine flexible capabilities | Composition |

This table is a starting point, not a rulebook.

## Prefer the Smallest Useful Pattern

A pattern does not need a class hierarchy.

This strategy is enough for many cases:

```js
const validators = {
  email(value) {
    return value.includes("@");
  },
  required(value) {
    return value.trim() !== "";
  },
};
```

This factory is enough for many cases:

```js
function createUser(name) {
  return {
    name,
    active: true,
  };
}
```

Use the smallest version that makes the design clearer.

## Anti-Pattern: God Object

A god object owns too many responsibilities.

```js
const system = {
  users: [],
  products: [],
  cart: [],
  renderPage() {},
  saveUser() {},
  calculateTax() {},
  sendEmail() {},
  trackAnalytics() {},
};
```

This object becomes hard to test and risky to change.

Better: split responsibilities by purpose.

```js
const userService = createUserService();
const cartService = createCartService();
const analytics = createAnalyticsClient();
```

## Anti-Pattern: Hidden Global State

Hidden global state appears when many parts of the app read and write shared values.

```js
export const appState = {
  currentUser: null,
  cart: [],
  theme: "light",
};
```

This may start convenient, but changes become hard to trace.

Prefer explicit functions, scoped state, or well-defined state management.

## Anti-Pattern: Pattern Soup

Pattern soup happens when several patterns are stacked without improving clarity.

Example warning signs:

- many files exist for one small behavior
- every action passes through several managers
- pattern names appear more often than domain names
- debugging requires jumping across many layers

A simple function may be better.

## Anti-Pattern: Premature Abstraction

Premature abstraction means creating a flexible design before you know what needs to vary.

```js
function createUniversalInputStrategyFactory(config) {
  // built for many cases that do not exist yet
}
```

It is often better to write clear direct code first.

When real duplication or variation appears, extract the pattern then.

## Anti-Pattern: Leaky Abstraction

An abstraction leaks when callers still need to understand hidden details.

```js
const user = adaptUserFromApi(apiUser);

// Later in UI code:
console.log(user.user_id); // API field leaked into app code
```

If your app model uses `id`, keep the external `user_id` field inside the adapter.

## Balancing Readability and Flexibility

Readable code is not always the shortest code.

Flexible code is not always the best code.

A good design balances:

- what the code needs today
- how likely the behavior is to change
- how easy it is to test
- how easy it is for another developer to follow
- how consistent it is with the rest of the project

## Refactoring Into Patterns

You do not need to design everything perfectly at the start.

Many patterns are easiest to introduce during refactoring.

Example path:

1. Start with direct code.
2. Notice repeated creation or branching.
3. Extract a factory or strategy.
4. Add tests around the new boundary.
5. Keep the public interface small.

This approach is often safer than guessing early.

## Practical Checklist

Before adding a pattern, ask:

1. Does this pattern remove real duplication or coupling?
2. Does it make the calling code easier to read?
3. Are the names based on the app's domain, not only the pattern?
4. Can the pattern be tested independently?
5. Can a simpler function or module solve the problem?
6. Does it match the surrounding code style?

If the pattern fails these questions, simplify.

## Common Mistakes

### Optimizing for Imaginary Requirements

Design for likely change, not every possible change.

### Copying Examples Too Literally

Classic pattern examples may use classes because they came from other languages.

In JavaScript, a function or module may be clearer.

### Ignoring Team Understanding

Code is read more than it is written.

A clever pattern is not helpful if the team cannot maintain it.

## Best Practices

- Name code after business concepts first, pattern names second.
- Keep interfaces small and consistent.
- Prefer simple functions until a pattern solves a visible problem.
- Add patterns through refactoring when possible.
- Test behavior at pattern boundaries.
- Remove abstractions that no longer pay for themselves.

## Summary

Patterns help when they make real code easier to understand, test, and change.

They hurt when they add ceremony, hidden state, or imaginary flexibility.

The goal is not to use every pattern.

The goal is to choose the simplest design that handles the problem clearly.

