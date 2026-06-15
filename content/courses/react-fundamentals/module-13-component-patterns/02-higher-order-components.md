# Higher-Order Components

A higher-order component, or HOC, is a function that takes a component and returns a new component.

```jsx
const EnhancedComponent = withSomething(BaseComponent);
```

HOCs were especially common before hooks. You still see them in older React code and some libraries.

## Basic Example

```jsx
function withLoading(Component) {
  return function WithLoading({ isLoading, ...props }) {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };
}
```

Usage:

```jsx
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading isLoading={isLoading} users={users} />
```

The HOC adds loading behavior without changing `UserList`.

## HOCs Share Behavior

A HOC can inject props.

```jsx
function withCurrentUser(Component) {
  return function WithCurrentUser(props) {
    const user = useCurrentUser();
    return <Component {...props} currentUser={user} />;
  };
}
```

This is useful when several components need the same data.

In modern React, a custom hook is often simpler:

```jsx
function ProfileMenu() {
  const currentUser = useCurrentUser();
  return <Menu user={currentUser} />;
}
```

## Do Not Mutate the Wrapped Component

Avoid changing the component you receive.

```jsx
// Bad
function withDebug(Component) {
  Component.defaultProps = { debug: true };
  return Component;
}
```

Return a new component instead.

```jsx
function withDebug(Component) {
  return function WithDebug(props) {
    return <Component {...props} debug />;
  };
}
```

## Prop Collisions

HOCs can accidentally overwrite props.

```jsx
function withTheme(Component) {
  return function WithTheme(props) {
    return <Component {...props} theme="dark" />;
  };
}
```

If the caller also passes `theme`, this HOC forces `"dark"`.

Be deliberate about prop precedence.

```jsx
return <Component theme="dark" {...props} />;
```

Now the caller can override the default.

## Display Names

Wrapped components can be harder to debug.

Set a display name when useful.

```jsx
function withTracking(Component) {
  function WithTracking(props) {
    return <Component {...props} />;
  }

  WithTracking.displayName = `withTracking(${Component.displayName || Component.name || "Component"})`;

  return WithTracking;
}
```

This makes React DevTools easier to read.

## Refs and HOCs

Refs do not automatically pass through HOCs.

```jsx
const TrackedInput = withTracking(TextInput);
```

If a parent passes a ref to `TrackedInput`, the ref points to the wrapper unless you explicitly forward it.

```jsx
function withTracking(Component) {
  return React.forwardRef(function WithTracking(props, ref) {
    trackRender(Component.name);
    return <Component {...props} ref={ref} />;
  });
}
```

Only forward refs when that is part of the wrapped component's API.

## Common HOC Use Cases

You may see HOCs for:

- routing data in older router versions
- connecting to state stores
- analytics tracking
- permission checks
- feature flags
- data loading in older code

## Common Mistakes

- Creating HOCs when a custom hook would be clearer.
- Forgetting to pass props through.
- Accidentally overwriting caller props.
- Losing refs.
- Wrapping components inside render, which creates a new component type every render.

```jsx
function Page() {
  const Enhanced = withLoading(UserList); // avoid doing this inside render
  return <Enhanced />;
}
```

Create the enhanced component outside render instead.

:::quiz
question: What is a higher-order component?
options:
  - A function that takes a component and returns a new component
  - A component that must be written as a class
  - A hook that renders JSX
  - A prop that contains multiple children
answer: 0
explanation: HOCs are functions that wrap components to add behavior or props.
:::

## Recap

HOCs are a legacy-friendly pattern for reusing component behavior.

Understand them so you can maintain existing React code. For new code, compare them with custom hooks and composition before adding another wrapper.

## Practice

Write a `withPermission` HOC that renders an "Access denied" message unless the user has a required role.

Then rewrite the same behavior using a custom hook and compare the two APIs.
