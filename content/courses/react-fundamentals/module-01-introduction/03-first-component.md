# Your First Component

In this lesson, we'll build a real React component step by step.

:::video
url: https://www.youtube.com/watch?v=dQw4w9WgXcQ
title: Building Your First React Component
:::

## What is a Component?

A React component is a reusable piece of UI. Think of it like a custom HTML element that you define yourself. Components can:

- Accept data (props)
- Manage their own state
- Render other components
- Respond to user events

## Function Components

The simplest way to create a component is with a function:

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

This is a valid React component! You can use it like an HTML tag:

```jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  );
}
```

## Adding Props

Props let you pass data to components:

```jsx
function Greeting({ name, emoji }) {
  return (
    <h1>
      Hello, {name}! {emoji}
    </h1>
  );
}

// Usage
<Greeting name="Alice" emoji="👋" />
<Greeting name="Bob" emoji="🎉" />
```

## Building a Card Component

Let's build something more useful - a profile card:

```jsx
function ProfileCard({ name, role, avatar, bio }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '300px',
    }}>
      <img
        src={avatar}
        alt={name}
        style={{ width: '80px', borderRadius: '50%' }}
      />
      <h2>{name}</h2>
      <p style={{ color: '#666' }}>{role}</p>
      <p>{bio}</p>
    </div>
  );
}
```

## Component Composition

The real power of React comes from composing components together:

```jsx
function App() {
  const team = [
    { name: 'Alice', role: 'Developer', bio: 'Loves React' },
    { name: 'Bob', role: 'Designer', bio: 'CSS wizard' },
  ];

  return (
    <div>
      <h1>Our Team</h1>
      {team.map(person => (
        <ProfileCard key={person.name} {...person} />
      ))}
    </div>
  );
}
```

## Key Takeaways

1. Components are functions that return JSX
2. Props pass data from parent to child
3. Components can be composed together
4. Always name components with a capital letter

:::quiz
question: What is the correct way to pass a prop called "name" with value "Alice" to a component?
options:
  - <Greeting name="Alice" />
  - <Greeting props="name:Alice" />
  - <Greeting {name: "Alice"} />
  - Greeting(name="Alice")
answer: 0
explanation: In JSX, props are passed as attributes, similar to HTML. The syntax is attribute="value" for strings.
:::

:::exercise
title: Build a ProductCard Component
description: Create a ProductCard component that accepts name, price, and description props. Display them in a styled card.
starterCode: |
  function ProductCard({ name, price, description }) {
    return (
      <div>
        {/* Your code here */}
      </div>
    );
  }
:::
