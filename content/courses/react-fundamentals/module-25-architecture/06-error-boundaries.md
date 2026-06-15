# Error Boundaries

Error boundaries let React components catch rendering errors in their child tree and show fallback UI.

They prevent one broken component from unmounting the entire React app.

## What Error Boundaries Catch

Error boundaries catch errors during:

- rendering
- lifecycle methods in class components
- constructors in class components

They do not catch:

- event handler errors
- async callback errors
- server-side rendering errors in the same way
- errors thrown outside the React tree

## Class Component Boundary

React error boundaries are currently defined with class components.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Usage:

```jsx
<ErrorBoundary fallback={<p>Could not load this section.</p>}>
  <CourseProgressChart />
</ErrorBoundary>
```

## Placement Strategy

Do not place only one boundary around the entire app.

Use boundaries around meaningful sections:

```text
App
  Route boundary
    Dashboard layout
      Chart boundary
      Activity feed boundary
      Settings form boundary
```

This lets one widget fail without taking down the whole page.

## Route-Level Boundaries

Frameworks often provide route-level error boundaries.

These are useful for:

- page loading failures
- route component crashes
- missing data
- unexpected server errors

Still consider smaller boundaries around risky widgets inside the page.

## Resetting an Error Boundary

After a boundary shows fallback UI, it needs a way to recover.

Common reset triggers:

- user clicks "Try again"
- route changes
- key changes
- query variables change

```jsx
<ErrorBoundary key={lessonId} fallback={<LessonError />}>
  <LessonContent lessonId={lessonId} />
</ErrorBoundary>
```

Changing the key remounts the boundary for a different lesson.

## Event Handler Errors

Error boundaries do not catch event handler errors.

```jsx
function SaveButton() {
  async function handleClick() {
    try {
      await save();
    } catch (error) {
      showToast("Could not save");
    }
  }

  return <button onClick={handleClick}>Save</button>;
}
```

Handle event and async errors where they occur.

## Logging

Fallback UI helps the user. Logging helps the team.

When logging errors, include:

- error message and stack
- component stack if available
- route
- user action if known
- release version
- relevant IDs, without secrets

Do not log tokens, passwords, or private payloads.

## Fallback UI

Good fallback UI:

- explains what failed in plain language
- preserves the rest of the page
- offers retry when possible
- avoids exposing internal error details
- gives the user a next step

```jsx
function ChartErrorFallback({ onRetry }) {
  return (
    <section>
      <h2>Chart unavailable</h2>
      <p>We could not load this chart right now.</p>
      <button onClick={onRetry}>Try again</button>
    </section>
  );
}
```

## Common Mistakes

- Relying on error boundaries for async request errors.
- Wrapping only the whole app and losing all UI on a small crash.
- Showing raw stack traces to users.
- Forgetting reset behavior.
- Logging sensitive data with error context.
- Using fallback UI that traps the user with no recovery path.

## Edge Case

An error boundary cannot catch an error thrown by itself.

If the fallback component throws, the error bubbles to the next boundary above it.

Keep fallbacks simple and reliable.

:::quiz
question: Which error is an error boundary designed to catch?
options:
  - An error thrown while rendering a child component
  - A rejected promise inside a click handler with no `try/catch`
  - A failed HTTP request automatically
  - A syntax error before the app loads
answer: 0
explanation: Error boundaries catch render-time errors in their child tree. Event handler and async errors need separate handling.
:::

## Practical Challenge

Add error boundaries to a dashboard layout.

Decide:

- route-level fallback
- widget-level fallbacks
- retry/reset behavior
- error logging metadata
- what information must not be logged

Then intentionally throw an error in one widget and verify the rest of the page still works.

## Recap

Error boundaries are resilience boundaries for render failures.

Place them around meaningful UI sections, log safely, provide useful fallback UI, and handle async/event errors separately.
