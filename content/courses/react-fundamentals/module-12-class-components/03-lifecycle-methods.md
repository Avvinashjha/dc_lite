# Lifecycle Methods

Class components use lifecycle methods to run code at specific moments.

The most important moments are:

- mounting: the component appears on the screen
- updating: props or state change
- unmounting: the component is removed

Function components use effects for many of the same jobs.

## componentDidMount

`componentDidMount` runs after the component is first rendered to the DOM.

Use it for:

- fetching initial data
- starting timers
- subscribing to external services
- measuring DOM nodes after mount

```jsx
class UserProfile extends React.Component {
  state = { user: null };

  componentDidMount() {
    fetch(`/api/users/${this.props.userId}`)
      .then((response) => response.json())
      .then((user) => this.setState({ user }));
  }

  render() {
    return this.state.user ? <h1>{this.state.user.name}</h1> : <p>Loading...</p>;
  }
}
```

## componentDidUpdate

`componentDidUpdate` runs after updates.

It receives previous props and previous state.

```jsx
class UserProfile extends React.Component {
  state = { user: null };

  componentDidMount() {
    this.loadUser();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.userId !== this.props.userId) {
      this.loadUser();
    }
  }

  loadUser() {
    fetch(`/api/users/${this.props.userId}`)
      .then((response) => response.json())
      .then((user) => this.setState({ user }));
  }

  render() {
    return this.state.user ? <h1>{this.state.user.name}</h1> : <p>Loading...</p>;
  }
}
```

Always guard state updates in `componentDidUpdate`. Calling `setState` unconditionally creates an infinite update loop.

## componentWillUnmount

`componentWillUnmount` runs before the component is removed.

Use it for cleanup.

```jsx
class Clock extends React.Component {
  state = { now: new Date() };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({ now: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return <time>{this.state.now.toLocaleTimeString()}</time>;
  }
}
```

Cleanup prevents memory leaks and updates after unmount.

## Lifecycle and useEffect Comparison

This class lifecycle:

```jsx
componentDidMount() {
  subscribe(this.props.id);
}

componentDidUpdate(previousProps) {
  if (previousProps.id !== this.props.id) {
    unsubscribe(previousProps.id);
    subscribe(this.props.id);
  }
}

componentWillUnmount() {
  unsubscribe(this.props.id);
}
```

can often become this effect:

```jsx
useEffect(() => {
  subscribe(id);

  return () => {
    unsubscribe(id);
  };
}, [id]);
```

Effects group setup and cleanup together. Class lifecycles group code by timing.

## Less Common Lifecycle Methods

You may see these in existing code:

- `shouldComponentUpdate`: can skip rendering for performance.
- `getSnapshotBeforeUpdate`: reads information from the DOM before React applies updates.
- `componentDidCatch`: catches rendering errors in an error boundary.
- `static getDerivedStateFromProps`: derives state from props in rare cases.

Some older methods are unsafe in modern React:

- `componentWillMount`
- `componentWillReceiveProps`
- `componentWillUpdate`

Avoid adding these in new code.

## Error Boundaries

Class components are still commonly used for error boundaries.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    reportError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong.</p>;
    }

    return this.props.children;
  }
}
```

As of many React versions, error boundaries still require class components unless a framework or library provides a wrapper.

## Common Mistakes

- Fetching in `render`.
- Forgetting cleanup in `componentWillUnmount`.
- Calling `setState` unconditionally in `componentDidUpdate`.
- Copying props into state without a clear reason.
- Using legacy unsafe lifecycle methods in new code.

:::quiz
question: What is the main risk of calling setState unconditionally inside componentDidUpdate?
options:
  - It can create an infinite update loop
  - It prevents componentDidMount from running
  - It makes props mutable
  - It disables event handlers
answer: 0
explanation: setState triggers another update. If componentDidUpdate always calls setState, the cycle repeats.
:::

## Recap

Class lifecycle methods handle setup, updates, and cleanup.

Use `componentDidMount` for initial setup, `componentDidUpdate` for guarded reactions to changes, and `componentWillUnmount` for cleanup.

## Practice

Create a class component that subscribes to a fake `window` resize event.

Store the current width in state, update it on resize, and remove the listener during unmount.
