# JSX Syntax Rules

JSX is intentionally close to HTML, but it follows JavaScript rules.

Most JSX errors come from forgetting that you are writing JavaScript syntax, not an HTML file.

## Return One Root Value

A component must return one value. That value can contain many children, but the top level needs a single parent.

```jsx
// Invalid
function Profile() {
  return (
    <h1>Ada Lovelace</h1>
    <p>Mathematician</p>
  );
}
```

Wrap siblings in an element:

```jsx
function Profile() {
  return (
    <section>
      <h1>Ada Lovelace</h1>
      <p>Mathematician</p>
    </section>
  );
}
```

Or use a fragment when you do not want an extra DOM node:

```jsx
function Profile() {
  return (
    <>
      <h1>Ada Lovelace</h1>
      <p>Mathematician</p>
    </>
  );
}
```

## Close Every Tag

HTML sometimes lets you omit closing tags. JSX does not.

```jsx
// Invalid JSX
<img src="/avatar.png">
<input type="text">

// Valid JSX
<img src="/avatar.png" alt="User avatar" />
<input type="text" />
```

Self-closing tags are common for elements with no children and for component calls.

```jsx
<Avatar user={user} />
<Divider />
```

## Use Parentheses for Multi-Line JSX

When JSX spans multiple lines, wrap it in parentheses.

```jsx
function EmptyState() {
  return (
    <section className="empty-state">
      <h2>No projects yet</h2>
      <p>Create your first project to get started.</p>
    </section>
  );
}
```

Without parentheses, automatic semicolon insertion can return `undefined`.

```jsx
function BrokenEmptyState() {
  return
    <p>No projects yet</p>;
}
```

The code above is interpreted like this:

```jsx
function BrokenEmptyState() {
  return;
}
```

## Use camelCase for Most DOM Props

JSX props use JavaScript property naming.

```jsx
<button className="primary" onClick={handleSave}>
  Save
</button>
```

Common translations:

- `class` becomes `className`
- `for` becomes `htmlFor`
- `onclick` becomes `onClick`
- `tabindex` becomes `tabIndex`
- `readonly` becomes `readOnly`

ARIA and data attributes keep their dash-case names.

```jsx
<button aria-label="Close dialog" data-testid="close-button">
  X
</button>
```

## Put JavaScript Expressions in Curly Braces

Use quotes for plain strings.

```jsx
<UserCard name="Grace" />
```

Use braces for JavaScript values.

```jsx
<UserCard name={currentUser.name} isAdmin={currentUser.role === "admin"} />
```

Do not wrap booleans, numbers, arrays, or objects in quotes unless you really want strings.

```jsx
// Passes the number 3
<Rating value={3} />

// Passes the string "3"
<Rating value="3" />
```

## Comments Have JSX Syntax

Inside JSX, comments must be JavaScript comments inside braces.

```jsx
function Toolbar() {
  return (
    <div>
      {/* This button is hidden until permissions are added. */}
      <button disabled>Delete</button>
    </div>
  );
}
```

HTML comments are not valid JSX.

```jsx
// Invalid
<!-- comment -->
```

## Common Mistakes

- Returning JSX on the line after `return` without parentheses.
- Using `class` instead of `className`.
- Forgetting to close `<img />`, `<input />`, or a custom component.
- Passing numbers or booleans as quoted strings.
- Placing `// comment` directly inside JSX markup without wrapping it in `{}`.

:::quiz
question: Why do React components usually wrap multi-line JSX in parentheses after `return`?
options:
  - Parentheses make JSX render faster
  - Parentheses prevent automatic semicolon insertion from ending the return early
  - Parentheses are required for every JavaScript function
  - Parentheses turn JSX into HTML
answer: 1
explanation: If `return` is followed by a line break, JavaScript can insert a semicolon and return undefined. Parentheses keep the returned JSX expression connected to the return statement.
:::

## Mini Challenge

Fix this component:

```jsx
function SearchBox({ label, disabled }) {
  return
    <label for="search">
      {label}
      <input id="search" class="field" disabled="disabled">
    </label>
}
```

Your corrected version should return valid JSX, use the correct attribute names, and pass `disabled` as a boolean value.

## Recap

JSX must return one root value, close every tag, use JavaScript-style prop names, and wrap expressions in curly braces. These rules feel strict at first, but they make components predictable JavaScript.
