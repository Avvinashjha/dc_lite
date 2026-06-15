# Your First Component

In React, a component is a reusable piece of UI.

Most modern React components are JavaScript functions that return JSX.

:::video
url: https://www.youtube.com/watch?v=dQw4w9WgXcQ
title: Building Your First React Component
:::

## Start Small

Create a function with a capitalized name:

```jsx
function Greeting() {
  return <h1>Hello, React</h1>;
}
```

Use it from another component:

```jsx
function App() {
  return (
    <main>
      <Greeting />
      <p>This page is made of components.</p>
    </main>
  );
}

export default App;
```

Component names must start with a capital letter. Lowercase JSX tags are treated as built-in DOM elements.

```jsx
<Greeting />
<button>Save</button>
```

## Components Return JSX

JSX can contain normal HTML-like elements and other components.

```jsx
function PageHeader() {
  return (
    <header>
      <h1>Course Dashboard</h1>
      <p>Track your progress through React fundamentals.</p>
    </header>
  );
}
```

If a component returns multiple sibling elements, wrap them in one parent or a fragment.

```jsx
function HeaderText() {
  return (
    <>
      <h1>React Fundamentals</h1>
      <p>Build UI from components.</p>
    </>
  );
}
```

## Add Props

Props are inputs from a parent component.

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

function App() {
  return (
    <main>
      <Greeting name="Alice" />
      <Greeting name="Bob" />
    </main>
  );
}
```

The same component can render different output based on props.

Props are read-only. A child component should not modify them.

## Build a Profile Card

```jsx
function ProfileCard({ name, role, avatarUrl, bio }) {
  return (
    <article className="profile-card">
      <img src={avatarUrl} alt={name} />
      <h2>{name}</h2>
      <p>{role}</p>
      <p>{bio}</p>
    </article>
  );
}
```

Use it:

```jsx
function App() {
  return (
    <main>
      <h1>Team</h1>
      <ProfileCard
        name="Ada Lovelace"
        role="Programmer"
        avatarUrl="/avatars/ada.png"
        bio="Wrote notes on one of the earliest computing machines."
      />
    </main>
  );
}
```

## Compose Components

Composition means building larger UI from smaller components.

```jsx
function TeamList({ members }) {
  return (
    <section>
      <h1>Team</h1>
      <div className="grid">
        {members.map((member) => (
          <ProfileCard
            key={member.id}
            name={member.name}
            role={member.role}
            avatarUrl={member.avatarUrl}
            bio={member.bio}
          />
        ))}
      </div>
    </section>
  );
}
```

Notice the `key` prop in the list. React uses keys to track item identity when rendering arrays.

## Add Simple Interactivity

Components can also use state and events.

```jsx
import { useState } from "react";

function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button onClick={() => setIsFavorite(!isFavorite)}>
      {isFavorite ? "Favorited" : "Add favorite"}
    </button>
  );
}
```

You will study state and events in detail later. For now, notice the pattern:

- state stores a changing value
- event handlers respond to user actions
- rendering uses the current state

## Common Mistakes

- Naming a component `profileCard` instead of `ProfileCard`.
- Forgetting to return JSX from the component.
- Returning sibling elements without a wrapper or fragment.
- Calling a component as a regular function inside JSX instead of using `<Component />`.
- Mutating props inside a child component.
- Using array indexes as keys for lists that can reorder or delete items.

:::quiz
question: Why should React component names start with a capital letter?
options:
  - Capitalized names render faster
  - React treats lowercase JSX tags as built-in DOM elements
  - Capitalized names are required by CSS
  - It prevents props from changing
answer: 1
explanation: In JSX, lowercase tags like `button` and `section` refer to DOM elements. Capitalized tags like `ProfileCard` refer to JavaScript component functions.
:::

:::exercise
title: Build a ProductCard Component
description: Create a ProductCard component that accepts name, price, description, and isFeatured props. Display them in a card and conditionally show a "Featured" label.
starterCode: |
  function ProductCard({ name, price, description, isFeatured }) {
    return (
      <article className="product-card">
        {/* Add the product UI here */}
      </article>
    );
  }
:::

## Recap

A component is a capitalized function that returns JSX. Props configure components, composition combines them, and state plus events make them interactive.
