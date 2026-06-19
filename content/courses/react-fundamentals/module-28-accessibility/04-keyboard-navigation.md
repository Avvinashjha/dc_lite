# Keyboard Navigation

Keyboard navigation is the ability to use an app without a mouse.

Many users rely on keyboards, switch devices, voice control, screen readers, or other assistive technology that follows keyboard focus. If a React UI cannot be used with a keyboard, it is not accessible.

## Focus Basics

Interactive elements should be reachable and usable in a logical order.

Native controls are focusable by default:

- `button`
- `a` with `href`
- `input`
- `select`
- `textarea`
- `summary`

Generic elements such as `div` are not focusable by default.

```jsx
// Avoid custom click targets when a native control works
<div onClick={openMenu}>Menu</div>

// Better
<button type="button" onClick={openMenu}>
  Menu
</button>
```

## Visible Focus

Users need to see where focus is.

Avoid this:

```css
button:focus {
  outline: none;
}
```

If you remove the default outline, provide a clear replacement.

```css
.button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

Use `:focus-visible` when possible so focus rings appear for keyboard navigation without creating unnecessary visual noise for mouse users.

## Tab Order

The tab order should usually follow the DOM order.

Avoid positive `tabIndex` values.

```jsx
// Avoid
<button tabIndex={3}>Save</button>
<button tabIndex={1}>Cancel</button>
```

Positive values create a separate focus order that becomes hard to maintain. Use DOM order and CSS layout instead.

Common `tabIndex` values:

- `0`: include a custom element in normal tab order when truly needed
- `-1`: make an element programmatically focusable but not tabbable

## Managing Focus in React

Some UI changes should move focus intentionally.

Examples:

- after opening a modal, focus should move into the modal
- after closing a modal, focus should return to the opener
- after a route change, focus may move to the main heading or main content
- after form submission fails, focus may move to an error summary

```jsx
function ErrorSummary({ errors }) {
  const ref = useRef(null);

  useEffect(() => {
    if (errors.length > 0) {
      ref.current?.focus();
    }
  }, [errors.length]);

  if (errors.length === 0) return null;

  return (
    <div ref={ref} tabIndex={-1} role="alert">
      <h2>Fix these problems</h2>
      <ul>
        {errors.map((error) => (
          <li key={error.field}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

Use focus movement to support the user's task, not to surprise them on every render.

## Keyboard Patterns

Common expectations:

- buttons activate with Enter and Space
- links activate with Enter
- Escape closes dialogs, menus, and popovers
- arrow keys move within menus, tablists, radio groups, and listboxes
- Tab moves between major controls, not every item in a complex widget

For complex widgets, follow established WAI-ARIA Authoring Practices instead of inventing your own interaction model.

## Edge Cases

- Hidden content should not remain tabbable.
- A modal should prevent focus from moving behind it.
- Disabled controls cannot receive focus; if users need the explanation, show it near the control.
- Infinite scrolling should not make keyboard users lose their place.
- Skip links help keyboard users bypass repeated navigation.

```jsx
<a className="skip-link" href="#main-content">
  Skip to main content
</a>
```

## Common Mistakes

- Testing only clicks.
- Removing focus outlines globally.
- Using positive `tabIndex`.
- Opening a modal without moving focus into it.
- Closing a modal without returning focus.
- Making every item in a long custom list tabbable.

:::quiz
question: Which `tabIndex` value makes an element programmatically focusable but removes it from normal tab order?
options:
  - `-1`
  - `0`
  - `1`
  - `999`
answer: 0
explanation: `tabIndex={-1}` lets code call `.focus()` on an element without adding it to the user's normal Tab sequence.
:::

## Practice Challenge

Create a modal dialog. When it opens, focus the dialog title or first useful control. Trap focus inside the modal while open, close it with Escape, and return focus to the button that opened it.

## Recap

Keyboard accessibility depends on native controls, visible focus, logical DOM order, and intentional focus management. Every interactive React component should be tested without a mouse.
