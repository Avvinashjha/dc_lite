# Typing Events

React wraps browser events in its own event types.

TypeScript helps you know which properties are available for each element and event.

## Input Change Events

```tsx
function EmailField() {
  const [email, setEmail] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.currentTarget.value);
  }

  return <input type="email" value={email} onChange={handleChange} />;
}
```

`HTMLInputElement` tells TypeScript that `currentTarget.value` exists.

Prefer `currentTarget` when reading the element the handler is attached to.

## Inline Handlers Can Infer Types

```tsx
<input
  value={name}
  onChange={(event) => {
    setName(event.currentTarget.value);
  }}
/>;
```

TypeScript often infers `event` correctly for inline handlers.

When extracting the function, add the event type.

## Form Submit Events

```tsx
function SignupForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");

    console.log(email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <button type="submit">Sign up</button>
    </form>
  );
}
```

Use `preventDefault` when you want React to handle the submission instead of the browser navigating.

## Button Click Events

```tsx
function SaveButton() {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.currentTarget.disabled = true;
  }

  return <button onClick={handleClick}>Save</button>;
}
```

Usually you should update React state instead of mutating DOM properties directly.

This example shows the event type, not the preferred state pattern.

## Keyboard Events

```tsx
function SearchInput() {
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  }

  return <input onKeyDown={handleKeyDown} />;
}
```

Avoid relying on deprecated key codes.

Use `event.key` for readable behavior.

## Common Mistakes

- Using the broad `Event` type instead of React event types.
- Reading from `event.target` when `currentTarget` is the safer choice.
- Forgetting to type extracted event handlers.
- Mutating DOM directly instead of updating state.
- Handling keyboard events in ways that break expected accessibility behavior.

:::quiz
question: Which type is appropriate for an extracted text input `onChange` handler?
options:
  - React.ChangeEvent<HTMLInputElement>
  - React.MouseEvent<HTMLDivElement>
  - string
  - Promise<Event>
answer: 0
explanation: Text input changes use `React.ChangeEvent<HTMLInputElement>`, which exposes the input's current value.
:::

## Practical Challenge

Create a typed `SearchForm` component.

It should:

- track a text input
- submit through a typed form event
- clear the field when Escape is pressed
- call `onSearch(query: string)` when submitted

Use extracted handler functions with explicit event types.

## Recap

Type React events based on the event kind and the HTML element.

Use inference for small inline handlers, and add explicit React event types when extracting reusable functions.
