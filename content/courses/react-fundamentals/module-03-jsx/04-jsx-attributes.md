# Attributes and className

JSX attributes look like HTML attributes, but React treats them as props.

For built-in elements, those props usually map to DOM properties.

```jsx
<button className="primary" disabled={isSaving}>
  Save
</button>
```

## Strings vs JavaScript Values

Use quotes for literal strings.

```jsx
<img src="/logo.svg" alt="Company logo" />
```

Use curly braces for JavaScript values.

```jsx
<img src={user.avatarUrl} alt={user.name} />
<button disabled={isSaving}>Save</button>
```

The difference matters.

```jsx
<Progress value="10" />
<Progress value={10} />
```

The first passes a string. The second passes a number.

## className

Use `className` instead of `class`.

```jsx
function Alert({ type, message }) {
  return <p className={`alert alert-${type}`}>{message}</p>;
}
```

For conditional classes, build a string clearly.

```jsx
function SaveButton({ isSaving }) {
  const className = isSaving ? "button button-loading" : "button";

  return (
    <button className={className} disabled={isSaving}>
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
```

Small inline expressions are fine. When the class logic grows, move it into a variable or helper.

## htmlFor

Use `htmlFor` instead of `for` on labels.

```jsx
function EmailField() {
  return (
    <label htmlFor="email">
      Email
      <input id="email" type="email" />
    </label>
  );
}
```

This connects the label to the input for accessibility and browser focus behavior.

## Event Handler Props

Events use camelCase names and receive functions.

```jsx
function DeleteButton({ onDelete }) {
  return (
    <button onClick={onDelete}>
      Delete
    </button>
  );
}
```

Do not call the handler while rendering unless you are intentionally creating a function.

```jsx
// Wrong: calls deleteItem immediately during render
<button onClick={deleteItem(id)}>Delete</button>

// Right: passes a function React can call later
<button onClick={() => deleteItem(id)}>Delete</button>
```

## style Uses an Object

The `style` prop receives an object, not a CSS string.

```jsx
function Notice() {
  return (
    <p style={{ color: "tomato", fontWeight: "bold" }}>
      Unsaved changes
    </p>
  );
}
```

CSS property names are camelCase.

```jsx
// CSS: background-color
// JSX style object: backgroundColor
<div style={{ backgroundColor: "black" }} />
```

Inline styles can be useful for dynamic values, but regular CSS classes are usually better for reusable styling.

## Boolean Attributes

Boolean props should usually be passed as booleans.

```jsx
<button disabled={isSaving}>Save</button>
<input required />
```

Writing `disabled="false"` passes a string. In normal HTML, a present boolean attribute can still behave as enabled or disabled based on the browser property mapping, but in React code it is clearer and safer to pass an actual boolean.

## ARIA and data Attributes

ARIA and `data-*` attributes keep their original names.

```jsx
<button
  aria-expanded={isOpen}
  aria-controls="settings-panel"
  data-testid="settings-toggle"
>
  Settings
</button>
```

These attributes are designed to be dash-cased, so React preserves that convention.

## Spreading Props

The spread operator can forward props.

```jsx
function TextInput(props) {
  return <input className="field" {...props} />;
}
```

Use prop spread carefully. It can make code concise, but it can also hide what a component accepts.

Order matters:

```jsx
// Caller can override type
<input type="text" {...props} />

// Component forces type to text
<input {...props} type="text" />
```

## Common Mistakes

- Using `class` instead of `className`.
- Using `for` instead of `htmlFor`.
- Passing `"false"` or `"0"` when the component expects booleans or numbers.
- Calling an event handler immediately with `onClick={save()}`.
- Using a CSS string in `style` instead of an object.
- Spreading props after important defaults and accidentally overriding them.

:::quiz
question: What is wrong with `onClick={handleSave()}` in most React components?
options:
  - React requires all event handlers to be strings
  - It calls `handleSave` during render instead of passing a function to call on click
  - It prevents the component from receiving props
  - It only works for class components
answer: 1
explanation: Event props should receive a function. `handleSave()` runs immediately while rendering and passes its return value as the handler.
:::

## Mini Challenge

Fix this JSX:

```jsx
function ProfileLink({ user, isActive, openProfile }) {
  return (
    <a class="profile-link" href="/profile" onclick={openProfile(user.id)} style="font-weight: bold">
      {user.name}
    </a>
  );
}
```

Make the attributes valid JSX, pass a function to the click handler, and use a style object or class name for styling.

## Recap

JSX attributes are JavaScript-friendly props. Use `className`, `htmlFor`, camelCase events, boolean values in braces, object-based styles, and careful prop spreading.
