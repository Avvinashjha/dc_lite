# Handling Multiple Inputs

Real forms usually have more than one field. You can store each field in its own state variable, but large forms become easier to manage when related fields are grouped in one object.

## Separate State Variables

For a small form, separate state is perfectly fine.

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

This is explicit and easy to read.

## One Object for Related Fields

For related values, use one object and update only the changed property.

```jsx
import { useState } from "react";

function ProfileForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <form>
      <input name="firstName" value={form.firstName} onChange={handleChange} />
      <input name="lastName" value={form.lastName} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}
```

The `name` attribute must match a property in the state object.

## Handling Checkboxes

Checkboxes use `checked`, not `value`, for boolean state.

```jsx
function handleChange(event) {
  const { name, type, value, checked } = event.target;

  setForm((current) => ({
    ...current,
    [name]: type === "checkbox" ? checked : value,
  }));
}
```

## Handling Numbers

Inputs return strings. Convert carefully at the boundary where you need a number.

```jsx
function handleChange(event) {
  const { name, value } = event.target;

  setForm((current) => ({
    ...current,
    [name]: value === "" ? "" : Number(value),
  }));
}
```

Keeping the empty string allows the user to delete the current value while editing.

## Nested State

Avoid deeply nested form state unless the shape is necessary.

```jsx
setForm((current) => ({
  ...current,
  address: {
    ...current.address,
    city: nextCity,
  },
}));
```

Deep updates are easy to get wrong. If a form becomes complex, consider splitting it into smaller components, using `useReducer`, or using a form library.

## Dynamic Fields

For repeated fields, use stable ids instead of array indexes when possible.

```jsx
setLinks((current) =>
  current.map((link) =>
    link.id === id ? { ...link, url: nextUrl } : link
  )
);
```

Index-based updates can target the wrong item after insertions, deletions, or sorting.

:::quiz
question: Why does a shared handleChange function usually rely on the input's name attribute?
options:
  - It tells React which component to re-render
  - It identifies which state property should be updated
  - It automatically validates the field
answer: 1
explanation: The name attribute can be used as a computed property key, such as [name]: value.
:::

## Common Mistakes

Do not mutate form objects directly.

```jsx
// Wrong
form.email = "new@example.com";
setForm(form);
```

Create a new object instead.

```jsx
setForm((current) => ({ ...current, email: "new@example.com" }));
```

Do not forget to preserve other fields with the spread operator. Replacing the whole object with one property will erase the rest.

## Practice Challenge

Build an account settings form with these fields:

- `displayName`
- `email`
- `age`
- `isPublic`
- a dynamic list of website links

Use one shared change handler for normal fields. Add separate functions for adding, editing, and removing links.

## Recap

Multiple inputs are easiest to manage when the state shape mirrors the form. Use `name` attributes, computed property updates, functional state updates, and special handling for checkboxes, numbers, and dynamic collections.
