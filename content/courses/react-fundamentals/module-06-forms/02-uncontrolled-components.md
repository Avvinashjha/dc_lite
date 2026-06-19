# Uncontrolled Components

An uncontrolled component lets the browser keep the current form value. React does not update state on every keystroke. Instead, you read the value when you need it, usually with a ref or during form submission.

This is still a valid React pattern. Controlled inputs are common, but not every form needs live state.

## Reading Values with Refs

```jsx
import { useRef } from "react";

function NewsletterForm() {
  const emailRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const email = emailRef.current.value;
    console.log("Subscribe:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" name="email" />
      <button>Subscribe</button>
    </form>
  );
}
```

React renders the input, but the DOM node owns the changing value.

## defaultValue and defaultChecked

Use `defaultValue` for an initial value that React should not keep controlling.

```jsx
<input name="displayName" defaultValue="Ava" />
```

Use `defaultChecked` for checkbox and radio defaults.

```jsx
<input type="checkbox" name="newsletter" defaultChecked />
```

Changing `defaultValue` after the input has mounted does not overwrite what the user typed. That is the point: it is only the initial value.

## Reading FormData

For many simple forms, `FormData` is cleaner than one ref per input.

```jsx
function LoginForm() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData);

    console.log(values.email, values.password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button>Log in</button>
    </form>
  );
}
```

Inputs must have `name` attributes for `FormData` to include them.

## When Uncontrolled Inputs Fit

Uncontrolled inputs are useful for:

- simple forms that only need values on submit
- integrating with non-React code
- file inputs
- avoiding re-renders while typing in very large forms

They are less convenient when the UI needs to react to each change.

## File Inputs

File inputs are naturally uncontrolled because browsers do not allow scripts to set file paths for security reasons.

```jsx
function UploadForm() {
  function handleSubmit(event) {
    event.preventDefault();
    const file = event.currentTarget.avatar.files[0];
    console.log(file);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="avatar" type="file" />
      <button>Upload</button>
    </form>
  );
}
```

## Common Mistakes

Do not mix `value` and `defaultValue` on the same input. Choose controlled or uncontrolled.

Do not expect `defaultValue` to reset the field after the first render. To reset uncontrolled fields, call the form's `reset()` method or remount the form with a different `key`.

```jsx
event.currentTarget.reset();
```

:::quiz
question: What does defaultValue do on an uncontrolled input?
options:
  - Sets the initial DOM value only
  - Controls the input value on every render
  - Runs validation automatically
answer: 0
explanation: defaultValue gives the browser an initial value. After mount, the DOM owns the current value.
:::

## Practice Challenge

Create an uncontrolled feedback form with `name`, `rating`, and `message`.

Requirements:

- read values with `FormData`
- reset the form after submit
- include a file input for an optional screenshot
- explain which field cannot be controlled like normal text

## Recap

Uncontrolled components keep form state in the DOM. They are simple and efficient for submit-only forms, but controlled components are usually better when React needs to display live feedback or derive UI from the current value.
