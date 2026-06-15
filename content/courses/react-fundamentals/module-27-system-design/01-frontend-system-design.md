# Frontend System Design

Frontend system design is the practice of planning how a user interface behaves, scales, loads data, handles failure, and stays maintainable as the product grows.

React is only one part of the design. A strong frontend design also considers routing, state ownership, performance, accessibility, security, deployment, and team workflow.

## Start With Requirements

Before choosing libraries, clarify:

- who uses the app?
- what are the critical user flows?
- what data is needed on each screen?
- what must work offline or on slow networks?
- what are the accessibility and browser requirements?
- what are the expected scale and latency constraints?

Example: a dashboard for internal analysts has different tradeoffs than a public checkout flow.

## Break the App Into Surfaces

A useful design often starts with surfaces:

```text
App shell
Authentication screens
Primary routes
Shared layout
Data-heavy widgets
Forms and mutations
Error and empty states
```

Each surface should have clear ownership and data needs.

## Data Flow

React apps become hard to reason about when data can change from many places without a clear model.

Common categories:

- server state: data fetched from APIs
- client UI state: modals, filters, tabs, drafts
- URL state: route params, search params
- form state: user input before submission
- persisted client state: local storage or IndexedDB

Do not put all of these into one global store by default.

## Loading and Failure States

System design includes unhappy paths.

```jsx
if (isLoading) return <LoadingState />;
if (error) return <ErrorState retry={refetch} />;
if (!data.length) return <EmptyState />;

return <ResultsList items={data} />;
```

A screen is not designed until loading, empty, error, and permission states are designed.

## Performance Budget

Set expectations early:

- target bundle size
- acceptable initial load time
- interaction response time
- slow-network behavior
- expensive route boundaries

Budgets prevent performance from becoming a vague complaint after launch.

## Observability and Release Plan

A frontend system also needs a plan for what happens after deployment.

Decide how the app will track:

- JavaScript errors
- failed API requests
- slow routes and interactions
- feature adoption
- accessibility or form completion issues
- release version and source map mapping

For example, an error report is much more useful when it includes the route, app version, user action, and original source location through uploaded source maps.

Rollouts matter too. Feature flags, gradual releases, and quick rollback paths can reduce risk when a large React app changes often.

## Common Mistakes

- Starting with a state library before modeling state types.
- Designing only the happy path.
- Hiding route, permission, and error decisions inside components.
- Ignoring accessibility until QA.
- Assuming the frontend can fix backend data-shape problems cheaply.
- Shipping without a way to connect production errors back to releases and source maps.

:::quiz
question: Which question is most useful at the start of a frontend system design discussion?
options:
  - What are the critical user flows and their data, loading, and failure states?
  - Which CSS color should the first button use?
  - Can every value be stored in one global object?
  - How can we avoid writing tests entirely?
answer: 0
explanation: Frontend design should start from user flows, data needs, constraints, and failure cases before implementation details.
:::

## Practice Challenge

Design a React issue tracker. Write a one-page plan covering routes, data sources, state categories, loading states, error states, and performance risks. Do not pick libraries until the plan explains the problem.

## Recap

Frontend system design is about making UI behavior predictable under real conditions. React components matter, but the larger design comes from clear flows, state ownership, failure handling, and performance constraints.
