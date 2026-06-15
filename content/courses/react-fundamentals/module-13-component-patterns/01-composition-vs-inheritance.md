# Composition vs Inheritance

React favors composition over inheritance.

Composition means building components by combining smaller components and passing data, behavior, or UI through props.

Inheritance means creating a component by extending another component's class. In React application code, inheritance is rarely the right tool.

## Composition with children

The most common composition API is `children`.

```jsx
function Card({ children }) {
  return <section className="card">{children}</section>;
}

function ProfileCard({ user }) {
  return (
    <Card>
      <h2>{user.name}</h2>
      <p>{user.role}</p>
    </Card>
  );
}
```

`Card` does not need to know what content it will contain.

## Specialized Components

You can create specialized components by wrapping a general component.

```jsx
function Dialog({ title, children, actions }) {
  return (
    <section role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">{title}</h2>
      <div>{children}</div>
      <footer>{actions}</footer>
    </section>
  );
}

function ConfirmDeleteDialog({ onCancel, onConfirm }) {
  return (
    <Dialog
      title="Delete project?"
      actions={
        <>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Delete</button>
        </>
      }
    >
      This action cannot be undone.
    </Dialog>
  );
}
```

This is composition. `ConfirmDeleteDialog` does not inherit from `Dialog`; it uses it.

## Slot Props

Some components need multiple places where callers can provide UI.

These are often called slots.

```jsx
function PageLayout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
```

Usage:

```jsx
<PageLayout
  header={<AppHeader />}
  sidebar={<SettingsNav />}
>
  <SettingsPage />
</PageLayout>
```

Slot props are useful when `children` alone is not expressive enough.

## Behavior Composition

Composition is not only visual.

You can pass behavior through props.

```jsx
function ToolbarButton({ icon, label, onPress }) {
  return (
    <button onClick={onPress}>
      {icon}
      {label}
    </button>
  );
}
```

The button does not need to know what action it performs.

## Why Not Inheritance?

Inheritance makes behavior harder to trace.

```jsx
class PrimaryButton extends ButtonBase {}
```

In React, shared behavior is usually better handled with:

- props
- children
- custom hooks
- utility functions
- context
- component wrappers

Inheritance can also create tight coupling between base and child classes.

## Choosing a Composition API

Use `children` when there is one main content area.

Use named slot props when there are several content areas.

Use callback props when the parent provides behavior.

Use context when many deeply nested components need shared data.

Use custom hooks when you want to share stateful logic without sharing UI.

## Common Mistakes

- Creating a very generic component with too many props before real use cases exist.
- Using inheritance to share UI behavior.
- Passing large JSX trees through props without naming them clearly.
- Making slot props required when a simple default would work.
- Hiding important behavior inside a wrapper component with no clear API.

:::quiz
question: Which React pattern is usually preferred over component inheritance?
options:
  - Composition with props and children
  - Extending component classes for every variation
  - Direct DOM manipulation
  - Global variables for component configuration
answer: 0
explanation: React components are usually customized by composing them with props, children, callbacks, hooks, or context.
:::

## Recap

Composition keeps React components flexible.

Start with small components, combine them through props and children, and introduce slot props or context only when the component's shape requires it.

## Practice

Build a `DashboardLayout` component with `header`, `sidebar`, and `children` slots.

Then create two different pages that reuse the layout with different sidebar content.
