# Class vs Function Components

React supports both class components and function components.

For new code, function components with hooks are the standard choice. Class components are still important when maintaining older code or working with error boundaries.

## A Simple Comparison

Function component:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

Class component:

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Both render the same UI.

## State Comparison

Function component:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

Class component:

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    this.setState((state) => ({ count: state.count + 1 }));
  };

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

The class version uses `this.state` and `this.setState`. The function version uses `useState`.

## Side Effects Comparison

Function component:

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setUser(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;
}
```

Class component:

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

Hooks group related setup and cleanup by concern. Classes split behavior across lifecycle methods.

## Why Function Components Are Preferred

Function components are usually preferred because they:

- avoid `this` binding issues
- work naturally with hooks
- make it easier to share stateful logic through custom hooks
- tend to be shorter
- align with modern React documentation and ecosystem patterns

## Why Class Components Still Matter

You still need to understand classes because:

- many mature React apps contain them
- older libraries and examples use them
- error boundaries are commonly implemented with classes
- migration work often requires reading class lifecycle behavior

## Migration Strategy

Do not rewrite every class component just because it is a class.

Good migration candidates:

- small components with simple state
- components with duplicated lifecycle logic
- components that need shared logic from custom hooks
- components already being changed for a feature

Riskier migration candidates:

- large components with many lifecycle methods
- components with subtle update guards
- components connected to older libraries
- error boundaries

## Mapping Class Concepts to Hooks

Common mappings:

- `this.props` -> function parameters
- `this.state` -> `useState` or `useReducer`
- `componentDidMount` -> `useEffect(..., [])`
- `componentDidUpdate` -> `useEffect(..., [dependencies])`
- `componentWillUnmount` -> effect cleanup
- instance fields -> `useRef`

These are not always one-to-one. Think in terms of behavior, not mechanical translation.

## Common Mistakes

- Rewriting classes without tests or behavior checks.
- Translating lifecycle methods directly into one giant effect.
- Forgetting cleanup when moving from `componentWillUnmount` to `useEffect`.
- Replacing `setState` object merge with `useState` and accidentally dropping fields.
- Migrating an error boundary without a supported replacement.

:::quiz
question: Which statement is the best migration guideline?
options:
  - Migrate classes when there is a clear reason and enough confidence to preserve behavior
  - Migrate every class immediately
  - Never migrate class components
  - Convert lifecycle names directly into hook names without changing structure
answer: 0
explanation: Migration has risk. Prefer targeted changes with tests or clear behavior checks.
:::

## Recap

Function components are the modern default, but class components remain part of real React maintenance work.

Understand classes well enough to debug them, migrate them carefully, and recognize when leaving them alone is the better choice.

## Practice

Take a small class counter and convert it to a function component.

Then explain how `this.setState((state) => ...)` maps to the functional form of `setCount`.
