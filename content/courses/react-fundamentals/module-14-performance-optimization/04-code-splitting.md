# Code Splitting and Lazy Loading

Code splitting means sending less JavaScript up front and loading some code later.

In React apps, this often means lazy loading routes, dialogs, charts, editors, or other heavy features that are not needed immediately.

## Why Code Splitting Helps

Large JavaScript bundles can slow down:

- download
- parsing
- compilation
- startup execution
- time before the app becomes interactive

If a user lands on the home page, they should not always need to download the admin dashboard, charting library, and settings editor immediately.

## React.lazy

`React.lazy` loads a component dynamically.

```jsx
const SettingsPage = React.lazy(() => import("./SettingsPage"));
```

Render it inside `Suspense`.

```jsx
function App() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <SettingsPage />
    </Suspense>
  );
}
```

While the code is loading, React shows the fallback.

## Route-Level Splitting

Routes are a natural splitting boundary.

```jsx
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Suspense>
  );
}
```

The reports code loads when the reports route is visited.

Frameworks may provide their own route-based lazy loading APIs. Prefer the framework's pattern when one exists.

## Component-Level Splitting

Split heavy components that are not always visible.

```jsx
const RichTextEditor = React.lazy(() => import("./RichTextEditor"));

function CommentComposer({ advanced }) {
  return (
    <Suspense fallback={<p>Loading editor...</p>}>
      {advanced ? <RichTextEditor /> : <textarea />}
    </Suspense>
  );
}
```

This can keep the initial bundle smaller for users who never open advanced editing.

## Good Fallbacks

Fallbacks should match the UI.

```jsx
<Suspense fallback={<SettingsSkeleton />}>
  <SettingsPage />
</Suspense>
```

A full-page spinner for a tiny panel can feel jarring. A small skeleton or placeholder may be better.

## Error Handling

Lazy loading can fail because of network errors, deploy mismatches, or blocked requests.

Use an error boundary around lazy areas when failure needs a friendly recovery path.

```jsx
<ErrorBoundary fallback={<p>Could not load this section.</p>}>
  <Suspense fallback={<p>Loading...</p>}>
    <ReportsPage />
  </Suspense>
</ErrorBoundary>
```

## Preloading

Sometimes you can load code just before it is needed.

```jsx
function ReportsLink() {
  return (
    <Link
      to="/reports"
      onMouseEnter={() => import("./pages/ReportsPage")}
    >
      Reports
    </Link>
  );
}
```

Be careful. Preloading too much can undo the benefits of splitting.

## Common Mistakes

- Splitting tiny components and creating too many network requests.
- Lazy loading content needed immediately above the fold.
- Forgetting a `Suspense` fallback.
- Using a fallback that causes layout shift.
- Ignoring error handling for failed chunk loads.
- Assuming code splitting fixes slow rendering after the code has loaded.

:::quiz
question: What is a good candidate for code splitting?
options:
  - A heavy admin page that most users do not visit
  - A small button used on every page
  - The root app shell required for startup
  - A utility function used during initial render
answer: 0
explanation: Code splitting works best for heavy code that is not needed immediately by most users.
:::

## Recap

Code splitting improves startup by delaying less important JavaScript.

Use route and feature boundaries, provide good fallbacks, and remember that splitting helps loading cost, not every rendering problem.

## Practice

Lazy load a settings page behind a route.

Add a skeleton fallback and an error boundary, then inspect the built bundles to confirm the page moved into a separate chunk.
