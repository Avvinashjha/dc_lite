# Performance at Scale

React performance at scale is about protecting user experience as screens, data, teams, and dependencies grow. The goal is not to memoize everything. The goal is to make expensive work visible and controlled.

## Measure First

Use browser performance tools, React DevTools Profiler, bundle analysis, and real-user monitoring when possible.

Look for:

- slow initial load
- large JavaScript bundles
- expensive rerenders
- long tasks on the main thread
- repeated network requests
- layout shifts

Useful user-facing metrics include:

- Largest Contentful Paint: how quickly the main content appears
- Interaction to Next Paint: how responsive interactions feel
- Cumulative Layout Shift: how stable the page is while loading

## Bundle Strategy

Large apps should not send every route to every user during startup.

```jsx
import { lazy, Suspense } from 'react';

const SettingsPage = lazy(() => import('./SettingsPage'));

export function SettingsRoute() {
  return (
    <Suspense fallback={<p>Loading settings...</p>}>
      <SettingsPage />
    </Suspense>
  );
}
```

Route-level splitting is often a good first step. Component-level splitting is useful for heavy, rarely used features.

## Rendering Strategy

Rerenders are normal. They become a problem when expensive components rerender frequently for unrelated reasons.

Useful tools include:

- stable keys
- `memo` for expensive pure components
- `useMemo` for expensive derived values
- `useCallback` when function identity affects child rerenders
- virtualization for long lists

Do not use these blindly. They add complexity and can hide design issues.

## Long Lists

Rendering thousands of rows can block the main thread. Virtualization renders only the visible window.

```text
Visible rows: 40
Total rows: 50,000
Rendered DOM nodes: about 40 plus buffer
```

This helps memory and rendering cost, but it can complicate keyboard navigation, screen reader behavior, and dynamic row heights.

## Network and Cache Design

At scale, repeated fetching is a performance bug.

Plan for:

- request deduplication
- caching and invalidation
- pagination or infinite loading
- aborting stale requests
- prefetching likely next screens

Prefetch carefully. Loading everything early can harm the first screen.

## Performance Budgets

A performance budget turns "make it fast" into a constraint the team can review.

Example budget:

```text
Initial route JavaScript: under 180 KB compressed
Route transition: useful content within 1 second on good 4G
Search input: visible response within 100 ms
Largest table: virtualized or paginated above 500 rows
```

Budgets should be checked in pull requests, build reports, or release dashboards. If a budget is exceeded, the team can decide whether the feature is worth the cost.

## Common Mistakes

- Memoizing cheap components while ignoring a huge dependency.
- Fetching the same data separately in sibling components.
- Rendering unbounded lists.
- Shipping admin-only code in the main public bundle.
- Optimizing local development speed but never checking production metrics.
- Discussing performance only after users report a slow production experience.

:::quiz
question: What is the safest first step when a React screen feels slow?
options:
  - Measure where time is spent before choosing an optimization
  - Wrap every component in `memo`
  - Move all state into one context provider
  - Disable source maps and hope the issue disappears
answer: 0
explanation: Measurement prevents guessing. Different bottlenecks require different fixes.
:::

## Practice Challenge

Profile a React page that renders a large list. Record render time before and after adding pagination or virtualization. Note one accessibility concern introduced by your solution.

## Recap

Performance at scale is a design discipline. Reduce unnecessary downloads, avoid repeated work, make expensive rendering visible, and choose optimizations based on evidence.
