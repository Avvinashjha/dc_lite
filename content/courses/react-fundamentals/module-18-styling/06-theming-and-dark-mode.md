# Theming and Dark Mode

Theming means defining reusable design values and applying them consistently.

Dark mode is one common theme, but the same ideas apply to brand themes, high-contrast modes, and user preferences.

## Design Tokens

Tokens are named design decisions.

```css
:root {
  --color-bg: #ffffff;
  --color-text: #24292f;
  --color-primary: #0969da;
  --space-3: 0.75rem;
  --radius-md: 8px;
}
```

Components use tokens instead of hard-coded values.

```css
.card {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: var(--space-3);
}
```

This makes themes easier to change.

## Dark Mode With CSS Variables

```css
:root {
  --color-bg: #ffffff;
  --color-text: #24292f;
}

[data-theme="dark"] {
  --color-bg: #0d1117;
  --color-text: #f0f6fc;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Use {theme === "light" ? "dark" : "light"} mode
    </button>
  );
}
```

In production, also persist the preference and avoid a flash of the wrong theme during initial load.

## Respecting System Preference

CSS can respond to the user's system preference.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0d1117;
    --color-text: #f0f6fc;
  }
}
```

If users can manually choose a theme, their explicit choice should usually override the system preference.

## Avoiding Theme Flash

If the app renders light mode first and then switches to dark mode after JavaScript loads, users may see a flash.

Many apps add a tiny inline script in the HTML document to set the theme before React hydrates.

The exact setup depends on the framework.

The important idea is to apply the initial theme before the first visible paint when possible.

## Accessibility Concerns

Dark mode is not just inverting colors.

Check:

- text contrast in both themes
- focus outlines in both themes
- disabled and placeholder text contrast
- chart and status colors
- images or logos that disappear on dark backgrounds
- reduced motion preferences

Color should not be the only way to communicate meaning.

## Common Mistakes

- Hard-coding colors inside components instead of using tokens.
- Supporting dark mode for backgrounds but forgetting borders, shadows, and form controls.
- Ignoring the user's saved preference.
- Creating a theme toggle that is not keyboard accessible.
- Choosing colors that pass in light mode but fail in dark mode.

:::quiz
question: Why are CSS custom properties useful for theming?
options:
  - They let components read shared design values that can change by theme
  - They make React state unnecessary
  - They force every style to be inline
  - They prevent media queries from working
answer: 0
explanation: CSS variables let themes swap values such as colors while components continue using the same token names.
:::

## Practical Challenge

Create a light and dark theme using CSS variables.

Include tokens for:

- page background
- text
- muted text
- border
- primary button
- focus outline

Then audit one component in both themes for contrast and keyboard focus visibility.

## Recap

Good theming starts with tokens.

Dark mode should respect user preference, avoid initial flash when possible, and be tested for accessibility instead of treated as a simple color swap.
