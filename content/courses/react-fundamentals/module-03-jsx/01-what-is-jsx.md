# What is JSX?

JSX is the syntax React developers commonly use to describe UI.

It looks like HTML, but it is JavaScript syntax that gets transformed before it runs in the browser.

```jsx
function WelcomeMessage() {
  return <h1>Welcome back!</h1>;
}
```

The `h1` above is not a string and it is not directly inserted into the DOM. It becomes a React element: a plain JavaScript object that describes what React should render.

## Why JSX Exists

React is built around components. A component usually combines:

- markup structure
- JavaScript values
- event handlers
- conditional logic
- child components

JSX keeps those related pieces close together.

```jsx
function UserBadge({ user }) {
  return (
    <section className="badge">
      <img src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.role}</p>
    </section>
  );
}
```

Without JSX, the same UI would be written with function calls. That is valid, but harder to read for most interface code.

```jsx
import { createElement } from "react";

function UserBadge({ user }) {
  return createElement(
    "section",
    { className: "badge" },
    createElement("img", { src: user.avatarUrl, alt: user.name }),
    createElement("h2", null, user.name),
    createElement("p", null, user.role)
  );
}
```

JSX is not required to use React, but it is the standard way to write React applications.

## JSX Produces React Elements

A React element is a description of UI.

```jsx
const element = <button disabled>Save</button>;
```

Conceptually, React receives an object that says:

- render a `button`
- set its `disabled` prop
- place the text `Save` inside it

React uses that description to update the actual browser DOM.

## JSX Can Represent Components

Lowercase tags represent built-in DOM elements.

```jsx
<article>
  <h1>Lesson</h1>
</article>
```

Capitalized tags represent React components.

```jsx
function LessonTitle({ title }) {
  return <h1>{title}</h1>;
}

function LessonPage() {
  return <LessonTitle title="What is JSX?" />;
}
```

This capitalization rule matters. If you write `<lessonTitle />`, React treats it like a custom HTML tag instead of your JavaScript function.

## JSX Is JavaScript With Markup Syntax

Because JSX lives inside JavaScript, you can use variables and expressions with curly braces.

```jsx
function CartSummary({ itemCount }) {
  const label = itemCount === 1 ? "item" : "items";

  return (
    <p>
      Your cart has {itemCount} {label}.
    </p>
  );
}
```

Curly braces accept expressions, not statements. A ternary expression is allowed. An `if` statement is not.

```jsx
// Good
<p>{isLoggedIn ? "Welcome back" : "Please sign in"}</p>

// Not valid JSX
<p>{if (isLoggedIn) "Welcome back"}</p>
```

## Common Mistakes

- Treating JSX like a template string. JSX values are JavaScript expressions, not string interpolation.
- Forgetting to capitalize component names.
- Returning two sibling elements without wrapping them in a parent or fragment.
- Using HTML attributes like `class` or `for` instead of JSX names like `className` and `htmlFor`.
- Trying to put statements such as `if`, `for`, or `switch` directly inside `{}`.

## Awareness Note: JSX and Security

React escapes text values inserted with curly braces.

```jsx
function Comment({ text }) {
  return <p>{text}</p>;
}
```

If `text` contains `"<script>alert('x')</script>"`, React renders it as text instead of executing it as HTML.

This default escaping is an important security feature. Avoid `dangerouslySetInnerHTML` unless you fully understand and sanitize the content.

:::quiz
question: What does JSX become before it runs in the browser?
options:
  - CSS rules
  - React element descriptions created by JavaScript
  - Raw HTML strings inserted directly into the page
  - Browser-only template files
answer: 1
explanation: JSX is compiled into JavaScript that creates React elements. React then uses those element descriptions to render and update the UI.
:::

## Recap

JSX is a JavaScript syntax extension for describing React UI. It lets you combine markup-like structure with JavaScript expressions, component calls, props, and children in one readable form.
