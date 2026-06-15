# Testing Accessibility

Accessibility testing combines automated checks, manual interaction, and real user awareness.

No single tool catches everything. A good React workflow uses multiple checks because accessibility includes markup, behavior, visual design, and dynamic state.

## Start With Manual Keyboard Testing

The quickest test is to use the app without a mouse.

Check:

- Can you reach every interactive control with Tab?
- Is the focus indicator visible?
- Does the focus order match the visual and logical order?
- Can buttons, links, menus, dialogs, and forms be operated?
- Does Escape close temporary UI such as modals and menus?
- Does focus return to a sensible place after closing UI?

Manual keyboard testing catches many issues before specialized tools are needed.

## Automated Checks

Automated tools catch missing labels, invalid ARIA, color contrast issues, and some semantic problems.

Common tools:

- browser accessibility inspectors
- Lighthouse accessibility audits
- axe DevTools
- `jest-axe` for component tests
- Testing Library queries such as `getByRole`

Example with Testing Library:

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("opens the menu with a keyboard", async () => {
  const user = userEvent.setup();

  render(<AccountMenu />);

  await user.tab();
  expect(screen.getByRole("button", { name: /account/i })).toHaveFocus();

  await user.keyboard("{Enter}");
  expect(screen.getByRole("menu")).toBeInTheDocument();
});
```

Queries by role encourage accessible markup.

## Testing With axe

`jest-axe` can catch common violations in rendered components.

```jsx
import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "@testing-library/react";

expect.extend(toHaveNoViolations);

test("settings form has no obvious accessibility violations", async () => {
  const { container } = render(<SettingsForm />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
```

Passing axe is not the same as being accessible. It is a useful baseline, not a complete review.

## Screen Reader Smoke Tests

You do not need to become a full-time screen reader expert to run basic smoke tests.

Useful checks:

- Does the page title describe the current page?
- Can you navigate by headings and landmarks?
- Do controls have understandable names?
- Are form errors announced or easy to find?
- Are loading and success states announced when needed?
- Does a modal identify itself and keep focus inside?

Common screen readers:

- VoiceOver on macOS and iOS
- NVDA on Windows
- JAWS on Windows
- TalkBack on Android

Start with the screen reader built into your platform.

## Visual Checks

Accessibility is not only screen readers.

Check:

- text contrast
- focus contrast
- 200% browser zoom
- responsive layouts
- reduced motion settings
- dark mode and high contrast mode
- touch target size and spacing

Animations should respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    scroll-behavior: auto;
    transition-duration: 0.01ms;
  }
}
```

Use broad resets carefully. Some components may need more specific reduced-motion behavior.

## Edge Cases

- Portaled UI such as modals and tooltips can break focus and reading order.
- Virtualized lists may hide content from assistive technology if item counts and labels are unclear.
- Toasts can disappear before users read them.
- Route changes in single-page apps may not announce a new page.
- Skeleton loaders can create noisy or meaningless output if exposed to assistive technology.

## Common Mistakes

- Treating a Lighthouse score as proof that the app is accessible.
- Testing only the initial page load, not errors, modals, and async states.
- Ignoring keyboard traps.
- Writing tests that use class names instead of roles and names.
- Forgetting color contrast for focus rings and disabled-looking controls.

:::quiz
question: Why is an automated accessibility scan not enough by itself?
options:
  - It cannot fully verify keyboard flow, user understanding, focus management, or every dynamic state
  - It makes React stop rendering components
  - It only works for server-rendered pages
  - It replaces the need for semantic HTML
answer: 0
explanation: Automated tools catch many markup issues, but manual testing is still needed for behavior, focus, screen reader experience, and real workflows.
:::

## Practice Challenge

Choose one React page and test it three ways: keyboard-only, automated scan, and a screen reader smoke test. Write down at least five findings, including one that the automated tool did not catch.

## Recap

Accessibility testing works best as a layered practice. Use semantic Testing Library queries, automated scans, keyboard testing, visual checks, and screen reader smoke tests to cover real user behavior.
