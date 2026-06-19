# Introduction to Routing

Routing lets a React app show different screens for different URLs.

In a traditional multi-page site, the browser requests a new HTML page for each URL. In many React apps, the browser loads one app shell and React changes what is displayed as the URL changes.

This is called client-side routing.

## Why Routing Matters

Good routing gives users:

- bookmarkable pages
- working browser back and forward buttons
- shareable links
- clear navigation
- separate screens for different tasks

Routing is not only about rendering components. It is part of the user experience.

## React Router

React Router is a popular routing library for React.

It maps paths to elements.

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductsPage />} />
  <Route path="/products/:productId" element={<ProductDetailsPage />} />
</Routes>
```

When the URL matches `/products`, React Router renders `ProductsPage`.

When the URL matches `/products/42`, it renders `ProductDetailsPage` and provides `productId` as a route parameter.

## BrowserRouter

Most browser apps wrap their routes in `BrowserRouter`.

```jsx
import { BrowserRouter } from "react-router-dom";

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
```

`BrowserRouter` uses the browser history API so navigation can update the URL without a full page reload.

## Routes Are UI State

The URL can represent important state.

Examples:

- `/products?page=2`
- `/users/123`
- `/settings/billing`
- `/search?q=react`

If a user should be able to refresh, bookmark, or share a view, consider putting that state in the URL.

## Client-Side Routing Needs Server Support

If the user refreshes `/settings`, the server receives a request for `/settings`.

For a client-routed app, the server usually needs to return the React app's HTML for that route.

Otherwise, deep links may show a 404 even though navigation works inside the app.

## Not Every State Belongs in the URL

Good URL state:

- selected resource ID
- current route
- filters and search terms that should be shareable
- pagination
- tab selection when the tab is a meaningful page state

Poor URL state:

- temporary input draft
- open tooltip
- hover state
- non-shareable animation state

## Common Mistakes

- Using regular `<a href>` for internal navigation and causing full page reloads.
- Storing shareable page state only in component state.
- Forgetting server fallback support for deep links.
- Making routes too vague, such as putting every screen behind `/app`.
- Treating routing as separate from accessibility and navigation structure.

:::quiz
question: What is one benefit of client-side routing with React Router?
options:
  - Users can navigate between app screens while preserving shareable URLs
  - It removes the need for all server configuration
  - It automatically fetches all data for every page
  - It prevents components from re-rendering
answer: 0
explanation: React Router keeps the URL meaningful while rendering different React screens without full page reloads.
:::

## Recap

Routing connects URLs to UI.

Use routes for meaningful screens and shareable state. Remember that deep links need server or hosting support.

## Practice

Sketch routes for a small shop app.

Include a home page, product list, product details page, cart page, and account settings page. Decide which state belongs in path parameters and which belongs in query strings.
