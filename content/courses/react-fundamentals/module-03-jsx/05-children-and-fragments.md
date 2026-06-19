# Children and Fragments

Children are the content placed between an opening and closing JSX tag.

They let components compose UI instead of hard-coding every detail.

```jsx
function Card({ children }) {
  return <section className="card">{children}</section>;
}

function Dashboard() {
  return (
    <Card>
      <h2>Revenue</h2>
      <p>$12,400 this month</p>
    </Card>
  );
}
```

Inside `Card`, the `children` prop contains the `h2` and `p` elements.

## Why children Matters

Props are great for named values.

```jsx
<Avatar name="Ada" imageUrl="/ada.png" />
```

Children are better when the parent should decide the nested structure.

```jsx
<Modal title="Delete project">
  <p>This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</Modal>
```

The `Modal` can provide the frame, while callers provide the content.

## Building Layout Components

Components that use `children` often act as layout or design primitives.

```jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}
```

Use it with any valid React children:

```jsx
<Panel title="Account">
  <p>Email: ada@example.com</p>
  <button>Change password</button>
</Panel>
```

Children can be:

- strings
- numbers
- elements
- arrays of elements
- `null`, `undefined`, `false`, or `true` values that React ignores

## Passing Components as Children

Children are not limited to DOM elements.

```jsx
function Page() {
  return (
    <AppShell>
      <Sidebar />
      <MainContent />
    </AppShell>
  );
}
```

This is the foundation of React composition. Instead of making `AppShell` know every screen, let the caller provide the pieces.

## Fragments

A component must return one root value, but sometimes adding a wrapper element creates bad markup.

```jsx
function TableRows({ users }) {
  return (
    <>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </>
  );
}
```

The fragment groups the rows without adding an extra DOM node.

Fragments are especially useful in:

- tables
- lists
- definition lists
- components where extra wrappers break CSS layout

## Short and Long Fragment Syntax

The short syntax is concise:

```jsx
<>
  <h1>Title</h1>
  <p>Body</p>
</>
```

The long syntax is needed when the fragment itself needs a key.

```jsx
import { Fragment } from "react";

function Glossary({ terms }) {
  return (
    <dl>
      {terms.map((term) => (
        <Fragment key={term.id}>
          <dt>{term.word}</dt>
          <dd>{term.definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

You cannot put a `key` on the short `<>...</>` fragment syntax.

## Common Mistakes

- Forgetting to render `{children}` inside a wrapper component.
- Using extra `div` wrappers that break table, list, or flex/grid layout.
- Trying to pass a `key` to the short fragment syntax.
- Treating `children` as always a single element. It may be one child, many children, text, or nothing.
- Using children when named props would be clearer for simple values.

:::quiz
question: When should you use a React Fragment?
options:
  - When you need to group JSX without adding an extra DOM element
  - When you want to create component state
  - When you need to fetch data from an API
  - When you want to disable escaping
answer: 0
explanation: Fragments let a component return multiple JSX children as one React value without inserting an extra wrapper element into the DOM.
:::

## Practice Challenge

Build a `Callout` component.

Requirements:

- It accepts a `type` prop such as `"info"` or `"warning"`.
- It renders its `children`.
- It uses `className={`callout callout-${type}`}`.
- Use it to wrap a heading and a paragraph.

Example usage:

```jsx
<Callout type="warning">
  <h2>Unsaved changes</h2>
  <p>Save before leaving this page.</p>
</Callout>
```

## Recap

Children make components flexible and composable. Fragments let you group multiple children without changing the DOM structure.
