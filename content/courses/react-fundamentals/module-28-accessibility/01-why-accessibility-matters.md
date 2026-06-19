# Why Accessibility Matters

Accessibility means people with different bodies, devices, abilities, preferences, and situations can use your application.

In React, accessibility is not a separate feature added at the end. It is part of component design, state management, routing, forms, testing, and product quality.

Accessibility helps people who:

- use screen readers or braille displays
- navigate with a keyboard, switch device, voice control, or other assistive technology
- need captions, larger text, reduced motion, or high contrast
- have temporary limitations, such as a broken arm or bright sunlight on a screen
- are using older devices, slow networks, or zoomed browser settings

## Accessibility Is User Experience

An inaccessible UI is often a confusing UI.

For example, a button made from a clickable `div` can fail for keyboard users, screen reader users, and automated tests.

```jsx
// Avoid this
function FakeButton({ onClick }) {
  return <div onClick={onClick}>Save</div>;
}
```

Use the platform element when it matches the behavior.

```jsx
function SaveButton({ onClick }) {
  return <button onClick={onClick}>Save</button>;
}
```

The real `button` already supports focus, keyboard activation, disabled behavior, and semantic meaning.

## React Does Not Make Accessibility Automatic

React renders HTML. If the HTML is inaccessible, the React app is inaccessible.

React can help by making reusable accessible components:

```jsx
function Field({ id, label, error, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={errorId} {...props} />
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

React can also make accessibility worse if components hide native semantics, move focus unexpectedly, or update content without announcing it.

## Common Accessibility Areas

Most React accessibility work falls into a few categories:

- semantic HTML: headings, landmarks, buttons, links, lists, and tables
- keyboard support: visible focus, tab order, escape behavior, and shortcuts
- forms: labels, errors, instructions, required fields, and validation
- dynamic updates: loading states, route changes, modals, toasts, and live regions
- visual design: contrast, zoom, spacing, reduced motion, and responsive layouts
- testing: automated checks, manual keyboard testing, and screen reader smoke tests

## Edge Cases

Accessibility bugs often appear in states that are easy to skip:

- loading placeholders without useful labels
- disabled buttons that hide why an action is unavailable
- modals that leave focus behind the overlay
- custom dropdowns that cannot be operated with arrow keys
- route changes that do not move focus or update the page title
- error messages that are visible but not connected to inputs

## Common Mistakes

- Treating accessibility as only a legal checklist.
- Using `div` and `span` for interactive controls.
- Adding ARIA before checking whether native HTML already solves the problem.
- Removing focus outlines without providing a visible replacement.
- Testing only with a mouse.
- Assuming automated accessibility tools catch every issue.

:::quiz
question: Which React component is most accessible by default for a normal clickable action?
options:
  - A `button` with an `onClick` handler and clear text
  - A `div` with an `onClick` handler
  - A `span` with `cursor: pointer`
  - An icon with no label
answer: 0
explanation: Native buttons include keyboard behavior, focus behavior, and semantic meaning. Custom clickable elements require extra work and are easy to get wrong.
:::

## Practice Challenge

Open a page in one of your React apps and use it without a mouse. Record every place where focus is missing, the tab order is confusing, or a control cannot be activated with Enter or Space. Then fix one issue using native HTML before reaching for ARIA.

## Recap

Accessibility is part of building reliable React UI. Start with semantic HTML, preserve keyboard behavior, design every state, and test with more than a mouse.
