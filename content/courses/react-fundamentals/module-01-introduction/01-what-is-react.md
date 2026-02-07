# What is React?

React is a JavaScript library for building user interfaces. Created by Facebook (now Meta) in 2013, it has become the most popular front-end library in the world.

## Why React?

React solves a fundamental problem in web development: **keeping the UI in sync with application state**. Before React, developers had to manually manipulate the DOM, which was error-prone and hard to maintain.

### Key Concepts

1. **Declarative**: You describe *what* the UI should look like, not *how* to update it
2. **Component-Based**: Build encapsulated components that manage their own state
3. **Learn Once, Write Anywhere**: Use React for web, mobile (React Native), and more

## How React Works

React introduces a concept called the **Virtual DOM**:

```
User Action → State Change → Virtual DOM Update → Diff → Real DOM Update
```

Instead of updating the real DOM directly, React:
1. Creates a virtual representation of the UI
2. When state changes, creates a new virtual DOM
3. Compares (diffs) the old and new virtual DOM
4. Updates only the parts that actually changed

This makes updates efficient and predictable.

## A Simple Example

Here's what a React component looks like:

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Welcome name="World" />
```

This might look like HTML, but it's actually **JSX** - a syntax extension that lets you write HTML-like code in JavaScript.

## What You'll Learn

In this course, you'll learn:
- How to create and compose components
- Managing state and props
- Handling events and forms
- Working with hooks
- Building a complete project

Let's get started!

:::quiz
question: What problem does React primarily solve?
options:
  - Database management
  - Keeping UI in sync with application state
  - Server-side rendering
  - CSS styling
answer: 1
explanation: React's primary purpose is to efficiently keep the user interface in sync with the application's state through its virtual DOM and declarative approach.
:::
