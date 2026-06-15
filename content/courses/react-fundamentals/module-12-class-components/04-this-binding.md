# Binding this

In JavaScript classes, methods are not automatically bound to an instance.

That matters in React class components because event handlers often use `this`.

## The Problem

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  increment() {
    this.setState((state) => ({ count: state.count + 1 }));
  }

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

When the button calls `this.increment`, the method may run with `this` as `undefined`.

The result is an error like:

```txt
Cannot read properties of undefined
```

## Option 1: Bind in the Constructor

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.setState((state) => ({ count: state.count + 1 }));
  }

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

This is the traditional pattern.

## Option 2: Class Field Arrow Method

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

Arrow functions capture `this` from the class instance.

This style is common in modern class component code.

## Option 3: Inline Arrow Function

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  increment() {
    this.setState((state) => ({ count: state.count + 1 }));
  }

  render() {
    return (
      <button onClick={() => this.increment()}>
        {this.state.count}
      </button>
    );
  }
}
```

This works, but it creates a new function during each render.

That is usually fine for simple components. In large lists or memoized children, stable handlers may matter.

## Passing Arguments

You often need to pass an ID.

```jsx
class TodoList extends React.Component {
  deleteTodo = (id) => {
    this.props.onDelete(id);
  };

  render() {
    return (
      <ul>
        {this.props.todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => this.deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  }
}
```

The inline arrow is useful here because it delays the call until the click happens.

Do not do this:

```jsx
<button onClick={this.deleteTodo(todo.id)}>Delete</button>
```

That calls `deleteTodo` during render.

## Event Object

React passes the event object to event handlers.

```jsx
class SearchForm extends React.Component {
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch();
  };

  render() {
    return <form onSubmit={this.handleSubmit}>...</form>;
  }
}
```

With arguments:

```jsx
<button onClick={(event) => this.handleClick(todo.id, event)}>
  Select
</button>
```

## Common Mistakes

- Passing an unbound method as an event handler.
- Calling the handler during render instead of passing a function.
- Binding inside `render` without understanding that it creates a new function each time.
- Forgetting `super(props)` before using `this` in a constructor.
- Mixing binding styles in the same component without a reason.

:::quiz
question: What happens in this JSX: onClick={this.deleteTodo(todo.id)}?
options:
  - deleteTodo runs during render, and its return value becomes the handler
  - deleteTodo runs only when the user clicks
  - React automatically binds this
  - React passes todo.id as the event object
answer: 0
explanation: Parentheses call the function immediately. To pass an argument on click, wrap it in another function.
:::

## Recap

Class methods need the correct `this` when used as callbacks.

Bind methods in the constructor, use class field arrow methods, or use inline arrows when passing arguments.

## Practice

Fix a class component with an unbound `handleSubmit` method.

Then add a delete button for each item in a list and pass the item ID correctly without calling the handler during render.
