# JSX In Depth

JSX is the syntax most React components return.

This lesson reviews JSX through the lens of components and props: how data flows into markup, how components compose, and where common mistakes appear.

## JSX Creates React Elements

JSX looks like HTML, but it becomes JavaScript.

```jsx
const element = <h1>Hello, world</h1>;
```

Conceptually, this is similar to creating a React element object.

```jsx
import { createElement } from "react";

const element = createElement("h1", null, "Hello, world");
```

You normally write JSX because it is easier to read when UI has nested structure.

## Components Use JSX as Return Values

```jsx
function PageTitle({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
```

The component receives props, then returns JSX based on those props.

That pattern is the heart of React:

```txt
props + state -> JSX
```

## JSX Rules That Matter for Components

Return one root value:

```jsx
function Card({ title, children }) {
  return (
    <article>
      <h2>{title}</h2>
      {children}
    </article>
  );
}
```

Use fragments when you do not want an extra wrapper:

```jsx
function NameFields() {
  return (
    <>
      <input name="firstName" />
      <input name="lastName" />
    </>
  );
}
```

Close every tag:

```jsx
<Avatar />
<img src="/avatar.png" alt="Avatar" />
```

Use JSX prop names:

```jsx
<label htmlFor="email" className="label">
  Email
</label>
```

## Passing Props in JSX

Props are written like attributes.

```jsx
<UserCard name="Ada" age={36} isAdmin={true} />
```

Strings can use quotes. JavaScript values use braces.

```jsx
const user = { name: "Ada", role: "Admin" };

<UserCard user={user} showRole />
```

`showRole` without a value is the same as `showRole={true}`.

## Children as a Prop

Everything between opening and closing component tags becomes the `children` prop.

```jsx
function Notice({ children }) {
  return <aside className="notice">{children}</aside>;
}

function App() {
  return (
    <Notice>
      <strong>Heads up:</strong> Unsaved changes will be lost.
    </Notice>
  );
}
```

Children are useful for wrappers, layouts, modals, cards, tabs, and reusable design components.

## Conditional JSX

Use JavaScript expressions for conditional UI.

```jsx
function UserMenu({ user }) {
  if (!user) {
    return <LoginButton />;
  }

  return (
    <nav>
      <Avatar user={user} />
      {user.isAdmin && <AdminLink />}
    </nav>
  );
}
```

Be careful with numeric conditions:

```jsx
// Can render 0
{items.length && <ItemList items={items} />}

// Clearer
{items.length > 0 && <ItemList items={items} />}
```

## Lists and Keys

Use `.map()` to render arrays.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

Keys help React track identity. Use stable ids from your data when possible.

Avoid `Math.random()` and avoid indexes for lists that can reorder, insert, or delete items.

## Common JSX and Prop Mistakes

- Passing numbers or booleans as strings by accident.
- Calling event handlers during render: `onClick={save()}`.
- Forgetting that children must be rendered with `{children}` inside wrapper components.
- Using lowercase component names.
- Rendering objects directly: `<p>{user}</p>`.
- Using unstable keys in lists.

:::quiz
question: What does `<Modal><p>Saved</p></Modal>` pass to `Modal`?
options:
  - A prop named `p`
  - A `children` prop containing the paragraph element
  - A string prop named `Modal`
  - Nothing, because components cannot contain children
answer: 1
explanation: JSX nested between component tags is passed as the special `children` prop.
:::

## Practice Challenge

Build a `Panel` component.

Requirements:

- accepts `title`
- accepts `children`
- renders a `<section>`
- renders the title in an `<h2>`
- renders children below the title

Example usage:

```jsx
<Panel title="Profile">
  <p>Manage your account details.</p>
  <button>Edit profile</button>
</Panel>
```

## Recap

JSX is JavaScript syntax for describing React elements. Components use JSX to combine props, children, conditional logic, and lists into reusable UI.
