# Micro Frontends

Micro frontends split a frontend application into independently owned pieces. The pattern can help large organizations, but it adds operational and user-experience complexity.

Use micro frontends to solve team and deployment boundaries, not because the app has many components.

## When They Help

Micro frontends may be useful when:

- different teams own clearly separate product areas
- releases must happen independently
- parts of the app use different technology stacks
- a large migration needs gradual replacement
- organizational boundaries are stronger than code-sharing needs

They are often unnecessary for small or medium React apps.

## Common Approaches

- build-time composition: packages are combined during build
- runtime composition: apps are loaded in the browser at runtime
- route-level composition: different routes are served by different apps
- iframe isolation: strong isolation with communication costs
- module federation: runtime sharing of modules between builds

Each approach has tradeoffs for performance, reliability, styling, dependency sharing, and testing.

## Shared Dependencies

React should usually not be loaded multiple times on the same page. Duplicate framework versions can increase bundle size and cause runtime issues.

Shared dependencies need version rules. Too strict and teams block each other. Too loose and runtime behavior becomes unpredictable.

## Design Systems and Contracts

Micro frontends need shared contracts:

- design tokens
- shared navigation model
- authentication/session contract
- analytics event schema
- routing conventions
- error handling and observability

Without contracts, users experience a patchwork of inconsistent apps.

## Failure Modes

Runtime composition introduces partial failure. One remote app may fail while the shell still loads.

Design fallbacks:

```jsx
<RemoteBoundary fallback={<p>This section is temporarily unavailable.</p>}>
  <BillingRemote />
</RemoteBoundary>
```

A broken remote should not crash the entire app shell.

## Common Mistakes

- Choosing micro frontends to avoid normal modular design.
- Sharing too much state across independently deployed apps.
- Ignoring version and dependency governance.
- Letting each team invent separate accessibility and design rules.
- Forgetting fallback UI and monitoring for remote load failures.

:::quiz
question: What is the best reason to consider micro frontends?
options:
  - Independent ownership and deployment needs across large product areas
  - Avoiding all component design decisions
  - Making a small app faster by default
  - Removing the need for API contracts
answer: 0
explanation: Micro frontends mainly address organizational and deployment boundaries. They do not remove the need for architecture.
:::

## Practice Challenge

Design a route-level micro frontend plan for an admin console with Billing, Users, and Reports areas. Define shared contracts for authentication, navigation, design tokens, and error reporting. Then list two reasons you might reject the approach.

## Recap

Micro frontends are powerful when team independence matters enough to justify the complexity. Start with modular React architecture first; move to micro frontends only when boundaries and operations demand it.
