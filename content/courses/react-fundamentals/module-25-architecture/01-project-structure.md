# Project Structure

Project structure should help developers find code, understand ownership, and make changes without touching unrelated areas.

There is no perfect folder layout for every React app. Good structure depends on app size, team size, routing, data flow, and product boundaries.

## Start Simple

Small apps can use a simple layout.

```text
src/
  components/
  pages/
  hooks/
  lib/
  styles/
  App.jsx
```

This is fine when the app is small and there are few features.

Do not over-engineer a prototype.

## When Structure Starts to Hurt

Flat technical folders can become painful as the app grows.

```text
components/
  UserTable.jsx
  ProjectTable.jsx
  BillingForm.jsx
  LessonCard.jsx
  CourseSidebar.jsx
hooks/
  useUsers.js
  useProjects.js
  useBilling.js
  useLessons.js
```

The problem is not the folder names. The problem is that code for one feature is scattered across the project.

## Feature-Oriented Structure

A feature-oriented structure groups code by product area.

```text
src/
  app/
    routes/
    providers/
  features/
    courses/
      components/
      hooks/
      api/
      types/
    billing/
      components/
      hooks/
      api/
      types/
  shared/
    components/
    hooks/
    lib/
```

This makes ownership clearer.

If you are changing course progress, you start in `features/courses`.

## Shared Code

`shared` should contain code that is truly reused across features.

Good shared code:

- design system components
- formatting helpers
- generic hooks
- API client primitives
- date and currency utilities

Avoid moving code to `shared` just because two files currently use it. Wait until the abstraction is stable enough.

## Naming Matters

Use names that communicate product meaning.

Prefer:

```text
features/course-progress/
features/checkout/
features/lesson-player/
```

Over vague buckets:

```text
features/misc/
features/common/
features/new/
```

Vague folders become dumping grounds.

## Import Boundaries

Structure is only useful if imports respect it.

Example rule:

```text
features/billing can import:
  shared/*
  features/billing/*

features/billing should not import:
  features/courses/internal/*
```

Some teams enforce this with lint rules or path aliases.

## Co-Locating Tests

Tests can live near the code they verify.

```text
features/courses/
  components/
    CourseCard.jsx
    CourseCard.test.jsx
```

Co-location makes ownership obvious and lowers the cost of updating tests when behavior changes.

## Common Mistakes

- Creating many folders before the app has real complexity.
- Keeping everything in `components` forever.
- Using `shared` as a junk drawer.
- Allowing deep imports into another feature's internals.
- Organizing only by file type and ignoring product ownership.

## Edge Case

A design system button belongs in `shared` or a design system package.

A `StartLessonButton` probably belongs in the course feature because it contains course-specific behavior.

:::quiz
question: What is the main benefit of feature-oriented structure in a growing React app?
options:
  - Related UI, hooks, API calls, and types stay near their product feature
  - React renders components faster automatically
  - CSS becomes unnecessary
  - It removes the need for tests
answer: 0
explanation: Feature grouping improves ownership and change locality. It does not automatically improve runtime performance.
:::

## Practical Challenge

Take a flat React project and choose one feature.

Move only that feature's:

- components
- hooks
- API functions
- tests
- types

Write down what should remain shared and what should stay private to the feature.

## Recap

Good project structure optimizes for finding, changing, and owning code.

Start simple, group by feature as complexity grows, and keep shared code truly shared.
