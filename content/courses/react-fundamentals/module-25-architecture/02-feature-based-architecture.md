# Feature-Based Architecture

Feature-based architecture organizes code around product capabilities instead of technical file types.

The goal is to make a feature understandable as a unit.

## What Is a Feature?

A feature is a user-visible capability or product area.

Examples:

- course catalog
- lesson player
- user profile
- checkout
- notifications
- admin reports

A feature is not just a component. It often includes UI, data access, validation, state, tests, and types.

## Example Layout

```text
src/features/lesson-player/
  components/
    LessonContent.jsx
    LessonSidebar.jsx
  hooks/
    useLessonProgress.js
  api/
    lessonProgressApi.js
  state/
    lessonPlayerStore.js
  types/
    lessonTypes.js
  index.js
```

The feature has a public entry point through `index.js`.

Other features should import from the public entry point instead of internal files.

## Public API

```js
// src/features/lesson-player/index.js
export { LessonPlayer } from "./components/LessonPlayer";
export { useLessonProgress } from "./hooks/useLessonProgress";
```

This gives the feature control over what it exposes.

Avoid this from outside the feature:

```js
import { calculateProgress } from "../lesson-player/state/internalProgressMath";
```

Deep imports create hidden coupling.

## Feature Ownership

Feature boundaries help teams answer:

- where does this behavior live?
- who owns this code?
- what can this feature expose?
- what can change without breaking other features?

Ownership matters more as teams grow.

## Shared vs Feature Code

Keep code inside a feature when it is specific to that feature.

Move code to shared only when:

- multiple features need it
- the API is stable enough
- it has no feature-specific assumptions
- it can be tested independently

Example:

```text
shared/lib/formatCurrency.js
features/checkout/components/PaymentSummary.jsx
```

`formatCurrency` is generic. `PaymentSummary` is feature-specific.

## Cross-Feature Communication

Features sometimes need to interact.

Prefer communication through:

- route parameters
- shared app state
- backend APIs
- events with clear payloads
- public feature APIs

Avoid one feature reaching into another feature's internals.

## Data Ownership

Decide which feature owns which data.

For example:

```text
features/auth owns current user identity
features/courses owns course catalog and lesson metadata
features/progress owns completion state
```

If multiple features edit the same data, define a clear source of truth.

## Common Mistakes

- Creating features that are too tiny to own meaningful behavior.
- Moving every reusable-looking function into `shared` immediately.
- Allowing circular imports between features.
- Having multiple features own the same server state without coordination.
- Exporting everything from a feature and losing encapsulation.

## Edge Case

Sometimes a folder starts as a feature and later becomes shared infrastructure.

That is fine. Let real usage prove the abstraction before moving it.

:::quiz
question: Why is a feature public API useful?
options:
  - It controls what other parts of the app can depend on
  - It makes React skip reconciliation
  - It stores files in alphabetical order
  - It replaces backend APIs
answer: 0
explanation: A public API limits coupling by exposing stable entry points and hiding internals.
:::

## Practical Challenge

Design a feature folder for notifications.

Include:

- components
- hooks
- API functions
- state or cache integration
- tests
- public exports

Then list what other features are allowed to import.

## Recap

Feature-based architecture improves change locality and ownership.

Use public feature APIs, keep internals private, and promote code to shared only when reuse is real and stable.
