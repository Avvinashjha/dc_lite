# The Prop Drilling Problem

Prop drilling happens when a value is passed through components that do not use it, only so a deeper child can receive it.

```jsx
function App() {
  const user = { name: "Ava" };
  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {
  return <p>{user.name}</p>;
}
```

`Dashboard` and `Sidebar` may not care about `user`, but they must keep passing it.

## Why It Becomes a Problem

Prop drilling can make code harder to maintain when:

- many intermediate components forward the same props
- renaming a prop requires edits across many files
- unrelated components become coupled to data they do not use
- deeply nested components need app-level values such as theme, auth, or locale

## Prop Drilling Is Not Always Bad

Passing props is still the clearest React data flow for local relationships.

```jsx
function ProductCard({ product }) {
  return <ProductPrice price={product.price} />;
}
```

This is normal, readable, and explicit. Do not reach for context just because a prop moves down one or two levels.

## Alternatives Before Context

Sometimes component composition removes the problem.

```jsx
function Dashboard({ userMenu }) {
  return <Sidebar userMenu={userMenu} />;
}

function App() {
  return <Dashboard userMenu={<UserMenu user={user} />} />;
}
```

The intermediate components no longer need to know about `user`.

## When Context Fits

Context is useful for values that are:

- needed by many components at different depths
- stable enough not to cause constant broad re-renders
- conceptually shared by a section of the app

Examples include current user, theme, locale, feature flags, and route-level settings.

:::quiz
question: When is prop drilling most likely to become a problem?
options:
  - A parent passes one prop to its direct child
  - Several intermediate components pass data they do not use
  - A component renders a local variable
answer: 1
explanation: Prop drilling becomes painful when components forward props only for deeper descendants.
:::

## Common Mistakes

Do not move every prop into context. Context can hide dependencies and make components harder to reuse.

Do not use context to avoid designing clear component boundaries.

Do not ignore composition. Passing a child element can sometimes be simpler than creating global-ish state.

## Practice Challenge

Take a layout with `App -> Page -> Sidebar -> UserMenu`.

Try three versions:

- pass `user` through props
- pass `<UserMenu />` as a composed child
- read `user` from context

Write down which version is clearest and why.

## Recap

Prop drilling is a real maintenance problem when intermediate components forward data they do not use. Props are still the default for local data; context is best for genuinely shared values across a tree.
