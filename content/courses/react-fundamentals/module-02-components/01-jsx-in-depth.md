# JSX In Depth

JSX is a syntax extension for JavaScript that looks like HTML. It's one of the most distinctive features of React.

## What is JSX?

JSX stands for JavaScript XML. It lets you write HTML-like syntax directly in your JavaScript code:

```jsx
const element = <h1>Hello, world!</h1>;
```

Under the hood, JSX is transformed into regular JavaScript function calls:

```javascript
const element = React.createElement('h1', null, 'Hello, world!');
```

## JSX Rules

### 1. Return a Single Root Element

Every component must return a single root element:

```jsx
// Bad - multiple root elements
function Bad() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// Good - wrapped in a div
function Good() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// Better - use a Fragment
function Better() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}
```

### 2. Close All Tags

In JSX, all tags must be closed:

```jsx
// HTML allows this
<img src="photo.jpg">
<br>

// JSX requires closing
<img src="photo.jpg" />
<br />
```

### 3. Use camelCase for Attributes

HTML attributes become camelCase in JSX:

```jsx
// HTML
<div class="container" onclick="handleClick()">

// JSX
<div className="container" onClick={handleClick}>
```

## Embedding Expressions

Use curly braces `{}` to embed JavaScript expressions in JSX:

```jsx
function UserProfile({ user }) {
  const isAdmin = user.role === 'admin';

  return (
    <div>
      <h1>{user.name.toUpperCase()}</h1>
      <p>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
      <p>Posts: {user.posts.length}</p>
      {isAdmin && <span className="badge">Admin</span>}
    </div>
  );
}
```

## Conditional Rendering

There are several ways to conditionally render in JSX:

```jsx
// Ternary operator
{isLoggedIn ? <Dashboard /> : <LoginForm />}

// Logical AND
{hasNotifications && <NotificationBadge />}

// Early return
function Content({ isLoading, error, data }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <DataView data={data} />;
}
```

## Rendering Lists

Use `.map()` to render arrays of elements:

```jsx
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
```

Always provide a unique `key` prop when rendering lists!

:::quiz
question: Why do you need a `key` prop when rendering lists in React?
options:
  - For CSS styling purposes
  - To help React identify which items have changed, been added, or removed
  - To make the list sortable
  - It's optional and just a best practice
answer: 1
explanation: The key prop helps React's reconciliation algorithm efficiently update the DOM by identifying which list items have changed between renders.
:::
