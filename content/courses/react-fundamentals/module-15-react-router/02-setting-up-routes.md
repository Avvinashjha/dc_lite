# Setting Up Routes

Routes describe which UI should appear for each path.

In React Router, the common component API uses `Routes` and `Route`.

## Basic Setup

```jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Each route has a `path` and an `element`.

## The element Prop

The `element` prop receives JSX.

```jsx
<Route path="/profile" element={<ProfilePage user={user} />} />
```

Do not pass the component function itself.

```jsx
// Wrong for React Router v6 style routes
<Route path="/profile" component={ProfilePage} />
```

That was an older API.

## Not Found Routes

Use `*` to match anything that did not match earlier routes.

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductsPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

This gives users a friendly 404 screen inside the app.

## Route Order

React Router v6 ranks routes by specificity.

You do not need to put every specific route before every broad route, but you should still keep route lists organized for humans.

```jsx
<Route path="/products/:productId" element={<ProductDetailsPage />} />
<Route path="/products/new" element={<NewProductPage />} />
```

React Router can choose the more specific match.

## Layout Routes

Many apps share a layout.

```jsx
function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

Routes:

```jsx
<Routes>
  <Route element={<AppLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
  </Route>
</Routes>
```

`Outlet` is where the matched child route renders.

## Index Routes

An index route is the default child for a parent route.

```jsx
<Route path="/settings" element={<SettingsLayout />}>
  <Route index element={<ProfileSettings />} />
  <Route path="billing" element={<BillingSettings />} />
</Route>
```

`/settings` renders `ProfileSettings`.

`/settings/billing` renders `BillingSettings`.

## Keeping Routes Maintainable

As apps grow:

- group routes by feature
- keep route paths consistent
- give route components clear names
- use layout routes for shared chrome
- avoid deeply nested route trees unless the UI is truly nested

## Data Router Awareness

Recent React Router versions also support data routers with route objects, loaders, and actions.

Those APIs can load data and handle mutations at the route level.

This course focuses first on the component routing model because it teaches the core concepts. When using a framework or newer React Router setup, follow its recommended data-router patterns.

## Common Mistakes

- Forgetting to wrap routes in a router provider such as `BrowserRouter`.
- Using old `component` or `render` route props in a v6 app.
- Forgetting a not-found route.
- Rendering layout markup around each page instead of using layout routes.
- Using absolute child paths when relative paths are intended.

:::quiz
question: What does Outlet do in a layout route?
options:
  - It marks where the matched child route should render
  - It redirects users to the home page
  - It creates a route parameter
  - It prevents navigation
answer: 0
explanation: Outlet is a placeholder inside a parent route's element where child route elements appear.
:::

## Recap

Routes map paths to elements.

Use layout routes and index routes to keep shared structure clean, and add a not-found route for unmatched URLs.

## Practice

Set up routes for `/`, `/products`, `/products/:productId`, `/settings`, and `/settings/billing`.

Use a layout route with a header and a not-found route for unmatched paths.
