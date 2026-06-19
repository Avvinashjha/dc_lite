# System Design Questions

Frontend system design interviews ask how you would build a user-facing product, not just a component. For React, strong answers cover data flow, routing, state, performance, accessibility, reliability, and deployment.

You are not expected to design the entire internet. You are expected to ask good questions, set scope, and make tradeoffs explicit.

## Answer Framework

Use this structure:

1. Clarify requirements.
2. Define users and core flows.
3. Sketch component and route structure.
4. Define data model and API contract.
5. Choose state strategy.
6. Cover loading, empty, and error states.
7. Discuss performance.
8. Discuss accessibility.
9. Discuss testing.
10. Discuss deployment and monitoring.

## Question 1: Design a Todo App for Teams

Clarifying questions:

- Is this single-user or multi-user?
- Do tasks update in real time?
- Are there projects or only one list?
- Do users need permissions?
- Should it work offline?

Possible architecture:

```text
Routes
  /login
  /projects
  /projects/:projectId

Components
  ProjectList
  TaskFilters
  TaskList
  TaskItem
  TaskEditor
  ActivityPanel
```

State:

- server state: projects, tasks, current user
- UI state: active filter, open editor, draft form

Important tradeoff:

If real-time collaboration is required, use WebSockets or a real-time backend. If not, polling or normal refetching may be enough.

## Question 2: Design an E-Commerce Product Page

Core flows:

- view product details
- choose variant
- add to cart
- view recommendations
- read reviews

Data needs:

- product details
- images
- variants
- inventory status
- price
- reviews
- recommendations

Performance concerns:

- optimize images
- lazy-load reviews and recommendations
- keep critical product content fast
- avoid blocking render with analytics
- code split heavy carousels or review widgets

Reliability:

- show unavailable state when inventory changes
- backend must verify price and stock
- cart should handle stale product data

## Question 3: Design a Dashboard

Dashboards combine many data sources and visual components.

Clarify:

- who uses it?
- what decisions does it support?
- how fresh must data be?
- are charts interactive?
- how large is the data?

Architecture:

```text
DashboardPage
  DateRangePicker
  MetricGrid
    MetricCard
  ChartSection
  TableSection
  ErrorSummary
```

State strategy:

- URL state for date range and filters when shareable
- server state library for API data and caching
- local state for open panels and hover details

Edge cases:

- partial API failures
- empty data
- slow charts
- timezone boundaries
- user changes filters quickly

## Question 4: Design a Search Experience

Requirements to clarify:

- typeahead or submit search?
- server-side search or client-side filtering?
- sorting and filters?
- pagination or infinite scroll?
- search history?

Key decisions:

- debounce input for typeahead
- cancel stale requests
- keep query in URL if results should be shareable
- show loading state without flicker
- distinguish no results from failed request

Accessibility:

- label the search input
- announce result counts when useful
- support keyboard navigation in suggestions
- do not trap focus in dropdowns accidentally

## Question 5: Design Authentication in a React App

Frontend responsibilities:

- render login and logout UI
- protect routes for user experience
- store or receive session state safely
- attach credentials to API calls as required
- handle expired sessions

Backend responsibilities:

- verify credentials
- issue and validate sessions or tokens
- enforce authorization
- protect user data

Important answer:

Frontend route guards are not security by themselves. Backend APIs must enforce access control.

## Question 6: Design a Component Library

Clarify:

- internal app only or public package?
- design tokens?
- accessibility requirements?
- theming?
- supported frameworks?

React architecture:

- primitive components such as Button, Input, Modal
- composed components such as Dialog, Select, Tabs
- theme provider or CSS variables
- documentation with examples
- visual regression tests

Common mistake:

Building highly flexible components before real use cases exist. Start with consistent patterns, then generalize.

:::quiz
question: In a frontend system design interview, why should filters often be stored in the URL?
options:
  - URL state makes shareable and refreshable views possible.
  - React state cannot store filters.
  - URLs make APIs unnecessary.
  - It prevents all re-renders.
answer: 0
explanation: URL-backed filters let users refresh, bookmark, and share a specific view.
:::

## Tricky Follow-Ups

How do you handle partial failure on a dashboard?

Answer:

Show available sections, mark failed sections clearly, provide retry, and avoid turning the whole page into a blank error unless the main data is unavailable.

How do you prevent stale search results?

Answer:

Use request cancellation, request ids, or a server state library that tracks query identity. Only apply the latest relevant response.

How do you choose global state vs server state?

Answer:

Server state comes from external systems and needs caching, refetching, invalidation, and synchronization. UI state belongs to the current interface. They have different needs.

## Practice Challenge

Design a React app for booking appointments.

Cover:

- user roles
- main routes
- component structure
- data model
- API endpoints
- state strategy
- loading and error states
- accessibility considerations
- performance risks
- deployment concerns

Then explain one tradeoff you would make for version one.

## Recap

Frontend system design is about product behavior under real constraints. Strong React answers connect components to data, state, accessibility, performance, failure handling, and deployment.
