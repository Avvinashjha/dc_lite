# Accessible Forms

Forms are one of the most important accessibility areas in React apps.

Users need to understand what each field asks for, how to complete it, what went wrong, and how to recover. This must work visually, with a keyboard, and with assistive technology.

## Labels

Every form control needs an accessible name.

The most reliable pattern is a visible `label` connected with `htmlFor`.

```jsx
function EmailField() {
  return (
    <div>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" />
    </div>
  );
}
```

Do not rely on placeholders as labels.

```jsx
// Avoid
<input placeholder="Email address" />
```

Placeholders disappear when users type, often have low contrast, and may not be announced consistently as labels.

## Instructions and Help Text

Use `aria-describedby` to connect instructions to a field.

```jsx
function PasswordField() {
  return (
    <div>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        aria-describedby="password-help"
      />
      <p id="password-help">
        Use at least 12 characters, including a number.
      </p>
    </div>
  );
}
```

This gives users the instruction when they focus the input.

## Validation Errors

Error messages should be visible, specific, and connected to the field.

```jsx
function TextField({ id, label, error, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

Avoid vague errors like "Invalid input." Prefer "Enter an email address, like name@example.com."

## Required Fields

Make required fields clear in text, not only color or symbols.

```jsx
<label htmlFor="name">
  Full name <span aria-hidden="true">*</span>
</label>
<input id="name" name="name" required aria-describedby="name-help" />
<p id="name-help">Required.</p>
```

The native `required` attribute helps browsers and assistive technology, but your app should still provide clear validation messages.

## Fieldsets and Groups

Related controls need a group label.

```jsx
<fieldset>
  <legend>Notification preferences</legend>

  <label>
    <input type="checkbox" name="notifications" value="email" />
    Email
  </label>

  <label>
    <input type="checkbox" name="notifications" value="sms" />
    SMS
  </label>
</fieldset>
```

Use `fieldset` and `legend` for related radio buttons and checkboxes.

## Async Submit States

React forms often submit to an API. Make the state understandable.

```jsx
function SubmitButton({ isSubmitting }) {
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : "Save changes"}
    </button>
  );
}
```

Also announce important result messages:

```jsx
<p role="status">{statusMessage}</p>
```

When submission fails, preserve user input and show recovery steps.

## Edge Cases

- Custom select components need keyboard support and correct roles; a native `select` may be better.
- Error summaries should link or move focus to invalid fields in long forms.
- Color alone should not indicate errors or required fields.
- Inputs hidden with CSS can still be focusable if not handled correctly.
- Client-side validation should not replace server-side validation.

## Common Mistakes

- Using placeholder text instead of labels.
- Showing errors only after submit but not connecting them to fields.
- Clearing all user input after a failed request.
- Disabling submit without explaining what must be fixed.
- Making custom controls that do not support keyboard interaction.

:::quiz
question: What is the best way to connect a visible label to an input in React?
options:
  - Use `htmlFor` on the label and a matching `id` on the input
  - Use only a placeholder
  - Put the label text in a CSS background image
  - Use `aria-hidden` on the input
answer: 0
explanation: `htmlFor` maps to the HTML `for` attribute and creates a reliable relationship between the label and form control.
:::

## Practice Challenge

Build a sign-up form with email, password, and notification preferences. Add visible labels, help text, required-field messaging, connected validation errors, a submit loading state, and a status message after submission.

## Recap

Accessible forms need labels, instructions, connected errors, clear groups, keyboard support, and understandable submit states. Design the recovery path as carefully as the happy path.
