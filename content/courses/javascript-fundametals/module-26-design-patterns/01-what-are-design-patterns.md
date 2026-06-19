# What Are Design Patterns?

A design pattern is a reusable way to solve a common programming problem.

It is not a library, framework, or rule you must follow every time.

It is a name for a solution shape that experienced developers have seen many times.

Examples:

- creating objects in a consistent way
- sharing one service across a program
- notifying many parts of an app when something changes
- swapping one algorithm for another
- wrapping one API so it is easier to use

## Why Patterns Matter

Patterns help developers talk about code.

Instead of saying:

> This object keeps a list of functions and calls them when the value changes.

You can say:

> This uses the observer pattern.

That shared vocabulary is useful when reading code, reviewing pull requests, and designing larger systems.

## Patterns Are Not Magic

A pattern does not automatically make code better.

This simple code is often better than a pattern-heavy version:

```js
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

You do not need a `TotalCalculatorFactoryStrategyManager` for every function.

Use patterns when they solve a real problem in the code you have.

## A Simple Pattern Example

Imagine an app that needs to create users from form input.

Without a clear creation step, user objects may be shaped differently in different files.

```js
const userA = {
  name: "Ada",
  active: true,
};

const userB = {
  fullName: "Grace",
  isActive: true,
};
```

This inconsistency creates bugs.

A factory function gives the creation logic one place to live.

```js
function createUser(name) {
  return {
    name,
    active: true,
    createdAt: new Date().toISOString(),
  };
}

const user = createUser("Ada");
```

That is a small example of a pattern helping with consistency.

## When Patterns Help

Patterns are useful when code has a recurring shape.

Good signs:

- the same setup code appears in several places
- one part of the code needs to notify many other parts
- several implementations share the same interface
- a complex API needs a simpler wrapper
- dependencies are hard to replace in tests
- object creation has validation or defaults

## When Patterns Hurt

Patterns hurt when they add layers without solving a problem.

Warning signs:

- the pattern name is clearer than the code itself
- simple functions become many files and classes
- every change requires touching multiple abstractions
- the design is built for imaginary future requirements
- beginners on the team cannot follow the flow

## Patterns in JavaScript

JavaScript is flexible.

A pattern might be implemented with:

- plain objects
- functions
- closures
- classes
- modules
- arrays of callbacks
- higher-order functions

For example, the strategy pattern does not require classes.

```js
const shippingStrategies = {
  standard: (total) => total + 5,
  express: (total) => total + 15,
  pickup: (total) => total,
};

function calculateOrderTotal(total, shippingType) {
  const applyShipping = shippingStrategies[shippingType];
  return applyShipping(total);
}
```

This is still a strategy pattern because the behavior is selected from interchangeable options.

## Pattern vs Principle

A design principle is a broad guideline.

A design pattern is a reusable solution shape.

Examples of principles:

- keep code readable
- prefer composition over inheritance
- separate concerns
- depend on abstractions, not hard-coded details

Examples of patterns:

- factory
- singleton
- observer
- strategy
- adapter
- command

Patterns often apply principles, but they are not the same thing.

## Common Mistakes

### Starting With the Pattern

Do not start by asking, "Which pattern can I use?"

Start by asking, "What problem does this code have?"

Then choose the simplest solution.

### Memorizing Names Without Understanding Tradeoffs

Knowing pattern names is useful, but the real skill is knowing when a pattern improves code.

A singleton can simplify access to shared configuration.

It can also hide global state and make tests harder.

Both are true.

### Treating JavaScript Like Java

Many classic design pattern examples use classes because they came from class-based languages.

JavaScript can often express the same idea with smaller functions and modules.

Prefer the style that fits the codebase.

## A Practical Decision Process

Before adding a pattern, ask:

1. What problem am I solving?
2. Is the problem happening now?
3. Would a function or plain object be enough?
4. Will this make the calling code easier to read?
5. Will this make testing easier or harder?
6. Can another developer understand it quickly?

If the answer is unclear, keep the design simple.

## Best Practices

- Use pattern names as communication tools, not decoration.
- Prefer simple functions and objects first.
- Add a pattern when duplication, coupling, or complexity makes it worthwhile.
- Keep public interfaces small and predictable.
- Avoid building for requirements that do not exist yet.
- Document unusual patterns with a short comment or README note.

## Summary

Design patterns are reusable ways to solve common software design problems.

They are valuable because they provide shared vocabulary and proven solution shapes.

They are harmful when used to make simple code look advanced.

In JavaScript, the best pattern implementation is often the simplest one that makes the code easier to understand, test, and change.

