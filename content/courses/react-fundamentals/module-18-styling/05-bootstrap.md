# Bootstrap with React

Bootstrap is a CSS framework with prebuilt layout utilities and components.

In React projects, you can use Bootstrap CSS classes directly or use a wrapper library such as React Bootstrap.

## Using Bootstrap Classes

```jsx
function LoginCard() {
  return (
    <section className="card p-4 shadow-sm">
      <h1 className="h4 mb-3">Sign in</h1>
      <button className="btn btn-primary">Continue</button>
    </section>
  );
}
```

This is quick and familiar to many developers.

The tradeoff is that the UI can look generic unless you customize the theme.

## Grid and Layout

Bootstrap's grid is useful for responsive layouts.

```jsx
function DashboardCards({ cards }) {
  return (
    <div className="row g-3">
      {cards.map((card) => (
        <div className="col-12 col-md-6 col-xl-3" key={card.id}>
          <article className="card h-100">
            <div className="card-body">{card.title}</div>
          </article>
        </div>
      ))}
    </div>
  );
}
```

This renders full-width cards on small screens and more columns on larger screens.

## React Bootstrap Awareness

React Bootstrap provides React components that map to Bootstrap behavior.

```jsx
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmDialog({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete item?</Modal.Title>
      </Modal.Header>
      <Modal.Body>This action cannot be undone.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
```

This can be easier than manually wiring Bootstrap JavaScript behavior.

## Customizing Bootstrap

Teams often customize Bootstrap through Sass variables or CSS custom properties.

Customize early if the product should not look like default Bootstrap.

Also define component rules so developers do not mix random Bootstrap utilities with unrelated custom CSS in unpredictable ways.

## Accessibility Notes

Bootstrap components can help with accessibility, but they do not guarantee it.

You still need:

- meaningful button text
- correct labels for form controls
- sensible heading order
- keyboard-tested modals and dropdowns
- sufficient color contrast after customization

Changing colors can accidentally break contrast.

## Common Mistakes

- Importing Bootstrap JavaScript and React wrapper behavior that conflict.
- Overriding Bootstrap styles with scattered `!important` rules.
- Using layout classes without checking mobile behavior.
- Assuming every Bootstrap component is accessible after customization.
- Mixing Bootstrap with another full component framework without a clear reason.

:::quiz
question: Why might a React team choose React Bootstrap instead of manually using Bootstrap JavaScript plugins?
options:
  - It provides React components that integrate Bootstrap behavior with React state
  - It removes the need for HTML
  - It makes all components server-only
  - It disables Bootstrap CSS
answer: 0
explanation: React Bootstrap wraps Bootstrap patterns as React components, which can fit React state and rendering better than direct DOM plugins.
:::

## Practical Challenge

Create a responsive settings page using Bootstrap.

Include:

- a two-column layout on desktop
- stacked sections on mobile
- a form with labels
- primary and secondary actions
- one customized color token

Then test the form using only the keyboard.

## Recap

Bootstrap is useful when speed, familiarity, and prebuilt patterns matter.

Use it intentionally, customize consistently, and keep accessibility and responsive behavior in the review checklist.
