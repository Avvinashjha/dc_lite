# Navigation and Links

Navigation changes the current URL.

In React Router apps, use router-aware links for internal navigation so the app can update without a full page reload.

## Link

Use `Link` instead of a normal anchor for internal routes.

```jsx
import { Link } from "react-router-dom";

function MainNav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
```

`Link` renders an anchor, but React Router intercepts the click and updates the route client-side.

## NavLink

`NavLink` is useful for navigation items that need active styling.

```jsx
import { NavLink } from "react-router-dom";

function MainNav() {
  return (
    <nav>
      <NavLink
        to="/products"
        className={({ isActive }) => isActive ? "active" : undefined}
      >
        Products
      </NavLink>
    </nav>
  );
}
```

Use active styles to help users understand where they are.

## Relative Links

Inside nested routes, links can be relative.

```jsx
function SettingsNav() {
  return (
    <nav>
      <Link to="profile">Profile</Link>
      <Link to="billing">Billing</Link>
    </nav>
  );
}
```

If the current route is `/settings`, the links go to `/settings/profile` and `/settings/billing`.

Use absolute paths when you want to navigate from the app root.

```jsx
<Link to="/billing">Billing</Link>
```

## Search Params

Links can include query strings.

```jsx
<Link to="/products?category=books&page=2">Books</Link>
```

For dynamic query strings, use `URLSearchParams`.

```jsx
const params = new URLSearchParams({
  category: "books",
  page: "2",
});

<Link to={`/products?${params}`}>Books</Link>
```

Query strings are good for filters, sorting, pagination, and search terms.

## External Links

Use normal anchors for external URLs.

```jsx
<a href="https://react.dev" target="_blank" rel="noreferrer">
  React docs
</a>
```

`Link` is for routes handled by your React Router app.

## Accessibility

Links and buttons have different meanings.

Use a link when the user navigates to another location.

Use a button when the user performs an action on the current page.

```jsx
<Link to="/profile">View profile</Link>
<button onClick={saveProfile}>Save profile</button>
```

Do not use clickable `<div>` elements for navigation.

## Common Mistakes

- Using `<a href="/settings">` for internal navigation and causing full reloads.
- Using `Link` for external websites.
- Using buttons for navigation when a link would be more semantic.
- Forgetting active navigation styles.
- Confusing relative and absolute paths in nested routes.

:::quiz
question: When should you use Link instead of a normal anchor?
options:
  - For internal routes handled by the React Router app
  - For every external URL
  - For submit buttons
  - For non-clickable headings
answer: 0
explanation: Link enables client-side navigation for routes inside the app. External URLs should use normal anchors.
:::

## Recap

Use `Link` for internal navigation and `NavLink` when active styling matters.

Choose links for navigation, buttons for actions, and keep query strings for shareable route state.

## Practice

Create a main navigation bar with `NavLink` active styles.

Add product filter links that update `category` and `page` in the query string.
