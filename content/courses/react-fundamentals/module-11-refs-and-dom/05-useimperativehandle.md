# useImperativeHandle

`useImperativeHandle` customizes what a parent receives when it uses a ref on your component.

Instead of exposing a raw DOM node, you can expose a small set of methods.

```jsx
useImperativeHandle(ref, createHandle, dependencies);
```

This hook is usually used with `forwardRef`.

## Why Not Always Expose the DOM Node?

Forwarding a ref to an input exposes everything on the input element.

```jsx
const TextInput = React.forwardRef(function TextInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

That may be fine. But sometimes the parent should only be allowed to do a few specific actions.

For example, a rich text editor component might expose `focus()` and `clear()`, not its entire internal DOM structure.

## Exposing a Small API

```jsx
const SearchInput = React.forwardRef(function SearchInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  }), []);

  return <input {...props} ref={inputRef} type="search" />;
});
```

The parent receives the custom object.

```jsx
function SearchPage() {
  const searchRef = useRef(null);

  return (
    <>
      <SearchInput ref={searchRef} />
      <button onClick={() => searchRef.current?.focus()}>Focus</button>
      <button onClick={() => searchRef.current?.clear()}>Clear</button>
    </>
  );
}
```

The parent does not need to know which DOM elements exist inside `SearchInput`.

## Prefer State for React-Owned Values

The previous `clear()` example mutates the DOM value directly. That may be acceptable for an uncontrolled input.

For a controlled input, the value belongs to React state.

```jsx
const ControlledSearchInput = React.forwardRef(function ControlledSearchInput(
  { value, onChange },
  ref
) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }), []);

  return (
    <input
      ref={inputRef}
      type="search"
      value={value}
      onChange={onChange}
    />
  );
});
```

The parent can focus the input, but clearing still happens by updating state.

## Dependency Array

The third argument controls when React recreates the imperative handle.

```jsx
useImperativeHandle(ref, () => ({
  scrollToTop() {
    listRef.current?.scrollTo({ top: 0 });
  },
}), []);
```

If the exposed methods use props or state, include those dependencies or use functional updates.

```jsx
useImperativeHandle(ref, () => ({
  reset() {
    setValue(initialValue);
  },
}), [initialValue]);
```

Leaving dependencies out can expose methods that read stale values.

## Good Uses

`useImperativeHandle` is useful for:

- focusing a custom input
- opening or closing a modal from a parent
- scrolling a virtualized list
- controlling playback in a media wrapper
- exposing methods from a third-party widget wrapper

Use it when a small imperative escape hatch makes the component easier to use.

## Avoid Overusing It

This is usually a design smell:

```jsx
formRef.current.setName("Ava");
formRef.current.setEmail("ava@example.com");
formRef.current.submit();
```

If the parent is controlling form data, props and state are usually clearer.

Imperative handles should be small and focused.

## Common Mistakes

- Exposing too many methods and turning the component into a hidden object API.
- Using imperative handles instead of props for normal data flow.
- Forgetting dependencies and closing over stale props.
- Exposing internal DOM structure that may change later.
- Calling methods before checking that `ref.current` exists.

:::quiz
question: What is the main benefit of useImperativeHandle?
options:
  - It lets a component expose a controlled imperative API through a ref
  - It makes state updates synchronous
  - It prevents child components from rendering
  - It replaces the need for event handlers
answer: 0
explanation: useImperativeHandle customizes what a parent receives through a ref, often exposing only a small set of methods.
:::

## Recap

`useImperativeHandle` is an escape hatch for carefully designed imperative APIs.

Prefer props and state for normal rendering. Use imperative handles for actions like focus, scroll, open, close, or reset when they make the component simpler to use.

## Practice

Build a `Modal` component that exposes `open()` and `close()` through a ref.

Then refactor it so the open state can also be controlled with props. Compare which version is easier to test.
