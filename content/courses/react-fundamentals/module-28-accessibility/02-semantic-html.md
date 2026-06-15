# Semantic HTML

Semantic HTML means choosing elements based on meaning, not appearance.

React components should still produce meaningful HTML. A component named `CardButton` does not help assistive technology unless it renders an actual button or exposes the correct semantics.

## Why Semantics Matter

Browsers, screen readers, search engines, automated tests, and keyboard users all rely on HTML meaning.

```jsx
// Weak semantics
function Navigation() {
  return (
    <div className="nav">
      <div>Home</div>
      <div>Docs</div>
    </div>
  );
}
```

Better:

```jsx
function Navigation() {
  return (
    <nav aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/docs">Docs</a></li>
      </ul>
    </nav>
  );
}
```

The second version gives the browser real navigation, list, and link semantics.

## Landmarks

Landmarks help assistive technology users jump around the page.

Common landmarks:

- `header`
- `nav`
- `main`
- `aside`
- `footer`
- `section` with an accessible name
- `form` with an accessible name

Most pages should have one main content area.

```jsx
function AppLayout({ children }) {
  return (
    <>
      <header>...</header>
      <nav aria-label="Primary">...</nav>
      <main id="main-content">{children}</main>
      <footer>...</footer>
    </>
  );
}
```

## Headings

Headings create a document outline. They should describe page structure, not just font size.

```jsx
function SettingsPage() {
  return (
    <main>
      <h1>Settings</h1>

      <section aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>
        ...
      </section>

      <section aria-labelledby="security-heading">
        <h2 id="security-heading">Security</h2>
        ...
      </section>
    </main>
  );
}
```

Avoid skipping heading levels only because a heading looks too large. Use CSS to change appearance.

## Buttons vs Links

Use a link for navigation. Use a button for an action.

```jsx
// Navigation
<a href="/billing">Billing</a>

// Action
<button type="button" onClick={openBillingModal}>
  Open billing modal
</button>
```

In React Router, `Link` still represents navigation.

```jsx
<Link to="/projects/new">Create project</Link>
```

If it submits, deletes, opens, closes, saves, or toggles state without navigating, it is usually a button.

## Images and Icons

Images need useful `alt` text when they communicate information.

```jsx
<img src="/avatar.jpg" alt="Asha Patel" />
```

Decorative images should use empty alt text.

```jsx
<img src="/divider.svg" alt="" />
```

Icon-only buttons need an accessible name.

```jsx
<button type="button" aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

## Edge Cases

- A `section` is not a useful landmark unless it has an accessible name.
- A `table` is appropriate for tabular data, not for layout.
- A disabled button may be skipped by keyboard users; sometimes an enabled button with an explanatory validation message is clearer.
- A custom component can hide semantics if it does not pass props to the underlying element.
- Multiple `nav` elements should have labels such as `Primary`, `Breadcrumb`, or `Footer`.

## Common Mistakes

- Styling everything as `div`.
- Using a link with `href="#"` for an action.
- Using headings for visual size instead of page structure.
- Giving every icon verbose alt text, including decorative icons.
- Replacing native controls with custom controls before understanding the accessibility cost.

:::quiz
question: Which element should you usually use for an action that opens a modal without navigating?
options:
  - `button`
  - `a`
  - `main`
  - `section`
answer: 0
explanation: Opening a modal changes UI state rather than navigating to another location, so a button is the correct semantic control.
:::

## Practice Challenge

Take a React page that uses layout `div`s. Identify the app shell, navigation, main content, headings, lists, buttons, and links. Replace at least three generic elements with semantic HTML while preserving the visual design.

## Recap

Semantic HTML is the foundation of accessible React. Choose elements by meaning, keep headings structural, use buttons and links correctly, and let the browser provide built-in behavior whenever possible.
