# What is React?

React is a JavaScript library for building user interfaces.

Its core job is to help you keep the UI in sync with changing data.

Instead of manually finding DOM nodes and updating them one by one, you describe what the UI should look like for a given state. React figures out how to update the page.

## The Problem React Solves

A web app usually has state:

- the signed-in user
- the selected tab
- items in a cart
- a form draft
- whether data is loading
- validation errors

Without a UI library, you often write code like this:

```js
const button = document.querySelector("#save-button");
const status = document.querySelector("#status");

button.disabled = isSaving;
status.textContent = isSaving ? "Saving..." : "Ready";
```

That is fine for tiny pages. It becomes harder when many parts of the UI depend on the same data.

React lets you express the result:

```jsx
function SaveStatus({ isSaving }) {
  return (
    <button disabled={isSaving}>
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
}
```

The component says what the button should look like. React handles the update.

## The Modern React Mental Model

Think of React UI as a function of state.

```txt
state + props -> UI
```

If state changes, React calls your components again and calculates the next UI description.

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

For the same `name`, this component should return the same UI. That predictability makes components easier to test, reuse, and combine.

## Core Ideas

React is built around a few ideas you will see throughout the course.

### Declarative UI

You describe the desired result, not every DOM operation.

```jsx
{isLoggedIn ? <Dashboard /> : <LoginForm />}
```

### Components

Components are reusable pieces of UI.

```jsx
function Avatar({ user }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}
```

### Props

Props are inputs passed from a parent component to a child component.

```jsx
<Avatar user={currentUser} />
```

### State

State is data a component remembers and can update.

```jsx
const [isOpen, setIsOpen] = useState(false);
```

### Composition

Small components combine into larger screens.

```jsx
function ProfilePage({ user }) {
  return (
    <main>
      <Avatar user={user} />
      <ProfileDetails user={user} />
    </main>
  );
}
```

## React and the Ecosystem

React is the UI library. Real applications often include other tools:

- Vite or another build tool for local development and production builds
- React DOM for rendering React to the browser
- React Router or a framework for navigation
- a data fetching approach for APIs
- testing tools such as Testing Library
- a styling strategy such as CSS modules, utility CSS, or plain CSS
- frameworks like Next.js or Remix when routing, data loading, or server rendering are needed

You do not need all of these to learn React. Start with components, props, JSX, state, events, and rendering.

## How React Updates the Page

At a high level:

1. A user action, network response, or timer changes state.
2. React calls affected components again.
3. Components return new React elements.
4. React compares the new tree with the previous tree.
5. React commits the necessary DOM updates.

This comparison process is part of reconciliation, which you will study in the rendering module.

## What React Is Not

React is not:

- a full backend framework
- a database layer
- a CSS framework
- a guarantee that your app is automatically fast
- a replacement for understanding JavaScript

React helps with UI. You still need good JavaScript fundamentals, accessible HTML, CSS, and thoughtful application design.

## Common Mistakes

- Thinking React is HTML with extra syntax. React components are JavaScript functions.
- Updating the DOM manually for UI React owns.
- Putting every value in state instead of deriving values during render.
- Learning hooks without understanding props, state, and rendering first.
- Starting with a large framework before understanding React's core model.

:::quiz
question: What problem does React primarily help solve?
options:
  - Managing database indexes
  - Keeping the UI in sync with changing application state
  - Replacing all CSS
  - Running JavaScript without a browser
answer: 1
explanation: React helps developers describe UI as a function of state and props, then updates the browser DOM when that data changes.
:::

## Recap

React is a UI library based on components and declarative rendering. You describe what the UI should look like for the current state, and React updates the page to match.
