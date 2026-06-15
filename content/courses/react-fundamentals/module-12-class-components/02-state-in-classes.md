# State in Class Components

Class components store local state on `this.state`.

State represents data that can change over time and affects what the component renders.

## Initial State

You can initialize state in the constructor.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

Many projects use class fields instead.

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

## Updating State

Never assign to `this.state` after initialization.

```jsx
// Bad
this.state.count = this.state.count + 1;
```

Use `this.setState`.

```jsx
this.setState({ count: this.state.count + 1 });
```

React schedules a re-render after state changes.

## Functional setState

When the next state depends on the previous state, use the functional form.

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    this.setState((previousState) => ({
      count: previousState.count + 1,
    }));
  };

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

This avoids bugs when React batches updates.

## Batching and Stale State

Multiple state updates may be batched.

```jsx
incrementTwice = () => {
  this.setState({ count: this.state.count + 1 });
  this.setState({ count: this.state.count + 1 });
};
```

This may only increment once because both updates read the same `this.state.count`.

Use functional updates:

```jsx
incrementTwice = () => {
  this.setState((state) => ({ count: state.count + 1 }));
  this.setState((state) => ({ count: state.count + 1 }));
};
```

## setState Merges Objects

In class components, `setState` shallowly merges the object you provide.

```jsx
this.state = {
  name: "Ava",
  email: "ava@example.com",
};

this.setState({ email: "new@example.com" });
```

After this update, `name` is still present.

This differs from `useState`, where setting object state replaces the whole value.

## Nested State Still Needs Immutability

The merge is shallow. Nested objects must still be copied.

```jsx
this.setState((state) => ({
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: "Pune",
    },
  },
}));
```

Mutating nested objects can cause confusing bugs.

## setState Callback

`setState` accepts an optional callback that runs after the update is applied.

```jsx
this.setState({ saved: true }, () => {
  console.log("Saved state is now visible in the component");
});
```

Use this sparingly. Many side effects belong in `componentDidUpdate`.

## Common Mistakes

- Directly mutating `this.state`.
- Reading stale state when doing multiple updates.
- Forgetting that class `setState` shallowly merges objects.
- Assuming nested objects are deeply merged.
- Storing derived data that can be calculated during render.

:::quiz
question: Why is functional setState recommended when the next value depends on the previous value?
options:
  - It avoids bugs from batched updates reading stale state
  - It prevents the component from rendering
  - It deeply merges nested objects
  - It turns a class component into a function component
answer: 0
explanation: React may batch updates, so functional setState receives the latest previous state for each update.
:::

## Recap

Class state lives on `this.state` and is updated with `this.setState`.

Use functional updates for counters, toggles, arrays, and any update based on previous state.

## Practice

Build a class component with `items` and `filter` in state.

Add a button that appends an item without mutating the existing array, and an input that updates only the filter.
