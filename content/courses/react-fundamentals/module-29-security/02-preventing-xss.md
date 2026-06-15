# Preventing XSS

Cross-site scripting, or XSS, happens when attacker-controlled content runs as JavaScript in another user's browser.

React escapes text values by default, which removes many common XSS risks. But XSS is still possible when you render raw HTML, build unsafe URLs, use risky third-party libraries, or bypass React's defaults.

## React Escapes Text

This is generally safe:

```jsx
function Comment({ text }) {
  return <p>{text}</p>;
}
```

If `text` contains `<script>alert(1)</script>`, React renders it as text rather than executing it as HTML.

That protection applies to normal JSX text interpolation and many attributes.

## Dangerous HTML Rendering

`dangerouslySetInnerHTML` tells React to insert raw HTML.

```jsx
function Article({ html }) {
  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}
```

Only use this with trusted or sanitized HTML. The name is intentionally scary because React can no longer escape the content for you.

If your app renders CMS content, Markdown, or user-generated rich text, sanitize it with a well-maintained HTML sanitizer on the server or before rendering.

```jsx
import DOMPurify from "dompurify";

function SafeArticle({ html }) {
  const cleanHtml = DOMPurify.sanitize(html);

  return <article dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
```

Sanitization must match the content you allow. For example, allowing links means you must also think about unsafe `href` values.

## Unsafe URLs

XSS can happen through URL-like values.

```jsx
// Risky if profileUrl is attacker-controlled
<a href={profileUrl}>View profile</a>
```

An attacker may try values such as `javascript:alert(1)`.

Prefer validating allowed protocols and hosts:

```js
function getSafeUrl(value) {
  const url = new URL(value, window.location.origin);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Unsupported URL protocol");
  }

  return url.toString();
}
```

Use allowlists for redirects, image hosts, and embedded content.

## Event Handler Strings

React event handlers should be functions, not strings.

```jsx
// Good
<button onClick={handleSave}>Save</button>
```

Avoid patterns that evaluate strings as code, such as `eval`, `new Function`, or injecting HTML that contains inline event handlers.

```js
// Avoid
eval(userProvidedExpression);
```

## Content Security Policy

A Content Security Policy, or CSP, can reduce the damage of XSS by limiting where scripts can load from and whether inline scripts can run.

Example policy shape:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'
```

CSP is not a replacement for escaping and sanitization. It is defense in depth.

React apps that rely on inline scripts, dynamic code evaluation, or unsafe third-party snippets are harder to protect with CSP.

## Edge Cases

- Markdown can become unsafe HTML if the renderer allows raw HTML.
- SVG can contain scriptable features depending on how it is embedded.
- Translations can become risky if they include raw HTML placeholders.
- Browser extensions and third-party widgets can inject code outside React's control.
- Error messages from APIs may contain user-controlled content and should be rendered as text.
- Hydration mismatches are not usually XSS by themselves, but unsafe server-rendered HTML can be.

## Common Mistakes

- Using `dangerouslySetInnerHTML` for convenience.
- Sanitizing once and later concatenating more unsanitized HTML.
- Allowing any URL in `href`, `src`, redirects, or embedded content.
- Trusting content because it came from your own database.
- Disabling lint rules that warn about unsafe rendering.
- Assuming TypeScript prevents XSS.

:::quiz
question: Why is `{commentText}` usually safer than `dangerouslySetInnerHTML` for rendering a user comment?
options:
  - React escapes text interpolation, while raw HTML insertion bypasses that protection
  - Text interpolation disables all network requests
  - `dangerouslySetInnerHTML` only works on server components
  - Curly braces automatically validate authorization
answer: 0
explanation: React escapes normal text rendering so HTML-like input is displayed as text. Raw HTML insertion skips that escaping and must be sanitized.
:::

## Practice Challenge

Build a comment preview that supports plain text safely. Then add Markdown support using a Markdown library configured to disallow raw HTML. Test inputs containing `<script>`, `<img onerror>`, and `javascript:` links.

## Recap

React's default escaping is valuable, but XSS prevention still requires careful handling of raw HTML, URLs, third-party content, Markdown, and CSP compatibility.
