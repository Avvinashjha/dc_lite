# Building a Design System

A design system is a shared language for building consistent user interfaces. In React, it often includes design tokens, reusable components, accessibility rules, documentation, and contribution guidelines.

A component library is only one part of a design system.

## Core Pieces

A practical design system includes:

- tokens: color, spacing, typography, radius, shadow
- components: Button, Input, Modal, Tabs, Toast
- patterns: forms, empty states, navigation, data tables
- guidelines: accessibility, content, responsive behavior
- examples: usage and anti-usage
- governance: how changes are proposed and released

## Design Tokens

Tokens describe decisions without tying them to one component.

```css
:root {
  --color-bg: #ffffff;
  --color-text: #172026;
  --space-2: 0.5rem;
  --radius-md: 0.5rem;
}
```

Tokens make themes and consistency easier, but they need meaningful names. `--blue-500` is a palette token. `--color-link` is a semantic token.

## Component APIs

Reusable components should encode accessibility and behavior defaults.

```jsx
<Button variant="primary" onClick={saveChanges}>
  Save changes
</Button>
```

The component should handle disabled styling, focus states, and consistent spacing. It should not prevent normal HTML behavior.

## Accessibility Is Part of the System

A design system should define keyboard behavior, focus management, labels, ARIA usage, and color contrast expectations.

For complex components, document interactions:

- how to open and close a modal
- where focus moves
- how Escape behaves
- how screen readers announce changes
- which ARIA roles are required

## Documentation and Testing

Good documentation shows examples and constraints.

Testing should include:

- unit tests for behavior
- accessibility checks
- visual regression checks when available
- keyboard interaction tests for complex components

## Versioning and Adoption

A design system must be easy to adopt safely.

Plan for:

- changelogs with migration notes
- deprecation periods for old props or tokens
- codemods for large API changes when practical
- examples that match real product use cases
- ownership rules for who can change shared components
- release channels for experimental components

Breaking every product screen with one token change damages trust. Versioning and communication are part of the system.

## Common Mistakes

- Building components without documenting when not to use them.
- Treating visual consistency as more important than semantic HTML.
- Exposing too many low-level styling escape hatches.
- Changing tokens without checking downstream screens.
- Making a design system a bottleneck instead of a shared product.
- Releasing breaking component API changes without migration guidance.

:::quiz
question: What is a design token?
options:
  - A named design decision such as spacing, color, or radius that can be reused consistently
  - A private authentication token for designers
  - A React hook that stores every CSS class
  - A generated source map file
answer: 0
explanation: Design tokens capture reusable design decisions and help components stay consistent across the product.
:::

## Practice Challenge

Design a small React design system with `Button`, `TextField`, and `Modal`. For each component, document props, accessibility requirements, keyboard behavior, and one common misuse.

## Recap

A design system scales decisions. It should make correct UI easier to build by combining tokens, accessible components, clear documentation, and a healthy contribution process.
