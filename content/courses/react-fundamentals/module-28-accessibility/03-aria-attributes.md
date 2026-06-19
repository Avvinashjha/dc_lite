# ARIA Attributes

ARIA stands for Accessible Rich Internet Applications.

ARIA attributes can add names, relationships, roles, and state to elements when native HTML is not enough. They are powerful, but they do not automatically add behavior.

The first rule is simple: prefer native HTML.

## What ARIA Can Do

ARIA can describe things that HTML alone may not express clearly:

- the accessible name of an icon button
- the relationship between an input and an error message
- whether a custom disclosure is expanded
- where a live status update should be announced
- the role of a custom widget when no native element fits

Example:

```jsx
function SearchField({ error }) {
  const errorId = error ? "search-error" : undefined;

  return (
    <div>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
```

`aria-describedby` connects extra information to the input. `aria-invalid` communicates that the current value is invalid.

## Accessible Names

Interactive controls need accessible names.

Visible text is usually best:

```jsx
<button type="button">Save changes</button>
```

For icon-only controls, use `aria-label`:

```jsx
<button type="button" aria-label="Delete file">
  <TrashIcon aria-hidden="true" />
</button>
```

Do not put important text only in a placeholder or tooltip. Placeholders can disappear and tooltips may not be available to keyboard or touch users.

## State Attributes

ARIA state must match React state.

```jsx
function Disclosure({ title, children }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
      </button>
      {open && <div id={panelId}>{children}</div>}
    </section>
  );
}
```

If the visual state changes but `aria-expanded` does not, assistive technology receives the wrong information.

## Live Regions

Dynamic updates may need announcement.

```jsx
function SaveStatus({ status }) {
  return (
    <p role="status" aria-live="polite">
      {status}
    </p>
  );
}
```

Use live regions sparingly. Announcing every small render can become noisy.

Common choices:

- `role="status"` for polite status updates
- `role="alert"` for urgent validation or failure messages
- `aria-live="polite"` for updates that can wait
- `aria-live="assertive"` only for critical interruptions

## ARIA Does Not Add Behavior

This is a common trap:

```jsx
// Incomplete custom button
<div role="button" tabIndex={0} onClick={submit}>
  Submit
</div>
```

The role tells assistive technology that it is a button, but you still need keyboard handling, disabled behavior, focus styling, and correct event behavior. A real `button` is almost always better.

## Edge Cases

- `aria-hidden="true"` hides content from assistive technology, even if it is visible.
- `aria-label` can replace visible text as the accessible name, which may surprise translators and testers.
- IDs used by `aria-describedby`, `aria-labelledby`, and `aria-controls` must be stable and unique.
- `role="presentation"` and `role="none"` remove semantics and can break lists or tables if used casually.
- ARIA roles can conflict with native semantics. Do not put `role="button"` on an actual link unless you also make it behave like a button.

## Common Mistakes

- Using ARIA to patch avoidable semantic HTML mistakes.
- Adding `aria-label` that disagrees with visible text.
- Forgetting to update ARIA state when React state changes.
- Hiding focusable content with `aria-hidden`.
- Building complex custom widgets without following the expected keyboard pattern.

:::quiz
question: What does `aria-expanded` do on a disclosure button?
options:
  - Communicates whether the controlled content is currently expanded
  - Automatically opens and closes the content
  - Makes the button submit a form
  - Prevents the element from receiving focus
answer: 0
explanation: ARIA communicates meaning and state. It does not implement behavior, so React state and event handlers must still control the UI.
:::

## Practice Challenge

Build a small FAQ accordion. Use a real `button`, connect it to the panel with `aria-controls`, update `aria-expanded`, and verify that the accordion works with keyboard and mouse.

## Recap

ARIA is for semantics, names, relationships, and state when native HTML is not enough. Use it carefully, keep it synchronized with React state, and remember that it does not add interaction behavior.
