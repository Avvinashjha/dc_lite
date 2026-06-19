# Form Libraries

You can build forms with React state, refs, and validation functions. As forms grow, repeated patterns appear: field registration, touched state, nested errors, validation schemas, submit state, and server errors.

Form libraries exist to manage those patterns.

## When You May Not Need a Library

Use plain React for:

- small forms
- simple validation
- forms with only a few fields
- pages where form behavior is easy to inspect

Adding a library too early can make a simple form harder to understand.

## When a Library Helps

A library becomes useful when the form has:

- many fields
- repeated sections
- complex validation rules
- conditional fields
- server error mapping
- performance issues from re-rendering on every keystroke
- shared form patterns across the app

## Common Choices

React Hook Form often uses uncontrolled inputs internally and focuses on performance.

```jsx
import { useForm } from "react-hook-form";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    await createAccount(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", { required: "Email is required" })}
        type="email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <button disabled={isSubmitting}>Create account</button>
    </form>
  );
}
```

Formik uses a controlled form model and can be straightforward for teams that prefer explicit state.

Schema libraries such as Zod or Yup can define reusable validation rules.

```jsx
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

## Library Tradeoffs

Libraries add conventions. They may improve consistency, but they also create coupling.

Before choosing one, ask:

- Does the team already use it?
- Does it work well with the component library?
- Can it show server errors naturally?
- Does it support accessible error output?
- Is the validation story clear?
- Can new contributors understand the form quickly?

## Common Mistakes

Do not hide business logic inside form configuration that nobody can test. Important validation rules should still be understandable and reusable.

Do not fight the library's model. If a library expects registered uncontrolled fields, avoid forcing every input into local React state unless there is a reason.

Do not assume a library removes the need for server validation.

## Edge Cases

Third-party UI components sometimes do not expose normal `ref`, `name`, or `onChange` props. Most form libraries provide adapter components or controller APIs for this.

Dynamic arrays need careful keys and error paths. A validation error for `addresses[2].city` can point to the wrong row if rows are reordered with index keys.

:::quiz
question: What is a good reason to introduce a form library?
options:
  - The form is one text input and one button
  - The app needs consistent handling for many fields, validation, touched state, and server errors
  - React cannot submit forms without a library
answer: 1
explanation: Plain React handles simple forms well. Libraries help when repeated form concerns become costly or error-prone.
:::

## Best Practices

Choose the smallest tool that solves the real problem. Keep submit logic readable, map server errors explicitly, and test important validation rules outside the UI when possible.

## Practice Challenge

Compare a plain React form with a form-library version.

Build the same registration form twice:

- email
- password
- confirm password
- terms checkbox

Write down which version is easier to read, which one handles errors better, and where the library starts to pay for itself.

## Recap

Form libraries manage repeated form concerns, but they are not required for every form. Use them when complexity is real, understand their model, and keep validation and submit behavior visible enough to maintain.
