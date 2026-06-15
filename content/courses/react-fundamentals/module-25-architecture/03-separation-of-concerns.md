# Separation of Concerns

Separation of concerns means giving different parts of the code clear responsibilities.

In React, this often means separating rendering, state, data access, domain logic, and side effects enough that each part can be understood and tested.

## Why It Matters

A component that does everything becomes hard to change.

```jsx
function CoursePage() {
  // reads route params
  // fetches data
  // transforms lessons
  // handles progress mutation
  // manages tabs
  // renders layout
  // formats dates
}
```

This is hard to test and easy to break.

Separation does not mean every line needs a new file. It means responsibilities should be visible.

## Common Concern Types

React apps often contain:

- presentation: markup and visual structure
- state: UI state and server state
- data access: API calls and queries
- domain logic: product rules
- effects: subscriptions, timers, browser APIs
- routing: route parameters and navigation
- formatting: dates, numbers, labels

## Container and Presentational Split

A useful pattern is to keep data loading outside a presentational component.

```jsx
function CoursePageContainer({ courseId }) {
  const { course, status } = useCourse(courseId);

  if (status === "loading") return <p>Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return <CoursePage course={course} />;
}
```

```jsx
function CoursePage({ course }) {
  return (
    <main>
      <h1>{course.title}</h1>
      <LessonList lessons={course.lessons} />
    </main>
  );
}
```

The presentational component is easier to test and reuse.

## Custom Hooks

Custom hooks are good for stateful behavior.

```jsx
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

Hooks should have clear inputs and outputs. Avoid hooks that secretly control too many unrelated things.

## API Modules

Keep low-level request details out of components.

```js
export async function getCourse(courseId) {
  return apiJson(`/api/courses/${courseId}`);
}
```

Components should express product intent, not repeat headers and URL construction everywhere.

## Domain Logic

Domain rules should not be buried inside JSX.

```js
export function canStartFinalQuiz(progress) {
  return progress.completedLessons >= progress.requiredLessons && !progress.isSuspended;
}
```

This logic can be tested without rendering React.

## Avoid Over-Separation

Too much separation creates ceremony.

Bad signs:

- every component has five tiny files with little value
- logic is harder to follow after extraction
- abstractions have vague names
- files exist only to satisfy a pattern

Extract when it improves clarity, reuse, or testing.

## Common Mistakes

- Putting API calls, formatting, domain rules, and JSX in one large component.
- Moving code into hooks even when it is pure calculation.
- Creating generic abstractions before there are repeated real cases.
- Letting presentational components mutate global state.
- Hiding important side effects inside helpers with harmless names.

## Edge Case

A component can fetch its own data if it is small, local, and unlikely to be reused.

Architecture should serve the codebase, not a diagram.

:::quiz
question: Which logic is a good candidate to extract from a React component into a plain function?
options:
  - A domain rule such as whether a user can start a quiz
  - A single `<h1>` element
  - A prop name used once
  - The `return` keyword from JSX
answer: 0
explanation: Domain rules are easier to test and reuse as plain functions when they do not need React state or lifecycle.
:::

## Practical Challenge

Find a component with mixed responsibilities.

Extract:

- API request code into an API module
- domain calculation into a plain function
- stateful reusable behavior into a hook
- display markup into smaller components only where it improves clarity

## Recap

Separation of concerns is about understandable responsibility boundaries.

Keep render code focused, put domain rules in testable functions, isolate data access, and use hooks for stateful behavior.
