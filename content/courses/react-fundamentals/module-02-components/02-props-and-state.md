# Props vs State

Understanding the difference between props and state is fundamental to working with React.

## Props: Data from Parent

Props are read-only data passed from a parent component to a child component:

```jsx
// Parent passes data via props
function App() {
  return <UserCard name="Alice" role="Developer" />;
}

// Child receives and uses props
function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}
```

### Props Rules

1. **Read-only**: Never modify props directly
2. **Flow down**: Data flows from parent to child
3. **Any type**: Props can be strings, numbers, objects, functions, even other components

## State: Internal Data

State is data that a component manages internally. When state changes, the component re-renders:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
```

### useState Hook

`useState` returns an array with two elements:
1. The current state value
2. A function to update the state

```jsx
const [value, setValue] = useState(initialValue);
```

## Props vs State Comparison

| Feature | Props | State |
|---------|-------|-------|
| Owned by | Parent | Component itself |
| Mutable? | No (read-only) | Yes (via setter) |
| Triggers re-render? | When parent re-renders | When state changes |
| Purpose | Configure component | Track changing data |

## Combining Props and State

Real components often use both:

```jsx
function ToggleMessage({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>{message}</p>}
    </div>
  );
}

// Usage
<ToggleMessage message="This can be toggled!" />
```

Here, `message` is a prop (from parent) and `isVisible` is state (managed internally).

## Lifting State Up

When multiple components need to share state, lift it to their common parent:

```jsx
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);
  const fahrenheit = (celsius * 9/5) + 32;

  return (
    <div>
      <TemperatureInput
        label="Celsius"
        value={celsius}
        onChange={setCelsius}
      />
      <TemperatureInput
        label="Fahrenheit"
        value={fahrenheit}
        onChange={(f) => setCelsius((f - 32) * 5/9)}
      />
    </div>
  );
}
```

:::quiz
question: When should you use state instead of props?
options:
  - When the data comes from a parent component
  - When the data needs to change over time within the component
  - When you want to style the component
  - When you need to pass data to child components
answer: 1
explanation: State is for data that changes over time and is managed by the component itself. Props are for data passed from parent to child.
:::

:::exercise
title: Build a Toggle Switch
description: Create a ToggleSwitch component that toggles between ON and OFF when clicked. Use useState to track the current state.
starterCode: |
  import { useState } from 'react';

  function ToggleSwitch() {
    // Add state here

    return (
      <button>
        {/* Display ON or OFF */}
      </button>
    );
  }
:::
