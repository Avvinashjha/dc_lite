# Controlled Components

Forms are different from most UI because the browser already knows how to store input values. A text box keeps its own current text, a checkbox keeps its own checked state, and a select element keeps its selected option.

In a controlled component, React state becomes the source of truth for that value.

## The Core Pattern

A controlled input has two important pieces:

- `value` or `checked` comes from React state
- `onChange` updates that state when the user edits the field

```jsx
import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <label>
      Name
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </label>
  );
}
```

When the user types, React receives the change event, updates state, and renders the input again with the new value.

## Why Control Inputs?

Controlled inputs make form data easy to inspect and transform.

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  return (
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search lessons"
      />
      <p>Searching for: {normalizedQuery || "nothing yet"}</p>
    </>
  );
}
```

This is useful when the UI depends on the current value, such as live previews, conditional fields, character counters, disabled submit buttons, and validation messages.

## Different Input Types

Text inputs use `value`.

```jsx
<input value={email} onChange={(event) => setEmail(event.target.value)} />
```

Textareas also use `value` in React.

```jsx
<textarea value={bio} onChange={(event) => setBio(event.target.value)} />
```

Checkboxes usually use `checked`.

```jsx
<input
  type="checkbox"
  checked={accepted}
  onChange={(event) => setAccepted(event.target.checked)}
/>
```

Selects use `value` on the `select` element.

```jsx
<select value={role} onChange={(event) => setRole(event.target.value)}>
  <option value="student">Student</option>
  <option value="mentor">Mentor</option>
</select>
```

## Common Mistakes

Do not pass `value` without an `onChange` handler unless the field is intentionally read-only.

```jsx
// This field cannot be edited.
<input value={name} />
```

Do not switch between uncontrolled and controlled values.

```jsx
// Risky: undefined makes the input uncontrolled at first.
const [name, setName] = useState();
```

Prefer an explicit initial value.

```jsx
const [name, setName] = useState("");
```

## Edge Cases

Number inputs still provide strings through `event.target.value`.

```jsx
const age = Number(event.target.value);
```

Be careful with empty input. `Number("")` becomes `0`, which may not be what the user meant.

```jsx
const nextAge = event.target.value === "" ? "" : Number(event.target.value);
```

File inputs cannot be controlled with a normal `value`; use a ref or read `event.target.files`.

:::quiz
question: In a controlled text input, where should the displayed value come from?
options:
  - React state passed to the input's value prop
  - A variable declared outside the component
  - The input's defaultValue after every render
answer: 0
explanation: A controlled text input displays the value React passes through the value prop, and onChange updates that state.
:::

## Best Practices

Use controlled components when the form needs live validation, conditional rendering, or derived UI. Keep the state shape simple, initialize fields clearly, and avoid doing expensive work directly inside every `onChange`.

## Practice Challenge

Build a controlled signup form with `email`, `password`, and `acceptedTerms`.

Requirements:

- disable the submit button until all fields are valid
- show a live password length message
- use `checked` for the terms checkbox
- log the final form data on submit

## Recap

Controlled components put React state in charge of form values. They require a value prop and a change handler, but they make form behavior easier to validate, preview, reset, and submit.
