# Final Assessment

The final assessment combines written answers, practical coding, project review, and interview-style explanation. It is designed to confirm that you can build and reason about React applications without relying on step-by-step instructions.

Use this lesson as the assessment guide and grading rubric.

## Assessment Structure

Total score: 100 points

```text
Concept assessment: 25 points
Coding assessment: 25 points
Capstone project: 35 points
Mock interview readiness: 15 points
```

Passing recommendation:

- 70 or above: pass
- 85 or above: strong pass
- below 70: review weak areas and resubmit

Some programs may require a higher passing score. Follow your instructor's policy if it differs.

## Part 1: Concept Assessment

Topics:

- JSX and rendering
- components and props
- state and events
- controlled forms
- effects and dependency arrays
- refs
- context
- routing
- data fetching
- testing basics
- deployment basics

Example questions:

1. Why should React state be updated immutably?
2. When should you lift state up?
3. Why are stable keys important in lists?
4. What belongs in a `useEffect`?
5. What is the difference between server state and UI state?
6. Why are frontend environment variables not secrets?

Strong answers should include:

- direct definition
- small example
- common mistake or edge case

## Part 2: Coding Assessment

Build one feature in a limited time.

Possible prompts:

- searchable list with empty state
- todo list with filters
- tab component with accessible markup
- fetch component with loading, error, and retry
- cart reducer with quantity updates
- controlled form with validation

Scoring rubric: 25 points

```text
Correct behavior: 10
State design: 5
Edge cases: 4
Readability: 3
Accessibility: 2
Communication: 1
```

Common edge cases:

- empty input
- duplicate item
- failed request
- stale response
- invalid quantity
- keyboard interaction

## Part 3: Capstone Project

The capstone is the largest part of certification.

Required criteria:

- clear project goal
- working deployed app
- repository with readable structure
- README with setup and deployment details
- meaningful components
- stateful interactions
- at least one form
- at least one list
- validation or error handling
- manual test checklist
- no committed secrets

Capstone scoring rubric: 35 points

```text
Feature completeness: 8
React architecture: 7
State and data flow: 6
Edge/error handling: 5
User experience and accessibility: 3
Deployment and README: 3
Code clarity: 3
```

## Capstone Review Questions

Be ready to answer:

- Why did you choose this component structure?
- Which state is local and which state is shared?
- What data is derived instead of stored?
- What side effects does your app perform?
- How does your app handle invalid input?
- How does your app handle loading and errors?
- What happens on page refresh?
- How did you test the main flows?
- What would you refactor next?
- What would change if this app had 10 times more users or data?

## Part 4: Mock Interview Readiness

The mock interview checks communication under realistic pressure.

Format:

- 5 minutes: project walkthrough
- 10 minutes: React concept questions
- 15 minutes: live coding or debugging
- 10 minutes: system design or tradeoff discussion
- 5 minutes: reflection and questions

Readiness rubric: 15 points

```text
Clear explanations: 4
React mental models: 4
Debugging approach: 3
Tradeoff awareness: 2
Professional communication: 2
```

## Debugging Scenario Examples

Scenario 1:

An input loses focus when typing in a list.

Likely areas:

- unstable keys
- remounting components
- changing component definitions inside render

Scenario 2:

An effect keeps running forever.

Likely areas:

- dependency array contains a new object or function every render
- effect updates state that changes a dependency
- missing separation between derived data and side effects

Scenario 3:

A deployed app returns 404 on refresh at `/dashboard`.

Likely areas:

- missing SPA fallback rewrite or redirect
- host serving only physical files
- router base path misconfiguration

## Final Submission Checklist

Before submitting:

- run tests
- run linting, if available
- run a production build
- open the deployed app
- test the main user flow
- test one error or empty state
- test a direct refresh on a nested route
- check that `.env` files are not committed
- review README instructions from a fresh clone perspective
- prepare a two-minute project explanation

:::quiz
question: What is the strongest capstone submission?
options:
  - A large app with many broken screens.
  - A small complete app with deployment, README, tests or manual checks, and clear tradeoffs.
  - A zip file containing node_modules.
  - A project that requires private secrets committed to the repository.
answer: 1
explanation: A complete, explainable, deployed app demonstrates more readiness than an unfinished app with many features.
:::

## Remediation Plan

If you do not pass, identify the weak area.

Concept weakness:

- rewrite answers in your own words
- build tiny examples for each concept

Coding weakness:

- practice small prompts with a timer
- review state immutability and controlled inputs

Capstone weakness:

- reduce scope
- fix the core flow
- add README and deployment

Interview weakness:

- practice explaining while coding
- record a project walkthrough
- answer follow-up questions out loud

## Final Challenge

Run a self-review on your capstone.

Write one paragraph for each:

- what works well
- what edge case you handled
- what tradeoff you made
- what you would improve next
- what React concept the project best demonstrates

## Recap

The final assessment rewards complete, reliable React work. Show that you can explain concepts, code a focused feature, finish and deploy a capstone, and discuss tradeoffs with clarity.
