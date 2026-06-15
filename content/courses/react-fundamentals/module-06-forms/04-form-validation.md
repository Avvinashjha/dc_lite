# Form Validation

Validation checks whether form data is acceptable before it is used. Good validation helps users fix mistakes without hiding server-side rules or blocking normal editing.

## Client Validation and Server Validation

Client validation runs in the browser. It is useful for fast feedback.

Server validation runs where the final action happens. It is required for security and correctness.

Never trust client validation alone. A user can disable JavaScript, modify requests, or call an API directly.

## Field-Level Validation

Start with small validation functions.

```jsx
function validateEmail(email) {
  if (!email.trim()) {
    return "Email is required.";
  }

  if (!email.includes("@")) {
    return "Enter a valid email address.";
  }

  return "";
}
```

Then render the message near the field.

```jsx
const emailError = validateEmail(email);

<label>
  Email
  <input
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    aria-describedby="email-error"
  />
</label>
{emailError && <p id="email-error">{emailError}</p>}
```

## Touched State

Showing every error immediately can feel noisy. Track whether a field has been visited.

```jsx
const [email, setEmail] = useState("");
const [touched, setTouched] = useState({ email: false });

const emailError = touched.email ? validateEmail(email) : "";
```

```jsx
<input
  value={email}
  onBlur={() => setTouched((current) => ({ ...current, email: true }))}
  onChange={(event) => setEmail(event.target.value)}
/>
```

Use immediate validation for constraints where instant feedback is helpful, such as password length or username availability.

## Form-Level Validation

Some rules involve more than one field.

```jsx
function validateSignup(values) {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required.";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords must match.";
  }

  return errors;
}
```

Keep validation functions pure. Given the same values, they should return the same errors.

## HTML Validation

Native attributes are useful.

```jsx
<input type="email" required minLength={6} />
```

They provide browser behavior, mobile keyboard hints, and accessibility benefits. For custom UI, you may still need your own messages and server handling.

## Common Mistakes

Do not validate on stale state right after calling a state setter.

```jsx
setEmail(nextEmail);
// email still contains the previous render's value here.
```

Validate `nextEmail` directly or validate during render.

Do not trim the controlled value on every keystroke if spaces might be meaningful while editing. Trim on submit or during validation instead.

Do not hide server errors. A username can be valid in the browser and still be taken on the server.

:::quiz
question: Why is server-side validation still needed when a React form already validates fields?
options:
  - React validation only runs after deployment
  - Browser validation can be bypassed or outdated
  - Server validation is only needed for styling
answer: 1
explanation: Client validation improves UX, but the server must enforce final rules because requests can be modified or sent outside the UI.
:::

## Best Practices

Keep validation messages specific and actionable. Associate messages with fields using accessible markup. Validate as close as possible to where the rule belongs, and keep final business rules on the server.

## Mini Challenge

Create a password reset form with `email`, `password`, and `confirmPassword`.

Requirements:

- show field errors after blur
- disable submit while errors exist
- show a form-level error if passwords differ
- keep the validation functions separate from the component

## Recap

Good validation balances correctness and user experience. Use browser features where they help, keep validation functions predictable, track touched state for timing, and always enforce important rules on the server.
