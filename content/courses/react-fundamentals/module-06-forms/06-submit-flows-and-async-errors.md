# Submit Flows and Async Errors

Submitting a form is not just collecting values. A good submit flow prevents duplicate requests, keeps the user informed, handles server validation, and recovers cleanly from failure.

## The Basic Submit Pattern

Always prevent the browser's default navigation when React is handling the submit.

```jsx
function ContactForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await sendMessage({ message });
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
      <button>Send</button>
    </form>
  );
}
```

Use the form's `onSubmit`, not only a button's `onClick`. That keeps keyboard submission and assistive technology behavior working.

## Tracking Submit State

A form usually needs at least these states:

- `isSubmitting`
- field or form errors
- success feedback

```jsx
function SignupForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await createAccount(values);
    } catch (error) {
      setErrors(normalizeSignupError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <p>{errors.email}</p>}

      <input name="password" type="password" value={values.password} onChange={handleChange} />
      {errors.password && <p>{errors.password}</p>}

      {errors.form && <p>{errors.form}</p>}

      <button disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
```

## Field Errors vs Form Errors

Field errors belong beside a specific input.

```jsx
{errors.email && <p id="email-error">{errors.email}</p>}
```

Form errors describe the whole submit attempt.

```jsx
{errors.form && <p role="alert">{errors.form}</p>}
```

Examples include "The server is unavailable" or "Your session expired. Please sign in again."

## Handling Async Validation

Some validation requires a request, such as checking whether a username is available. Avoid firing a request on every keystroke without control. Use blur, debounce, or submit-time validation.

```jsx
async function handleUsernameBlur() {
  if (!username) return;

  const available = await checkUsername(username);
  setErrors((current) => ({
    ...current,
    username: available ? "" : "That username is already taken.",
  }));
}
```

If several async checks can overlap, ignore stale responses or abort old requests.

## Duplicate Submits

Disable the submit button while a request is in flight, but do not rely on the button alone. The submit handler should also guard.

```jsx
if (isSubmitting) {
  return;
}
```

The server should also be able to handle duplicate requests safely when an action is important, such as payments or account creation.

## Common Mistakes

Do not clear the form before the server confirms success. If the request fails, the user should not lose their work.

Do not show only a console error. Users need visible feedback.

Do not swallow server validation details. If the server says the email is already registered, show that near the email field.

:::quiz
question: Why should form submit logic usually live on the form's onSubmit event instead of only a button's onClick?
options:
  - onSubmit supports keyboard submission and native form behavior
  - onClick automatically validates server errors
  - onSubmit makes all inputs uncontrolled
answer: 0
explanation: A form submit can be triggered by Enter and assistive technology, not just a mouse click on one button.
:::

## Practice Challenge

Build a login form with async submit behavior.

Requirements:

- show `isSubmitting` while the request runs
- prevent duplicate submits
- show field errors for invalid email/password
- show a form error for "network unavailable"
- keep the user's typed values after a failed request

## Recap

Submit flows need more than a click handler. Track pending state, preserve user input on failure, map server errors clearly, prevent duplicate submits, and keep the form accessible through `onSubmit`.
