# Class Component Syntax

Before hooks, most stateful React components were written as classes.

Modern React code usually uses function components, but class components still appear in existing applications, older tutorials, and error boundaries.

## Basic Syntax

A class component extends `React.Component` and defines a `render` method.

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

The `render` method returns React elements, just like a function component returns JSX.

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

## Props in Class Components

Props are available on `this.props`.

```jsx
class UserCard extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <article>
        <h2>{user.name}</h2>
        <p>{user.role}</p>
      </article>
    );
  }
}
```

Do not mutate props.

```jsx
// Bad
this.props.user.name = "New name";
```

Props are still owned by the parent.

## The render Method Must Be Pure

`render` should describe the UI for the current props and state.

Avoid side effects inside `render`.

```jsx
class BadExample extends React.Component {
  render() {
    localStorage.setItem("visited", "yes"); // side effect
    return <p>Welcome</p>;
  }
}
```

Side effects belong in lifecycle methods such as `componentDidMount` or `componentDidUpdate`.

## Constructor

Classes can define a constructor when they need initial state or method binding.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

Always call `super(props)` before using `this` in a constructor.

## Class Fields

Many projects use class field syntax.

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

This avoids manual method binding.

## Destructuring for Readability

```jsx
class ProductRow extends React.Component {
  render() {
    const { product, onSelect } = this.props;
    const { id, name, price } = product;

    return (
      <button onClick={() => onSelect(id)}>
        {name}: ${price}
      </button>
    );
  }
}
```

Destructuring reduces repeated `this.props` and `this.state` access.

## Common Mistakes

- Forgetting `extends React.Component`.
- Forgetting the `render` method.
- Using `props` directly instead of `this.props`.
- Calling `super()` without `props` and then expecting `this.props` inside the constructor.
- Performing side effects inside `render`.
- Mutating props.

:::quiz
question: Where does a class component return its JSX?
options:
  - Inside the render method
  - Inside the constructor
  - Inside componentDidMount only
  - Inside this.props
answer: 0
explanation: Class components must define a render method that returns the React elements to display.
:::

## Recap

Class components use `this.props`, `this.state`, and a `render` method.

Even though function components are preferred for new code, reading class syntax is important when maintaining older React codebases.

## Practice

Convert this function component into a class component:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

Then add a second prop named `title` and render it above the greeting.
