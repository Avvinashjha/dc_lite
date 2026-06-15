# Forwarding Refs

Normally, a ref on a DOM element gives you the DOM node.

```jsx
<input ref={inputRef} />
```

But a ref on your own component does not automatically point to an inner DOM element.

```jsx
<TextInput ref={inputRef} />
```

For that to work, the component must forward the ref.

## Why Forward Refs?

Forwarding refs lets a parent access an important element inside a child component.

This is useful for reusable components such as:

- text inputs
- buttons
- dialogs
- scroll containers
- media wrappers
- design system components

## Basic forwardRef

```jsx
const TextInput = React.forwardRef(function TextInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

Now the parent can focus the actual input.

```jsx
function ProfileForm() {
  const nameRef = useRef(null);

  return (
    <>
      <TextInput ref={nameRef} placeholder="Name" />
      <button onClick={() => nameRef.current?.focus()}>
        Focus name
      </button>
    </>
  );
}
```

## Forwarding Props and Refs Together

When building a reusable component, pass normal props to the element and attach the forwarded ref.

```jsx
const Button = React.forwardRef(function Button(
  { variant = "primary", className = "", ...props },
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      className={`button button-${variant} ${className}`}
    />
  );
});
```

The ref is not part of `props`. It is received as the second argument to the `forwardRef` render function.

## Common Mistake: Dropping the Ref

This component accepts a `ref` from the parent, but it never uses it.

```jsx
const BadInput = React.forwardRef(function BadInput(props, ref) {
  return <input {...props} />;
});
```

The parent's `ref.current` will stay `null` because the ref was not attached.

## Forwarding Through Multiple Layers

Sometimes a wrapper needs to pass the ref deeper.

```jsx
const Field = React.forwardRef(function Field({ label, ...props }, ref) {
  return (
    <label>
      {label}
      <TextInput {...props} ref={ref} />
    </label>
  );
});
```

Each component in the chain must intentionally forward the ref.

## Ref Forwarding Is an API Decision

When a component forwards a ref, it exposes implementation details.

If `TextInput` forwards a ref to an `<input>`, users may depend on input methods like `focus()` or `select()`.

Changing the inner element later can become a breaking change.

For design system components, document what the ref points to.

## React 19 Awareness

Modern React is moving toward allowing `ref` as a normal prop for function components. Many codebases and libraries still use `React.forwardRef`, and you will see it often.

When working in an existing project, follow the React version and style already used there.

## Common Mistakes

- Treating `ref` as a normal prop in React versions that require `forwardRef`.
- Forgetting to attach the forwarded ref to an element or child.
- Forwarding a ref to the wrong element.
- Exposing a raw DOM node when a smaller imperative API would be safer.
- Changing what the ref points to without considering users of the component.

:::quiz
question: In React.forwardRef, where does the forwarded ref appear?
options:
  - As the second argument to the render function
  - Inside props.ref
  - Inside props.children
  - As the return value of the component
answer: 0
explanation: With forwardRef, React passes the ref as the second argument. It is not included in the props object.
:::

## Recap

Use `forwardRef` when a parent needs access to a child component's inner DOM node or imperative API.

Forwarding refs is useful for reusable components, but it is part of the component's public API. Be intentional.

## Practice

Create a `SearchInput` component that forwards its ref to an internal `<input>`.

Use it from a parent component with a "Focus search" button.
