# Handling Events

Events let React components respond to user actions.

React event handlers are passed as functions through JSX props.

```jsx
function SaveButton() {
  function handleClick() {
    console.log("Saved");
  }

  return <button onClick={handleClick}>Save</button>;
}
```

## Event Prop Names

React event props use camelCase.

```jsx
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit}>...</form>
```

The value should be a function, not a string.

```jsx
// Bad
<button onclick="save()">Save</button>

// Good
<button onClick={save}>Save</button>
```

## Passing Arguments

If a handler needs arguments, wrap it in another function.

```jsx
function TodoItem({ todo, onToggle }) {
  return (
    <button onClick={() => onToggle(todo.id)}>
      {todo.completed ? "Undo" : "Complete"}
    </button>
  );
}
```

Do not call the handler during render.

```jsx
// Wrong: runs immediately
<button onClick={onToggle(todo.id)}>Toggle</button>
```

## The Event Object

React passes an event object to handlers.

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} />;
}
```

For form fields, `event.target.value` is the current input value.

For checkboxes, use `event.target.checked`.

```jsx
function TermsCheckbox() {
  const [accepted, setAccepted] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={accepted}
        onChange={(event) => setAccepted(event.target.checked)}
      />
      I accept the terms
    </label>
  );
}
```

## Preventing Default Behavior

Forms reload the page by default. In React apps, you often prevent that and handle submission in JavaScript.

```jsx
function SignupForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Submit", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit">Sign up</button>
    </form>
  );
}
```

Set button types intentionally. A plain `<button>` inside a form submits the form by default.

```jsx
<button type="button" onClick={openPreview}>
  Preview
</button>
```

## Event Bubbling

Events bubble from child elements to parent elements.

```jsx
function Card() {
  function handleCardClick() {
    console.log("card");
  }

  function handleButtonClick(event) {
    event.stopPropagation();
    console.log("button");
  }

  return (
    <article onClick={handleCardClick}>
      <h2>Project</h2>
      <button onClick={handleButtonClick}>Open menu</button>
    </article>
  );
}
```

Use `stopPropagation` sparingly. Often, simpler markup or more specific handlers are better.

## Common Mistakes

- Writing `onClick={save()}` instead of `onClick={save}`.
- Forgetting `event.preventDefault()` for handled form submissions.
- Reading `event.target.value` from checkboxes instead of `event.target.checked`.
- Using a submit button for an in-form action that should not submit.
- Stopping propagation when the real issue is unclear component structure.

:::quiz
question: What should you pass to `onClick`?
options:
  - A string of JavaScript code
  - A function React can call when the click happens
  - The result of calling the handler immediately
  - A CSS selector
answer: 1
explanation: React event props receive functions. React calls the function later when the event occurs.
:::

## Practice Challenge

Build a `SearchForm` component.

Requirements:

- controlled text input
- submit button
- prevents the browser's default form submission
- calls `onSearch(query)` when submitted
- includes a clear button with `type="button"`

## Recap

React events are functions passed through camelCase props. Use event objects for input values, prevent default form behavior when needed, and pass arguments with wrapper functions.
